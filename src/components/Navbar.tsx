import { Link } from './Link';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { supabase } from '../lib/supabase';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const { resolvedTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBlogActive, setIsBlogActive] = useState<boolean>(true);
  const [isSeoGestaoActive, setIsSeoGestaoActive] = useState<boolean>(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const { data } = await supabase
          .from('configuracoes')
          .select('chave, valor')
          .in('chave', ['blog_settings', 'seo_gestao_settings']);
        if (data) {
          const blog = data.find(c => c.chave === 'blog_settings')?.valor;
          const seo = data.find(c => c.chave === 'seo_gestao_settings')?.valor;
          
          if (blog && typeof blog === 'object' && 'is_active' in blog) {
            setIsBlogActive(!!blog.is_active);
          }
          if (seo && typeof seo === 'object' && 'is_active' in seo) {
            setIsSeoGestaoActive(!!seo.is_active);
          }
        }
      } catch (e) {
        console.error('Error loading settings in Navbar:', e);
      }
    }
    loadSettings();
  }, []);

  return (
    <nav className="fixed w-full top-0 z-[9999] px-4 pt-4 pointer-events-none">
      <div className="max-w-7xl mx-auto glass-card border-white/10 bg-white dark:bg-[#121212]/80 backdrop-blur-xl px-6 py-3 pointer-events-auto">
        <div className="flex justify-between h-12">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Logo showText={true} iconSize={46} variant={resolvedTheme === 'dark' ? 'dark' : 'light'} />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-zinc-700 dark:text-neutral-300 hover:text-green-400 transition-colors font-medium text-sm">Inicio</Link>
            <Link href="/services" className="text-zinc-700 dark:text-neutral-300 hover:text-green-400 transition-colors font-medium text-sm">Serviços</Link>
            <Link href="/portfolio" className="text-zinc-700 dark:text-neutral-300 hover:text-green-400 transition-colors font-medium text-sm">Portfolio</Link>

            {isBlogActive && (
              <Link href="/blog" className="text-zinc-700 dark:text-neutral-300 hover:text-green-400 transition-colors font-medium text-sm">Blog</Link>
            )}
            {isSeoGestaoActive && (
              <Link href="/infoproducts" className="text-zinc-700 dark:text-neutral-300 hover:text-green-400 transition-colors font-medium text-sm">SEO de Gestão</Link>
            )}
            <Link href="/contact" className="text-zinc-700 dark:text-neutral-300 hover:text-green-400 transition-colors font-medium text-sm">Contato</Link>

            {user ? (
              <>
                <Link
                  href={profile?.role === 'admin' ? '/admin' : '/dashboard'}
                  className="text-zinc-700 dark:text-neutral-300 hover:text-green-400 transition-colors font-medium text-sm flex items-center gap-2"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <button
                  onClick={async () => {
                    try {
                      await signOut();
                      window.location.href = '/login';
                    } catch (error) {
                      console.error('Logout error:', error);
                      window.location.href = '/login';
                    }
                  }}
                  className="flex items-center gap-2 text-zinc-700 dark:text-neutral-300 hover:text-green-400 transition-colors font-medium text-sm"
                >
                  <LogOut size={18} />
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-zinc-700 dark:text-neutral-300 hover:text-green-400 transition-colors font-medium text-sm">Login</Link>
              </>
            )}
            <ThemeToggle />
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-zinc-700 dark:text-neutral-300 hover:text-zinc-900 dark:text-white transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-full left-4 right-4 mt-2 md:hidden pointer-events-auto animate-in fade-in zoom-in-95 duration-200 z-[9999]">
          <div className="glass-card bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-zinc-200 dark:border-white/10 shadow-2xl p-4 space-y-1">
            <Link href="/" className="flex items-center gap-3 px-4 py-3 text-zinc-700 dark:text-neutral-200 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-green-600 dark:hover:text-green-400 rounded-xl transition-all font-bold" onClick={() => setMobileMenuOpen(false)}>
              Inicio
            </Link>
            <Link href="/services" className="flex items-center gap-3 px-4 py-3 text-zinc-700 dark:text-neutral-200 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-green-600 dark:hover:text-green-400 rounded-xl transition-all font-bold" onClick={() => setMobileMenuOpen(false)}>
              Serviços
            </Link>
            <Link href="/portfolio" className="flex items-center gap-3 px-4 py-3 text-zinc-700 dark:text-neutral-200 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-green-600 dark:hover:text-green-400 rounded-xl transition-all font-bold" onClick={() => setMobileMenuOpen(false)}>
              Portfolio
            </Link>

            {isBlogActive && (
              <Link href="/blog" className="flex items-center gap-3 px-4 py-3 text-zinc-700 dark:text-neutral-200 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-green-600 dark:hover:text-green-400 rounded-xl transition-all font-bold" onClick={() => setMobileMenuOpen(false)}>
                Blog
              </Link>
            )}
            {isSeoGestaoActive && (
              <Link href="/infoproducts" className="flex items-center gap-3 px-4 py-3 text-zinc-700 dark:text-neutral-200 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-green-600 dark:hover:text-green-400 rounded-xl transition-all font-bold" onClick={() => setMobileMenuOpen(false)}>
                SEO de Gestão
              </Link>
            )}
            <Link href="/contact" className="flex items-center gap-3 px-4 py-3 text-zinc-700 dark:text-neutral-200 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-green-600 dark:hover:text-green-400 rounded-xl transition-all font-bold" onClick={() => setMobileMenuOpen(false)}>
              Contato
            </Link>

            <div className="pt-4 mt-4 border-t border-black/5 dark:border-white/5 space-y-1">
              {user ? (
                <>
                  <Link
                    href={profile?.role === 'admin' ? '/admin' : '/dashboard'}
                    className="flex items-center gap-3 px-4 py-3 text-zinc-700 dark:text-neutral-200 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-green-600 dark:hover:text-green-400 rounded-xl transition-all font-bold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                  <button
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      try {
                        await signOut();
                        window.location.href = '/login';
                      } catch (error) {
                        window.location.href = '/login';
                      }
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold w-full text-left"
                  >
                    <LogOut size={18} />
                    Sair
                  </button>
                </>
              ) : (
                <Link 
                  href="/login" 
                  className="flex items-center gap-3 px-4 py-3 bg-green-700 text-zinc-900 dark:text-white rounded-xl transition-all font-bold justify-center hover:bg-green-800" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
            <div className="pt-4 mt-4 border-t border-black/5 dark:border-white/5 flex justify-center">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

