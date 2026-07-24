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
      <section className="relative w-full min-h-[80vh] flex items-center bg-white text-neutral-900 px-6 py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="space-y-8 text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xl md:text-2xl text-neutral-600 leading-relaxed">
                {subtitle}
              </p>
            )}
            {cta_text && (
              <div className="pt-4">
                <button 
                  style={{ backgroundColor: primaryColor || '#171717' }}
                  className="px-8 py-4 text-lg font-bold text-white rounded-full hover:opacity-90 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled
                >
                  {cta_text}
                </button>
              </div>
            )}
          </div>
          <div className="w-full h-64 sm:h-96 lg:h-full min-h-[400px] bg-neutral-100 rounded-3xl overflow-hidden relative border border-neutral-200">
            <img src={finalImageUrl} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'full-image') {
    return (
      <section className="relative w-full min-h-[85vh] flex items-center justify-center text-white px-6 py-24 overflow-hidden">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 z-0 bg-neutral-900">
          <img 
            src={finalImageUrl} 
            alt="Background" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 mt-16">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] drop-shadow-lg">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl md:text-2xl text-neutral-200 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium">
              {subtitle}
            </p>
          )}
          {cta_text && (
            <div className="pt-8">
              <button 
                style={{ color: primaryColor || '#171717' }}
                className="px-10 py-5 text-lg font-bold bg-white rounded-full hover:bg-neutral-100 transition-all hover:scale-105 shadow-2xl hover:shadow-white/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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

  // Default: centered
  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center bg-neutral-50 text-neutral-900 px-6 py-24 overflow-hidden">
      {/* Background Decorator */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-emerald-50 opacity-80" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-neutral-900 leading-[1.1]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl md:text-2xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
        {cta_text && (
          <div className="pt-8">
            <button 
              style={{ backgroundColor: primaryColor || '#171717' }}
              className="px-8 py-4 text-lg font-bold text-white rounded-full hover:opacity-90 transition-all hover:scale-105 shadow-xl hover:shadow-neutral-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
