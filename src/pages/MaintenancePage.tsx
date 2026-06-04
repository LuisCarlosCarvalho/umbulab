import { useEffect } from 'react';
import { Logo } from '../components/Logo';

export function MaintenancePage() {
  useEffect(() => {
    // Inject noindex meta tag
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex, nofollow');
    
    // Prevent scrolling behind
    document.body.style.overflow = 'hidden';

    return () => {
      // Cleanup
      meta?.setAttribute('content', 'index, follow');
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[99999] bg-[#0f172a] flex items-center justify-center p-4 overflow-hidden">
      {/* Pulse Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-green-700/20 rounded-full blur-[120px] md:blur-[150px] animate-pulse pointer-events-none"></div>

      <div className="relative z-10 text-center max-w-3xl mx-auto flex flex-col items-center">
        <div className="mb-12">
          {/* Logo component rendering */}
          <Logo showText={true} textColor="text-white" iconSize={80} />
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tight leading-[1.15] font-sans">
          Estamos reformulando nossa marca<br className="hidden md:block"/> para melhor atendê-lo.
        </h1>
        
        <p className="text-lg sm:text-xl text-green-200/70 font-medium max-w-xl mx-auto leading-relaxed">
          Novidades incríveis estão a caminho com a UmbuLab. Aguarde, voltaremos em breve com uma plataforma mais rápida e potente.
        </p>

        <div className="mt-16 w-12 h-1.5 bg-green-700 rounded-full mx-auto opacity-50"></div>
      </div>
    </div>
  );
}
