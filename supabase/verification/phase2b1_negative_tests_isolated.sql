-- =============================================================================
-- UMBULAB — FASE 3.2: SUITE COMPLETA DE HOMOLOGAÇÃO DE SEGURANÇA E FINOPS
-- Ficheiro: supabase/verification/phase2b1_negative_tests_isolated.sql
--
-- CARACTERÍSTICAS DE SEGURANÇA:
--   1. Executa integralmente dentro de BEGIN ... ROLLBACK (zero efeito persistente).
--   2. Instancia identidades sintéticas determinísticas (Cliente e Admin).
--   3. Valida ROW_COUNT, exceções, privilégios de tabela/função, cofre de segredos,
--      orçamentos atómicos (concorrência/expiração/hard-stop/liquidação) e quotas.
-- =============================================================================

BEGIN;

DO $$
DECLARE
  v_client_id uuid := '00000000-0000-4000-8000-0000000000c1';
  v_admin_id  uuid := '00000000-0000-4000-8000-0000000000a1';
  v_rows integer := 0;
  v_blocked boolean := false;
  v_role_after text;
  v_reset_after boolean;
  v_toggle_res jsonb;
  v_res1 jsonb;
  v_res_idem jsonb;
  v_res_over jsonb;
  v_settle_over jsonb;
  v_settle_ok jsonb;
  v_settle_dup jsonb;
  v_reservation_id uuid;
  v_budget_id uuid;
  v_quota_res jsonb;
  v_i integer;
BEGIN
  -- ---------------------------------------------------------------------------
  -- 0. PREPARAÇÃO DE IDENTIDADES SINTÉTICAS (REVERTIDAS PELO ROLLBACK FINAL)
  -- ---------------------------------------------------------------------------
  SET LOCAL ROLE postgres;

  INSERT INTO auth.users (id, email, raw_app_meta_data, raw_user_meta_data)
  VALUES
    (v_client_id, 'synthetic.client.rls@umbulab.test', '{"role":"client"}'::jsonb, '{}'::jsonb),
    (v_admin_id,  'synthetic.admin.rls@umbulab.test',  '{"role":"admin"}'::jsonb,  '{}'::jsonb)
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;

  INSERT INTO public.profiles (id, email, full_name, role, force_password_reset, payment_score, manual_payment_override)
  VALUES
    (v_client_id, 'synthetic.client.rls@umbulab.test', 'Cliente Sintético RLS', 'client', true, 100, false),
    (v_admin_id,  'synthetic.admin.rls@umbulab.test',  'Admin Sintético RLS',   'admin',  false, 100, false)
  ON CONFLICT (id) DO UPDATE
  SET role = EXCLUDED.role,
      force_password_reset = EXCLUDED.force_password_reset,
      payment_score = EXCLUDED.payment_score,
      manual_payment_override = EXCLUDED.manual_payment_override;

  INSERT INTO public.configuracoes (chave, valor)
  VALUES
    ('maintenance_settings', '{"is_active": false}'::jsonb),
    ('blog_settings', '{"is_active": true}'::jsonb),
    ('seo_gestao_settings', '{"is_active": true}'::jsonb),
    ('infoproducts_settings', '{"is_active": true}'::jsonb),
    ('payment_methods', '{"secret_gateway_token": "DO_NOT_LEAK"}'::jsonb),
    ('payment_global_settings', '{"webhook_secret": "DO_NOT_LEAK"}'::jsonb),
    ('global_payment_settings', '{"webhook_secret": "DO_NOT_LEAK"}'::jsonb),
    ('blog_rss_sync', '{"url": "https://private.rss.internal/feed", "enabled": true}'::jsonb)
  ON CONFLICT (chave) DO UPDATE
  SET valor = EXCLUDED.valor;

  INSERT INTO public.ai_integrations (provider_key, display_name, category, status, auth_mode, env_var_name, has_saved_secret, key_hint)
  VALUES ('google_gemini', 'Google Gemini API', 'ai_llm', 'connected', 'api_key', 'GEMINI_API_KEY', true, '••••9a1f')
  ON CONFLICT (provider_key) DO NOTHING;

  INSERT INTO public.ai_integration_secrets (provider_key, encrypted_secret_payload)
  VALUES ('google_gemini', 'v1:aes256gcm:encrypted_payload_test_only')
  ON CONFLICT (provider_key) DO UPDATE
  SET encrypted_secret_payload = EXCLUDED.encrypted_secret_payload;

  -- ---------------------------------------------------------------------------
  -- TESTE 1 (`anon`): Leitura de configuracoes deve ver APENAS as 4 flags de UI
  -- públicas e 0 linhas das chaves privadas (payment_*, blog_rss_sync)
  -- ---------------------------------------------------------------------------
  SET LOCAL ROLE anon;
  PERFORM set_config('request.jwt.claims', '{}', true);

  SELECT count(*)::integer INTO v_rows
  FROM public.configuracoes
  WHERE chave IN ('payment_methods', 'payment_global_settings', 'global_payment_settings', 'blog_rss_sync');

  IF v_rows <> 0 THEN
    RAISE EXCEPTION 'FALHA P0-D (anon): chaves privadas visíveis para anon (% linhas)!', v_rows;
  END IF;

  SELECT count(*)::integer INTO v_rows
  FROM public.configuracoes
  WHERE chave IN ('maintenance_settings', 'blog_settings', 'seo_gestao_settings', 'infoproducts_settings');

  IF v_rows <> 4 THEN
    RAISE EXCEPTION 'FALHA COMPATIBILIDADE (anon): as 4 chaves públicas de UI deveriam retornar 4 linhas, retornaram %', v_rows;
  END IF;

  -- Confirmar que public.profiles_debug não existe
  IF to_regclass('public.profiles_debug') IS NOT NULL THEN
    RAISE EXCEPTION 'FALHA P0-C: view public.profiles_debug ainda existe!';
  END IF;

  -- Confirmar que nenhuma sobrecarga de sync_user_role_to_metadata pode ser executada por anon ou authenticated
  IF EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname IN ('sync_user_role_to_metadata', 'sync_role_to_metadata')
      AND (
        has_function_privilege('anon', p.oid, 'EXECUTE')
        OR has_function_privilege('authenticated', p.oid, 'EXECUTE')
      )
  ) THEN
    RAISE EXCEPTION 'FALHA P0-B: alguma sobrecarga de sync_user_role_to_metadata ainda permite EXECUTE a anon/authenticated!';
  END IF;

  -- ---------------------------------------------------------------------------
  -- TESTE 2 (`authenticated` client): Tentativa de auto-promoção para role = 'admin'
  -- e tentativa de adulterar payment_score / manual_payment_override
  -- ---------------------------------------------------------------------------
  SET LOCAL ROLE authenticated;
  PERFORM set_config(
    'request.jwt.claims',
    json_build_object('sub', v_client_id::text, 'role', 'authenticated', 'email', 'synthetic.client.rls@umbulab.test')::text,
    true
  );

  IF public.is_verified_admin() IS TRUE THEN
    RAISE EXCEPTION 'FALHA CRÍTICA: is_verified_admin() retornou TRUE para cliente comum!';
  END IF;

  v_blocked := false;
  BEGIN
    UPDATE public.profiles
    SET role = 'admin'
    WHERE id = v_client_id;
    GET DIAGNOSTICS v_rows = ROW_COUNT;
  EXCEPTION WHEN OTHERS THEN
    v_blocked := true;
    v_rows := 0;
  END;

  SET LOCAL ROLE postgres;
  SELECT role INTO v_role_after FROM public.profiles WHERE id = v_client_id;
  IF NOT v_blocked OR v_role_after = 'admin' THEN
    RAISE EXCEPTION 'FALHA CRÍTICA P0-A: Cliente sintético conseguiu promover-se a admin!';
  END IF;

  -- Tentativa de alterar manual_payment_override pelo cliente
  SET LOCAL ROLE authenticated;
  PERFORM set_config(
    'request.jwt.claims',
    json_build_object('sub', v_client_id::text, 'role', 'authenticated', 'email', 'synthetic.client.rls@umbulab.test')::text,
    true
  );

  v_blocked := false;
  BEGIN
    UPDATE public.profiles
    SET manual_payment_override = true
    WHERE id = v_client_id;
  EXCEPTION WHEN OTHERS THEN
    v_blocked := true;
  END;

  IF NOT v_blocked THEN
    RAISE EXCEPTION 'FALHA P0-A: Cliente conseguiu alterar manual_payment_override!';
  END IF;

  -- ---------------------------------------------------------------------------
  -- TESTE 3 (`authenticated` client): Transição legítima force_password_reset: true -> false
  -- Deve alterar exatamente 1 linha (preserva PasswordChangeModal.tsx)
  -- ---------------------------------------------------------------------------
  UPDATE public.profiles
  SET force_password_reset = false
  WHERE id = v_client_id;
  GET DIAGNOSTICS v_rows = ROW_COUNT;

  SET LOCAL ROLE postgres;
  SELECT force_password_reset INTO v_reset_after FROM public.profiles WHERE id = v_client_id;
  IF v_rows <> 1 OR v_reset_after IS NOT FALSE THEN
    RAISE EXCEPTION 'FALHA COMPATIBILIDADE PasswordChangeModal: esperava 1 linha alterada e force_password_reset=false (rows=%, val=%)', v_rows, v_reset_after;
  END IF;

  -- Tentativa de reverter force_password_reset: false -> true pelo cliente deve falhar
  SET LOCAL ROLE authenticated;
  PERFORM set_config(
    'request.jwt.claims',
    json_build_object('sub', v_client_id::text, 'role', 'authenticated', 'email', 'synthetic.client.rls@umbulab.test')::text,
    true
  );
  v_blocked := false;
  BEGIN
    UPDATE public.profiles SET force_password_reset = true WHERE id = v_client_id;
  EXCEPTION WHEN OTHERS THEN
    v_blocked := true;
  END;
  IF NOT v_blocked THEN
    RAISE EXCEPTION 'FALHA P0-A: Cliente conseguiu reverter force_password_reset para true!';
  END IF;

  -- ---------------------------------------------------------------------------
  -- TESTE 4 (`authenticated` client): Tentativa de executar toggle_maintenance,
  -- ler logs de IA e ler cofre de segredos
  -- ---------------------------------------------------------------------------
  v_toggle_res := public.toggle_maintenance('UmbuLab2026!', true);
  IF COALESCE((v_toggle_res->>'success')::boolean, false) IS TRUE THEN
    RAISE EXCEPTION 'FALHA P0-D: Cliente não-admin conseguiu ativar modo de manutenção!';
  END IF;

  SELECT count(*)::integer INTO v_rows FROM public.ai_generation_logs;
  IF v_rows <> 0 THEN
    RAISE EXCEPTION 'FALHA P0-E: Cliente não-admin conseguiu ler ai_generation_logs (% linhas)!', v_rows;
  END IF;

  SELECT count(*)::integer INTO v_rows FROM public.seo_logs;
  IF v_rows <> 0 THEN
    RAISE EXCEPTION 'FALHA P0-E: Cliente não-admin conseguiu ler seo_logs (% linhas)!', v_rows;
  END IF;

  -- ---------------------------------------------------------------------------
  -- TESTE 5 (`authenticated` admin): Verificação de is_verified_admin(), leitura
  -- de configuracoes, atualização de perfil de cliente e bloqueio do cofre de segredos
  -- ---------------------------------------------------------------------------
  SET LOCAL ROLE authenticated;
  PERFORM set_config(
    'request.jwt.claims',
    json_build_object('sub', v_admin_id::text, 'role', 'authenticated', 'email', 'synthetic.admin.rls@umbulab.test')::text,
    true
  );

  IF public.is_verified_admin() IS NOT TRUE THEN
    RAISE EXCEPTION 'FALHA ADMIN: is_verified_admin() retornou FALSE para administrador legítimo!';
  END IF;

  SELECT count(*)::integer INTO v_rows
  FROM public.configuracoes
  WHERE chave = 'payment_methods';

  IF v_rows <> 1 THEN
    RAISE EXCEPTION 'FALHA ADMIN: Administrador autenticado não conseguiu ler payment_methods!';
  END IF;

  UPDATE public.profiles
  SET full_name = 'Cliente Atualizado pelo Admin'
  WHERE id = v_client_id;
  GET DIAGNOSTICS v_rows = ROW_COUNT;

  IF v_rows <> 1 THEN
    RAISE EXCEPTION 'FALHA ADMIN: Administrador autenticado não conseguiu atualizar perfil de cliente (rows=%)!', v_rows;
  END IF;

  -- Mesmo um Administrador autenticado no browser NÃO pode ler public.ai_integration_secrets diretamente!
  v_blocked := false;
  BEGIN
    PERFORM count(*) FROM public.ai_integration_secrets;
  EXCEPTION WHEN insufficient_privilege THEN
    v_blocked := true;
  END;
  IF NOT v_blocked THEN
    RAISE EXCEPTION 'FALHA PONTO 5.4: Papel authenticated conseguiu consultar public.ai_integration_secrets diretamente!';
  END IF;

  -- ---------------------------------------------------------------------------
  -- TESTE 6 (`service_role`): Cofre de segredos, Orçamentos Atómicos (Reserva,
  -- Idempotência, Expiração, Hard-Stop, Liquidação e Rasto em Cashflow)
  -- ---------------------------------------------------------------------------
  SET LOCAL ROLE service_role;

  SELECT count(*)::integer INTO v_rows FROM public.ai_integration_secrets WHERE provider_key = 'google_gemini';
  IF v_rows <> 1 THEN
    RAISE EXCEPTION 'FALHA SERVICE_ROLE: service_role não conseguiu ler ai_integration_secrets!';
  END IF;

  -- Criar orçamento de teste (50,00 EUR = 5000 cêntimos)
  INSERT INTO public.fin_budgets (code, scope_name, period_month, currency_code, allocated_cents, reserved_cents, consumed_cents, hard_stop_enabled)
  VALUES ('TEST_BUDGET_EUR_32', 'Orçamento Teste Homologação 3.2', '2026-11', 'EUR', 5000, 0, 0, true)
  RETURNING id INTO v_budget_id;

  -- 6.1 Rejeitar valor negativo ou zero
  v_res1 := public.reserve_ai_budget('TEST_BUDGET_EUR_32', NULL, NULL, 0, 'idem_zero_32');
  IF (v_res1->>'success')::boolean IS TRUE THEN
    RAISE EXCEPTION 'FALHA FINOPS: reserve_ai_budget aceitou valor 0!';
  END IF;

  -- 6.2 Reserva válida de 20,00 EUR (2000 cêntimos)
  v_res1 := public.reserve_ai_budget('TEST_BUDGET_EUR_32', NULL, NULL, 2000, 'idem_valid_001');
  IF (v_res1->>'success')::boolean IS NOT TRUE THEN
    RAISE EXCEPTION 'FALHA FINOPS: reserve_ai_budget falhou para reserva válida: %', v_res1;
  END IF;
  v_reservation_id := (v_res1->>'reservation_id')::uuid;

  -- 6.3 Replay idempotente com a mesma chave não deve duplicar reserva
  v_res_idem := public.reserve_ai_budget('TEST_BUDGET_EUR_32', NULL, NULL, 2000, 'idem_valid_001');
  IF (v_res_idem->>'idempotent_replay')::boolean IS NOT TRUE OR (v_res_idem->>'reservation_id')::uuid <> v_reservation_id THEN
    RAISE EXCEPTION 'FALHA FINOPS: idempotência de reserve_ai_budget falhou: %', v_res_idem;
  END IF;

  -- 6.4 Expiração automática de reserva vencida: inserir reserva expirada de 1500 cêntimos e verificar recuperação
  SET LOCAL ROLE postgres;
  UPDATE public.fin_budgets SET reserved_cents = reserved_cents + 1500 WHERE id = v_budget_id;
  INSERT INTO public.fin_budget_reservations (budget_id, idempotency_key, currency_code, reserved_cents, status, expires_at)
  VALUES (v_budget_id, 'idem_expired_002', 'EUR', 1500, 'reserved', now() - interval '5 minutes');

  SET LOCAL ROLE service_role;
  -- Agora o disponível real (após libertar os 1500 expirados) é 5000 - 2000 = 3000 cêntimos.
  -- Uma reserva de 4000 cêntimos deve ser bloqueada pelo Hard-Stop!
  v_res_over := public.reserve_ai_budget('TEST_BUDGET_EUR_32', NULL, NULL, 4000, 'idem_over_003');
  IF (v_res_over->>'error') <> 'BUDGET_HARD_STOP_EXCEEDED' OR (v_res_over->>'available_cents')::bigint <> 3000 THEN
    RAISE EXCEPTION 'FALHA FINOPS: Hard-Stop ou limpeza de expirados falhou: %', v_res_over;
  END IF;

  -- 6.5 Bloquear liquidação acima do valor reservado (reservado = 2000, tentativa = 2500)
  v_settle_over := public.settle_ai_budget(v_reservation_id, 2500, false);
  IF (v_settle_over->>'error') <> 'SETTLEMENT_EXCEEDS_RESERVED_LIMIT' THEN
    RAISE EXCEPTION 'FALHA FINOPS: settle_ai_budget permitiu liquidar acima do reservado: %', v_settle_over;
  END IF;

  -- 6.6 Liquidação válida de 1250 cêntimos (12,50 EUR) deve atualizar orçamento e criar lançamento em fin_cashflow_entries
  v_settle_ok := public.settle_ai_budget(v_reservation_id, 1250, false);
  IF (v_settle_ok->>'success')::boolean IS NOT TRUE OR v_settle_ok->>'cashflow_entry_id' IS NULL THEN
    RAISE EXCEPTION 'FALHA FINOPS: settle_ai_budget falhou na liquidação legítima: %', v_settle_ok;
  END IF;

  -- 6.7 Dupla liquidação deve retornar already_finalized = true sem duplicar débito
  v_settle_dup := public.settle_ai_budget(v_reservation_id, 1250, false);
  IF (v_settle_dup->>'already_finalized')::boolean IS NOT TRUE THEN
    RAISE EXCEPTION 'FALHA FINOPS: settle_ai_budget não detetou dupla liquidação: %', v_settle_dup;
  END IF;

  -- ---------------------------------------------------------------------------
  -- TESTE 7: Proteção Anti-Enumeração e Rate-Limit nas funções de Quota de IA
  -- ---------------------------------------------------------------------------
  SET LOCAL ROLE anon;
  FOR v_i IN 1..10 LOOP
    v_quota_res := public.check_ai_site_draw_quota('Visitante.Quota32@umbulab.test');
    IF (v_quota_res->>'allowed')::boolean IS NOT TRUE THEN
      RAISE EXCEPTION 'FALHA QUOTA: tentativa % deveria ser permitida!', v_i;
    END IF;
  END LOOP;

  -- A 11.ª chamada dentro de 60 segundos deve ser bloqueada pelo rate limiter (allowed = false)
  v_quota_res := public.check_ai_site_draw_quota('visitante.quota32@umbulab.test');
  IF (v_quota_res->>'allowed')::boolean IS TRUE THEN
    RAISE EXCEPTION 'FALHA RATE LIMIT QUOTA: 11.ª chamada consecutiva não foi bloqueada por check_rate_limit!';
  END IF;

  RAISE NOTICE 'HOMOLOGAÇÃO FASE 3.2: TODOS OS 7 BLOCOS DE TESTES (RLS, P0-A..E, COFRE, FINOPS ATÓMICO E RATE-LIMIT DE QUOTAS) PASSARAM COM SUCESSO!';
END;
$$;

ROLLBACK;
