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
}

export function Features({ title = "Nossas Features", subtitle, items }: FeaturesProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="w-full py-24 bg-white text-neutral-900 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">{title}</h2>
          {subtitle && <p className="text-xl text-neutral-500 max-w-2xl mx-auto">{subtitle}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div key={i} className="p-8 rounded-3xl bg-neutral-50 border border-neutral-100 hover:shadow-xl hover:shadow-neutral-200/50 transition-all duration-300 group">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
              <p className="text-neutral-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
