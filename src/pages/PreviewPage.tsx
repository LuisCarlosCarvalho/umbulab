import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Renderer, SiteData } from '../components/site/Renderer';
import { LayoutTemplate, AlertTriangle, Loader2, MessageCircle } from 'lucide-react';
import { sendApproval } from '../lib/api/sendApproval';
import { generateProjectPDF } from '../lib/pdf/generateProjectPDF';
import { showToast } from '../components/ui/Toast';

import { Logo } from '../components/Logo';

export function PreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Dados passados do gerador
  const email = location.state?.email || '';
  const name = location.state?.name || '';
  const phone = location.state?.phone || '';
  const businessType = location.state?.business_type || '';
  const prompt = location.state?.prompt || '';
  const logoUrl = location.state?.logo_url || '';

  useEffect(() => {
    // Carrega o JSON recebido da rota /generate através do state
    if (location.state && location.state.siteData) {
      setSiteData(location.state.siteData);
    }
  }, [location]);

  const handleApprove = async () => {
    if (!email || !name || !phone || !siteData || !prompt) {
      showToast('Dados insuficientes para aprovação.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Gerar o PDF
      const pdfBlob = generateProjectPDF({
        name,
        email,
        business_type: businessType,
        description: siteData.title, // or any description if we passed it
        siteData,
        prompt
      });

      // 2. Enviar a aprovação
      await sendApproval({
        email,
        name,
        phone,
        business_type: businessType,
        data: siteData,
        prompt,
        pdfBlob
      });
      
      setIsSuccess(true);
    } catch (error: any) {
      showToast(error.message || 'Erro ao processar a solicitação.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!siteData) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white p-6">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mb-6" />
        <h1 className="text-2xl font-bold mb-4 text-center">Nenhum site encontrado na memória</h1>
        <p className="text-neutral-400 text-center max-w-md mb-8">
          Por favor, utilize o gerador de IA para criar a estrutura do seu site primeiro.
        </p>
        <button 
          onClick={() => navigate('/generate')}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-full font-bold transition-all"
        >
          Ir para o Gerador
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 
        TASK 6: PREVIEW HEADER
        Fixed bar indicating this is a preview, and user can request the project.
      */}
      <div className="fixed top-0 left-0 w-full h-16 bg-neutral-950 border-b border-emerald-500/20 z-[100] flex items-center justify-between px-4 lg:px-8 shadow-2xl">
        <div className="flex items-center gap-3 text-emerald-400">
          <LayoutTemplate className="w-5 h-5 hidden sm:block" />
          <span className="font-semibold text-sm sm:text-base">
            Este é um preview gerado por IA
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="hidden md:inline-block text-emerald-500/80 text-sm font-medium mr-2">
            Gostou? Envie para nossa equipe e transformamos isso em um site real.
          </span>
          
          {!isSuccess && (
            <button 
              onClick={() => navigate('/generate')}
              className="text-neutral-400 hover:text-white text-sm hidden sm:block transition-colors"
              disabled={isSubmitting}
            >
              Gerar outro
            </button>
          )}
          
          {isSuccess ? (
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 font-bold px-4 py-2 rounded-lg text-sm items-center gap-2">
                ✅ Recebemos sua solicitação!
              </div>
              <a 
                href={`https://wa.me/351928485483?text=${encodeURIComponent(`Olá UmbuLab, vi a versão IA do meu site e quero finalizar o projeto para a empresa ${name}!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20b958] text-white font-bold px-4 sm:px-6 py-2 rounded-lg text-sm transition-all shadow-lg shadow-[#25D366]/30 animate-pulse"
              >
                <MessageCircle size={18} />
                <span className="hidden sm:inline">Quero meu site pronto agora</span>
                <span className="sm:hidden">WhatsApp</span>
              </a>
            </div>
          ) : (
            <button 
              onClick={handleApprove}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2 rounded-lg text-sm transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 min-w-[160px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  A enviar...
                </>
              ) : (
                'Quero esse site'
              )}
            </button>
          )}
        </div>
      </div>

      {/* 
        Espaço em branco no topo para compensar a barra fixa,
        pois a NavBar simulada da página renderizada ficará colada logo abaixo.
      */}
      <div className="pt-16 w-full relative">
        {/* Renderizador Mestre dinâmico que percorre o JSON */}
        <Renderer data={siteData} logoUrl={logoUrl} />
      </div>

      {/* Floating CTA - Pedido do Cliente */}
      <div className="fixed bottom-6 left-6 z-[100] animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-700 hidden sm:block">
        <div className="bg-white rounded-2xl p-6 shadow-2xl border border-neutral-100 max-w-sm ring-1 ring-black/5">
          <h3 className="font-bold text-neutral-900 text-lg mb-2">Gostou do projeto? 🚀</h3>
          <p className="text-neutral-600 text-sm mb-5 leading-relaxed">
            Agora dê mais um passo, entre em contato e vamos colocar sua ideia além do papel.
          </p>
          <a
            href={`https://wa.me/351928485483?text=${encodeURIComponent(`Olá UmbuLab, acabei de gerar um preview de site (para ${name || 'meu negócio'}) pela IA e quero tirar minha ideia do papel!`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20b958] text-white font-bold px-4 py-3 rounded-xl text-sm transition-all shadow-lg shadow-[#25D366]/30 hover:-translate-y-0.5"
          >
            <MessageCircle size={18} />
            Falar com a Equipe no WhatsApp
          </a>
        </div>
      </div>

      {/* Marca d'água UmbuLab */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-2 opacity-80 scale-90 sm:scale-100 origin-bottom-right">
        <div className="bg-black/60 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-white/20 flex items-center gap-3 shadow-2xl">
          <Logo showText={true} iconSize={24} textColor="text-white" />
          <div className="w-px h-6 bg-white/20"></div>
          <span className="text-white font-bold text-xs tracking-wider uppercase">Gerado por IA</span>
        </div>
      </div>
    </div>
  );
}
