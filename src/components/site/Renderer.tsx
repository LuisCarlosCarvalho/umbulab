import React from 'react';
import { Hero } from './Hero';
import { About } from './About';
import { Services } from './Services';
import { Gallery } from './Gallery';
import { Testimonials } from './Testimonials';
import { Contact } from './Contact';
import { Features } from './Features';
import { Pricing } from './Pricing';
import { Event } from './Event';
import { Projects } from './Projects';

const componentMap: Record<string, React.ElementType> = {
  Hero,
  About,
  Services,
  Gallery,
  Testimonials,
  Contact,
  Features,
  Pricing,
  Event,
  Projects
};

export interface SiteSection {
  component?: string;
  type?: string;
  props?: any;
  [key: string]: any;
}

export interface SiteData {
  title: string;
  primaryColor?: string;
  theme?: string;
  sections: SiteSection[];
}

interface RendererProps {
  data: SiteData;
  logoUrl?: string;
}

export function Renderer({ data, logoUrl }: RendererProps) {
  if (!data || !data.sections || !Array.isArray(data.sections)) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>Formato de site inválido. Não foi possível renderizar a pré-visualização.</p>
      </div>
    );
  }

  const isDark = data.theme === 'dark';
  const mainBg = isDark ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900';
  const navBg = isDark ? 'bg-neutral-950/80 backdrop-blur-md border-white/10' : 'bg-white/80 backdrop-blur-md border-neutral-100';
  const btnStyle = data.primaryColor ? { backgroundColor: data.primaryColor } : {};

  return (
    <div className={`w-full flex flex-col font-sans ${mainBg}`}>
      {/* Navbar mockup */}
      <nav className={`w-full h-20 border-b flex items-center justify-between px-6 lg:px-12 sticky top-0 z-50 ${navBg}`}>
        <div className="text-xl font-black tracking-tighter flex items-center gap-3">
          {logoUrl ? (
            <img 
              src={logoUrl.includes('imgur.com/a/') ? logoUrl.replace('imgur.com/a/', 'i.imgur.com/') + '.png' : (logoUrl.includes('imgur.com/') && !logoUrl.match(/\.(jpeg|jpg|gif|png)$/) ? logoUrl.replace('imgur.com/', 'i.imgur.com/') + '.png' : logoUrl)} 
              alt="Logo da Empresa" 
              className="h-8 max-w-[150px] object-contain" 
              onError={(e) => {
                // Se a imagem falhar ao carregar, esconde e mostra o texto
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.innerHTML += `<span>${data.title}</span>`;
              }}
            />
          ) : (
            data.title
          )}
        </div>
        <div className={`hidden md:flex gap-8 text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
          <span className={`cursor-not-allowed transition-colors ${isDark ? 'hover:text-white' : 'hover:text-neutral-900'}`}>Início</span>
          <span className={`cursor-not-allowed transition-colors ${isDark ? 'hover:text-white' : 'hover:text-neutral-900'}`}>Serviços</span>
          <span className={`cursor-not-allowed transition-colors ${isDark ? 'hover:text-white' : 'hover:text-neutral-900'}`}>Sobre</span>
          <span className={`cursor-not-allowed transition-colors ${isDark ? 'hover:text-white' : 'hover:text-neutral-900'}`}>Contacto</span>
        </div>
        <button 
          disabled 
          style={btnStyle}
          className={`px-6 py-2.5 rounded-full text-sm font-bold cursor-not-allowed ${data.primaryColor ? 'text-white' : (isDark ? 'bg-white text-neutral-900' : 'bg-neutral-900 text-white')}`}
        >
          Começar
        </button>
      </nav>

      {/* Renderização dinâmica das secções */}
      {data.sections.map((section, index) => {
        const key = `${section.component || section.type}-${index}`;
        
        // Mapeia tanto o formato novo (component: "Hero") como o antigo (type: "hero")
        let componentName = section.component;
        if (!componentName && section.type) {
          componentName = section.type.charAt(0).toUpperCase() + section.type.slice(1);
        }
        
        const Component = componentMap[componentName as string];
        
        if (Component) {
          // Suporta tanto o formato { component, props } quanto o antigo { type, title, ... }
          const props = section.props || { ...section, title: section.title || section.headline, subtitle: section.subtitle || section.subheadline, cta_text: section.cta_text || section.cta };
          
          // Injeta a cor primária para que o componente possa usá-la em botões e destaques
          const componentProps = { ...props, primaryColor: data.primaryColor };
          
          return <Component key={key} {...componentProps} />;
        }
        
        console.warn(`Tipo de secção desconhecido: ${componentName}`);
        return null;
      })}

      {/* Footer mockup */}
      <footer className="bg-neutral-950 text-neutral-400 py-12 text-center text-sm w-full">
        <p>&copy; {new Date().getFullYear()} {data.title}. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
