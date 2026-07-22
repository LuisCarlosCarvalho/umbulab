import React from 'react';

interface GalleryProps {
  title?: string;
  images: string[];
}

export function Gallery({ title = 'Portfólio', images }: GalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <section className="py-24 px-6 bg-white w-full">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">{title}</h2>
          <div className="w-20 h-1 bg-emerald-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((url, index) => (
            <div 
              key={index}
              className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100 group shadow-md hover:shadow-xl transition-all"
            >
              <img 
                src={url} 
                alt={`${title} - Imagem ${index + 1}`} 
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/20 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
