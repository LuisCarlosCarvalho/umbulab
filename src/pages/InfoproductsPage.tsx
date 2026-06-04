import { useState, useEffect } from 'react';
import { ShoppingCart, ExternalLink, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import { supabase, MarketingProduct } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { showToast } from '../components/ui/Toast';
import { LazyImage } from '../components/ui/LazyImage';

// Global SWR Cache for standard data fetching
let globalInfoproductsCache: MarketingProduct[] | null = null;

export function InfoproductsPage() {
  const [products, setProducts] = useState<MarketingProduct[]>(globalInfoproductsCache || []);
  const [loading, setLoading] = useState(!globalInfoproductsCache);
  const [errorStatus, setErrorStatus] = useState(false);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    
    // Safety fallback: if cache exists, we drop the loading lock immediately
    if (globalInfoproductsCache) {
      setLoading(false);
    }

    const loadProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('marketing_products')
          .select('*')
          .abortSignal(controller.signal)
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (mounted) {
          setProducts(data || []);
          globalInfoproductsCache = data || [];
        }
      } catch (error: any) {
        if (error.name === 'AbortError') return;
        console.error('[Infoproducts] Error loading products:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProducts();

    const timeout = setTimeout(() => {
      if (mounted) {
        setLoading((current) => {
          if (current) {
            console.warn('[Infoproducts] Timeout de 30s atingido.');
            setErrorStatus(true);
            return false;
          }
          return current;
        });
      }
    }, 30000);

    return () => {
      mounted = false;
      controller.abort();
      clearTimeout(timeout);
    };
  }, []);

  const copyToClipboard = (code: string) => {
    const url = `${window.location.origin}/${code}`;
    navigator.clipboard.writeText(url);
    showToast('Link copiado com sucesso!', 'success');
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-[#0d0d0d] dot-pattern">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(46,125,50,0.1),_transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <span className="text-xs font-extrabold uppercase tracking-widest text-green-400 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
            SOLUÇÕES PRONTAS
          </span>
          <h1 className="text-5xl font-black text-white mt-6 mb-6 tracking-tight">SEO de Gestão</h1>
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
            Soluções completas de SEO e gestão digital para impulsionar sua presença online e resultados.
          </p>
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
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
            <p className="mt-4 text-neutral-400">Carregando produtos...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-[#121212] rounded-3xl border border-white/5 p-12">
            <ShoppingCart size={64} className="mx-auto text-neutral-600 mb-6" />
            <h3 className="text-2xl font-semibold text-white mb-2">
              Nenhum produto disponível no momento
            </h3>
            <p className="text-neutral-400 max-w-md mx-auto">
              Estamos preparando novas soluções de SEO e gestão para você. Fique atento às novidades!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-[#121212] border border-white/5 rounded-2xl overflow-hidden flex flex-col group hover:border-green-600/35 hover:shadow-[0_0_30px_rgba(46,125,50,0.15)] transition-all duration-300 shadow-xl"
              >
                {/* Image Area */}
                <div className="relative aspect-video bg-neutral-900 overflow-hidden border-b border-white/5">
                   {product.image_urls && product.image_urls.length > 0 ? (
                    <LazyImage
                      src={product.image_urls[0]}
                      alt={product.title}
                      wrapperClassName="w-full h-full"
                      className="group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                   ) : product.image_url ? (
                    <LazyImage
                      src={product.image_url}
                      alt={product.title}
                      wrapperClassName="w-full h-full"
                      className="group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-950/20 to-neutral-900/50">
                      <ShoppingCart size={48} className="text-green-500/20" />
                    </div>
                  )}
                  
                  {/* Overlay Actions */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        copyToClipboard(product.public_code);
                      }}
                      className="bg-black/80 backdrop-blur text-neutral-300 p-2 rounded-full hover:bg-neutral-800 hover:text-white shadow-sm transition-colors border border-white/5"
                      title="Copiar Link"
                    >
                      <LinkIcon size={18} />
                    </button>
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  <div className="mb-4">
                    <span className="text-xs font-mono bg-white/5 text-neutral-400 px-2.5 py-1 rounded-lg border border-white/5">
                      #{product.public_code}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                    {product.title}
                  </h3>
                  
                  {product.subtitle && (
                    <p className="text-sm text-green-400 font-medium mb-3">
                      {product.subtitle}
                    </p>
                  )}

                  <p className="text-neutral-400 mb-6 line-clamp-3 text-sm flex-grow">
                    {product.description}
                  </p>

                  <div className="pt-4 border-t border-white/5 mt-auto">
                    <Link
                      to={`/${product.public_code}`}
                      className="w-full inline-flex items-center justify-center gap-2 bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800 transition-colors"
                    >
                      Ver Detalhes
                      <ExternalLink size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-green-950/40 to-neutral-900/60 rounded-3xl p-12 text-center text-white border border-white/5 relative overflow-hidden group shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(46,125,50,0.1),_transparent_60%)]" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">
              Precisa de uma solução personalizada?
            </h2>
            <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
              Nossa equipe de especialistas em SEO e gestão digital está pronta para criar uma estratégia exclusiva para o seu negócio.
            </p>
            <Link
              to="/contact?service=infoproducts"
              className="btn btn-primary shadow-lg justify-center"
            >
              Falar com Consultor
              <ExternalLink size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

