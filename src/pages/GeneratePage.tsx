import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Wand2 } from 'lucide-react';
import { showToast } from '../components/ui/Toast';

export function GeneratePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    business_type: 'service',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.name || !formData.description) {
      showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/ai/generate-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao comunicar com a IA.');
      }

      showToast('Site desenhado com sucesso!', 'success');
      
      // Redireciona para /preview e passa o JSON de forma segura através do state da rota
      navigate('/preview', { state: { siteData: data.site, email: formData.email } });

    } catch (error: any) {
      console.error(error);
      showToast(error.message || 'Ocorreu um erro ao gerar o modelo.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Voltar ao início
        </button>

        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Elementos decorativos de fundo */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 space-y-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
                Criar Site com IA
              </h1>
              <p className="text-neutral-400">
                Preencha os dados e a nossa IA vai desenhar a estrutura visual perfeita para a sua empresa (Máximo de 2 testes por email).
              </p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">O seu Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Nome do Negócio *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  placeholder="Ex: UmbuLab Tech"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Tipo de Negócio</label>
                <select
                  name="business_type"
                  value={formData.business_type}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="service">Serviços</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="portfolio">Portfólio</option>
                  <option value="landing_page">Landing Page</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Descrição Breve *</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Descreva o que a sua empresa faz e qual o seu público..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    A processar o design com IA (aprox. 15s)...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Gerar Preview do Site
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
