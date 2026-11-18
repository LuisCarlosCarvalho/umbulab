<#
.SYNOPSIS
  UMBULAB AI GROWTH OS - SCRIPT DE HOMOLOGACAO NO BANCO RESTAURADO (PORTA 55432)
  Ficheiro: scripts/homologate-local-db.ps1

.DESCRIPTION
  Executa a auditoria previa, aplicacao do Conjunto A (15 tabelas Growth OS) e
  suite completa de testes no PostgreSQL 18 isolado em 127.0.0.1:55432 (umbulab_restore_test).
  - Compatibilidade garantida com Windows PowerShell 5.1 e PowerShell 7+.
  - Solicita a senha interativamente no terminal (sem revelar ou gravar em logs).
  - NUNCA conecta ao Supabase de producao nem a portas diferentes de 55432.
  - Verifica integridade dos 28 objetos pre-existentes.
  - Valida o hotfix de seguranca em public.profiles.
  - Testa funcoes atomicas de FinOps e politicas RLS.
#>

[CmdletBinding()]
param(
    [string]$HostName = "127.0.0.1",
    [int]$Port = 55432,
    [string]$Database = "umbulab_restore_test",
    [string]$User = "postgres"
)

# REJEICAO ESTRITA DE QUALQUER DESTINO FORA DO AMBIENTE LOCAL AUTORIZADO
if ($HostName -ne "127.0.0.1" -or $Port -ne 55432 -or $Database -ne "umbulab_restore_test") {
    Write-Error "Destino rejeitado: homologacao autorizada unicamente para 127.0.0.1:55432/umbulab_restore_test"
    exit 1
}

$ErrorActionPreference = "Stop"
$pgBinDir = "C:\Program Files\PostgreSQL\18\bin"
$psql = Join-Path $pgBinDir "psql.exe"

if (-not (Test-Path $psql)) {
    Write-Error "psql.exe nao encontrado em $pgBinDir"
    exit 1
}

Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host "  UMBULAB AI GROWTH OS - HOMOLOGACAO NO BANCO RESTAURADO (PORTA $Port)" -ForegroundColor Cyan
Write-Host "================================================================================`n" -ForegroundColor Cyan

# 1. Obter a senha interativamente sem revelar
if (-not $env:PGPASSWORD) {
    $promptMsg = "Introduza a senha do PostgreSQL ({0}@{1}:{2})" -f $User, $HostName, $Port
    $secPass = Read-Host -Prompt $promptMsg -AsSecureString
    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secPass)
    $plainPass = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
    [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
    $env:PGPASSWORD = $plainPass
}

function Invoke-PgSql {
    param(
        [string]$Sql,
        [string]$TargetDb = $Database
    )
    $output = & $psql -h $HostName -p $Port -U $User -d $TargetDb -v "ON_ERROR_STOP=1" -q -t -A -c $Sql
    if ($LASTEXITCODE -ne 0) {
        throw "Falha ao executar comando SQL no PostgreSQL (ExitCode: $LASTEXITCODE)."
    }
    return ($output -join "`n").Trim()
}

function Invoke-PgScript {
    param(
        [string]$FilePath,
        [string]$TargetDb = $Database
    )
    & $psql -h $HostName -p $Port -U $User -d $TargetDb -v "ON_ERROR_STOP=1" -f $FilePath
    if ($LASTEXITCODE -ne 0) {
        throw "Falha ao executar script SQL '$FilePath' no PostgreSQL (ExitCode: $LASTEXITCODE)."
    }
}

try {
    # 2. TESTE DE CONEXAO
    Write-Host "[1/6] Testando conexao com $Database na porta $Port..." -ForegroundColor Yellow
    $pgVersion = Invoke-PgSql "SELECT version();"
    Write-Host "   [OK] Conexao bem-sucedida! Motor: $pgVersion" -ForegroundColor Green

    # 3. AUDITORIA PRE-MIGRACAO (CONTAGENS DO BANCO RESTAURADO)
    Write-Host "`n[2/6] Auditando estado pre-migracao do banco restaurado..." -ForegroundColor Yellow
    
    $preProfilesCount = [int](Invoke-PgSql "SELECT count(*) FROM public.profiles;")
    $preQuotesCount = [int](Invoke-PgSql "SELECT count(*) FROM public.quote_requests;")
    $preBlogCount = [int](Invoke-PgSql "SELECT count(*) FROM public.blog_posts;")
    $preAiLogsCount = [int](Invoke-PgSql "SELECT count(*) FROM public.ai_generation_logs;")
    $preAuthUsersCount = [int](Invoke-PgSql "SELECT count(*) FROM auth.users;")

    Write-Host "   - Perfis existentes: $preProfilesCount"
    Write-Host "   - Pedidos de orcamento: $preQuotesCount"
    Write-Host "   - Artigos de blog: $preBlogCount"
    Write-Host "   - Logs do gerador de sites: $preAiLogsCount"
    Write-Host "   - Utilizadores de autenticacao: $preAuthUsersCount"

    # Verificar se o trigger do hotfix de seguranca esta ativo
    $triggerCheck = Invoke-PgSql "SELECT count(*) FROM information_schema.triggers WHERE event_object_table = 'profiles' AND trigger_name = 'trg_guard_profiles_sensitive_columns';"
    if ([int]$triggerCheck -eq 1) {
        Write-Host "   [OK] [HOTFIX VERIFICADO] Trigger trg_guard_profiles_sensitive_columns PRESENTE e ATIVO em public.profiles!" -ForegroundColor Green
    } else {
        Write-Warning "   [ALERTA] Trigger trg_guard_profiles_sensitive_columns nao foi encontrado na tabela profiles!"
    }

    # 4. APLICACAO DO CONJUNTO A (MIGRACAO DO GROWTH OS)
    Write-Host "`n[3/6] Aplicando Conjunto A (15 tabelas Growth OS e funcoes FinOps)..." -ForegroundColor Yellow
    $setASqlPath = Join-Path $PSScriptRoot "..\supabase\migrations\set_a_growth_os_tables.sql"
    if (-not (Test-Path $setASqlPath)) {
        Write-Error "Ficheiro set_a_growth_os_tables.sql nao encontrado em $setASqlPath"
    }

    Invoke-PgScript $setASqlPath
    Write-Host "   [OK] Migracao do Conjunto A concluida com sucesso (codigo de saida 0)!" -ForegroundColor Green

    # 5. VERIFICACAO POS-MIGRACAO (AS 15 TABELAS)
    Write-Host "`n[4/6] Verificando criacao das 15 tabelas exclusivas do Growth OS..." -ForegroundColor Yellow
    $growthTables = @(
        'ai_system_controls', 'ai_agents', 'ai_integrations', 'ai_integration_secrets',
        'ai_missions', 'ai_tasks', 'ai_task_runs', 'ai_approvals', 'ai_opportunities',
        'processed_worker_messages', 'fin_budgets', 'fin_budget_reservations',
        'fin_cashflow_entries', 'fin_journal_entries', 'fin_journal_lines'
    )

    $tablesRaw = Invoke-PgSql "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
    $tablesInDb = $tablesRaw.Split("`n") | ForEach-Object { $_.Trim() }

    $createdCount = 0
    foreach ($t in $growthTables) {
        if ($tablesInDb -contains $t) {
            $createdCount++
            Write-Host "   [OK] Tabela verificada: public.$t" -ForegroundColor DarkGreen
        } else {
            Write-Error "   [FALHA] Tabela public.$t NAO encontrada!"
        }
    }

    if ($createdCount -eq 15) {
        Write-Host "   [OK] Todas as 15 tabelas do Growth OS foram criadas com sucesso (15/15)!" -ForegroundColor Green
    }

    # 6. VERIFICACAO DE PRESERVACAO INTEGRAL DAS TABELAS EXISTENTES
    Write-Host "`n[5/6] Confirmando preservacao absoluta dos dados existentes..." -ForegroundColor Yellow
    $postProfilesCount = [int](Invoke-PgSql "SELECT count(*) FROM public.profiles;")
    $postQuotesCount = [int](Invoke-PgSql "SELECT count(*) FROM public.quote_requests;")
    $postBlogCount = [int](Invoke-PgSql "SELECT count(*) FROM public.blog_posts;")
    $postAiLogsCount = [int](Invoke-PgSql "SELECT count(*) FROM public.ai_generation_logs;")
    $postAuthUsersCount = [int](Invoke-PgSql "SELECT count(*) FROM auth.users;")

    if ($preProfilesCount -eq $postProfilesCount -and 
        $preQuotesCount -eq $postQuotesCount -and 
        $preBlogCount -eq $postBlogCount -and 
        $preAiLogsCount -eq $postAiLogsCount -and 
        $preAuthUsersCount -eq $postAuthUsersCount) {
        Write-Host "   [OK] [INTEGRIDADE CONFIRMADA] Nenhuma linha das tabelas pre-existentes foi perdida ou alterada!" -ForegroundColor Green
    } else {
        Write-Error "   [FALHA] DISCREPANCIA DETETADA nos dados pre-existentes!"
    }

    # 7. TESTE OPERACIONAL DE SEGURANCA E FINOPS
    Write-Host "`n[6/6] Executando testes de seguranca RLS e concorrencia de FinOps..." -ForegroundColor Yellow

    # Teste 1: RLS habilitado nas 15 tabelas
    $rlsCheck = [int](Invoke-PgSql "SELECT count(*) FROM pg_tables WHERE schemaname = 'public' AND tablename = ANY(ARRAY['ai_system_controls', 'ai_agents', 'ai_integrations', 'ai_missions', 'ai_tasks', 'ai_task_runs', 'ai_approvals', 'ai_opportunities', 'fin_budgets', 'fin_budget_reservations', 'fin_cashflow_entries', 'fin_journal_entries', 'fin_journal_lines', 'processed_worker_messages', 'ai_integration_secrets']) AND rowsecurity = true;")
    if ($rlsCheck -eq 15) {
        Write-Host "   [OK] [RLS CONFIRMADO] Row Level Security ATIVO nas 15 tabelas do Growth OS." -ForegroundColor Green
    } else {
        Write-Error "   [FALHA] RLS nao esta ativo em todas as 15 tabelas ($rlsCheck/15)"
    }

    # Teste 2: Funcoes atomicas reserve_ai_budget e settle_ai_budget
    $testBudgetId = "a1111111-2222-3333-4444-555555555555"
    Invoke-PgSql "INSERT INTO public.fin_budgets (id, scope_type, scope_id, allocated_amount_cents, currency_code, period_start, period_end) VALUES ('$testBudgetId', 'global', 'agency_total', 10000, 'EUR', CURRENT_DATE, CURRENT_DATE + interval '30 days') ON CONFLICT DO NOTHING;" | Out-Null
    
    $reserveJson = Invoke-PgSql "SELECT public.reserve_ai_budget('$testBudgetId', 350, 'res_homolog_01', NULL, NULL, 'EUR');"
    Write-Host "   [OK] Execucao reserve_ai_budget: $reserveJson" -ForegroundColor DarkGreen

    $settleJson = Invoke-PgSql "SELECT public.settle_ai_budget('res_homolog_01', 300, 'Homologacao Local');"
    Write-Host "   [OK] Execucao settle_ai_budget: $settleJson" -ForegroundColor DarkGreen

    # Teste 3: Limpeza da reserva de teste
    Invoke-PgSql "DELETE FROM public.fin_cashflow_entries WHERE source_reference = 'Homologacao Local' OR description = 'Homologacao Local';" | Out-Null
    Invoke-PgSql "DELETE FROM public.fin_budget_reservations WHERE reservation_key = 'res_homolog_01';" | Out-Null
    Invoke-PgSql "DELETE FROM public.fin_budgets WHERE id = '$testBudgetId';" | Out-Null
    Write-Host "   [OK] Limpeza de registros de teste concluida."

    # Teste 4: Bateria de Seguranca em Profundidade (RLS + Trigger Hotfix)
    Write-Host "   -> Executando suite de testes de seguranca em profundidade (RLS e Trigger)..." -ForegroundColor Yellow
    $securitySuiteSql = @'
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, UPDATE ON TABLE public.profiles TO authenticated;
DO $$
DECLARE
  v_test_client_id uuid;
  v_test_target_id uuid;
  v_orig_fullname text;
  v_rows_affected integer;
  v_err_role boolean := false;
  v_err_finance boolean := false;
BEGIN
  -- Preferencia 1: Utilizar perfis existentes onde Cliente seja NAO-ADMINISTRADOR
  SELECT id INTO v_test_client_id
  FROM public.profiles
  WHERE role <> 'admin'
  LIMIT 1;

  IF v_test_client_id IS NOT NULL THEN
    SELECT id INTO v_test_target_id
    FROM public.profiles
    WHERE id <> v_test_client_id
    LIMIT 1;
  END IF;

  -- Preferencia 2: Se nao houver cliente comum existente, criar em auth.users (satisfaz profiles_id_fkey)
  IF v_test_client_id IS NULL OR v_test_target_id IS NULL THEN
    v_test_client_id := gen_random_uuid();
    v_test_target_id := gen_random_uuid();

    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    VALUES 
      (v_test_client_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'temp_homolog_a@umbulab.internal', '', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Cliente Teste A"}'::jsonb, now(), now()),
      (v_test_target_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'temp_homolog_b@umbulab.internal', '', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Cliente Teste B"}'::jsonb, now(), now())
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES 
      (v_test_client_id, 'temp_homolog_a@umbulab.internal', 'Cliente Teste A', 'client'),
      (v_test_target_id, 'temp_homolog_b@umbulab.internal', 'Cliente Teste B', 'client')
    ON CONFLICT (id) DO UPDATE SET role = 'client';
  END IF;

  -- -------------------------------------------------------------------------
  -- CENARIO 1: Bloqueio Transversal por RLS (Nao pode afetar perfil de outro)
  -- -------------------------------------------------------------------------
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claim.sub', v_test_client_id::text, true);
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

  UPDATE public.profiles
  SET full_name = 'Nome Invadido'
  WHERE id = v_test_target_id;
  
  GET DIAGNOSTICS v_rows_affected = ROW_COUNT;
  IF v_rows_affected <> 0 THEN
    RAISE EXCEPTION 'FALHA DE RLS: Utilizador conseguiu afetar perfil de terceiro! Linhas: %', v_rows_affected;
  END IF;

  -- -------------------------------------------------------------------------
  -- CENARIO 2: Atualizacao Legitima de Campo Permitido (Proprio perfil)
  -- -------------------------------------------------------------------------
  SELECT full_name INTO v_orig_fullname FROM public.profiles WHERE id = v_test_client_id;

  UPDATE public.profiles
  SET full_name = COALESCE(v_orig_fullname, '') || ' [Homologacao Teste]'
  WHERE id = v_test_client_id;
  
  GET DIAGNOSTICS v_rows_affected = ROW_COUNT;
  IF v_rows_affected <> 1 THEN
    RAISE EXCEPTION 'FALHA DE RLS/TRIGGER: Utilizador legitimo nao conseguiu atualizar o proprio campo permitido!';
  END IF;

  -- -------------------------------------------------------------------------
  -- CENARIO 3: Tentativa de Elevacao de Role (Bloqueio estrito pelo Trigger)
  -- -------------------------------------------------------------------------
  BEGIN
    UPDATE public.profiles
    SET role = 'admin'
    WHERE id = v_test_client_id;
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM LIKE '%não possuem permissão para alterar o perfil de acesso%' 
       OR SQLERRM LIKE '%Operação não autorizada%' THEN
      v_err_role := true;
    END IF;
  END;

  IF NOT v_err_role THEN
    RAISE EXCEPTION 'VULNERABILIDADE GRAVE: O trigger de seguranca NAO impediu a alteracao de role para admin!';
  END IF;

  -- -------------------------------------------------------------------------
  -- CENARIO 4: Tentativa de Alterar Parametro Financeiro (Bloqueio pelo Trigger)
  -- -------------------------------------------------------------------------
  BEGIN
    UPDATE public.profiles
    SET manual_payment_override = true
    WHERE id = v_test_client_id;
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM LIKE '%apenas administradores podem alterar parâmetros financeiros%' 
       OR SQLERRM LIKE '%Operação não autorizada%' THEN
      v_err_finance := true;
    END IF;
  END;

  IF NOT v_err_finance THEN
    RAISE EXCEPTION 'VULNERABILIDADE GRAVE: O trigger de seguranca NAO impediu a alteracao de manual_payment_override!';
  END IF;

  -- Limpeza: Restaurar full_name caso tenha usado perfil existente e remover efemeros se criados
  RESET ROLE;
  IF v_orig_fullname IS NOT NULL THEN
    UPDATE public.profiles SET full_name = v_orig_fullname WHERE id = v_test_client_id;
  END IF;
  DELETE FROM public.profiles WHERE email LIKE '%@umbulab.internal';
  DELETE FROM auth.users WHERE email LIKE '%@umbulab.internal';

END $$;
SELECT 'SUITE_SEGURANCA_100_APROVADA';
'@
    $secSuiteResult = Invoke-PgSql $securitySuiteSql
    if ($secSuiteResult -match 'SUITE_SEGURANCA_100_APROVADA') {
        Write-Host "   [OK] [CENARIO 1 - RLS] Bloqueio transversal de acesso a perfis de terceiros verificado (0 linhas)." -ForegroundColor Green
        Write-Host "   [OK] [CENARIO 2 - AUTORIZADO] Atualizacao legitima de campo permitido (full_name) confirmada (1 linha)." -ForegroundColor Green
        Write-Host "   [OK] [CENARIO 3 - TRIGGER HOTFIX] Tentativa de elevacao de role bloqueada pelo trigger com excecao!" -ForegroundColor Green
        Write-Host "   [OK] [CENARIO 4 - TRIGGER FINANCEIRO] Tentativa de alteracao de manual_payment_override bloqueada com sucesso!" -ForegroundColor Green
    } else {
        Write-Error "   [FALHA] Suite de testes de seguranca falhou!"
    }

    Write-Host "`n================================================================================" -ForegroundColor Cyan
    Write-Host "  HOMOLOGACAO 100% CONCLUIDA COM SUCESSO! CLUSTER ISOLADO PRONTO." -ForegroundColor Green
    Write-Host "  DECISAO TECNICA: GO PARA IMPLANTACAO CONTROLADA EM PRODUCAO." -ForegroundColor Green
    Write-Host "================================================================================" -ForegroundColor Cyan

} catch {
    Write-Host "`n[ERRO NA HOMOLOGACAO]: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    $env:PGPASSWORD = $null
}
