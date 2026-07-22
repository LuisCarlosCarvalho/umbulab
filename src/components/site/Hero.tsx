import React from 'react';

interface HeroProps {
  title: string;
  subtitle?: string;
  cta_text?: string;
}

export function Hero({ title, subtitle, cta_text }: HeroProps) {
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
              className="px-8 py-4 text-lg font-bold text-white bg-neutral-900 rounded-full hover:bg-neutral-800 transition-all hover:scale-105 hover:shadow-xl hover:shadow-neutral-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
