import React from 'react';

interface AboutProps {
  title?: string;
  content: string;
}

export function About({ title = 'Sobre nós', content }: AboutProps) {
  return (
    <section className="py-24 px-6 bg-white w-full">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">{title}</h2>
        <div className="w-20 h-1 bg-emerald-500 mx-auto rounded-full" />
        <p className="text-lg md:text-xl text-neutral-600 leading-relaxed font-light">
          {content}
        </p>
      </div>
    </section>
  );
}
