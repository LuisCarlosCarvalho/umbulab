-- =============================================================================
-- UMBULAB AI GROWTH OS — VALIDAÇÃO PROFUNDA DA FASE 4.7
-- Ficheiro: scripts/verify_phase4_7_deep_validation.sql
--
-- OBJETIVO:
--   Validar todos os objetos, assinaturas, políticas RLS, ACLs direcionadas
--   e testes negativos de segurança FinOps (anon e clientes bloqueados).
-- =============================================================================

\set ON_ERROR_STOP on

-- 1. CONFERÊNCIA DAS ASSINATURAS DAS FUNÇÕES FINOPS
DO $$
DECLARE
  v_reserve_exists boolean;
  v_settle_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' 
      AND p.proname = 'reserve_ai_budget'
      AND pg_get_function_identity_arguments(p.oid) = 'p_budget_id uuid, p_amount_cents bigint, p_reservation_key text, p_agent_key text, p_mission_id uuid, p_currency_code text'
  ) INTO v_reserve_exists;

  IF NOT v_reserve_exists THEN
    RAISE EXCEPTION 'FALHA: Função public.reserve_ai_budget com assinatura (uuid, bigint, text, text, uuid, text) NÃO foi encontrada!';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' 
      AND p.proname = 'settle_ai_budget'
      AND pg_get_function_identity_arguments(p.oid) = 'p_reservation_key text, p_actual_spent_cents bigint, p_description text'
  ) INTO v_settle_exists;

  IF NOT v_settle_exists THEN
    RAISE EXCEPTION 'FALHA: Função public.settle_ai_budget com assinatura correta NÃO foi encontrada!';
  END IF;

  RAISE NOTICE 'VALIDAÇÃO 1 APROVADA: Assinaturas de FinOps confirmadas com precisão.';
END $$;

-- 2. TESTES NEGATIVOS DE FINOPS (ANON E CLIENTES COMUNS BLOQUEADOS)
DO $$
DECLARE
  v_test_budget_id uuid := gen_random_uuid();
  v_anon_blocked boolean := false;
  v_auth_client_blocked boolean := false;
  v_res_json jsonb;
BEGIN
  -- Criar orçamento de teste como superuser
  INSERT INTO public.fin_budgets (id, scope_type, scope_id, allocated_amount_cents, currency_code, period_start, period_end)
  VALUES (v_test_budget_id, 'global', 'agency_total', 10000, 'EUR', CURRENT_DATE, CURRENT_DATE + interval '30 days')
  ON CONFLICT DO NOTHING;

  -- ---------------------------------------------------------------------------
  -- TESTE NEGATIVO 1: Papel 'anon' tenta executar reserve_ai_budget e settle_ai_budget
  -- ---------------------------------------------------------------------------
  BEGIN
    SET LOCAL ROLE anon;
    PERFORM public.reserve_ai_budget(v_test_budget_id, 100, 'res_test_anon', NULL, NULL, 'EUR');
    RESET ROLE;
  EXCEPTION WHEN OTHERS THEN
    RESET ROLE;
    IF SQLERRM LIKE '%permission denied%' OR SQLERRM LIKE '%Operação não autorizada%' THEN
      v_anon_blocked := true;
    END IF;
  END;

  IF NOT v_anon_blocked THEN
    RAISE EXCEPTION 'FALHA CRÍTICA DE SEGURANÇA: Papel anon conseguiu executar reserve_ai_budget!';
  END IF;

  v_anon_blocked := false;
  BEGIN
    SET LOCAL ROLE anon;
    PERFORM public.settle_ai_budget('res_test_anon', 50, 'Tentativa Anon');
    RESET ROLE;
  EXCEPTION WHEN OTHERS THEN
    RESET ROLE;
    IF SQLERRM LIKE '%permission denied%' OR SQLERRM LIKE '%Operação não autorizada%' THEN
      v_anon_blocked := true;
    END IF;
  END;

  IF NOT v_anon_blocked THEN
    RAISE EXCEPTION 'FALHA CRÍTICA DE SEGURANÇA: Papel anon conseguiu executar settle_ai_budget!';
  END IF;
  RAISE NOTICE 'VALIDAÇÃO 2.1 APROVADA: Papel anon sumariamente BLOQUEADO para operações de FinOps (reserve e settle).';

  -- ---------------------------------------------------------------------------
  -- TESTE NEGATIVO 2: Cliente comum autenticado tenta executar reserve_ai_budget e settle_ai_budget
  -- ---------------------------------------------------------------------------
  BEGIN
    SET LOCAL ROLE authenticated;
    PERFORM set_config('request.jwt.claim.sub', gen_random_uuid()::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);
    PERFORM public.reserve_ai_budget(v_test_budget_id, 100, 'res_test_client', NULL, NULL, 'EUR');
    RESET ROLE;
  EXCEPTION WHEN OTHERS THEN
    RESET ROLE;
    IF SQLERRM LIKE '%permission denied%' OR SQLERRM LIKE '%Operação não autorizada%' THEN
      v_auth_client_blocked := true;
    END IF;
  END;

  IF NOT v_auth_client_blocked THEN
    RAISE EXCEPTION 'FALHA CRÍTICA DE SEGURANÇA: Cliente comum autenticado conseguiu executar reserve_ai_budget!';
  END IF;

  v_auth_client_blocked := false;
  BEGIN
    SET LOCAL ROLE authenticated;
    PERFORM set_config('request.jwt.claim.sub', gen_random_uuid()::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);
    PERFORM public.settle_ai_budget('res_test_client', 50, 'Tentativa Client');
    RESET ROLE;
  EXCEPTION WHEN OTHERS THEN
    RESET ROLE;
    IF SQLERRM LIKE '%permission denied%' OR SQLERRM LIKE '%Operação não autorizada%' THEN
      v_auth_client_blocked := true;
    END IF;
  END;

  IF NOT v_auth_client_blocked THEN
    RAISE EXCEPTION 'FALHA CRÍTICA DE SEGURANÇA: Cliente comum autenticado conseguiu executar settle_ai_budget!';
  END IF;
  RAISE NOTICE 'VALIDAÇÃO 2.2 APROVADA: Cliente autenticado não-admin sumariamente BLOQUEADO para FinOps (reserve e settle).';

  -- ---------------------------------------------------------------------------
  -- TESTE POSITIVO 3: Backend service_role autorizado SEM JWT DE ADMINISTRADOR
  -- ---------------------------------------------------------------------------
  SET LOCAL ROLE service_role;
  -- Garantir explicitamente que não existem claims de sessão JWT
  PERFORM set_config('request.jwt.claim.sub', '', true);
  PERFORM set_config('request.jwt.claim.role', '', true);
  
  v_res_json := public.reserve_ai_budget(v_test_budget_id, 250, 'res_test_service_role', NULL, NULL, 'EUR');
  
  IF NOT (v_res_json->>'success')::boolean THEN
    RESET ROLE;
    RAISE EXCEPTION 'FALHA: service_role deveria estar autorizado, mas retornou erro: %', v_res_json;
  END IF;

  v_res_json := public.settle_ai_budget('res_test_service_role', 200, 'Teste Service Role');
  IF NOT (v_res_json->>'success')::boolean THEN
    RESET ROLE;
    RAISE EXCEPTION 'FALHA: service_role falhou ao liquidar reserva: %', v_res_json;
  END IF;
  RESET ROLE;

  RAISE NOTICE 'VALIDAÇÃO 2.3 APROVADA: Backend service_role autorizado sem JWT de admin (reserve e settle com sucesso).';

  -- ---------------------------------------------------------------------------
  -- TESTE 4: Orçamento insuficiente bloqueado (BUDGET_EXCEEDED)
  -- ---------------------------------------------------------------------------
  SET LOCAL ROLE service_role;
  -- Orçamento tem saldo disponível de 9800 cents. Tentar reservar 50000 cents.
  v_res_json := public.reserve_ai_budget(v_test_budget_id, 50000, 'res_test_exceeded', NULL, NULL, 'EUR');
  RESET ROLE;

  IF (v_res_json->>'success')::boolean OR (v_res_json->>'error') <> 'BUDGET_EXCEEDED' THEN
    RAISE EXCEPTION 'FALHA DE REGRA DE NEGÓCIO: Orçamento insuficiente não foi bloqueado! Retorno: %', v_res_json;
  END IF;
  RAISE NOTICE 'VALIDAÇÃO 2.4 APROVADA: Orçamento insuficiente bloqueado atomicamente (BUDGET_EXCEEDED).';

  -- Limpeza do orçamento de teste
  DELETE FROM public.fin_cashflow_entries WHERE source_reference = 'res_test_service_role';
  DELETE FROM public.fin_budget_reservations WHERE reservation_key = 'res_test_service_role';
  DELETE FROM public.fin_budgets WHERE id = v_test_budget_id;

END $$;

-- 3. AUDITORIA DE PERMISSÕES DAC E ISOLAMENTO DE COFRE
DO $$
DECLARE
  v_anon_grants_count integer;
  v_secrets_grants_count integer;
BEGIN
  -- Verificar se anon tem qualquer permissão nas 15 tabelas
  SELECT count(*) INTO v_anon_grants_count
  FROM information_schema.role_table_grants
  WHERE grantee = 'anon'
    AND table_schema = 'public'
    AND table_name = ANY(ARRAY[
      'ai_system_controls', 'ai_agents', 'ai_integrations', 'ai_integration_secrets',
      'ai_missions', 'ai_tasks', 'ai_task_runs', 'ai_approvals', 'ai_opportunities',
      'processed_worker_messages', 'fin_budgets', 'fin_budget_reservations',
      'fin_cashflow_entries', 'fin_journal_entries', 'fin_journal_lines'
    ]);

  IF v_anon_grants_count <> 0 THEN
    RAISE EXCEPTION 'FALHA DE PRIVILÉGIOS: Papel anon possui % privilégios nas tabelas do Growth OS!', v_anon_grants_count;
  END IF;
  RAISE NOTICE 'VALIDAÇÃO 3.1 APROVADA: Papel anon possui 0 privilégios nas 15 tabelas do Growth OS.';

  -- Verificar se ai_integration_secrets está isolada de anon e authenticated
  SELECT count(*) INTO v_secrets_grants_count
  FROM information_schema.role_table_grants
  WHERE grantee IN ('anon', 'authenticated')
    AND table_schema = 'public'
    AND table_name = 'ai_integration_secrets';

  IF v_secrets_grants_count <> 0 THEN
    RAISE EXCEPTION 'FALHA DE COFRE: ai_integration_secrets concedeu privilégios a anon ou authenticated!';
  END IF;
  RAISE NOTICE 'VALIDAÇÃO 3.2 APROVADA: Cofre de segredos estritamente isolado (apenas service_role).';
END $$;
