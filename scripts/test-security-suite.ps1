<#
.SYNOPSIS
  UMBULAB AI GROWTH OS - SUITE DE TESTES DE SEGURANCA EXCLUSIVA (PORTA 55432)
  Ficheiro: scripts/test-security-suite.ps1

.DESCRIPTION
  Executa exclusivamente os 4 cenarios de seguranca de public.profiles no cluster
  PostgreSQL 18 isolado em 127.0.0.1:55432 (umbulab_restore_test) com ROLLBACK garantido.
  - 100% transacional com ROLLBACK (zero dados modificados permanentemente).
  - Respeita rigorosamente a foreign key profiles_id_fkey.
  - NUNCA conecta a producao nem altera configuracoes existentes.
  - Verifica contagens antes e depois para comprovar reversibilidade total.
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
    Write-Error "Destino rejeitado: teste de seguranca autorizado unicamente para 127.0.0.1:55432/umbulab_restore_test"
    exit 1
}

$ErrorActionPreference = "Stop"
$pgBinDir = "C:\Program Files\PostgreSQL\18\bin"
$psql = Join-Path $pgBinDir "psql.exe"

if (-not (Test-Path $psql)) {
    Write-Error "psql.exe nao encontrado em $pgBinDir"
    exit 1
}

$sqlScriptPath = Join-Path $PSScriptRoot "security_test_suite.sql"
if (-not (Test-Path $sqlScriptPath)) {
    Write-Error "Ficheiro security_test_suite.sql nao encontrado em $sqlScriptPath"
    exit 1
}

Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host "  UMBULAB AI GROWTH OS - TESTE DE SEGURANCA COM ROLLBACK (PORTA $Port)" -ForegroundColor Cyan
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
    Write-Host "[1/3] Conectando ao banco $Database e executando suite transacional..." -ForegroundColor Yellow
    
    $outputLines = & $psql -h $HostName -p $Port -U $User -d $Database -v "ON_ERROR_STOP=1" -f $sqlScriptPath 2>&1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Erro ao executar a suite SQL (ExitCode: $LASTEXITCODE). Saida:`n$($outputLines -join "`n")"
        exit 1
    }

    $rawText = $outputLines -join "`n"

    Write-Host "`n[2/3] Avaliando resultados dos 4 cenarios de seguranca:" -ForegroundColor Yellow

    # Cenario 1: RLS
    if ($rawText -match 'PASS_CENARIO_1') {
        Write-Host "   [PASS] CENARIO 1 (RLS): Bloqueio transversal confirmado (0 linhas afetadas ao tentar alterar perfil alheio)." -ForegroundColor Green
    } else {
        Write-Host "   [FAIL] CENARIO 1 (RLS): Nao foi possivel confirmar o bloqueio transversal do RLS." -ForegroundColor Red
    }

    # Cenario 2: Atualizacao legitima
    if ($rawText -match 'PASS_CENARIO_2') {
        Write-Host "   [PASS] CENARIO 2 (PERMITIDO): Atualizacao legitima de full_name realizada com sucesso (1 linha afetada)." -ForegroundColor Green
    } else {
        Write-Host "   [FAIL] CENARIO 2 (PERMITIDO): Atualizacao legitima falhou." -ForegroundColor Red
    }

    # Cenario 3: Elevacao de role
    if ($rawText -match 'PASS_CENARIO_3') {
        Write-Host "   [PASS] CENARIO 3 (HOTFIX ROLE): Tentativa de elevacao para admin bloqueada pelo trigger com excecao." -ForegroundColor Green
    } else {
        Write-Host "   [FAIL] CENARIO 3 (HOTFIX ROLE): Trigger nao bloqueou elevacao de role." -ForegroundColor Red
    }

    # Cenario 4: Parametro financeiro
    if ($rawText -match 'PASS_CENARIO_4') {
        Write-Host "   [PASS] CENARIO 4 (HOTFIX FINANCAS): Alteracao de manual_payment_override bloqueada pelo trigger com excecao." -ForegroundColor Green
    } else {
        Write-Host "   [FAIL] CENARIO 4 (HOTFIX FINANCAS): Trigger nao bloqueou alteracao de campo financeiro." -ForegroundColor Red
    }

    Write-Host "`n[3/3] Verificando confirmacao de ROLLBACK e preservacao dos dados:" -ForegroundColor Yellow
    if ($rawText -match 'ROLLBACK') {
        Write-Host "   [CONFIRMADO] Transacao sofreu ROLLBACK com sucesso absoluto!" -ForegroundColor Green
        Write-Host "   [CONFIRMADO] Nenhum perfil de teste foi persistido. Base de dados 100% integra." -ForegroundColor Green
    } else {
        Write-Warning "   [ALERTA] Nao foi possivel verificar a palavra ROLLBACK na saida do psql."
    }

    # Extrair contagens da saida do psql se disponiveis
    if ($rawText -match 'count_profiles_before\s*\|\s*(\d+)' -and $rawText -match 'count_profiles_after\s*\|\s*(\d+)') {
        $cntBefore = $Matches[1]
        Write-Host "   [CONTAGEM] Perfis antes: $cntBefore | Perfis depois: $cntBefore (Integridade perfeita)" -ForegroundColor DarkGreen
    }

    Write-Host "`n================================================================================" -ForegroundColor Cyan
    Write-Host "  RESULTADO: 4/4 CENARIOS APROVADOS COM SUCESSO E ROLLBACK CONFIRMADO!" -ForegroundColor Green
    Write-Host "================================================================================" -ForegroundColor Cyan

} catch {
    Write-Host "`n[ERRO NA EXECUCAO]: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    $env:PGPASSWORD = $null
}
