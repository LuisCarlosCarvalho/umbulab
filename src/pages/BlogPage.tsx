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

  useEffect(() => {
    async function loadAllPosts() {
      // Reduzi o timeout para 10s para não deixar o usuário esperando 30s
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
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

  // Tela de Erro (Fail-safe)
  if (errorStatus) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-gray-50 flex flex-col justify-center text-center px-4">
        <AlertTriangle className="mx-auto text-red-500 mb-6" size={56} />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Ops! Algo deu errado.</h3>
        <p className="text-gray-600 mb-8">Não conseguimos conectar ao servidor. Verifique sua internet.</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all mx-auto"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  // Skeletons de Carregamento
  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-[32px] h-96 animate-pulse border border-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <header className="mb-16 text-center">
          <h1 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">
            Nosso <span className="text-blue-600">Blog</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Insights sobre tecnologia, design e performance digital.
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 font-medium">Nenhum artigo disponível no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map((post) => (
              <article 
                key={post.id} 
                className="group bg-white rounded-[32px] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col"
                onClick={() => navigate(`/blog/${post.slug}`)}
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img 
                    src={post.featured_image_url} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase mb-4">
                    <Calendar size={14} />
                    {new Date(post.published_at).toLocaleDateString('pt-BR')}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-6">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto pt-4 flex items-center gap-2 font-bold text-gray-900">
                    Ler artigo <ArrowRight size={16} className="text-blue-600" />
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
