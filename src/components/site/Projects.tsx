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
    <section className="w-full py-32 bg-transparent px-6 relative overflow-hidden">
      <div className="max-w-[90rem] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="space-y-6">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white drop-shadow-md">{title}</h2>
            {subtitle && <p className="text-2xl text-neutral-400 max-w-2xl font-light">{subtitle}</p>}
          </div>
          <div className="hidden md:flex items-center gap-4 text-neutral-400">
            <span className="h-[1px] w-24 bg-white/20"></span>
            <span className="text-sm font-bold tracking-widest uppercase" style={{ color: primaryColor }}>Scroll to explore</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item, i) => {
            const finalImageUrl = item.imageUrl || `https://image.pollinations.ai/prompt/${encodeURIComponent((item.category || 'creative') + ' ' + item.title + ' masterpiece portfolio high quality')}?width=1200&height=800&nologo=true&enhance=true`;
            
            return (
            <div key={i} className="group relative rounded-[2rem] overflow-hidden bg-neutral-900 h-[60vh] min-h-[400px] cursor-pointer shadow-2xl border border-white/5">
              <img 
                src={finalImageUrl} 
                alt={item.title} 
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out" 
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700" />
              
              <div className="absolute inset-0 p-10 flex flex-col justify-end transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                {item.category && (
                  <span 
                    className="inline-block px-4 py-1.5 mb-6 text-xs font-black uppercase tracking-widest text-white backdrop-blur-xl rounded-full w-fit border border-white/20"
                    style={{ backgroundColor: `${primaryColor}60` }}
                  >
                    {item.category}
                  </span>
                )}
                
                <div className="backdrop-blur-md bg-black/20 p-8 rounded-3xl border border-white/10 group-hover:border-white/20 transition-colors duration-700">
                  <h3 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-md">{item.title}</h3>
                  {item.description && (
                    <p className="text-xl text-neutral-300 mb-0 opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto group-hover:mb-8 transition-all duration-700 ease-out font-light line-clamp-3">
                      {item.description}
                    </p>
                  )}
                  
                  {item.link && (
                    <button className="flex items-center gap-3 text-white font-bold tracking-wide uppercase text-sm group-hover:text-white transition-colors opacity-0 group-hover:opacity-100 duration-700 delay-100">
                      <span style={{ color: primaryColor }}>View Project</span> 
                      <ArrowRight className="w-5 h-5" style={{ color: primaryColor }} />
                    </button>
                  )}
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
