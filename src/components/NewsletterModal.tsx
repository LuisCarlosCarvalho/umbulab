import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import emailjs from '@emailjs/browser';

export function NewsletterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // 1. Checa a persistência de bloqueio (14 dias)
    const isDismissed = localStorage.getItem('umbulab_newsletter_dismissed');
    if (isDismissed) {
      const dismissedAt = new Date(isDismissed).getTime();
      const now = new Date().getTime();
      const fourteenDays = 14 * 24 * 60 * 60 * 1000;
      
      if (now - dismissedAt < fourteenDays) return;
      localStorage.removeItem('umbulab_newsletter_dismissed');
    }

    // 2. Disparo por Tempo (8 segundos)
    const timer = setTimeout(() => setIsOpen(true), 8000);

    // 3. Disparo por Scroll (35%)
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.scrollHeight;
      
      if (documentHeight > windowHeight) {
        const scrollPercentage = (scrollPosition / (documentHeight - windowHeight)) * 100;
        if (scrollPercentage >= 35) {
          setIsOpen(true);
          window.removeEventListener('scroll', handleScroll);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const dismissModal = () => {
    setIsOpen(false);
    localStorage.setItem('umbulab_newsletter_dismissed', new Date().toISOString());
  };

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
      // Se for violação unique (e-mail já existe), apenas agradecemos
      if (error.code === '23505') {
        setStatus('success');
        setTimeout(dismissModal, 2500);
        return;
      }
      setErrorMsg('Falha ao processar. Tente novamente mais tarde.');
      setStatus('error');
      return;
    }

    try {
      // Disparo duplo pelo EmailJS:
      // O template configurado no EmailJS deve ter 'to_email' para o usuário
      // e pode disparar uma cópia (ou usar um segundo send) para a UmbuLab
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
      // Não interrompemos a experiência do usuário se o e-mail falhar, 
      // já que o lead foi gravado no banco de dados com sucesso.
    }

    setStatus('success');
    setTimeout(dismissModal, 3000);
  };

  useEffect(() => {
    // Fechamento via ESC
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) dismissModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity" 
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
