import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Link } from "../components/Link";
import { Eye, AlertTriangle, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { LazyImage } from "../components/ui/LazyImage";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
  project_url?: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

const categories = [
  "Todos",
  "Criação de Website",
  "Designer de logo",
  "Blog",
  "Branding",
  "EmailMarketing",
  "landing page",
  "Paginas Convite",
];

export function PortfolioPage() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [scrollProgress, setScrollProgress] = useState(0);
  const isHovered = useRef(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
    setScrollProgress(0);
  }, [selectedCategory]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const totalScroll = scrollWidth - clientWidth;
      if (totalScroll > 0) {
        setScrollProgress((scrollLeft / totalScroll) * 100);
      }
    }
  };

  const filteredItems =
    selectedCategory === "Todos"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === selectedCategory);

  // Auto-play interval
  useEffect(() => {
    if (filteredItems.length <= 1) return;

    const interval = setInterval(() => {
      if (scrollRef.current && !isHovered.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        // Tolerance of 15px for browser zoom or sub-pixel differences
        const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 15;
        if (isAtEnd) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          const scrollAmount = window.innerWidth < 640 ? 320 : 420;
          scrollRef.current.scrollTo({ left: scrollLeft + scrollAmount, behavior: 'smooth' });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [filteredItems]);

  useEffect(() => {
    const controller = new AbortController();
    loadPortfolio(controller.signal);

    const timeout = setTimeout(() => {
      // Check if it's still loading before firing the fatal error
      setLoading((currentLoading) => {
        if (currentLoading) {
          console.warn('[Portfolio] Aviso: Timeout de 30s da UI atingido (banco muito lento).');
          setErrorStatus(true);
          return false;
        }
        return currentLoading;
      });
    }, 30000);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, []);

  const loadPortfolio = async (signal?: AbortSignal) => {
    try {
      console.log(`[Portfolio] DEBUG: Iniciando fetch de portfolio... VITE_SUPABASE_URL ativo:`, !!import.meta.env.VITE_SUPABASE_URL);
      setLoading(true);
      
      const { data, error } = await supabase
        .from("portfolio")
        .select("*")
        .abortSignal(signal || new AbortController().signal)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[Portfolio] DEBUG ERROR fetching items:", error);
        throw error;
      }
      console.log(`[Portfolio] DEBUG: Fetch concluído com sucesso. Itens recebidos:`, data?.length);
      setPortfolioItems(data || []);
    } catch (error: any) {
      if (error.name === 'AbortError') return;
      console.error("[Portfolio] Error loading portfolio items:", error);
      setErrorStatus(true);
      await supabase.auth.signOut();
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollAmount = window.innerWidth < 640 ? 320 : 420;
      const scrollTo = direction === 'left' 
        ? scrollLeft - scrollAmount 
        : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-[#0d0d0d] dot-pattern">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(46,125,50,0.1),_transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <span className="text-xs font-extrabold uppercase tracking-widest text-green-400 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
            NOSSO TRABALHO
          </span>
          <h1 className="text-5xl font-black text-white mt-6 mb-6 tracking-tight">Portfolio</h1>
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            Conheça alguns dos projetos que desenvolvemos com excelência e dedicação.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-green-700 text-white shadow-lg shadow-green-700/25"
                    : "bg-[#121212] text-neutral-300 hover:bg-neutral-800 border border-white/5"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {errorStatus ? (
          <div className="text-center py-20 bg-red-950/20 rounded-3xl border border-red-900/50 mt-12 mx-auto max-w-2xl">
            <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">Erro de Conexão</h3>
            <p className="text-neutral-400 font-medium">Os dados demoraram muito para responder. Isso indica uma falha de rede ou no banco. Limpamos seu cache de sessão local.</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 btn bg-red-700 hover:bg-red-800 text-white font-bold transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#121212] rounded-3xl overflow-hidden border border-white/5 shadow-md animate-pulse">
                <div className="aspect-[4/3] bg-neutral-850" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-neutral-800 rounded w-3/4" />
                  <div className="h-4 bg-neutral-800 rounded w-1/4" />
                  <div className="h-10 bg-neutral-800 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-400 text-lg">
              {selectedCategory === "Todos"
                ? "Nenhum projeto disponível no momento."
                : `Nenhum projeto encontrado na categoria "${selectedCategory}".`}
            </p>
          </div>
        ) : (
          <div className="relative mt-12 group/carousel">
            {/* Left navigation arrow */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-[#121212]/90 border border-white/10 hover:border-green-500/30 text-white hover:text-green-400 p-4 rounded-full shadow-2xl backdrop-blur-md opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 active:scale-95 cursor-pointer"
              aria-label="Anterior"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Right navigation arrow */}
            <button
              onClick={() => scroll('right')}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-[#121212]/90 border border-white/10 hover:border-green-500/30 text-white hover:text-green-400 p-4 rounded-full shadow-2xl backdrop-blur-md opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 active:scale-95 cursor-pointer"
              aria-label="Próximo"
            >
              <ChevronRight size={24} />
            </button>

            {/* Carousel flex container */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              onMouseEnter={() => { isHovered.current = true; }}
              onMouseLeave={() => { isHovered.current = false; }}
              className="flex gap-8 overflow-x-auto py-12 px-4 scroll-smooth scrollbar-hide snap-x snap-mandatory"
            >
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-[300px] sm:w-[380px] aspect-[3/4] relative rounded-[28px] overflow-hidden bg-neutral-950 border border-white/5 cursor-pointer shadow-xl snap-start transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-4 hover:z-20 hover:border-green-500/40 hover:shadow-[0_20px_50px_rgba(46,125,50,0.3)] group"
                  onClick={() => navigate(`/portfolio/${item.id}`)}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 w-full h-full">
                    <LazyImage
                      src={item.image_url}
                      alt={item.title}
                      wrapperClassName="w-full h-full"
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1.2s] ease-out opacity-80"
                    />
                  </div>

                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Card Content (Always visible/readable at the bottom) */}
                  <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end text-left z-10">
                    <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-md border border-green-500/20 mb-4 self-start">
                      {item.category}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tighter mb-2 group-hover:text-green-400 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <div className="h-0.5 w-12 bg-green-500 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 delay-75" />
                    
                    {/* Collapsible description that slides up on hover */}
                    <div className="max-h-0 opacity-0 overflow-hidden transition-all duration-500 ease-out group-hover:max-h-24 group-hover:opacity-100 group-hover:mt-4">
                      <p className="text-neutral-300 text-sm leading-relaxed max-w-xs">
                        {item.description}
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-2 mt-4 text-xs font-extrabold uppercase tracking-widest text-neutral-400 group-hover:text-white transition-colors duration-300">
                      Ver Projeto <ArrowRight size={16} className="text-green-400 group-hover:translate-x-1.5 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll progress bar */}
            {filteredItems.length > 0 && (
              <div className="max-w-xs mx-auto mt-6 bg-neutral-900 h-[2px] rounded-full overflow-hidden border border-white/5">
                <div
                  className="bg-gradient-to-r from-green-600 to-green-400 h-full transition-all duration-150"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>
            )}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-green-950/40 to-neutral-900/60 rounded-3xl p-12 text-center text-white border border-white/5 relative overflow-hidden group shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(46,125,50,0.1),_transparent_60%)]" />
          <h2 className="text-3xl font-bold mb-4 relative z-10">
            Pronto para Iniciar Seu Projeto?
          </h2>
          <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto relative z-10">
            Entre em contato conosco e transforme suas ideias em realidade digital.
          </p>
          <Link
            href="/contact"
            className="btn btn-primary relative z-10 shadow-lg justify-center"
          >
            Solicitar Orçamento
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}


