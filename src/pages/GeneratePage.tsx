import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Wand2, Check } from 'lucide-react';
import { showToast } from '../components/ui/Toast';

export function GeneratePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    name: '',
    project: '',
    logo_url: '',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.name || !formData.description || !formData.phone) {
      showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/ai/generate-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          business_type: formData.project // Mapear project para compatibilidade caso a API espere business_type
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao comunicar com a IA.');
      }

      showToast('Site desenhado com sucesso!', 'success');
      
      // Redireciona para /preview e passa o JSON e dados base de forma segura através do state da rota
      navigate('/preview', { 
        state: { 
          siteData: data.site, 
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          business_type: formData.project,
          prompt: data.prompt,
          logo_url: formData.logo_url
        } 
      });

    } catch (error: any) {
      console.error('API Error:', error);
      showToast(error.message || 'Ocorreu um erro ao gerar o site.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex font-sans text-white pt-24 relative overflow-hidden">
      {/* Efeitos de Luz no Fundo */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-lime-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row relative z-10 px-4 sm:px-6 lg:px-8 pb-12 gap-12 lg:gap-24">
        
        {/* Lado Esquerdo: Textos e Proposta de Valor */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center pt-8 lg:pt-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-sm font-medium w-fit mb-8 backdrop-blur-sm">
            <Wand2 size={16} className="text-green-400" /> Powered by UmbuLab IA
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
            O seu Preview <br/>
            <span className="block mt-2 text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-lime-300 whitespace-nowrap">
              pronto em 1 minuto.
            </span>
          </h1>
          
          <p className="text-neutral-400 text-lg leading-relaxed mb-6">
            Com a Umbulab IA, você visualiza rapidamente a estrutura do seu projeto, criando um preview real da sua ideia antes mesmo de começar.
          </p>
          <p className="text-neutral-400 text-lg leading-relaxed mb-10">
            Transformamos o seu conceito em uma base estratégica e visual, para que você possa validar, ajustar e crescer com segurança no digital.
          </p>

          <ul className="space-y-5">
            {[
              'Visualização imediata do projeto',
              'Rapidez no desenvolvimento',
              'Redução de custos e riscos',
              'Direção estratégica para crescer'
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-4 text-neutral-200 font-medium text-base">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Check size={14} className="text-green-400 stroke-[3]" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Lado Direito: Formulário */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center">
          <div className="bg-[#0a0a0a] rounded-3xl p-8 lg:p-10 border border-white/5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            {/* Brilho suave dentro do card */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-2">Descreva sua ideia</h2>
              <p className="text-neutral-500 text-sm">Preencha os campos abaixo e deixe a mágica com a nossa IA.</p>
            </div>

            <form onSubmit={handleGenerate} className="relative z-10 space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">E-mail corporativo</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:bg-white/10 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 outline-none transition-all placeholder:text-neutral-600 text-sm"
                  placeholder="seu@email.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">WhatsApp</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:bg-white/10 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 outline-none transition-all placeholder:text-neutral-600 text-sm"
                    placeholder="+351 912 345 678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Nome da Empresa</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:bg-white/10 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 outline-none transition-all placeholder:text-neutral-600 text-sm"
                    placeholder="Ex: UmbuLab Tech"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Seu Projeto</label>
                  <input
                    type="text"
                    name="project"
                    value={formData.project}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:bg-white/10 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 outline-none transition-all placeholder:text-neutral-600 text-sm"
                    placeholder="Website, Landing Page..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">URL da sua Logo</label>
                  <input
                    type="url"
                    name="logo_url"
                    value={formData.logo_url}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:bg-white/10 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 outline-none transition-all placeholder:text-neutral-600 text-sm"
                    placeholder="https://site.com/logo.png"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Descreva sua IDEIA</label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:bg-white/10 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 outline-none transition-all resize-none placeholder:text-neutral-600 text-sm"
                  placeholder="Descreva o que a sua empresa faz, o seu público-alvo, cores preferidas..."
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-lime-500 hover:from-green-500 hover:to-lime-400 text-white font-bold py-4 px-8 rounded-xl transition-all disabled:opacity-70 flex items-center justify-center gap-3 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:-translate-y-0.5"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      A processar a sua ideia...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Gerar Preview do Site
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
