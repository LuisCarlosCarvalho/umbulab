import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  Monitor, 
  Smartphone, 
  Tablet, 
  CheckCircle2, 
  ChevronRight,
  Loader2,
  Calendar,
  Layers,
  User
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Portfolio } from '../types';
import { LazyImage } from '../components/ui/LazyImage';

export function PortfolioDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeMockup, setActiveMockup] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    async function loadProject() {
      try {
        const { data, error } = await supabase
          .from('portfolio')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setItem(data);
      } catch (err) {
        console.error('Erro ao carregar projeto:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProject();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Carregando história do projeto...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Projeto não encontrado</h1>
          <button
            onClick={() => navigate('/portfolio')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            <ArrowLeft size={20} />
            Voltar ao Portfólio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Dynamic Header / Hero */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={item.image_url} 
            className="w-full h-full object-cover opacity-20 blur-sm scale-110" 
            alt="background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/80 to-gray-900" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <button 
            onClick={() => navigate('/portfolio')}
            className="inline-flex items-center gap-2 text-blue-400 hover:text-white transition-colors mb-12 font-bold uppercase tracking-widest text-xs"
          >
            <ArrowLeft size={16} />
            Voltar ao Portfólio
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {item.category}
                </span>
                {item.is_featured && (
                  <span className="px-3 py-1 bg-amber-600/20 text-amber-400 border border-amber-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter mb-8">
                {item.title}
              </h1>
              
              <div className="flex flex-wrap gap-8 text-gray-400">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest font-black text-gray-500">Cliente</span>
                  <div className="flex items-center gap-2 text-white font-bold">
                    <User size={14} className="text-blue-500" />
                    {item.client_name || 'Particular'}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest font-black text-gray-500">Projeto</span>
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Layers size={14} className="text-blue-500" />
                    {item.project_type || item.category}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest font-black text-gray-500">Data</span>
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Calendar size={14} className="text-blue-500" />
                    {new Date(item.created_at).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' })}
                  </div>
                </div>
              </div>

              {item.project_url && (
                <div className="mt-12">
                  <a 
                    href={item.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20 group"
                  >
                    Ver Projeto ao Vivo
                    <ExternalLink size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                </div>
              )}
            </div>

            <div className="hidden lg:block relative group">
              <div className="absolute -inset-4 bg-blue-600/20 rounded-[40px] blur-2xl group-hover:bg-blue-600/30 transition-all duration-700" />
              <img 
                src={item.image_url} 
                alt={item.title} 
                className="relative rounded-[32px] shadow-2xl border border-white/10 ring-1 ring-white/20 transform group-hover:scale-[1.02] transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-6">O Desafio</h2>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-8">
                {item.challenge || 'Transformar a presença digital e criar uma experiência única para os usuários.'}
              </p>
              <div className="h-1 w-20 bg-blue-600 rounded-full" />
            </div>
            <div className="space-y-6">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-6 font-medium">Nossa Solução</h2>
              <p className="text-lg text-gray-600 leading-relaxed font-medium">
                {item.solution || item.description}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                {['Design Exclusivo', 'Performance Otimizada', 'SEO Estratégico', 'Interface Intuitiva'].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-gray-900 font-bold text-sm">
                    <CheckCircle2 size={18} className="text-blue-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mosaic Gallery */}
      {item.gallery_images && item.gallery_images.length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
             <header className="mb-16">
                <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Exploração <span className="text-blue-600">Visual</span></h2>
                <div className="h-1 w-12 bg-gray-200 mt-4" />
             </header>

             <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {item.gallery_images.map((img, idx) => {
                  // Create a mosaic effect: first image is large, others vary
                  const isLarge = idx === 0;
                  const isMedium = idx === 2 || idx === 5;
                  
                  return (
                    <div 
                      key={idx} 
                      className={`
                        relative rounded-[32px] overflow-hidden group shadow-lg shadow-gray-200/50 border border-gray-100
                        ${isLarge ? 'md:col-span-8 md:row-span-2 aspect-video md:aspect-auto' : isMedium ? 'md:col-span-6 aspect-square' : 'md:col-span-4 aspect-square'}
                      `}
                    >
                      <LazyImage 
                        src={img} 
                        alt={`${item.title} gallery ${idx}`} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                        wrapperClassName="w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                    </div>
                  );
                })}
             </div>
          </div>
        </section>
      )}

      {/* Showcase / Perspective Layout */}
      <section className="py-32 bg-white overflow-hidden border-t border-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <header className="text-center mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">
              Showcase <span className="text-blue-600">Multiplas Telas</span>
            </h2>
            <p className="text-gray-500 font-medium max-w-2xl mx-auto">
              Cada detalhe foi refinado para uma experiência impecável em todos os dispositivos.
            </p>
          </header>

          <div className="relative w-full max-w-5xl mx-auto pt-10 pb-20 animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both">
            {/* 1. Laptop (Base) */}
            <div className="relative z-10 w-full rounded-[2.5rem] bg-gray-900 p-2 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-gray-800">
               <div className="relative overflow-hidden rounded-[2rem] bg-gray-800 aspect-[16/10] border border-white/5">
                  <img 
                    src={item.laptop_image_url || item.image_url} 
                    className="w-full h-full object-cover object-top" 
                    alt="Laptop View"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes('placehold.co')) {
                        target.src = 'https://placehold.co/1200x800/e2e8f0/1e293b?text=Laptop+Design';
                      }
                    }}
                  />
               </div>
               {/* Laptop Base Stand Detail */}
               <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-2 bg-gray-800 rounded-b-xl" />
            </div>

            {/* 2. Tablet (Overlapping) */}
            <div className="absolute -bottom-10 -right-12 md:-right-20 z-20 w-[45%] rounded-[2rem] bg-gray-950 p-1.5 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] border border-gray-800 transform rotate-1">
               <div className="relative overflow-hidden rounded-[1.5rem] aspect-[3/4] bg-gray-800 border border-white/5">
                  <img 
                    src={item.tablet_image_url || item.image_url} 
                    className="w-full h-full object-cover object-top" 
                    alt="Tablet View"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes('placehold.co')) {
                        target.src = 'https://placehold.co/600x800/e2e8f0/1e293b?text=Tablet';
                      }
                    }}
                  />
               </div>
               {/* Tablet Button Detail */}
               <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/10" />
            </div>

            {/* 3. Mobile (Overlapping Topmost) */}
            <div className="absolute -bottom-20 right-4 md:right-12 z-30 w-[22%] rounded-[2.5rem] bg-gray-950 p-1 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)] border border-gray-800 transform -rotate-2">
               <div className="relative overflow-hidden rounded-[2.2rem] aspect-[9/19] bg-gray-800 border border-white/5">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-gray-950 rounded-b-lg z-10" />
                  
                  <img 
                    src={item.mobile_image_url || item.image_url} 
                    className="w-full h-full object-cover object-top" 
                    alt="Mobile View"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes('placehold.co')) {
                        target.src = 'https://placehold.co/300x600/e2e8f0/1e293b?text=Mobile';
                      }
                    }}
                  />
               </div>
            </div>

            {/* Subtle Reflection */}
            <div className="absolute -bottom-32 inset-x-0 h-40 bg-gradient-to-t from-transparent via-blue-500/5 to-transparent blur-3xl pointer-events-none -z-10" />
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-gray-950 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
            Pronto para transformar o seu negócio em um <span className="text-blue-500 font-black italic">Case de Sucesso?</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
            <button 
              onClick={() => navigate('/contact')}
              className="px-12 py-5 bg-blue-600 text-white rounded-[24px] font-black text-lg hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-blue-900/40"
            >
              Iniciar meu Projeto
            </button>
            <button 
              onClick={() => navigate('/portfolio')}
              className="px-8 py-5 bg-white/5 text-white border border-white/10 rounded-[24px] font-bold text-lg hover:bg-white/10 transition-all"
            >
              Explorar outros projetos
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
