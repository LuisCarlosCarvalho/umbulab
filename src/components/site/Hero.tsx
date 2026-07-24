import React from 'react';

export interface HeroProps {
  title: string;
  subtitle?: string;
  cta_text?: string;
  variant?: 'centered' | 'split' | 'full-image';
  imageUrl?: string;
  primaryColor?: string;
}

export function Hero({ title, subtitle, cta_text, variant = 'centered', imageUrl, primaryColor }: HeroProps) {
  
  // Cria uma imagem fantástica automaticamente se a IA se esquecer de a fornecer no JSON
  const finalImageUrl = imageUrl || `https://image.pollinations.ai/prompt/${encodeURIComponent(title + ' ' + (subtitle || 'professional modern minimalist design'))}?width=1200&height=800&nologo=true&enhance=true`;

  // Render based on the chosen variant from AI
  if (variant === 'split') {
    return (
      <section className="relative w-full min-h-[90vh] flex items-center bg-transparent px-6 py-24 overflow-hidden">
        {/* Glow Effects */}
        {primaryColor && (
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 pointer-events-none" style={{ backgroundColor: primaryColor }} />
        )}
        
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="space-y-8 text-left p-8 md:p-12 rounded-[2rem] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05] text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xl md:text-2xl text-neutral-300 leading-relaxed font-light">
                {subtitle}
              </p>
            )}
            {cta_text && (
              <div className="pt-6 relative z-10">
                <button 
                  style={{ backgroundColor: primaryColor || '#ffffff', color: primaryColor ? '#ffffff' : '#000000' }}
                  className="px-8 py-4 text-lg font-bold rounded-full hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px] hover:shadow-[0_0_60px_-15px] disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled
                >
                  {cta_text}
                </button>
              </div>
            )}
          </div>
          <div className="w-full h-[60vh] min-h-[500px] rounded-[2rem] overflow-hidden relative shadow-2xl transform lg:rotate-2 hover:rotate-0 transition-all duration-700">
            <img src={finalImageUrl} alt="Hero" className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000" />
            <div className="absolute inset-0 border-[4px] border-white/10 rounded-[2rem] pointer-events-none" />
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'full-image') {
    return (
      <section className="relative w-full min-h-[100vh] flex items-center justify-center text-white px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-neutral-900">
          <img 
            src={finalImageUrl} 
            alt="Background" 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay scale-105 animate-in zoom-in duration-[3s]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/60 to-transparent" />
          {/* Edge shadow for blending */}
          <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(3,3,3,1)] pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 mt-20">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1] drop-shadow-2xl">
            {title}
          </h1>
          {subtitle && (
            <p className="text-2xl md:text-3xl text-neutral-200 max-w-3xl mx-auto leading-relaxed drop-shadow-xl font-light">
              {subtitle}
            </p>
          )}
          {cta_text && (
            <div className="pt-10">
              <button 
                style={{ backgroundColor: primaryColor || '#ffffff', color: primaryColor ? '#ffffff' : '#000000' }}
                className="px-10 py-5 text-xl font-black rounded-full hover:scale-110 transition-all shadow-[0_0_50px_-10px] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                {cta_text}
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Default: centered (Minimal/Tech)
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center bg-transparent px-6 py-24 overflow-hidden">
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        {primaryColor && (
          <div className="absolute w-[800px] h-[800px] rounded-full blur-[150px] opacity-20 animate-pulse duration-1000" style={{ backgroundColor: primaryColor }} />
        )}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[1]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-2xl md:text-3xl text-neutral-400 max-w-3xl mx-auto leading-relaxed font-light">
            {subtitle}
          </p>
        )}
        {cta_text && (
          <div className="pt-10 flex justify-center gap-6">
            <button 
              style={{ backgroundColor: primaryColor || '#ffffff', color: primaryColor ? '#ffffff' : '#000000' }}
              className="px-10 py-5 text-xl font-bold rounded-full hover:scale-105 transition-all shadow-[0_0_40px_-10px] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled
            >
              {cta_text}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
