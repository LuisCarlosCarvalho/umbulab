import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';

interface ContactProps {
  title?: string;
  email: string;
}

export function Contact({ title = 'Fale Conosco', email }: ContactProps) {
  return (
    <section className="py-24 px-6 bg-blue-600 text-white w-full relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-blue-700 rounded-full filter blur-3xl opacity-50" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-10">
        <h2 className="text-4xl md:text-5xl font-bold leading-tight">
          {title}
        </h2>
        <p className="text-blue-100 text-xl font-light max-w-2xl mx-auto">
          Estamos prontos para ouvir a sua ideia e transformá-la em realidade. Entre em contacto connosco hoje mesmo.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <a 
            href={`mailto:${email}`}
            className="flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-neutral-50 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-900/20"
            onClick={(e) => e.preventDefault()} // Non-functional in preview
          >
            <Mail className="w-5 h-5" />
            {email}
          </a>
          <button 
            className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg text-white border-2 border-white/20 hover:bg-white/10 transition-all"
            disabled
          >
            Saber mais <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
