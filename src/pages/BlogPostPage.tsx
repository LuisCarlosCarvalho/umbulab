import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronLeft, Share2, Clock, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BlogPost } from '../types';

export function BlogPostPage() {
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBlogActive, setIsBlogActive] = useState<boolean | null>(null);

  useEffect(() => {
    async function loadPost() {
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
          return;
        }

        // Get slug from URL
        const slug = window.location.pathname.split('/').pop();
        if (!slug) return;

        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();
        
        if (error) throw error;
        setPost(data);
      } catch (error) {
        console.error('Error loading blog post:', error);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

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

  if (!post) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="text-4xl font-bold text-white mb-4">Artigo não encontrado</h1>
        <p className="text-neutral-400 mb-8 max-w-md">O artigo que você está procurando pode ter sido removido ou o link está incorreto.</p>
        <button 
          onClick={() => navigate('/blog')}
          className="btn btn-primary"
        >
          Ver todos os artigos
        </button>
      </div>
    );
  }

  // Calculate reading time (rough estimate)
  const wordsPerMinute = 200;
  const noOfWords = post.content.split(/\s/g).length;
  const minutes = Math.ceil(noOfWords / wordsPerMinute);

  return (
    <article className="pt-32 pb-24 bg-[#0d0d0d] min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <button 
          onClick={() => navigate('/blog')}
          className="flex items-center gap-2 text-neutral-400 hover:text-green-400 transition-colors mb-8 font-medium group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Voltar para o Blog
        </button>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-6 mb-8 text-sm font-bold text-green-400 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              {new Date(post.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              {minutes} min de leitura
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-8 tracking-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between pb-8 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center text-white font-bold text-xl uppercase shadow-lg shadow-green-950/20">
                U
              </div>
              <div>
                <p className="font-bold text-white">Equipe UmbuLab</p>
                <p className="text-xs text-neutral-400">Especialistas em Estratégia Digital</p>
              </div>
            </div>
            
            <button 
              onClick={() => {
                navigator.share({
                  title: post.title,
                  url: window.location.href
                }).catch(() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link do artigo copiado!');
                });
              }}
              className="p-3 border border-white/5 rounded-2xl hover:bg-white/5 text-neutral-400 hover:text-white transition-all shadow-sm"
              title="Compartilhar"
            >
              <Share2 size={20} />
            </button>
          </div>
        </header>

        {/* Featured Image */}
        <div className="aspect-video w-full rounded-[40px] overflow-hidden mb-16 border border-white/5 shadow-2xl">
          <img 
            src={post.featured_image_url} 
            alt={post.title} 
            className="w-full h-full object-cover opacity-90"
          />
        </div>

        {/* Content */}
        <div className="prose prose-lg prose-invert max-w-none text-neutral-300 leading-relaxed font-medium">
          <div 
             className="blog-content"
             dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} 
          />
        </div>

        {/* Footer info */}
        <footer className="mt-24 pt-12 border-t border-white/5 text-center">
            <h4 className="text-2xl font-bold text-white mb-4">Gostou deste artigo?</h4>
            <p className="text-neutral-400 mb-8 max-w-lg mx-auto italic">Compartilhe conhecimento! A UmbuLab está sempre em busca de inovação e resultados para nossos parceiros.</p>
            <button 
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-green-700 hover:bg-green-800 text-white rounded-2xl font-bold transition-all shadow-xl shadow-green-950/20"
            >
              Explorar mais artigos
            </button>
        </footer>
      </div>

      <style>{`
        .blog-content h2 { font-size: 2rem; font-weight: 800; color: #ffffff; margin-top: 3rem; margin-bottom: 1.5rem; letter-spacing: -0.025em; }
        .blog-content h3 { font-size: 1.5rem; font-weight: 700; color: #ffffff; margin-top: 2.5rem; margin-bottom: 1rem; }
        .blog-content p { margin-bottom: 1.5rem; color: #d4d4d4; }
        .blog-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1.5rem; }
        .blog-content li { margin-bottom: 0.5rem; color: #d4d4d4; }
        .blog-content strong { color: #ffffff; font-weight: 700; }
        .blog-content blockquote { border-left: 4px solid #2e7d32; padding-left: 1.5rem; font-style: italic; font-size: 1.25rem; color: #4ade80; margin: 3rem 0; background: rgba(46,125,50,0.1); padding: 2rem; border-radius: 0 24px 24px 0; }
      `}</style>
    </article>
  );
}

