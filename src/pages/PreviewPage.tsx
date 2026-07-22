import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Renderer, SiteData } from '../components/site/Renderer';
import { LayoutTemplate, AlertTriangle, Loader2 } from 'lucide-react';
import { sendApproval } from '../lib/api/sendApproval';
import { generateProjectPDF } from '../lib/pdf/generateProjectPDF';
import { showToast } from '../components/ui/Toast';

export function PreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Dados passados do gerador
  const email = location.state?.email || '';
  const name = location.state?.name || '';
  const businessType = location.state?.business_type || '';
  const prompt = location.state?.prompt || '';

  useEffect(() => {
    // Carrega o JSON recebido da rota /generate através do state
    if (location.state && location.state.siteData) {
      setSiteData(location.state.siteData);
    }
  }, [location]);

  const handleApprove = async () => {
    if (!email || !name || !siteData || !prompt) {
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
            <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2">
              ✅ Recebemos sua solicitação! Nossa equipe entrará em contato.
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
        <Renderer data={siteData} />
      </div>
    </div>
  );
}
