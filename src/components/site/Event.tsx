import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

export interface EventProps {
  title?: string;
  date?: string;
  time?: string;
  location?: string;
  description?: string;
}

export function Event({ title = "Detalhes do Evento", date = "Em breve", time = "19:00", location = "Local a definir", description }: EventProps) {
  return (
    <section className="w-full py-24 bg-white text-neutral-900 px-6 relative overflow-hidden">
      {/* Decorative rings */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 border-[40px] border-emerald-50 rounded-full opacity-50" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 border-[40px] border-blue-50 rounded-full opacity-50" />

      <div className="max-w-4xl mx-auto relative z-10 bg-white rounded-[3rem] shadow-2xl p-10 md:p-16 border border-neutral-100">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-500">
            {title}
          </h2>
          {description && <p className="text-lg text-neutral-500">{description}</p>}
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center mb-12">
          <div className="flex items-center gap-4 bg-neutral-50 px-6 py-4 rounded-2xl w-full md:w-auto">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-emerald-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Data</p>
              <p className="font-bold text-xl">{date}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-neutral-50 px-6 py-4 rounded-2xl w-full md:w-auto">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-emerald-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Hora</p>
              <p className="font-bold text-xl">{time}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 bg-neutral-900 text-white px-8 py-6 rounded-3xl mx-auto max-w-2xl text-center">
          <MapPin className="w-8 h-8 text-emerald-400 flex-shrink-0" />
          <div className="text-left">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Localização</p>
            <p className="font-medium text-lg md:text-xl">{location}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
