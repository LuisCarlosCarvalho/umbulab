import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, Monitor, Smartphone, CheckCircle, Save, ArrowLeft } from 'lucide-react';
import { showToast } from '../components/ui/Toast';
import DOMPurify from 'dompurify';

export function DesenharSitePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [promptUsed, setPromptUsed] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
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
    setLoading(true);
    setGeneratedHtml(null);

    try {
      const response = await fetch('/api/generate-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const textData = await response.text();
      let data;
      
      try {
        data = textData ? JSON.parse(textData) : {};
      } catch (e) {
        throw new Error('A rota /api/generate-site não retornou JSON. Se está a testar localmente, precisa de usar "npx vercel dev" em vez de "npm run dev" para que as Serverless Functions funcionem.');
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Erro ao gerar o site.');
      }

      setGeneratedHtml(data.html);
      setPromptUsed(data.prompt);
      showToast('Protótipo gerado com sucesso!', 'success');
    } catch (error: any) {
      console.error(error);
      showToast(error.message || 'Ocorreu um erro ao gerar o site.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProject = async () => {
    if (!generatedHtml || !formData.company_name) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('ai_generated_sites')
        .insert([{
          company_name: formData.company_name,
          form_data: formData,
          generated_html: generatedHtml,
          prompt_used: promptUsed || '',
        }]);

      if (error) throw error;

      showToast('Projeto guardado com sucesso!', 'success');
      navigate('/dashboard'); // ou para uma rota onde listam estes projetos
    } catch (error: any) {
      console.error('Error saving project:', error);
      showToast('Erro ao guardar projeto: ' + error.message, 'error');
    } finally {
      setIsSaving(false);
    }
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
              Desenhar Site com IA
            </h1>
            <p className="text-neutral-400 mt-2">Crie protótipos de alta conversão em segundos.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Formulário (Esquerda) */}
          <div className="lg:col-span-4 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Nome da Empresa *</label>
                <input
                  type="text"
                  name="company_name"
                  required
                  value={formData.company_name}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Ex: UmbuLab"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">URL do Logotipo</label>
                <input
                  type="url"
                  name="logo_url"
                  value={formData.logo_url}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="https://exemplo.com/logo.png"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Tipo de Negócio</label>
                  <select
                    name="business_type"
                    value={formData.business_type}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="service">Serviços</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="portfolio">Portfólio</option>
                    <option value="blog">Blog</option>
                    <option value="landing_page">Landing Page</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Secções</label>
                  <input
                    type="number"
                    name="number_of_pages"
                    min="1"
                    max="10"
                    value={formData.number_of_pages}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Estilo Visual</label>
                  <select
                    name="style"
                    value={formData.style}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="modern">Moderno</option>
                    <option value="minimalist">Minimalista</option>
                    <option value="classic">Clássico</option>
                    <option value="bold">Ousado / Dark</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Cores (Hex/Nomes)</label>
                  <input
                    type="text"
                    name="colors"
                    value={formData.colors}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Ex: #000000, #3B82F6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Descrição do Projeto *</label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Descreva o que a empresa faz, quais os serviços principais e o objetivo do site..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    A Gerar Protótipo...
                  </>
                ) : (
                  'Gerar Site com IA'
                )}
              </button>
            </form>
          </div>

          {/* Preview Area (Direita) */}
          <div className="lg:col-span-8 bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col overflow-hidden h-[800px]">
            {/* Toolbar do Preview */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-950/50">
              <div className="flex items-center gap-2 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-2 rounded-md transition-colors ${previewMode === 'desktop' ? 'bg-neutral-800 text-blue-400' : 'text-neutral-500 hover:text-white'}`}
                  title="Visualização Desktop"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-2 rounded-md transition-colors ${previewMode === 'mobile' ? 'bg-neutral-800 text-blue-400' : 'text-neutral-500 hover:text-white'}`}
                  title="Visualização Mobile"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              {generatedHtml && (
                <button
                  onClick={handleSaveProject}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-70"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Guardar Projeto
                </button>
              )}
            </div>

            {/* Iframe Area */}
            <div className="flex-grow bg-neutral-950 relative flex items-center justify-center p-4">
              {loading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-neutral-950/80 backdrop-blur-sm">
                  <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
                  <p className="text-lg font-medium text-blue-400 animate-pulse">A Inteligência Artificial está a desenhar o seu site...</p>
                  <p className="text-sm text-neutral-500 mt-2">Isto pode demorar alguns segundos.</p>
                </div>
              )}

              {!generatedHtml && !loading && (
                <div className="text-center text-neutral-600">
                  <Monitor className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Preencha o formulário e clique em "Gerar Site"<br/> para ver a magia acontecer.</p>
                </div>
              )}

              {generatedHtml && (
                <div 
                  className={`transition-all duration-300 ease-in-out mx-auto bg-white overflow-hidden rounded-md border border-neutral-800 shadow-2xl ${
                    previewMode === 'mobile' ? 'w-[375px] h-[812px]' : 'w-full h-full'
                  }`}
                >
                  <iframe
                    title="Website Preview"
                    srcDoc={DOMPurify.sanitize(generatedHtml, { ADD_TAGS: ['style'] })}
                    sandbox="allow-scripts"
                    className="w-full h-full border-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
