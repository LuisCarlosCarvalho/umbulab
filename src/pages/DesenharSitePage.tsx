import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, Monitor, Smartphone, ArrowLeft, Send, XCircle } from 'lucide-react';
import { showToast } from '../components/ui/Toast';

export function DesenharSitePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const [formData, setFormData] = useState({
    email: '',
    company_name: '',
    logo_url: '',
    business_type: 'service',
    number_of_pages: 1,
    style: 'modern',
    colors: '',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      showToast('Por favor, insira o seu email.', 'error');
      return;
    }

    setLoading(true);
    setGeneratedHtml(null);
    setIsFinished(false);
    setProgress(0);

    let progressInterval: ReturnType<typeof setInterval>;

    try {
      // 1. Check usage limit
      const { count, error: countError } = await supabase
        .from('ai_generated_sites')
        .select('*', { count: 'exact', head: true })
        .eq('form_data->>email', formData.email);

      if (countError) throw new Error('Erro ao verificar limite de uso.');
      if (count && count >= 2) {
        throw new Error('Limite excedido. Já gerou o máximo de 2 modelos gratuitos com este email. Por favor, contacte a UmbuLab.');
      }

      // Start progress simulation
      let simProgress = 0;
      progressInterval = setInterval(() => {
        simProgress += Math.random() * 8;
        if (simProgress > 95) simProgress = 95;
        setProgress(simProgress);
      }, 500);

      // 2. Start streaming request
      const response = await fetch('/api/generate-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro ao comunicar com a IA.');
      }

      if (!response.body) throw new Error('Sem resposta da IA.');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let htmlAcc = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.slice(6));
              const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
              htmlAcc += text;
              setGeneratedHtml(htmlAcc);
            } catch (err) {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }

      clearInterval(progressInterval);
      setProgress(100);
      setIsFinished(true);
      showToast('Modelo desenhado com sucesso!', 'success');

      // 3. Auto-save the lead to Supabase
      const finalHtml = cleanHtml(htmlAcc);
      await supabase
        .from('ai_generated_sites')
        .insert([{
          company_name: formData.company_name,
          form_data: formData,
          generated_html: finalHtml,
          prompt_used: 'Streaming Prompt',
        }]);

    } catch (error: any) {
      console.error(error);
      showToast(error.message || 'Ocorreu um erro ao desenhar o modelo.', 'error');
      if (progressInterval!) clearInterval(progressInterval);
      setIsFinished(true); // Stop loading state even on error
    } finally {
      setLoading(false);
    }
  };

  const handleSendIdea = () => {
    navigate('/contact?service=Projeto de Site IA&email=' + encodeURIComponent(formData.email));
  };

  const [progress, setProgress] = useState(0);

  const cleanHtml = (raw: string) => {
    const match = raw.match(/```html\s*([\s\S]*?)\s*```/i);
    if (match) return match[1].trim();
    // Fallback if no markdown block
    return raw.replace(/^```html\n?/i, '').replace(/\n?```$/i, '').trim();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-neutral-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-neutral-400" />
          </button>
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Gerar Ideia de Site
            </h1>
            <p className="text-neutral-400 mt-2">Veja o seu modelo a ser desenhado em tempo real (Máximo: 2 por email).</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Formulário (Esquerda) */}
          <div className="lg:col-span-4 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 h-fit">
            {!isFinished ? (
              <form onSubmit={handleGenerate} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Seu Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Nome da Empresa *</label>
                  <input
                    type="text"
                    name="company_name"
                    required
                    value={formData.company_name}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    placeholder="Ex: UmbuLab"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Tipo de Negócio</label>
                  <select
                    name="business_type"
                    value={formData.business_type}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="service">Serviços</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="portfolio">Portfólio</option>
                    <option value="landing_page">Landing Page</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">Estilo Visual</label>
                    <select
                      name="style"
                      value={formData.style}
                      onChange={handleInputChange}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="modern">Moderno</option>
                      <option value="minimalist">Minimalista</option>
                      <option value="classic">Clássico</option>
                      <option value="bold">Ousado / Dark</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">Cores</label>
                    <input
                      type="text"
                      name="colors"
                      value={formData.colors}
                      onChange={handleInputChange}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                      placeholder="Ex: #000, Azul"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Descrição Breve *</label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Descreva o que a empresa faz..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      A Desenhar...
                    </>
                  ) : (
                    'Desenhar o meu Modelo'
                  )}
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center h-full space-y-6 py-12 text-center animate-in fade-in zoom-in duration-500">
                <div className="bg-emerald-500/10 p-4 rounded-full">
                  <Monitor className="w-12 h-12 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Modelo Concluído</h3>
                  <p className="text-neutral-400 text-sm">Este é apenas um modelo visual não-funcional para ter uma ideia do nosso trabalho.</p>
                </div>
                
                <div className="w-full space-y-3 pt-4 border-t border-neutral-800">
                  <button
                    onClick={handleSendIdea}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-emerald-900/20"
                  >
                    <Send className="w-5 h-5" />
                    Enviar ideia para o time UmbuLab
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="w-full flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3 px-4 rounded-xl transition-all"
                  >
                    <XCircle className="w-5 h-5" />
                    Sair da página
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Preview Area (Direita) */}
          <div className="lg:col-span-8 bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col overflow-hidden h-[800px]">
            {/* Toolbar do Preview */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-950/50">
              <div className="flex items-center gap-2 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-2 rounded-md transition-colors ${previewMode === 'desktop' ? 'bg-neutral-800 text-emerald-400' : 'text-neutral-500 hover:text-white'}`}
                  title="Visualização Desktop"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-2 rounded-md transition-colors ${previewMode === 'mobile' ? 'bg-neutral-800 text-emerald-400' : 'text-neutral-500 hover:text-white'}`}
                  title="Visualização Mobile"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Iframe Area */}
            <div className="flex-grow bg-neutral-950 relative flex items-center justify-center p-4">
              {loading && !isFinished && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-neutral-950 px-6 text-center">
                  <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-6" />
                  <p className="text-xl font-bold text-emerald-400 mb-2">A desenhar o seu modelo...</p>
                  <p className="text-sm text-neutral-400 mb-8 max-w-md">A Umbulab está a desenvolver a página, a estruturar o layout e a aplicar o design. Por favor, não feche a página.</p>
                  
                  <div className="w-full max-w-md bg-neutral-800 rounded-full h-3 mb-3 overflow-hidden border border-neutral-700 relative">
                    <div 
                      className="absolute left-0 top-0 bg-gradient-to-r from-emerald-500 to-green-400 h-full rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-emerald-500 animate-pulse">{Math.round(progress)}% Concluído</span>
                </div>
              )}

              {!generatedHtml && !loading && !isFinished && (
                <div className="text-center text-neutral-600">
                  <Monitor className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Preencha o formulário e clique em "Desenhar o meu Modelo"<br/> para ver a magia acontecer.</p>
                </div>
              )}

              {isFinished && generatedHtml && (
                generatedHtml.includes("<html") && generatedHtml.includes("</html>") && generatedHtml.length > 500 ? (
                  <div 
                    className={`transition-all duration-500 ease-in-out mx-auto bg-white overflow-hidden rounded-md border border-neutral-800 shadow-2xl animate-in fade-in zoom-in-95 ${
                      previewMode === 'mobile' ? 'w-[375px] h-[812px]' : 'w-full h-full'
                    }`}
                  >
                    <iframe
                      title="Website Preview"
                      srcDoc={cleanHtml(generatedHtml)}
                      sandbox="allow-scripts allow-popups"
                      className="w-full h-full border-none bg-white"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 border border-red-500/30 rounded-md p-8 text-center">
                    <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-4">
                      <i className="fas fa-exclamation-triangle text-2xl"></i>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Falha ao gerar site válido</h3>
                    <p className="text-neutral-400 max-w-md">
                      A Inteligência Artificial não conseguiu gerar um código estruturado a 100%. Por favor, tente gerar novamente.
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
