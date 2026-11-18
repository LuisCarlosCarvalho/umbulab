import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { X, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import emailjs from '@emailjs/browser';

export function NewsletterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExitIntent, setIsExitIntent] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const location = useLocation();

  // Rotas restritas/administrativas onde o popup de newsletter NUNCA deve aparecer
  const isExcludedRoute = 
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/register') ||
    location.pathname.startsWith('/approvals') ||
    location.pathname.startsWith('/ativar') ||
    location.pathname.startsWith('/proposta/');

  const checkIsSubscribed = useCallback(() => {
    try {
      return localStorage.getItem('umbulab_newsletter_subscribed') === 'true';
    } catch {
      return false;
    }
  }, []);

  const checkIsDismissedRecently = useCallback(() => {
    try {
      const isDismissed = localStorage.getItem('umbulab_newsletter_dismissed');
      if (!isDismissed) return false;
      const dismissedAt = new Date(isDismissed).getTime();
      const now = Date.now();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      return (now - dismissedAt) < sevenDays;
    } catch {
      return false;
    }
  }, []);

  const checkHasShownInSession = useCallback(() => {
    try {
      return sessionStorage.getItem('umbulab_newsletter_shown_in_session') === 'true';
    } catch {
      return false;
    }
  }, []);

  const checkHasExitShown = useCallback(() => {
    try {
      return sessionStorage.getItem('umbulab_newsletter_exit_shown') === 'true';
    } catch {
      return false;
    }
  }, []);

  const dismissModal = useCallback(() => {
    setIsOpen(false);
    try {
      localStorage.setItem('umbulab_newsletter_dismissed', new Date().toISOString());
      sessionStorage.setItem('umbulab_newsletter_shown_in_session', 'true');
    } catch {
      // ignore
    }
  }, []);

  // 1. Disparo de primeiro acesso no site (apenas no primeiro acesso real da sessão)
  useEffect(() => {
    if (isExcludedRoute) return;
    if (checkIsSubscribed() || checkIsDismissedRecently() || checkHasShownInSession()) {
      return;
    }

    // Abre suavemente após 3 segundos no primeiro acesso do site
    const timer = setTimeout(() => {
      if (!checkIsSubscribed() && !checkHasShownInSession()) {
        setIsExitIntent(false);
        setIsOpen(true);
        try {
          sessionStorage.setItem('umbulab_newsletter_shown_in_session', 'true');
        } catch {
          // ignore
        }
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isExcludedRoute, checkIsSubscribed, checkIsDismissedRecently, checkHasShownInSession]);

  // 2. Disparo por Exit-Intent (quando o visitante for fechar a página / sair pelo topo)
  useEffect(() => {
    if (isExcludedRoute) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Detecta quando o cursor se move para fora do topo da janela (área das abas/barra de navegação)
      if (e.clientY <= 0) {
        if (!checkIsSubscribed() && !checkHasExitShown() && !isOpen) {
          setIsExitIntent(true);
          setIsOpen(true);
          try {
            sessionStorage.setItem('umbulab_newsletter_exit_shown', 'true');
            sessionStorage.setItem('umbulab_newsletter_shown_in_session', 'true');
          } catch {
            // ignore
          }
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [isExcludedRoute, checkIsSubscribed, checkHasExitShown, isOpen]);

  // Fechamento via tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) dismissModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, dismissModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Por favor, insira um e-mail válido.');
      setStatus('error');
      return;
    }

    setStatus('loading');

    const { error } = await supabase.from('newsletter_leads').insert([{ email }]);

    if (error) {
      // Se for violação unique (e-mail já cadastrado), confirma e encerra
      if (error.code === '23505') {
        try {
          localStorage.setItem('umbulab_newsletter_subscribed', 'true');
        } catch {
          // ignore
        }
        setStatus('success');
        setTimeout(dismissModal, 2500);
        return;
      }
      setErrorMsg('Falha ao processar. Tente novamente mais tarde.');
      setStatus('error');
      return;
    }

    try {
      localStorage.setItem('umbulab_newsletter_subscribed', 'true');
      localStorage.removeItem('umbulab_newsletter_dismissed');
    } catch {
      // ignore
    }

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID',
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID',
        {
          to_email: email,
          to_admin: 'info@umbulab.com',
          message: 'Nova inscrição na newsletter UmbuLab!'
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY'
      );
    } catch (emailError) {
      console.error('UmbuLab: Erro no disparo do emailJS', emailError);
    }

    setStatus('success');
    setTimeout(dismissModal, 3000);
  };

  if (isExcludedRoute || !isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
      onClick={dismissModal}
    >
      <div 
        className="relative w-full max-w-md p-8 bg-[#0B0B0B] border border-zinc-800 rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={dismissModal}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          {isExitIntent && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 text-xs font-semibold bg-[#7ED321]/15 text-[#7ED321] rounded-full border border-[#7ED321]/30">
              <Sparkles className="w-3.5 h-3.5" />
              Antes de sair... Não perca seus insights exclusivos!
            </div>
          )}

          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
            Acelere seu <span className="text-[#7ED321]">crescimento</span>
          </h2>
          <p className="text-zinc-400 mb-6 text-sm">
            Receba insights exclusivos sobre marketing digital e tecnologia diretamente na sua caixa de entrada.
          </p>

          {status === 'success' ? (
            <div className="p-4 bg-[#7ED321]/10 border border-[#7ED321]/20 rounded-lg text-[#7ED321] font-medium animate-pulse">
              Inscrição confirmada! Bem-vindo(a) a bordo.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#7ED321] focus:ring-1 focus:ring-[#7ED321] transition-all"
                disabled={status === 'loading'}
              />
              {status === 'error' && (
                <span className="text-red-400 text-xs text-left">{errorMsg}</span>
              )}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full px-4 py-3 bg-[#7ED321] text-[#0B0B0B] font-semibold rounded-lg hover:bg-[#6bc11b] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {status === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
                {status === 'loading' ? 'Enviando...' : 'Quero receber as novidades'}
              </button>
            </form>
          )}
          <p className="mt-4 text-[10px] text-zinc-600 uppercase tracking-wide">
            Sem spam. Preenchimento opcional.
          </p>
        </div>
      </div>
    </div>
  );
}
