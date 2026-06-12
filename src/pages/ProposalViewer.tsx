import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldAlert, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export function ProposalViewer() {
  const { codigo } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Proteção básica contra inspeção e cópia na janela principal
    const preventDefault = (e: Event) => e.preventDefault();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Bloquear F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+P
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.key === 'P' || e.key === 'p'))
      ) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', preventDefault);
    document.addEventListener('keydown', handleKeyDown);
    
    // Injetar bloqueio de impressão via CSS
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body * {
          display: none !important;
        }
        body:after {
          content: "Impressão de propostas bloqueada por motivos de segurança e direitos de autor.";
          display: block;
          text-align: center;
          font-family: sans-serif;
          font-size: 24px;
          margin-top: 50px;
        }
      }
      body {
        user-select: none !important;
        -webkit-user-select: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener('contextmenu', preventDefault);
      document.removeEventListener('keydown', handleKeyDown);
      document.head.removeChild(style);
    };
  }, []);

  if (!codigo) {
    navigate('/services');
    return null;
  }

  const handleIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement, Event>) => {
    try {
      const iframe = e.target as HTMLIFrameElement;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        // Bloquear cliques e contexto dentro do iframe, EXCETO no painel da proposta
        doc.addEventListener('click', (ev) => {
          const target = ev.target as HTMLElement;
          if (target.closest('#umbulab-panel') || target.closest('#open-panel-btn') || target.closest('#success-modal')) {
            return; // Permite a interação com o painel da proposta
          }
          ev.preventDefault();
          ev.stopPropagation();
        }, true);

        doc.addEventListener('contextmenu', (ev) => ev.preventDefault(), true);
        
        // Bloquear teclado (tentativas de print/inspect pelo iframe)
        doc.addEventListener('keydown', (ev) => {
          if (
            ev.key === 'F12' ||
            (ev.ctrlKey && ev.shiftKey && (ev.key === 'I' || ev.key === 'J')) ||
            (ev.ctrlKey && (ev.key === 'U' || ev.key === 'u' || ev.key === 'P' || ev.key === 'p'))
          ) {
            ev.preventDefault();
            return false;
          }
        }, true);

        // Adicionar estilos de segurança dentro da proposta, exceto no painel
        const style = doc.createElement('style');
        style.innerHTML = `
          body > *:not(#umbulab-panel):not(#open-panel-btn):not(#success-modal) {
            user-select: none !important;
            -webkit-user-select: none !important;
          }
          body > *:not(#umbulab-panel):not(#open-panel-btn):not(#success-modal) a, 
          body > *:not(#umbulab-panel):not(#open-panel-btn):not(#success-modal) button, 
          body > *:not(#umbulab-panel):not(#open-panel-btn):not(#success-modal) input, 
          body > *:not(#umbulab-panel):not(#open-panel-btn):not(#success-modal) textarea, 
          body > *:not(#umbulab-panel):not(#open-panel-btn):not(#success-modal) select {
            pointer-events: none !important;
          }
          @media print {
            body { display: none !important; }
          }
        `;
        doc.head.appendChild(style);
      }
    } catch (err) {
      console.warn('Proteção de iframe parcial: origin cruzado ou falha no acesso.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Visualização de Proposta | UmbuLab</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="fixed inset-0 z-[99999] bg-black overflow-hidden flex flex-col">
        {/* Barra Superior - Indicador de Visualização */}
        <div className="bg-neutral-900 text-white p-3 flex items-center justify-between border-b border-neutral-800 shrink-0 shadow-lg relative z-50">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/10 text-amber-500 p-2 rounded-lg border border-amber-500/20">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest text-neutral-300">Modo de Visualização Seguro</h2>
              <p className="text-[10px] text-amber-500/80 font-medium">Interações, cópias e impressões desativadas</p>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 bg-black/50 px-4 py-2 rounded-xl border border-white/5">
            <span className="text-xs text-neutral-500">Proposta de Referência:</span>
            <span className="font-mono text-sm font-bold text-white tracking-wider">{codigo.toUpperCase()}</span>
          </div>

          <button 
            onClick={() => navigate('/services')}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-lg text-sm font-bold transition-colors border border-red-500/20"
          >
            <X size={16} />
            <span className="hidden sm:inline">Fechar Visualização</span>
          </button>
        </div>

        {/* Área da Proposta e Marca de Água */}
        <div className="relative flex-1 w-full h-full bg-white overflow-hidden">
          {/* Iframe */}
          <iframe 
            src={`/propostas/${codigo}/index.html`}
            className="w-full h-full border-none"
            title={`Proposta ${codigo}`}
            onLoad={handleIframeLoad}
          />

          {/* Marca de Água sobre o Iframe (Pointer-events: none para permitir Scroll no Iframe) */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-[60] overflow-hidden mix-blend-multiply opacity-[0.03]">
            <div className="transform -rotate-45 text-black font-black text-6xl sm:text-8xl md:text-[120px] tracking-tighter whitespace-nowrap select-none flex flex-col items-center">
              <span>PROPOSTA EM</span>
              <span>DESENVOLVIMENTO</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
