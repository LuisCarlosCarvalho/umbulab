import React, { useState } from 'react';
import {
  Palette,
  CheckCircle2,
  PlusCircle,
  Sparkles,
  RefreshCw,
  Edit3,
  Save,
  Send,
} from 'lucide-react';
import { DemoDataBadge } from '../components/GrowthOsBadges';
import {
  generateCreativeStudioAsset,
  submitCreativeAssetForApproval,
  updateCreativeAssetDraft,
  useGrowthOsRuntime,
} from '../services/growthOsRuntime';
import { showToast } from '../../../../components/ui/Toast';
import { FieldLabelWithHelp } from '../components/GrowthOsHelpSystem';

export const CreativeStudioView: React.FC = () => {
  const state = useGrowthOsRuntime();
  const [showAssistant, setShowAssistant] = useState(false);

  // Campos do Assistente "Criar Novo Conteúdo" (Parte 4.7)
  const [title, setTitle] = useState('Apresentação Comercial — Websites Rápidos & IA UmbuLab');
  const [contentType, setContentType] = useState('Texto para Página de Vendas (Landing Page)');
  const [objective, setObjective] = useState('Explicar os benefícios de forma simples e gerar pedidos de orçamento');
  const [targetAudience, setTargetAudience] = useState('Empresários e gestores de PMEs');
  const [targetChannel, setTargetChannel] = useState('Website / Landing Page B2B');
  const [locale, setLocale] = useState<'pt-PT' | 'pt-BR' | 'en-US'>('pt-PT');
  const [tone, setTone] = useState('Profissional, claro e próximo');
  const [productService, setProductService] = useState('Desenvolvimento Web & Automação WhatsApp UmbuLab');
  const [format, setFormat] = useState('Estrutura com Título, 3 Benefícios e Botão de Contacto');
  const [cta, setCta] = useState('Pedir Diagnóstico Gratuito');

  // Edição inline de rascunhos gerados
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const asset = generateCreativeStudioAsset({
      title: title.trim() || 'Novo Conteúdo UmbuLab',
      content_type: contentType,
      objective: objective.trim(),
      target_audience: targetAudience.trim(),
      target_channel: targetChannel.trim(),
      locale,
      tone,
      product_service: productService.trim(),
      format: format.trim(),
      call_to_action: cta.trim(),
    });
    setShowAssistant(false);
    setEditingAssetId(asset.asset_id);
    setEditingText(asset.generated_text);
    showToast('Rascunho de conteúdo criado! Pode pré-visualizar, editar ou enviar para aprovação abaixo.', 'success');
  };

  const handleSaveDraft = (assetId: string) => {
    updateCreativeAssetDraft(assetId, editingText);
    setEditingAssetId(null);
    showToast('Alterações guardadas no rascunho!', 'success');
  };

  const handleRegenerate = (assetId: string) => {
    const target = state.creative_assets.find((a) => a.asset_id === assetId);
    if (!target) return;
    const updatedText = `${target.generated_text}\n\n[Variação Alternativa Sugerida]: Foco direto em resultados mensuráveis e suporte técnico dedicado pela equipa UmbuLab (${new Date().toLocaleTimeString('pt-PT')}).`;
    updateCreativeAssetDraft(assetId, updatedText);
    if (editingAssetId === assetId) setEditingText(updatedText);
    showToast('Texto regenerado com nova variação!', 'info');
  };

  const handleSendForApproval = (assetId: string) => {
    if (editingAssetId === assetId) {
      updateCreativeAssetDraft(assetId, editingText);
      setEditingAssetId(null);
    }
    const updated = submitCreativeAssetForApproval(assetId);
    if (updated) {
      showToast('Conteúdo enviado para a fila de Tarefas e Aprovações!', 'success');
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho com Botão Principal "Criar Novo Conteúdo" */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <Palette size={18} className="text-umbu-primary dark:text-umbu-secondary shrink-0" aria-hidden="true" />
              Estúdio Criativo (Textos, Roteiros e Propostas)
            </h3>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              Geração de Textos e Roteiros (Sem Custos de Vídeo/Imagem Pagos)
            </span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Crie textos para páginas de vendas, publicações para redes sociais, roteiros de vídeo curto e mensagens comerciais em português de Portugal ou do Brasil sem precisar de conhecimentos técnicos.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAssistant((v) => !v)}
          className="inline-flex items-center gap-2 rounded-xl bg-umbu-primary px-4 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-sm hover:opacity-95 shrink-0 self-start lg:self-center"
        >
          <PlusCircle size={16} />
          <span>{showAssistant ? 'Fechar Assistente' : 'Criar Novo Conteúdo'}</span>
        </button>
      </div>

      {/* ASSISTENTE GUIADO "CRIAR NOVO CONTEÚDO" (PARTE 4.7) */}
      {showAssistant && (
        <section className="rounded-2xl border-2 border-umbu-primary/30 bg-white dark:bg-zinc-950 p-5 sm:p-6 space-y-4 shadow-sm">
          <div>
            <h4 className="text-base font-extrabold text-zinc-900 dark:text-white">
              Assistente para Criar Novo Conteúdo
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Escolha o tipo de conteúdo, o público e o idioma. O sistema gera um rascunho textual ou roteiro que poderá editar antes de aprovar.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <FieldLabelWithHelp
                  label="Tipo de Conteúdo"
                  help={{
                    meaning: 'Que peça de comunicação pretende criar.',
                    purpose: 'Estruturar o texto de acordo com o formato (página, post, roteiro de vídeo ou mensagem).',
                    howToFill: 'Escolha na lista.',
                    example: 'Texto para Página de Vendas',
                    required: true,
                    effect: 'Ajusta a estrutura do rascunho gerado.',
                    costOrExternalImpact: 'Gera apenas texto/roteiro (não renderiza vídeo nem imagem paga).',
                  }}
                />
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2 text-sm font-bold"
                >
                  <option value="Texto para Página de Vendas (Landing Page)">
                    Texto para Página de Vendas (Landing Page)
                  </option>
                  <option value="Publicação para Instagram / LinkedIn">
                    Publicação para Instagram / LinkedIn
                  </option>
                  <option value="Roteiro de Vídeo Curto (Reels / Shorts)">
                    Roteiro de Vídeo Curto (Guião em Texto)
                  </option>
                  <option value="Proposta Comercial B2B Individual">
                    Proposta Comercial B2B Individual
                  </option>
                </select>
              </div>

              <div>
                <FieldLabelWithHelp
                  label="Idioma"
                  help={{
                    meaning: 'Variante linguística do texto.',
                    purpose: 'Garantir vocabulário natural para Portugal (pt-PT), Brasil (pt-BR) ou Internacional (en-US).',
                    howToFill: 'Escolha o idioma.',
                    example: 'Português de Portugal (pt-PT)',
                    required: true,
                    effect: 'Adapta expressões e referências legais (RGPD/LGPD).',
                    costOrExternalImpact: 'Sem custo.',
                  }}
                />
                <select
                  value={locale}
                  onChange={(e) => setLocale(e.target.value as 'pt-PT' | 'pt-BR' | 'en-US')}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2 text-sm font-bold"
                >
                  <option value="pt-PT">Português de Portugal (pt-PT)</option>
                  <option value="pt-BR">Português do Brasil (pt-BR)</option>
                  <option value="en-US">Inglês Internacional (en-US)</option>
                </select>
              </div>

              <div>
                <FieldLabelWithHelp
                  label="Tom da Mensagem"
                  help={{
                    meaning: 'O estilo de comunicação do texto.',
                    purpose: 'Manter a voz profissional da UmbuLab.',
                    howToFill: 'Escolha o tom pretendido.',
                    example: 'Profissional, claro e próximo',
                    required: true,
                    effect: 'Orienta a redação.',
                    costOrExternalImpact: 'Sem custo.',
                  }}
                />
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2 text-sm font-bold"
                >
                  <option value="Profissional, claro e próximo">Profissional, claro e próximo</option>
                  <option value="Consultivo e executivo (B2B)">Consultivo e executivo (B2B)</option>
                  <option value="Educativo e passo a passo">Educativo e passo a passo</option>
                  <option value="Direto e orientado à ação">Direto e orientado à ação</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-zinc-800 dark:text-zinc-200 mb-1">
                  Título / Tema Principal
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-zinc-800 dark:text-zinc-200 mb-1">
                  Produto ou Serviço da UmbuLab a divulgar
                </label>
                <input
                  type="text"
                  required
                  value={productService}
                  onChange={(e) => setProductService(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-zinc-800 dark:text-zinc-200 mb-1">
                  Objetivo do Conteúdo
                </label>
                <input
                  type="text"
                  required
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-zinc-800 dark:text-zinc-200 mb-1">
                  Público-Alvo
                </label>
                <input
                  type="text"
                  required
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-zinc-800 dark:text-zinc-200 mb-1">
                  Plataforma / Canal
                </label>
                <input
                  type="text"
                  required
                  value={targetChannel}
                  onChange={(e) => setTargetChannel(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-zinc-800 dark:text-zinc-200 mb-1">
                  Formato da Estrutura
                </label>
                <input
                  type="text"
                  required
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-zinc-800 dark:text-zinc-200 mb-1">
                  Chamada para Ação (Botão / Convite final)
                </label>
                <input
                  type="text"
                  required
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2 text-sm font-semibold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setShowAssistant(false)}
                className="rounded-xl border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-umbu-primary px-5 py-2.5 text-xs font-extrabold text-white shadow-sm"
              >
                <Sparkles size={14} />
                Gerar Rascunho de Conteúdo
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Grelha de Conteúdos com Pré-visualização, Editar, Regenerar, Guardar Rascunho e Enviar para Aprovação */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {state.creative_assets.map((asset) => {
          const isEditing = editingAssetId === asset.asset_id;
          return (
            <article
              key={asset.asset_id}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-sm"
            >
              <div className="space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-umbu-primary/10 text-umbu-primary dark:bg-umbu-primary/20 dark:text-umbu-secondary">
                    {asset.content_type}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      {asset.locale}
                    </span>
                    {asset.is_demo_data ? (
                      <DemoDataBadge />
                    ) : (
                      <span
                        className={`rounded-md px-2.5 py-1 text-xs font-bold ${
                          asset.status_label === 'awaiting_approval'
                            ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        }`}
                      >
                        {asset.status_label === 'awaiting_approval'
                          ? 'Enviado para Aprovação'
                          : 'Rascunho Guardado'}
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white leading-snug">
                  {asset.title}
                </h4>

                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  <strong>Canal:</strong> {asset.target_channel} • <strong>Público:</strong> {asset.target_audience}
                </p>

                {/* Pré-visualização ou Edição do Texto/Roteiro */}
                <div>
                  <span className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-500 mb-1">
                    Pré-visualização do Texto / Roteiro (Apenas Texto):
                  </span>
                  {isEditing ? (
                    <textarea
                      rows={7}
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="w-full rounded-xl border border-umbu-primary bg-white dark:bg-zinc-950 p-3 text-xs sm:text-sm text-zinc-900 dark:text-white leading-relaxed"
                    />
                  ) : (
                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3.5 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                      {asset.generated_text}
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-umbu-primary dark:text-umbu-secondary shrink-0 mt-0.5" />
                  <span>{asset.compliance_check_note}</span>
                </div>
              </div>

              {/* Ações: Editar, Regenerar, Guardar rascunho, Enviar para aprovação */}
              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {isEditing ? (
                    <button
                      type="button"
                      onClick={() => handleSaveDraft(asset.asset_id)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-extrabold text-white"
                    >
                      <Save size={13} />
                      Guardar rascunho
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAssetId(asset.asset_id);
                        setEditingText(asset.generated_text);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100"
                    >
                      <Edit3 size={13} />
                      Editar texto
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleRegenerate(asset.asset_id)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100"
                  >
                    <RefreshCw size={13} />
                    Regenerar
                  </button>
                </div>

                <button
                  type="button"
                  disabled={asset.status_label === 'awaiting_approval'}
                  onClick={() => handleSendForApproval(asset.asset_id)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-umbu-primary px-3.5 py-1.5 text-xs font-extrabold text-white shadow-sm hover:opacity-95 disabled:opacity-50"
                >
                  <Send size={13} />
                  <span>
                    {asset.status_label === 'awaiting_approval'
                      ? 'Em Aprovação'
                      : 'Enviar para aprovação'}
                  </span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default CreativeStudioView;
