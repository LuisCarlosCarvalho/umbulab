-- =============================================================================
-- UMBULAB AI GROWTH OS — SUÍTE DE TESTES DE SEGURANÇA COM ROLLBACK GARANTIDO
-- Ficheiro: scripts/security_test_suite.sql
--
-- OBJETIVO:
--   Validar os 4 cenários de segurança de public.profiles no cluster 127.0.0.1:55432
--   em uma única transação atómica que sofre ROLLBACK incondicional no final.
--   Garante os privilégios canónicos do Supabase para a role authenticated
--   e respeita a foreign key profiles_id_fkey sem violar restrições.
-- =============================================================================

\set ON_ERROR_STOP on

BEGIN;

-- 1. Contagem pré-teste de perfis existentes
SELECT count(*) AS count_profiles_before FROM public.profiles;

-- 2. Conceder privilégios DAC canónicos do Supabase para o papel authenticated
-- (Necessário no PostgreSQL restaurado para que o RLS seja avaliado; revertido pelo ROLLBACK)
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, UPDATE ON TABLE public.profiles TO authenticated;

-- 3. Execução dos 4 cenários de segurança com simulação fidedigna
DO $$
DECLARE
  v_test_client_a_id uuid;
  v_test_client_b_id uuid;
  v_orig_fullname text;
  v_rows_affected integer;
  v_err_role boolean := false;
  v_role_errmsg text := '';
  v_err_finance boolean := false;
  v_finance_errmsg text := '';
BEGIN
  -- ---------------------------------------------------------------------------
  -- PREPARAÇÃO DE IDENTIDADES SEGURAS:
  -- Preferência 1: Utilizar perfis existentes onde Cliente A seja NÃO-ADMINISTRADOR
  -- ---------------------------------------------------------------------------
  SELECT id INTO v_test_client_a_id
  FROM public.profiles
  WHERE role <> 'admin'
  LIMIT 1;

  IF v_test_client_a_id IS NOT NULL THEN
    SELECT id INTO v_test_client_b_id
    FROM public.profiles
    WHERE id <> v_test_client_a_id
    LIMIT 1;
  END IF;

  -- Preferência 2: Se não houver cliente comum existente, criar utilizadores válidos em auth.users
  -- (Garante cumprimento estrito da Foreign Key profiles_id_fkey sem violar integridade)
  IF v_test_client_a_id IS NULL OR v_test_client_b_id IS NULL THEN
    v_test_client_a_id := gen_random_uuid();
    v_test_client_b_id := gen_random_uuid();

    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    VALUES 
      (v_test_client_a_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'temp_homolog_a@umbulab.internal', '', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Cliente Teste A"}'::jsonb, now(), now()),
      (v_test_client_b_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'temp_homolog_b@umbulab.internal', '', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Cliente Teste B"}'::jsonb, now(), now())
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES 
      (v_test_client_a_id, 'temp_homolog_a@umbulab.internal', 'Cliente Teste A', 'client'),
      (v_test_client_b_id, 'temp_homolog_b@umbulab.internal', 'Cliente Teste B', 'client')
    ON CONFLICT (id) DO UPDATE SET role = 'client';
  END IF;

  -- Simular sessão de cliente autenticado (Cliente A) via claims PostgREST
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claim.sub', v_test_client_a_id::text, true);
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

  -- ---------------------------------------------------------------------------
  -- CENÁRIO 1: Cliente A tenta atualizar o perfil do Cliente B (Bloqueio por RLS)
  -- ---------------------------------------------------------------------------
  UPDATE public.profiles
  SET full_name = 'Nome Invadido'
  WHERE id = v_test_client_b_id;
  
  GET DIAGNOSTICS v_rows_affected = ROW_COUNT;
  IF v_rows_affected <> 0 THEN
    RAISE EXCEPTION 'FAIL_CENARIO_1: RLS vazou acesso! Linhas afetadas: %', v_rows_affected;
  END IF;
  RAISE NOTICE 'PASS_CENARIO_1: RLS bloqueou transversalmente a alteracao do perfil de terceiro (0 linhas afetadas).';

  -- ---------------------------------------------------------------------------
  -- CENÁRIO 2: Cliente A atualiza campo permitido do próprio perfil
  -- ---------------------------------------------------------------------------
  SELECT full_name INTO v_orig_fullname FROM public.profiles WHERE id = v_test_client_a_id;

  UPDATE public.profiles
  SET full_name = COALESCE(v_orig_fullname, '') || ' [Homologacao Teste]'
  WHERE id = v_test_client_a_id;
  
  GET DIAGNOSTICS v_rows_affected = ROW_COUNT;
  IF v_rows_affected <> 1 THEN
    RAISE EXCEPTION 'FAIL_CENARIO_2: Atualizacao legitima falhou! Linhas afetadas: %', v_rows_affected;
  END IF;
  RAISE NOTICE 'PASS_CENARIO_2: Atualizacao legitima de full_name autorizada e executada com sucesso (1 linha afetada).';

  -- ---------------------------------------------------------------------------
  -- CENÁRIO 3: Cliente A tenta elevar o próprio role para admin (Bloqueio por Trigger)
  -- ---------------------------------------------------------------------------
  BEGIN
    UPDATE public.profiles
    SET role = 'admin'
    WHERE id = v_test_client_a_id;
  EXCEPTION WHEN OTHERS THEN
    v_role_errmsg := SQLERRM;
    IF SQLERRM LIKE '%não possuem permissão para alterar o perfil de acesso%' 
       OR SQLERRM LIKE '%Operação não autorizada%' THEN
      v_err_role := true;
    END IF;
  END;

  IF NOT v_err_role THEN
    RAISE EXCEPTION 'FAIL_CENARIO_3: Trigger nao impediu elevacao de role para admin! Msg: %', v_role_errmsg;
  END IF;
  RAISE NOTICE 'PASS_CENARIO_3: Trigger bloqueou tentativa de elevacao de role para admin com excecao: %', v_role_errmsg;

  -- ---------------------------------------------------------------------------
  -- CENÁRIO 4: Cliente A tenta alterar campo financeiro restrito (Bloqueio por Trigger)
  -- ---------------------------------------------------------------------------
  BEGIN
    UPDATE public.profiles
    SET manual_payment_override = true
    WHERE id = v_test_client_a_id;
  EXCEPTION WHEN OTHERS THEN
    v_finance_errmsg := SQLERRM;
    IF SQLERRM LIKE '%apenas administradores podem alterar parâmetros financeiros%' 
       OR SQLERRM LIKE '%Operação não autorizada%' THEN
      v_err_finance := true;
    END IF;
  END;

  IF NOT v_err_finance THEN
    RESET ROLE;
    RAISE EXCEPTION 'FAIL_CENARIO_4: Trigger nao impediu alteracao de manual_payment_override! Msg: %', v_finance_errmsg;
  END IF;
  RAISE NOTICE 'PASS_CENARIO_4: Trigger bloqueou tentativa de alteracao de campo financeiro com excecao: %', v_finance_errmsg;

  -- Restaurar sessão de superuser
  RESET ROLE;
END $$;

-- 4. ROLLBACK MANDATÓRIO (Desfaz todas as alterações, privilégios e dados efêmeros)
ROLLBACK;

-- 5. Contagem pós-teste comprovando integridade e preservação absoluta
SELECT count(*) AS count_profiles_after FROM public.profiles;
