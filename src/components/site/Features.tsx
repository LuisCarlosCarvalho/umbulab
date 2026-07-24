import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface FeatureItem {
  title: string;
  desc: string;
}

export interface FeaturesProps {
  title?: string;
  subtitle?: string;
  items: FeatureItem[];
  primaryColor?: string;
}

export function Features({ title = "Nossas Features", subtitle, items, primaryColor = "#059669" }: FeaturesProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="w-full py-32 bg-transparent px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20 space-y-6">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white drop-shadow-md">{title}</h2>
          {subtitle && <p className="text-2xl text-neutral-400 max-w-3xl mx-auto font-light">{subtitle}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
          {items.map((item, i) => {
            // Lógica de Bento Box: O primeiro e o quarto item ocupam 2 colunas se houver espaço
            const isWide = (i === 0 || i === 3) && items.length > 2;
            
            return (
              <div 
                key={i} 
                className={`p-10 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 group relative overflow-hidden ${isWide ? 'md:col-span-2' : 'md:col-span-1'}`}
              >
                {/* Subtle Glow on Hover */}
                <div 
                  className="absolute -inset-px opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-xl rounded-[2rem]"
                  style={{ backgroundColor: primaryColor }}
                />
                
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-2xl"
                      style={{ backgroundColor: `${primaryColor}30`, color: primaryColor }}
                    >
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className={`font-bold mb-4 text-white ${isWide ? 'text-4xl' : 'text-2xl'}`}>{item.title}</h3>
                  </div>
                  <p className="text-neutral-400 leading-relaxed font-light text-lg">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
