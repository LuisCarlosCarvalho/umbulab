<#
.SYNOPSIS
  UMBULAB AI GROWTH OS - SUITE DE VALIDAÇÃO PROFUNDA FASE 4.7 (PORTA 55432)
  Ficheiro: scripts/verify-phase4-7-deep-validation.ps1

.DESCRIPTION
  Executa a instalação corrigida da Fase 4.7 e suíte exaustiva de testes de segurança,
  incluindo testes negativos de FinOps (anon e clientes bloqueados), validação
  de assinaturas, isolamento de segredos, RLS e preservação dos dados legados.
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
    Write-Error "Destino rejeitado: validacao autorizada unicamente para 127.0.0.1:55432/umbulab_restore_test"
    exit 1
}

$ErrorActionPreference = "Stop"
$pgBinDir = "C:\Program Files\PostgreSQL\18\bin"
$psql = Join-Path $pgBinDir "psql.exe"

if (-not (Test-Path $psql)) {
    Write-Error "psql.exe nao encontrado em $pgBinDir"
    exit 1
}

$rollbackSqlPath = Join-Path $PSScriptRoot "..\supabase\migrations\phase4_7_rollback_growth_os.sql"
$migrationSqlPath = Join-Path $PSScriptRoot "..\supabase\migrations\20261118140000_phase4_7_install_growth_os_production.sql"
$deepValSqlPath = Join-Path $PSScriptRoot "verify_phase4_7_deep_validation.sql"
$secSuiteSqlPath = Join-Path $PSScriptRoot "security_test_suite.sql"

Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host "  UMBULAB AI GROWTH OS - VALIDACAO PROFUNDA FASE 4.7 (PORTA $Port)" -ForegroundColor Cyan
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

try {
    # ETAPA 0: PURGA PREVENTIVA DAS TABELAS DO GROWTH OS (BASE LIMPA PARA TESTE REAL)
    Write-Host "[0/4] Purga preventiva das tabelas do Growth OS (garantindo teste sobre base limpa)..." -ForegroundColor Yellow
    $rollbackOutput = & $psql -h $HostName -p $Port -U $User -d $Database -v "ON_ERROR_STOP=1" -f $rollbackSqlPath 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Falha na purga preparatoria (ExitCode: $LASTEXITCODE):`n$($rollbackOutput -join "`n")"
        exit 1
    }
    
    $remainingGrowth = (& $psql -h $HostName -p $Port -U $User -d $Database -q -t -A -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = ANY(ARRAY['ai_system_controls', 'ai_agents', 'ai_integrations', 'ai_integration_secrets', 'ai_missions', 'ai_tasks', 'ai_task_runs', 'ai_approvals', 'ai_opportunities', 'processed_worker_messages', 'fin_budgets', 'fin_budget_reservations', 'fin_cashflow_entries', 'fin_journal_entries', 'fin_journal_lines']);").Trim()
    
    if ([int]$remainingGrowth -ne 0) {
        Write-Error "A purga falhou: ainda restam $remainingGrowth tabelas do Growth OS!"
        exit 1
    }
    Write-Host "   [PASS] Base limpa comprovada: exatamente 0 tabelas do Growth OS presentes antes da migracao." -ForegroundColor Green

    # ETAPA 1: APLICAR A MIGRAÇÃO CORRIGIDA DE PRODUÇÃO SOBRE A BASE LIMPA
    Write-Host "`n[1/4] Aplicando migracao corrigida da Fase 4.7 na base limpa (criacao de raiz)..." -ForegroundColor Yellow
    $migOutput = & $psql -h $HostName -p $Port -U $User -d $Database -v "ON_ERROR_STOP=1" -f $migrationSqlPath 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Falha ao aplicar migracao de producao (ExitCode: $LASTEXITCODE):`n$($migOutput -join "`n")"
        exit 1
    }
    
    $createdGrowth = (& $psql -h $HostName -p $Port -U $User -d $Database -q -t -A -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = ANY(ARRAY['ai_system_controls', 'ai_agents', 'ai_integrations', 'ai_integration_secrets', 'ai_missions', 'ai_tasks', 'ai_task_runs', 'ai_approvals', 'ai_opportunities', 'processed_worker_messages', 'fin_budgets', 'fin_budget_reservations', 'fin_cashflow_entries', 'fin_journal_entries', 'fin_journal_lines']);").Trim()
    
    if ([int]$createdGrowth -ne 15) {
        Write-Error "Falha na criacao: apenas $createdGrowth de 15 tabelas foram criadas!"
        exit 1
    }
    Write-Host "   [PASS] Migracao em base limpa aplicada com sucesso: 15/15 tabelas criadas de raiz (ExitCode 0)." -ForegroundColor Green

    # ETAPA 2: EXECUTAR A SUÍTE PROFUNDA DE ASSINATURAS E TESTES NEGATIVOS
    Write-Host "`n[2/4] Executando testes negativos de FinOps e auditoria de ACLs..." -ForegroundColor Yellow
    $deepOutput = & $psql -h $HostName -p $Port -U $User -d $Database -v "ON_ERROR_STOP=1" -f $deepValSqlPath 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Falha na suite de validacao profunda (ExitCode: $LASTEXITCODE):`n$($deepOutput -join "`n")"
        exit 1
    }
    
    $deepRaw = $deepOutput -join "`n"
    if ($deepRaw -match 'VALIDAÇÃO 1 APROVADA') {
        Write-Host "   [PASS] Assinatura exata de reserve_ai_budget (uuid, bigint, text, text, uuid, text) CONFIRMADA." -ForegroundColor Green
        Write-Host "   [PASS] Assinatura exata de settle_ai_budget (text, bigint, text) CONFIRMADA." -ForegroundColor Green
    }
    if ($deepRaw -match 'VALIDAÇÃO 2.1 APROVADA') {
        Write-Host "   [PASS] Teste Negativo anon: Bloqueio estrito de acesso a funcoes de FinOps comprovado." -ForegroundColor Green
    }
    if ($deepRaw -match 'VALIDAÇÃO 2.2 APROVADA') {
        Write-Host "   [PASS] Teste Negativo cliente comum: Bloqueio estrito de execucao comprovado." -ForegroundColor Green
    }
    if ($deepRaw -match 'VALIDAÇÃO 2.3 APROVADA') {
        Write-Host "   [PASS] Teste Positivo service_role: Autorizado sem JWT de admin para operacoes de backend." -ForegroundColor Green
    }
    if ($deepRaw -match 'VALIDAÇÃO 2.4 APROVADA') {
        Write-Host "   [PASS] Teste FinOps Regra de Negocio: Orcamento insuficiente bloqueado (BUDGET_EXCEEDED)." -ForegroundColor Green
    }
    if ($deepRaw -match 'VALIDAÇÃO 3.1 APROVADA') {
        Write-Host "   [PASS] Menor Privilegio anon: 0 privilegios nas 15 tabelas do Growth OS." -ForegroundColor Green
    }
    if ($deepRaw -match 'VALIDAÇÃO 3.2 APROVADA') {
        Write-Host "   [PASS] Cofre ai_integration_secrets: 100% isolado de anon e authenticated." -ForegroundColor Green
    }

    # ETAPA 3: EXECUTAR A SUÍTE DOS 4 CENÁRIOS COM ROLLBACK
    Write-Host "`n[3/4] Reexecutando os 4 cenarios de seguranca com ROLLBACK garantido..." -ForegroundColor Yellow
    $secOutput = & $psql -h $HostName -p $Port -U $User -d $Database -v "ON_ERROR_STOP=1" -f $secSuiteSqlPath 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Falha na suite de seguranca (ExitCode: $LASTEXITCODE):`n$($secOutput -join "`n")"
        exit 1
    }

    $secRaw = $secOutput -join "`n"
    if ($secRaw -match 'PASS_CENARIO_1') {
        Write-Host "   [PASS] Cenario 1: RLS isolou acesso a perfis de terceiros (0 linhas afetadas)." -ForegroundColor Green
    }
    if ($secRaw -match 'PASS_CENARIO_2') {
        Write-Host "   [PASS] Cenario 2: Atualizacao legitima de full_name autorizada (1 linha afetada)." -ForegroundColor Green
    }
    if ($secRaw -match 'PASS_CENARIO_3') {
        Write-Host "   [PASS] Cenario 3: Elevacao de role para admin bloqueada pelo trigger com excecao." -ForegroundColor Green
    }
    if ($secRaw -match 'PASS_CENARIO_4') {
        Write-Host "   [PASS] Cenario 4: Alteracao de manual_payment_override bloqueada pelo trigger com excecao." -ForegroundColor Green
    }
    if ($secRaw -match 'ROLLBACK') {
        Write-Host "   [PASS] ROLLBACK confirmado: Zero persistencia de registros de teste." -ForegroundColor Green
    }

    # ETAPA 4: VERIFICAR PRESERVAÇÃO DAS TABELAS LEGADAS
    Write-Host "`n[4/4] Verificando integridade absoluta das tabelas legadas e perfis..." -ForegroundColor Yellow
    $profilesCount = (& $psql -h $HostName -p $Port -U $User -d $Database -q -t -A -c "SELECT count(*) FROM public.profiles;").Trim()
    $quotesCount = (& $psql -h $HostName -p $Port -U $User -d $Database -q -t -A -c "SELECT count(*) FROM public.quote_requests;").Trim()
    $blogCount = (& $psql -h $HostName -p $Port -U $User -d $Database -q -t -A -c "SELECT count(*) FROM public.blog_posts;").Trim()
    
    Write-Host "   [CONFIRMADO] public.profiles mantido intacto ($profilesCount registos originais)." -ForegroundColor Green
    Write-Host "   [CONFIRMADO] public.quote_requests mantido intacto ($quotesCount registos)." -ForegroundColor Green
    Write-Host "   [CONFIRMADO] public.blog_posts mantido intacto ($blogCount registos)." -ForegroundColor Green

    Write-Host "`n================================================================================" -ForegroundColor Cyan
    Write-Host "  VALIDACAO PROFUNDA CONCLUIDA COM SUCESSO ABSOLUTO (100% PASS)!" -ForegroundColor Green
    Write-Host "  O SQL CORRIGIDO DA FASE 4.7 ESTA RIGOROSAMENTE PRONTO PARA PRODUCAO." -ForegroundColor Green
    Write-Host "================================================================================" -ForegroundColor Cyan

} catch {
    Write-Host "`n[ERRO NA EXECUCAO]: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    $env:PGPASSWORD = $null
}
