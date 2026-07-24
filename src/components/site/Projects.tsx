import React from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';

export interface ProjectItem {
  title: string;
  category?: string;
  description?: string;
  imageUrl?: string;
  link?: string;
}

export interface ProjectsProps {
  title?: string;
  subtitle?: string;
  items: ProjectItem[];
  primaryColor?: string;
}

export function Projects({ title = "Nossos Projetos", subtitle, items, primaryColor = "#059669" }: ProjectsProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="w-full py-24 bg-white text-neutral-900 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">{title}</h2>
          {subtitle && <p className="text-xl text-neutral-500 max-w-2xl mx-auto">{subtitle}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, i) => {
            // Garante uma imagem gerada por IA caso a IA se esqueça de fornecer no JSON
            const finalImageUrl = item.imageUrl || `https://image.pollinations.ai/prompt/${encodeURIComponent((item.category || 'creative') + ' ' + item.title + ' portfolio project professional high quality')}?width=800&height=600&nologo=true&enhance=true`;
            
            return (
            <div key={i} className="group relative rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer">
              <div className="w-full h-72 bg-neutral-200 relative overflow-hidden">
                <img src={finalImageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/40 transition-colors duration-500" />
              </div>
              <div className="relative z-10 p-8 transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                {item.category && (
                  <span 
                    className="inline-block px-3 py-1 mb-3 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md rounded-full"
                    style={{ backgroundColor: `${primaryColor}80` }}
                  >
                    {item.category}
                  </span>
                )}
                <h3 className="text-3xl font-bold text-white mb-2">{item.title}</h3>
                {item.description && (
                  <p className="text-neutral-300 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">
                    {item.description}
                  </p>
                )}
                
                {item.link && (
                  <button className="flex items-center gap-2 text-white font-semibold hover:text-emerald-400 transition-colors">
                    Ver Projeto <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
