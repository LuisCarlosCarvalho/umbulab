import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Renderer, SiteData } from '../components/site/Renderer';
import { LayoutTemplate, AlertTriangle } from 'lucide-react';

export function PreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  
  // No caso real de um utilizador querer mesmo o projeto
  const email = location.state?.email || '';

  useEffect(() => {
    // Carrega o JSON recebido da rota /generate através do state
    if (location.state && location.state.siteData) {
      setSiteData(location.state.siteData);
    }
  }, [location]);

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
          <button 
            onClick={() => navigate('/generate')}
            className="text-neutral-400 hover:text-white text-sm hidden sm:block transition-colors"
          >
            Gerar outro
          </button>
          
          <button 
            onClick={() => {
              // Botão inativo como pedido: "Button does NOTHING for now"
              // Apenas damos um feedback visual
              alert('Funcionalidade de contacto em desenvolvimento!');
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg text-sm transition-all shadow-lg shadow-emerald-600/20"
          >
            Quero esse site
          </button>
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
