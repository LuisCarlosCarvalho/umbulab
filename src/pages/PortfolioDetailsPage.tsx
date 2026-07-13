import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
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

interface DeviceScreenProps {
  src?: string | null;
  alt: string;
  type: 'monitor' | 'laptop' | 'tablet' | 'mobile';
}

function DeviceScreen({ src, alt, type }: DeviceScreenProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    if (type === 'monitor' || type === 'laptop') {
      return (
        <div className="w-full h-full bg-[#0d0e15] p-6 flex flex-col justify-between text-white font-sans select-none border border-white/5 relative overflow-hidden">
          {/* Subtle light effect */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
          
          {/* Header */}
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded bg-green-500" />
              <div className="w-12 h-1.5 bg-white/20 rounded" />
            </div>
            <div className="flex gap-2">
              <div className="w-6 h-1 bg-white/10 rounded" />
              <div className="w-6 h-1 bg-white/10 rounded" />
              <div className="w-6 h-1 bg-white/10 rounded" />
            </div>
          </div>
          {/* Hero */}
          <div className="my-auto py-2 space-y-2 text-left">
            <div className="w-3/4 h-3 bg-gradient-to-r from-blue-500 to-green-500 rounded animate-pulse" />
            <div className="w-full h-1 bg-white/10 rounded" />
            <div className="w-5/6 h-1 bg-white/10 rounded" />
            <div className="w-12 h-3.5 bg-blue-600 rounded mt-1" />
          </div>
          {/* Cards */}
          <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/5">
            <div className="h-5 bg-white/5 rounded p-1 space-y-1">
              <div className="w-1/2 h-0.5 bg-white/20 rounded" />
              <div className="w-full h-0.5 bg-white/10 rounded" />
            </div>
            <div className="h-5 bg-white/5 rounded p-1 space-y-1">
              <div className="w-1/2 h-0.5 bg-white/20 rounded" />
              <div className="w-full h-0.5 bg-white/10 rounded" />
            </div>
            <div className="h-5 bg-white/5 rounded p-1 space-y-1">
              <div className="w-1/2 h-0.5 bg-white/20 rounded" />
              <div className="w-full h-0.5 bg-white/10 rounded" />
            </div>
          </div>
        </div>
      );
    } else if (type === 'tablet') {
      return (
        <div className="w-full h-full bg-[#0d0e15] p-3 flex flex-col justify-between text-white font-sans select-none border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-lg pointer-events-none" />
          
          {/* Header */}
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded bg-green-500" />
            </div>
            <div className="w-4 h-1.5 bg-white/10 rounded" />
          </div>
          {/* Hero */}
          <div className="my-auto py-1 space-y-1.5 text-left">
            <div className="w-4/5 h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded" />
            <div className="w-full h-0.5 bg-white/10 rounded" />
            <div className="w-full h-0.5 bg-white/10 rounded" />
            <div className="w-10 h-3 bg-blue-600 rounded mt-0.5" />
          </div>
          {/* Grid */}
          <div className="grid grid-cols-2 gap-1 pt-2 border-t border-white/5">
            <div className="h-4 bg-white/5 rounded p-0.5">
              <div className="w-1/2 h-0.5 bg-white/20 rounded" />
            </div>
            <div className="h-4 bg-white/5 rounded p-0.5">
              <div className="w-1/2 h-0.5 bg-white/20 rounded" />
            </div>
          </div>
        </div>
      );
    } else { // mobile
      return (
        <div className="w-full h-full bg-[#0d0e15] p-2 flex flex-col justify-between text-white font-sans select-none border border-white/5 relative overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center pb-1.5 border-b border-white/5">
            <div className="w-2 h-2 rounded bg-green-500" />
            <div className="w-3 h-1 bg-white/10 rounded" />
          </div>
          {/* Hero */}
          <div className="my-auto py-1 space-y-1 text-left">
            <div className="w-5/6 h-1.5 bg-gradient-to-r from-blue-500 to-green-500 rounded" />
            <div className="w-full h-0.5 bg-white/10 rounded" />
            <div className="w-8 h-2.5 bg-blue-600 rounded mt-0.5" />
          </div>
          {/* List */}
          <div className="space-y-0.5 pt-1.5 border-t border-white/5">
            <div className="h-2 bg-white/5 rounded flex items-center px-1">
              <div className="w-1/3 h-0.5 bg-white/20 rounded" />
            </div>
            <div className="h-2 bg-white/5 rounded flex items-center px-1">
              <div className="w-1/3 h-0.5 bg-white/20 rounded" />
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className="w-full h-full object-cover object-top"
      onError={() => setHasError(true)}
    />
  );
}

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

            </div>

            {/* Multi-Device Mockup Composition (Monitor, Laptop, Phone, Tablet) */}
            <div className="hidden lg:block relative w-full h-[450px]">
              {/* Glow background effect */}
              <div className="absolute -inset-4 bg-blue-600/10 rounded-[50px] blur-3xl pointer-events-none" />
              
              {/* 1. Center Monitor (iMac-like) */}
              <div className="absolute left-[15%] top-[5%] w-[58%] z-10 transition-all duration-500 hover:z-40 hover:scale-[1.02]">
                {/* Screen frame */}
                <div className="bg-[#1e1e24] p-2 rounded-2xl shadow-2xl border border-gray-700">
                  <div className="aspect-[16/10] bg-gray-900 rounded-lg overflow-hidden border border-white/5 relative">
                    <DeviceScreen src={item.image_url} alt="Monitor Layout" type="monitor" />
                  </div>
                </div>
                {/* Stand */}
                <div className="w-16 h-12 bg-gray-700 mx-auto -mt-0.5 rounded-b-xl" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }} />
                {/* Base */}
                <div className="w-28 h-1.5 bg-gray-600 mx-auto rounded-full" />
              </div>

              {/* 2. Tablet Mockup (Top Right) */}
              <div className="absolute right-[2%] top-[10%] w-[26%] z-10 transition-all duration-500 hover:z-40 hover:scale-[1.03] rotate-1">
                <div className="bg-gray-950 p-2 rounded-[20px] shadow-2xl border border-gray-800">
                  <div className="aspect-[3/4] bg-gray-900 rounded-[14px] overflow-hidden border border-white/5 relative">
                    <DeviceScreen src={item.tablet_image_url || item.image_url} alt="Tablet Layout" type="tablet" />
                  </div>
                </div>
              </div>

              {/* 3. Laptop Mockup (Bottom Right / Overlapping iMac base) */}
              <div className="absolute right-[10%] bottom-[8%] w-[48%] z-20 transition-all duration-500 hover:z-40 hover:scale-[1.02]">
                {/* Screen */}
                <div className="bg-gray-900 p-1.5 rounded-t-xl shadow-2xl border-t border-x border-gray-700">
                  <div className="aspect-[16/10] bg-gray-900 rounded-lg overflow-hidden border border-white/5 relative">
                    <DeviceScreen src={item.laptop_image_url || item.image_url} alt="Laptop Layout" type="laptop" />
                  </div>
                </div>
                {/* Base keyboard part */}
                <div className="h-2 bg-[#2d2e38] rounded-b-xl border-b border-x border-gray-600 shadow-md relative">
                  {/* Indentation for lid */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#121318] rounded-b-sm" />
                </div>
              </div>

              {/* 4. Mobile Mockup (Bottom Left / Frontmost) */}
              <div className="absolute left-[6%] bottom-[8%] w-[20%] z-30 transition-all duration-500 hover:z-45 hover:scale-[1.05] -rotate-1">
                <div className="bg-gray-950 p-1 rounded-[24px] shadow-2xl border-2 border-gray-800 relative">
                  {/* Notch */}
                  <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-10 h-2.5 bg-gray-950 rounded-b-md z-10" />
                  
                  <div className="aspect-[9/19] bg-gray-900 rounded-[20px] overflow-hidden border border-white/5 relative">
                    <DeviceScreen src={item.mobile_image_url || item.image_url} alt="Mobile Layout" type="mobile" />
                  </div>
                </div>
              </div>
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

      {/* Showcase / Desktop + Mobile Side-by-Side Mockup Layout */}
      <section className="py-24 bg-gray-50 overflow-hidden border-t border-gray-150 relative">
        {/* Subtle grid background for tech agency look */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <header className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">
              Apresentação <span className="text-blue-600">Responsiva</span>
            </h2>
            <p className="text-gray-500 font-medium max-w-2xl mx-auto">
              Visualização simulada do projeto em ambiente Desktop e Mobile lado a lado.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
            {/* Left: Desktop Mockup (lg:col-span-8) */}
            <div className="lg:col-span-8 w-full group">
              <span className="block text-center text-xs font-black uppercase tracking-widest text-gray-400 mb-3 font-mono">DESKTOP VIEW</span>
              
              {/* Browser Window mockup */}
              <div className="bg-[#f3f4f6] rounded-[24px] border border-gray-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-500 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] hover:border-gray-300">
                {/* Browser top bar */}
                <div className="flex items-center justify-between px-6 py-4 bg-[#e5e7eb] border-b border-gray-200">
                  <div className="flex gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-red-400 block" />
                    <span className="w-3.5 h-3.5 rounded-full bg-yellow-400 block" />
                    <span className="w-3.5 h-3.5 rounded-full bg-green-400 block" />
                  </div>
                  {/* Simulated URL bar */}
                  <div className="bg-white rounded-lg px-4 py-1 text-xs text-gray-500 font-medium w-1/2 text-center truncate border border-gray-300/40 select-all cursor-pointer">
                    {item.project_url ? item.project_url.replace(/^https?:\/\//, '') : 'umbulab.com/projeto'}
                  </div>
                  <div className="w-12" /> {/* spacer */}
                </div>
                
                {/* Browser content area - simulating client's website */}
                <div className="bg-[#fafafa] p-8 md:p-12 text-left relative overflow-hidden min-h-[480px] flex flex-col justify-between">
                  {/* Simulated inner website layout */}
                  <div>
                    {/* Simulated website header */}
                    <div className="flex justify-between items-center mb-10 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                          {item.title.charAt(0)}
                        </div>
                        <span className="font-black text-gray-900 tracking-tight text-sm uppercase">{item.client_name || 'Projeto'}</span>
                      </div>
                      <div className="hidden sm:flex gap-6 text-xs font-bold text-gray-500">
                        <span className="hover:text-blue-600 cursor-pointer transition-colors">HOME</span>
                        <span className="hover:text-blue-600 cursor-pointer transition-colors">SOBRE</span>
                        <span className="hover:text-blue-600 cursor-pointer transition-colors">SERVIÇOS</span>
                        <span className="hover:text-blue-600 cursor-pointer transition-colors">PORTFÓLIO</span>
                      </div>
                      <button className="bg-gray-900 text-white font-extrabold uppercase tracking-widest text-[9px] px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        Contato
                      </button>
                    </div>

                    {/* Simulated Hero */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-6">
                      <div className="space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                          {item.project_type || item.category}
                        </span>
                        <h3 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight tracking-tight">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium line-clamp-3">
                          {item.description}
                        </p>
                        
                        <div className="pt-2">
                          <a 
                            href={item.project_url || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold uppercase tracking-widest text-xs px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                          >
                            Ver Site Oficial
                            <ChevronRight size={16} />
                          </a>
                        </div>
                      </div>

                      {/* Laptop Screen mockup in Desktop Browser */}
                      <div className="relative rounded-2xl overflow-hidden bg-gray-950 p-1 border border-gray-800 shadow-xl aspect-[16/10]">
                        <DeviceScreen src={item.laptop_image_url || item.image_url} alt="Layout Desktop" type="laptop" />
                      </div>
                    </div>
                  </div>

                  {/* Simulated lower feature list ("Nossos Serviços") */}
                  <div className="mt-12 pt-8 border-t border-gray-100">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 text-center sm:text-left">Destaques do Desenvolvimento</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { title: 'Design Moderno', desc: 'Interface exclusiva e polida' },
                        { title: 'Experiência do Usuário', desc: 'Navegação fluida e intuitiva' },
                        { title: 'SEO e Performance', desc: 'Otimização Lighthouse 90+' },
                        { title: 'Suporte & Manutenção', desc: 'Monitoramento contínuo' }
                      ].map((svc, i) => (
                        <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 hover:border-blue-100 hover:shadow-md">
                          <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-tight mb-1">{svc.title}</h4>
                          <p className="text-[10px] text-gray-400 font-medium leading-tight">{svc.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Mobile Mockup (lg:col-span-4) */}
            <div className="lg:col-span-4 w-full max-w-sm mx-auto group">
              <span className="block text-center text-xs font-black uppercase tracking-widest text-gray-400 mb-3 font-mono">MOBILE VIEW</span>
              
              {/* Phone Frame */}
              <div className="bg-[#121318] rounded-[48px] p-3.5 border-4 border-[#2d2e38] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.35)] relative transition-all duration-500 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.45)] hover:border-[#383a46]">
                {/* Notch */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#121318] rounded-b-2xl z-20 flex items-center justify-center">
                  <span className="w-12 h-1 bg-white/10 rounded-full mb-1.5" />
                </div>
                
                {/* Phone Inner Container */}
                <div className="bg-[#fafafa] rounded-[36px] overflow-hidden aspect-[9/19] relative flex flex-col justify-between pt-6 border border-white/5">
                  {/* Phone Screen Header */}
                  <div className="px-5 py-3 flex justify-between items-center border-b border-gray-100">
                    <span className="font-black text-xs text-gray-900 tracking-tight uppercase">{item.client_name ? item.client_name.split(' ')[0] : 'Projeto'}</span>
                    <div className="flex flex-col gap-1 w-5 items-end">
                      <span className="w-4 h-0.5 bg-gray-600 rounded-full" />
                      <span className="w-3 h-0.5 bg-gray-600 rounded-full" />
                      <span className="w-4 h-0.5 bg-gray-600 rounded-full" />
                    </div>
                  </div>

                  {/* Phone Body */}
                  <div className="flex-grow p-5 space-y-5 overflow-y-auto scrollbar-hide text-left flex flex-col justify-between">
                    <div>
                      {/* Hero Title & Description */}
                      <div className="space-y-3">
                        <h4 className="text-xl font-black text-gray-900 leading-tight">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-500 leading-relaxed font-medium line-clamp-3">
                          {item.description}
                        </p>
                      </div>

                      {/* Screen Image mockup */}
                      <div className="mt-5 rounded-2xl overflow-hidden bg-[#0d0e15] border border-gray-200/80 shadow-md aspect-[9/12]">
                        <DeviceScreen src={item.mobile_image_url || item.image_url} alt="Layout Mobile" type="mobile" />
                      </div>
                    </div>

                    {/* Features in 2x2 grid */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {[
                        { title: 'Design', desc: 'Interface moderna' },
                        { title: 'UX', desc: 'Foco no usuário' },
                        { title: 'SEO', desc: 'Otimizado p/ Google' },
                        { title: 'Suporte', desc: 'Monitoramento 24h' }
                      ].map((feat, i) => (
                        <div key={i} className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
                          <h5 className="font-extrabold text-[10px] text-gray-950 uppercase tracking-tight mb-0.5">{feat.title}</h5>
                          <p className="text-[8px] text-gray-400 font-medium leading-none">{feat.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Phone Screen Footer Button */}
                  <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-center">
                    <a 
                      href={item.project_url || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full bg-gray-950 hover:bg-blue-600 text-white font-extrabold uppercase tracking-widest text-[9px] py-3.5 rounded-xl text-center transition-all block shadow-md"
                    >
                      Acessar Site Completo
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust/Qualities bar */}
          <div className="mt-16 flex flex-wrap justify-center gap-y-4 gap-x-8 max-w-4xl mx-auto pt-8 border-t border-gray-200/60 text-gray-500 font-extrabold uppercase tracking-widest text-xs">
            {[
              'Design Moderno',
              'Experiência do Usuário',
              'SEO e Performance',
              'Suporte e Manutenção'
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border border-gray-150 shadow-sm transition-all duration-300 hover:scale-105 hover:border-blue-200">
                <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
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
