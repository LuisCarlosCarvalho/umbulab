import React, { useState } from 'react';
import { CheckCircle2, Clock, FileCheck2, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { DIAGNOSTICO_DIGITAL_CONFIG } from '../data/diagnosticoDigitalConfig';
import { supabase } from '../lib/supabase';

interface OrderReceipt {
  order_id: string;
  order_code: string;
  payment_status: string;
  message: string;
}

export default function DiagnosticoDigitalPage() {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState('Comércio & Serviços');
  const [mainChallenge, setMainChallenge] = useState('');
  const [rgpdConsent, setRgpdConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMsg('Nome completo é obrigatório.');
      return;
    }
    if (!customerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
      setErrorMsg('E-mail profissional válido é obrigatório.');
      return;
    }
    if (!companyName.trim() || companyName.trim().length < 2) {
      setErrorMsg('Nome da empresa é obrigatório.');
      return;
    }
    if (!mainChallenge.trim() || mainChallenge.trim().length < 10) {
      setErrorMsg('Descreva brevemente o desafio digital (mínimo 10 caracteres).');
      return;
    }
    if (!rgpdConsent) {
      setErrorMsg('É necessário aceitar o tratamento de dados (RGPD) para continuar.');
      return;
    }

    setSubmitting(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      const resp = await fetch('/api/growth-os?action=create_commercial_order', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          customer_name: customerName,
          customer_email: customerEmail,
          company_name: companyName,
          sector,
          main_challenge: mainChallenge,
          rgpd_consent: rgpdConsent,
        }),
      });
      const json = await resp.json();
      if (!resp.ok || !json.ok) {
        setErrorMsg(json.error || 'Não foi possível registar o pedido.');
        return;
      }
      setReceipt({
        order_id: String(json.order_id),
        order_code: String(json.order_code),
        payment_status: String(json.payment_status),
        message: String(json.message),
      });
    } catch {
      setErrorMsg('Falha de comunicação ao registar o pedido.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Cabeçalho da Oferta MVP (Pré-lançamento) */}
        <div className="rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-gray-900 p-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200">
            <Sparkles className="w-3.5 h-3.5" />
            MVP Comercial (Pré-Lançamento / Ambiente de Testes)
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {DIAGNOSTICO_DIGITAL_CONFIG.provisional_name}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
            Avaliação prática da presença digital, captação de clientes e processos internos para
            pequenas empresas em Portugal, com plano de ação claro e entrega em{' '}
            <strong>{DIAGNOSTICO_DIGITAL_CONFIG.delivery_sla_business_days} dias úteis</strong>.
          </p>
          <div className="flex flex-wrap gap-4 pt-2 text-sm text-gray-700 dark:text-gray-300">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Prazo: {DIAGNOSTICO_DIGITAL_CONFIG.delivery_sla_business_days} dias úteis
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              IA com supervisão humana + RGPD
            </span>
          </div>
        </div>

        {/* Benefícios e Entregáveis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />O que inclui o diagnóstico
              </h2>
              <div className="space-y-4">
                {DIAGNOSTICO_DIGITAL_CONFIG.deliverables.map((item) => (
                  <div key={item.title} className="border-l-2 border-blue-500 pl-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-3">
              <h2 className="text-lg font-semibold">Benefícios & Transparência</h2>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {DIAGNOSTICO_DIGITAL_CONFIG.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
                {DIAGNOSTICO_DIGITAL_CONFIG.ai_transparency_notice}{' '}
                {DIAGNOSTICO_DIGITAL_CONFIG.rgpd_notice}
              </p>
              <p className="text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-lg">
                {DIAGNOSTICO_DIGITAL_CONFIG.price_visibility_note}
              </p>
            </div>
          </div>

          {/* Formulário de Pedido do Cliente */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <h2 className="text-xl font-semibold mb-4">Solicitar Diagnóstico (Teste MVP)</h2>

            {receipt ? (
              <div className="rounded-xl border border-green-200 dark:border-green-900 bg-green-50/70 dark:bg-green-950/30 p-5 space-y-3">
                <div className="flex items-center gap-2 text-green-800 dark:text-green-200 font-semibold">
                  <CheckCircle2 className="w-5 h-5" />
                  Pedido registado: {receipt.order_code}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{receipt.message}</p>
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <div>
                    <strong>ID:</strong> {receipt.order_id}
                  </div>
                  <div>
                    <strong>Estado atual:</strong> {receipt.payment_status}
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome completo</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ex.: Ana Silva"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">E-mail profissional</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="ana@empresa.pt"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Empresa</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Empresa Lda."
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Setor</label>
                    <input
                      type="text"
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Principal desafio digital atual
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={mainChallenge}
                    onChange={(e) => setMainChallenge(e.target.value)}
                    placeholder="Descreva o website atual, captação de pedidos ou processos que pretende melhorar."
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm"
                  />
                </div>
                <label className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <input
                    type="checkbox"
                    checked={rgpdConsent}
                    onChange={(e) => setRgpdConsent(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span>
                    Autorizo o tratamento destes dados para preparação do diagnóstico comercial
                    UmbuLab (em conformidade com o RGPD).
                  </span>
                </label>

                {errorMsg && (
                  <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 text-sm transition disabled:opacity-60"
                >
                  {submitting ? 'A registar pedido...' : 'Registar Pedido de Diagnóstico'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

