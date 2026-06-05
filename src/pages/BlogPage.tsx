import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronLeft, ArrowRight, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BlogPost } from '../types';

export function BlogPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(false);
  const [isBlogActive, setIsBlogActive] = useState<boolean | null>(null);

  useEffect(() => {
    async function loadAllPosts() {
      // Reduzi o timeout para 10s para não deixar o usuário esperando 30s
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const { data: settingsData } = await supabase
          .from('configuracoes')
          .select('valor')
          .eq('chave', 'blog_settings')
          .single();
        
        const active = settingsData?.valor && typeof settingsData.valor === 'object' && 'is_active' in settingsData.valor
          ? !!settingsData.valor.is_active
          : true;
        
        setIsBlogActive(active);

        if (!active) {
          setLoading(false);
          clearTimeout(timeoutId);
          return;
        }

        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        if (error) throw error;

        setPosts(data || []);
      } catch (error) {
        console.error('[Blog] Erro ao carregar posts:', error);
        setErrorStatus(true);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    }

    loadAllPosts();
    window.scrollTo(0, 0);
  }, []);

  if (isBlogActive === false) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#0d0d0d] flex flex-col justify-center items-center text-center px-4 dot-pattern">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(46,125,50,0.1),_transparent_50%)] pointer-events-none" />
        <div className="max-w-md bg-[#121212] p-10 rounded-3xl border border-white/5 relative z-10 shadow-2xl">
          <AlertTriangle className="mx-auto text-amber-500 mb-6" size={56} />
          <h3 className="text-2xl font-bold text-white mb-2">Blog Temporariamente Inativo</h3>
          <p className="text-neutral-400 mb-8">Esta funcionalidade está temporariamente indisponível. Volte mais tarde!</p>
          <button 
            onClick={() => navigate('/')}
            className="btn btn-primary w-full justify-center"
          >
            Voltar para o Início
          </button>
        </div>
      </div>
    );
  }

  // Tela de Erro (Fail-safe)
  if (errorStatus) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#0d0d0d] flex flex-col justify-center text-center px-4">
        <AlertTriangle className="mx-auto text-red-500 mb-6" size={56} />
        <h3 className="text-2xl font-bold text-white mb-2">Ops! Algo deu errado.</h3>
        <p className="text-neutral-400 mb-8">Não conseguimos conectar ao servidor. Verifique sua internet.</p>
        <button 
          onClick={() => window.location.reload()}
          className="btn btn-primary mx-auto"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  // Skeletons de Carregamento
  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#0d0d0d] px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#121212] rounded-[32px] h-96 animate-pulse border border-white/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-[#0d0d0d] min-h-screen dot-pattern">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(46,125,50,0.1),_transparent_50%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <header className="mb-16 text-center">
          <span className="text-xs font-extrabold uppercase tracking-widest text-green-400 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
            CONHECIMENTO & INSIGHTS
          </span>
          <h1 className="text-5xl font-black text-white mt-6 mb-6 tracking-tight">
            Nosso <span className="text-green-400">Blog</span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Insights sobre tecnologia, design e performance digital.
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-[#121212] rounded-3xl border border-white/5 shadow-sm">
            <p className="text-neutral-400 font-medium">Nenhum artigo disponível no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map((post) => (
              <article 
                key={post.id} 
                className="group bg-[#121212] rounded-[32px] overflow-hidden border border-white/5 hover:border-green-600/35 hover:shadow-[0_0_30px_rgba(46,125,50,0.15)] transition-all duration-500 cursor-pointer flex flex-col"
                onClick={() => navigate(`/blog/${post.slug}`)}
              >
                <div className="aspect-[16/10] overflow-hidden border-b border-white/5 bg-neutral-900">
                  <img 
                    src={post.featured_image_url} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                  />
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase mb-4">
                    <Calendar size={14} />
                    {new Date(post.published_at).toLocaleDateString('pt-BR')}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-neutral-400 text-sm line-clamp-3 mb-6">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto pt-4 flex items-center gap-2 font-bold text-white group-hover:text-green-400 transition-colors">
                    Ler artigo <ArrowRight size={16} className="text-green-400 animate-pulse" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

