import React from 'react';
import { Quote } from 'lucide-react';

interface TestimonialItem {
  name: string;
  role?: string;
  text: string;
}

interface TestimonialsProps {
  title?: string;
  items: TestimonialItem[];
}

export function Testimonials({ title = 'O que dizem sobre nós', items }: TestimonialsProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-24 px-6 bg-neutral-900 text-white w-full">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
          <div className="w-20 h-1 bg-emerald-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div key={index} className="bg-neutral-800 p-8 rounded-2xl border border-neutral-700 relative">
              <Quote className="absolute top-6 right-6 w-10 h-10 text-neutral-700 opacity-50" />
              <p className="text-neutral-300 leading-relaxed mb-8 relative z-10 font-medium">
                "{item.text}"
              </p>
              <div className="flex items-center gap-4 border-t border-neutral-700 pt-6">
                <div className="w-12 h-12 bg-neutral-700 rounded-full flex items-center justify-center font-bold text-xl text-neutral-400">
                  {item.name ? item.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h4 className="font-bold text-white">{item.name}</h4>
                  {item.role && <p className="text-sm text-emerald-400">{item.role}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
