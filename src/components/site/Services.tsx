import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface ServiceItem {
  name: string;
  description: string;
}

interface ServicesProps {
  title?: string;
  items: ServiceItem[];
}

export function Services({ title = 'Nossos Serviços', items }: ServicesProps) {
  return (
    <section className="py-24 px-6 bg-neutral-50 w-full">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">{title}</h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">{item.name}</h3>
              <p className="text-neutral-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
