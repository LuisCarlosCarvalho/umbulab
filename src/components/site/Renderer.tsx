import React from 'react';
import { Hero } from './Hero';
import { About } from './About';
import { Services } from './Services';
import { Gallery } from './Gallery';
import { Testimonials } from './Testimonials';
import { Contact } from './Contact';

export interface SiteSection {
  type: string;
  [key: string]: any;
}

export interface SiteData {
  title: string;
  sections: SiteSection[];
}

interface RendererProps {
  data: SiteData;
}

export function Renderer({ data }: RendererProps) {
  if (!data || !data.sections || !Array.isArray(data.sections)) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>Formato de site inválido. Não foi possível renderizar a pré-visualização.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col font-sans bg-white text-neutral-900">
      {/* Navbar mockup */}
      <nav className="w-full h-20 bg-white border-b border-neutral-100 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-50">
        <div className="text-xl font-black tracking-tighter">{data.title}</div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-neutral-500">
          <span className="cursor-not-allowed hover:text-neutral-900 transition-colors">Início</span>
          <span className="cursor-not-allowed hover:text-neutral-900 transition-colors">Serviços</span>
          <span className="cursor-not-allowed hover:text-neutral-900 transition-colors">Sobre</span>
          <span className="cursor-not-allowed hover:text-neutral-900 transition-colors">Contacto</span>
        </div>
        <button disabled className="bg-neutral-900 text-white px-6 py-2.5 rounded-full text-sm font-bold cursor-not-allowed">
          Começar
        </button>
      </nav>

      {/* Renderização dinâmica das secções baseada no tipo (JSON) */}
      {data.sections.map((section, index) => {
        const key = `${section.type}-${index}`;
        
        switch (section.type) {
          case 'hero':
            return <Hero key={key} title={section.title} subtitle={section.subtitle} cta_text={section.cta_text} />;
          case 'about':
            return <About key={key} title={section.title} content={section.content} />;
          case 'services':
            return <Services key={key} title={section.title} items={section.items} />;
          case 'gallery':
            return <Gallery key={key} title={section.title} images={section.images} />;
          case 'testimonials':
            return <Testimonials key={key} title={section.title} items={section.items} />;
          case 'contact':
            return <Contact key={key} title={section.title} email={section.email} />;
          default:
            console.warn(`Tipo de secção desconhecido: ${section.type}`);
            return null;
        }
      })}

      {/* Footer mockup */}
      <footer className="bg-neutral-950 text-neutral-400 py-12 text-center text-sm w-full">
        <p>&copy; {new Date().getFullYear()} {data.title}. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
