import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Search, Laptop, Palette, TrendingUp, CheckCircle2, Star, Target, Zap, Shield, ArrowUpRight, Plus, Minus } from 'lucide-react';
import { Link } from '../components/Link';
import { BlogSection } from '../components/BlogSection';
import { LogoCarousel } from '../components/LogoCarousel';
import { Logo } from '../components/Logo';

export function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqItems = [
    {
      q: "Quanto custa a criação de um site profissional?",
      a: "A criação de sites profissionais na UmbuLab começa em R$ 2.500 para sites institucionais completos. Landing pages de alta conversão a partir de R$ 1.500, e lojas online (e-commerce) completas a partir de R$ 6.000. O valor final é fechado e garantido em orçamento antes do início do projeto, sem surpresas ou taxas ocultas."
    },
    {
      q: "Qual é o prazo de entrega?",
      a: "O prazo exato de entrega é definido na proposta comercial e fixado em contrato. Uma landing page costuma ser entregue em até 10 dias úteis, enquanto sites institucionais levam entre 20 a 30 dias úteis. Cumprimos o cronograma rigorosamente. Se atrasarmos, reduzimos o valor do projeto proporcionalmente por dia de atraso."
    },
    {
      q: "Preciso fornecer todo o conteúdo (textos e imagens)?",
      a: "Não necessariamente. Trabalhamos de forma flexível: (1) você nos envia seus textos brutos e fotos e nós refinamos e aplicamos design profissional, ou (2) nossa equipe de copywriters profissionais desenvolve a escrita persuasiva com base em um briefing estratégico sobre seu negócio. Cuidamos do design e da otimização de imagens para velocidade máxima."
    },
    {
      q: "Quais tecnologias vocês utilizam?",
      a: "Utilizamos tecnologias modernas focadas em performance e flexibilidade, como React/Next.js, Tailwind CSS e headless CMS (Sanity/Strapi) para projetos de alta velocidade e customização. Para clientes que exigem total independência na edição posterior de conteúdo, desenvolvemos projetos otimizados em WordPress de código limpo. Escolhemos a tecnologia ideal junto com você no início."
    },
    {
      q: "O site já vem otimizado para o Google (SEO)?",
      a: "Sim, 100% otimizado técnica e estruturalmente. Entregamos seu site com tags de SEO corretas (heading tags estruturadas), sitemap XML automático, dados estruturados (schema markup), otimização de velocidade de carregamento extrema e redirecionamentos corretos se você já possuía um site antigo. A estrutura correta é metade do caminho para rankear no Google."
    },
    {
      q: "Como funciona a performance para celulares (Mobile)?",
      a: "Desenvolvemos com a filosofia mobile-first, já que a maioria das visitas a sites de empresas atualmente vem de celulares. Garantimos por contrato que a pontuação de performance no Google Lighthouse no mobile estará na zona verde (acima de 90). Isso não é promessa, é cláusula de contrato."
    },
    {
      q: "Vocês fazem lojas online integradas com meios de pagamento?",
      a: "Sim, desenvolvemos e-commerces completos utilizando Shopify ou WooCommerce de alta velocidade. O site já sai funcionando com integração total para Pix (com QR Code dinâmico), cartões de crédito (com checkout transparente) e boleto. Também integramos emissão automática de nota fiscal e cálculo automático de frete pelos Correios ou transportadoras."
    },
    {
      q: "Como funciona o suporte pós-lançamento?",
      a: "Fornecemos 30 dias de garantia e suporte completo gratuito para qualquer ajuste técnico pós-lançamento. Após esse período, oferecemos planos opcionais de manutenção preventiva a partir de R$ 190/mês, cobrindo backups em nuvem diários, atualizações críticas de segurança, monitoramento de instabilidade 24/7 e pequenas alterações mensais de conteúdo."
    }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number }> = [];
    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(74, 175, 105, 0.15)';
        ctx.fill();
      });

      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 160) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(74, 175, 105, ${0.08 * (1 - distance / 160)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      animationId = requestAnimationFrame(animate);
    };

    animate();
    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d0d] overflow-hidden">
      <section className="relative min-h-[95vh] flex items-center bg-[#0d0d0d] py-32 px-6 sm:px-8 lg:px-12 overflow-hidden dot-pattern">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(46,125,50,0.15),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,_rgba(255,179,0,0.06),_transparent_50%)]" />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" />
        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 text-left space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full text-green-400 text-xs font-bold uppercase tracking-widest">
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              SEO, SITES E BRANDING DE ALTA PERFORMANCE
            </div>
            <h1 className="text-white text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight">
              Criação de sites <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-500 to-amber-400">
                que pagam o investimento.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl font-light leading-relaxed">
              Criação de sites institucionais, lojas online e landing pages focados em conversão e retorno. Preço fixo, prazo garantido em contrato e performance Lighthouse 90+ em mobile.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <Link href="/contact" className="btn btn-primary justify-center text-center shadow-lg">
                Quero crescer meu negócio
                <ArrowRight size={18} />
              </Link>
              <Link href="/portfolio" className="btn btn-outline justify-center text-center">
                Ver Casos de Sucesso
                <ArrowUpRight size={18} className="text-neutral-300" />
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-center lg:justify-end animate-fade-in-up delay-150">
            <div className="relative w-80 h-80 sm:w-[400px] sm:h-[400px] rounded-full border border-green-950/40 flex items-center justify-center bg-gradient-to-tr from-neutral-950 to-neutral-900 shadow-2xl">
              <div className="absolute inset-4 rounded-full border border-dashed border-green-900/30 animate-[spin_40s_linear_infinite]" />
              <div className="absolute inset-10 rounded-full border border-neutral-800/80 animate-[spin_25s_linear_infinite_reverse]" />
              <div className="z-10 flex flex-col items-center gap-4 text-center">
                <Logo showText={false} iconSize={120} variant="dark" />
                <h3 className="text-white text-3xl font-extrabold tracking-tight">Umbu<span className="text-green-500">Lab</span></h3>
                <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Digital Growth Agency</p>
              </div>
              <div className="absolute top-10 left-0 bg-neutral-900/90 border border-green-900/30 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg backdrop-blur-md animate-bounce duration-1000">
                <Search size={14} className="text-green-400" />
                <span className="text-xs text-neutral-300 font-bold">SEO Rank #1</span>
              </div>
              <div className="absolute bottom-16 right-0 bg-neutral-900/90 border border-amber-900/30 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg backdrop-blur-md animate-bounce [animation-delay:0.5s] duration-1000">
                <TrendingUp size={14} className="text-amber-400" />
                <span className="text-xs text-neutral-300 font-bold">+280% ROI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-[#0d0d0d] relative z-10 px-6 sm:px-8 lg:px-12 border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(46,125,50,0.05),_transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-24">
            <span className="text-xs font-extrabold uppercase tracking-widest text-green-400 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
              O QUE FAZEMOS
            </span>
            <h2 className="text-white text-4xl sm:text-5xl mt-6 leading-tight font-extrabold">
              Soluções integradas para marcas que visam liderança.
            </h2>
            <p className="text-neutral-400 mt-6 text-lg font-light max-w-2xl leading-relaxed">
              Trabalhamos na interseção entre design premium, desenvolvimento técnico e aquisição de tráfego qualificado para estruturar o sucesso do seu negócio.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="group border border-white/5 bg-[#121212] hover:bg-[#151515] rounded-3xl p-10 hover:border-green-600/35 hover:shadow-[0_0_30px_rgba(46,125,50,0.15)] transition-all duration-500 flex flex-col justify-between min-h-[380px]">
              <div>
                <div className="bg-green-500/10 text-green-400 w-16 h-16 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-300 border border-green-500/20">
                  <Laptop size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Criação de Sites</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Websites, landing pages e e-commerces ultrarrápidos, totalmente responsivos e otimizados para converter visitantes casuais em clientes recorrentes. Design único sob medida.
                </p>
              </div>
              <div className="pt-8">
                <Link href="/services" className="inline-flex items-center gap-2 text-green-400 font-bold text-sm hover:text-green-300 group-hover:gap-3 transition-all">
                  Saiba mais <ArrowRight size={16} />
                </Link>
              </div>
            </div>
            <div className="group border border-white/5 bg-[#121212] hover:bg-[#151515] rounded-3xl p-10 hover:border-green-600/35 hover:shadow-[0_0_30px_rgba(46,125,50,0.15)] transition-all duration-500 flex flex-col justify-between min-h-[380px]">
              <div>
                <div className="bg-amber-500/10 text-amber-400 w-16 h-16 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-300 border border-amber-500/20">
                  <Search size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">SEO Profissional</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Colocamos seu site nas primeiras posições do Google. Otimização on-page avançada, criação de conteúdo estratégico focado em intenção de busca e link building de autoridade.
                </p>
              </div>
              <div className="pt-8">
                <Link href="/services" className="inline-flex items-center gap-2 text-amber-400 font-bold text-sm hover:text-amber-300 group-hover:gap-3 transition-all">
                  Saiba mais <ArrowRight size={16} />
                </Link>
              </div>
            </div>
            <div className="group border border-white/5 bg-[#121212] hover:bg-[#151515] rounded-3xl p-10 hover:border-green-600/35 hover:shadow-[0_0_30px_rgba(46,125,50,0.15)] transition-all duration-500 flex flex-col justify-between min-h-[380px]">
              <div>
                <div className="bg-green-500/10 text-green-400 w-16 h-16 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-300 border border-green-500/20">
                  <Palette size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Branding</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Criação de identidades visuais marcantes e profissionais que contam uma história. Logos, manual de marca, tipografia e diretrizes de design que constroem credibilidade instantânea.
                </p>
              </div>
              <div className="pt-8">
                <Link href="/services" className="inline-flex items-center gap-2 text-green-400 font-bold text-sm hover:text-green-300 group-hover:gap-3 transition-all">
                  Saiba mais <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-[#0d0d0d] relative z-10 px-6 sm:px-8 lg:px-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 space-y-6 animate-fade-in-up">
            <span className="text-xs font-extrabold uppercase tracking-widest text-green-400 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
              NOSSA FILOSOFIA
            </span>
            <h2 className="text-white text-4xl sm:text-5xl font-extrabold leading-tight">
              Por que escolher a UmbuLab?
            </h2>
            <p className="text-neutral-400 text-lg font-light leading-relaxed">
              Não acreditamos em soluções genéricas ou "hacks" de marketing de curto prazo. Nosso compromisso é estruturar uma fundação digital sólida que gera resultados constantes.
            </p>
            <div className="pt-4">
              <Link href="/contact" className="btn btn-primary">
                Falar com consultor
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="bg-[#121212] p-8 rounded-2xl border border-white/5 hover:border-green-600/25 transition-all">
              <div className="text-green-400 mb-4"><Target size={24} /></div>
              <h4 className="text-lg font-bold text-white mb-2">Estratégia antes de Execução</h4>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Estudamos seu nicho, seus concorrentes e a intenção do seu cliente antes de escrever uma única linha de código.
              </p>
            </div>
            <div className="bg-[#121212] p-8 rounded-2xl border border-white/5 hover:border-green-600/25 transition-all">
              <div className="text-green-400 mb-4"><Zap size={24} /></div>
              <h4 className="text-lg font-bold text-white mb-2">Foco em Resultado Real</h4>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Métricas de vaidade não pagam contas. Focamos em gerar leads qualificados, ligações e vendas.
              </p>
            </div>
            <div className="bg-[#121212] p-8 rounded-2xl border border-white/5 hover:border-green-600/25 transition-all">
              <div className="text-green-400 mb-4"><Shield size={24} /></div>
              <h4 className="text-lg font-bold text-white mb-2">Design + Performance juntos</h4>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Sites rápidos com design elegante. A beleza atrai, mas a velocidade e a clareza do site convertem o usuário.
              </p>
            </div>
            <div className="bg-[#121212] p-8 rounded-2xl border border-white/5 hover:border-green-600/25 transition-all">
              <div className="text-green-400 mb-4"><Star size={24} /></div>
              <h4 className="text-lg font-bold text-white mb-2">Atendimento Próximo</h4>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Você fala diretamente com quem planeja e executa seu projeto, com relatórios transparentes e acompanhamento ágil.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-[#0d0d0d] relative z-10 px-6 sm:px-8 lg:px-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-xs font-extrabold uppercase tracking-widest text-green-400 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
              NOSSAS MÉTRICAS
            </span>
            <h2 className="text-white text-4xl sm:text-5xl mt-6 font-extrabold">
              Crescimento medido em números reais
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-16">
            <div className="bg-[#121212] p-10 rounded-3xl border border-white/5">
              <h3 className="text-5xl lg:text-6xl font-extrabold text-green-400 mb-2">+180%</h3>
              <p className="text-sm font-bold text-white uppercase tracking-widest">Tráfego Orgânico</p>
              <p className="text-neutral-400 text-xs mt-3">Média de crescimento de acessos do Google no primeiro ano dos clientes.</p>
            </div>
            <div className="bg-[#121212] p-10 rounded-3xl border border-white/5">
              <h3 className="text-5xl lg:text-6xl font-extrabold text-green-400 mb-2">+60%</h3>
              <p className="text-sm font-bold text-white uppercase tracking-widest">Taxa de Conversão</p>
              <p className="text-neutral-400 text-xs mt-3">Melhoria na conversão de leads com layouts de alta performance e copywriting focado.</p>
            </div>
            <div className="bg-[#121212] p-10 rounded-3xl border border-white/5">
              <h3 className="text-5xl lg:text-6xl font-extrabold text-green-400 mb-2">+50</h3>
              <p className="text-sm font-bold text-white uppercase tracking-widest">Marcas Estruturadas</p>
              <p className="text-neutral-400 text-xs mt-3">Negócios que confiam na nossa equipe para gerenciar sua presença digital.</p>
            </div>
          </div>
          <div className="bg-[#121212] p-8 sm:p-12 rounded-3xl text-white relative overflow-hidden shadow-2xl border border-white/5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(46,125,50,0.15),_transparent_60%)]" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
              <div>
                <h4 className="text-xl font-bold">Projeção de Performance em SEO</h4>
                <p className="text-neutral-400 text-xs mt-1">Comparação de visitas orgânicas após reestruturação técnica e conteúdo UmbuLab.</p>
              </div>
              <div className="flex gap-4 text-xs font-semibold">
                <span className="flex items-center gap-2"><span className="h-3.5 w-3.5 rounded-full bg-green-500" /> UmbuLab</span>
                <span className="flex items-center gap-2"><span className="h-3.5 w-3.5 rounded-full bg-neutral-600" /> Sem Otimização</span>
              </div>
            </div>
            
            {/* SVG Visual Graph */}
            <div className="relative h-60 w-full z-10 flex items-end">
              <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
                {/* Grid lines */}
                <line x1="0" y1="75" x2="1000" y2="75" stroke="#222" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="0" y1="150" x2="1000" y2="150" stroke="#222" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="0" y1="225" x2="1000" y2="225" stroke="#222" strokeWidth="1" strokeDasharray="5,5" />

                {/* Base curve (without SEO) */}
                <path d="M 0 250 Q 250 240 500 230 T 1000 220" fill="none" stroke="#555" strokeWidth="2.5" />
                
                {/* Growth curve (with UmbuLab SEO) */}
                <path d="M 0 250 Q 250 180 500 120 T 1000 40" fill="none" stroke="#2E7D32" strokeWidth="5.5" strokeLinecap="round" />
                <path d="M 0 250 Q 250 180 500 120 T 1000 40 L 1000 300 L 0 300 Z" fill="url(#gradient-chart)" opacity="0.1" />

                <defs>
                  <linearGradient id="gradient-chart" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#66BB6A" />
                    <stop offset="100%" stopColor="#66BB6A" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Node Points */}
                <circle cx="500" cy="120" r="6" fill="#FFB300" />
                <circle cx="1000" cy="40" r="7" fill="#66BB6A" />
              </svg>

              {/* Labels */}
              <span className="absolute bottom-2 left-2 text-[10px] text-neutral-500 font-bold">Mês 1</span>
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-neutral-500 font-bold">Mês 6</span>
              <span className="absolute bottom-2 right-2 text-[10px] text-neutral-500 font-bold">Mês 12 (Entrega máxima)</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-neutral-950 text-white relative z-10 px-6 sm:px-8 lg:px-12 overflow-hidden dot-pattern">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,_rgba(46,125,50,0.1),_transparent_45%)]" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6 space-y-6 animate-fade-in-up">
            <span className="text-xs font-extrabold uppercase tracking-widest text-green-400 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/15">
              SOBRE A UMBULAB
            </span>
            <h2 className="text-white text-4xl sm:text-5xl font-extrabold leading-tight">
              Tecnologia digital com raízes fortes.
            </h2>
            <p className="text-neutral-400 text-base leading-relaxed">
              O **Umbu** é conhecido como a árvore sagrada do sertão brasileiro. Suas raízes são incrivelmente profundas e possuem reservatórios naturais que armazenam energia e água para florescer mesmo nos períodos mais difíceis.
            </p>
            <p className="text-neutral-400 text-base leading-relaxed">
              Inspirados por essa resiliência e solidez, fundamos a **UmbuLab**. Nosso papel é estruturar a base tecnológica e estratégica de empresas na internet, criando canais de atração orgânica que resistem às mudanças de mercado e algoritmos do Google, gerando crescimento seguro, consistente e perene.
            </p>
          </div>
          <div className="lg:col-span-6 flex justify-center lg:justify-end animate-fade-in-up">
            <div className="relative border border-neutral-800 rounded-3xl p-8 bg-[#121212]/60 max-w-md w-full">
              <div className="absolute -top-4 -left-4 bg-green-700 text-white p-3 rounded-2xl shadow-lg">
                <TrendingUp size={24} />
              </div>
              <h4 className="text-xl font-bold mb-6 pt-2">Nossa Missão</h4>
              <blockquote className="text-neutral-300 text-base italic leading-relaxed mb-6">
                "Projetar sites de performance inquestionável, posicionar marcas com clareza e construir o canal de tráfego de crescimento mais estável e lucrativo que uma empresa pode possuir."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <BlogSection />
      <LogoCarousel />

      <section className="section-padding bg-[#0d0d0d] relative z-10 px-6 sm:px-8 lg:px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-green-400 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
              DÚVIDAS FREQUENTES
            </span>
            <h2 className="text-white text-4xl sm:text-5xl mt-6 font-extrabold">
              Perguntas Frequentes
            </h2>
          </div>
          <div className="space-y-4">
            {faqItems.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="border border-white/5 bg-[#121212] rounded-2xl overflow-hidden transition-all duration-300">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left font-bold text-white hover:bg-white/[0.02] transition-colors"
                  >
                    <span>{item.q}</span>
                    <span className="text-green-400 shrink-0">
                      {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-neutral-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding bg-[#0d0d0d] relative z-10 px-6 sm:px-8 lg:px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
            VAMOS COMEÇAR?
          </span>
          <h2 className="text-white text-4xl sm:text-5xl font-extrabold leading-tight">
            Vamos fazer o seu negócio crescer de verdade?
          </h2>
          <p className="text-neutral-400 text-lg leading-relaxed max-w-2xl mx-auto font-light">
            Entre em contato hoje mesmo e agende uma conversa com um de nossos especialistas. Analisaremos sua presença digital atual e mostraremos os melhores caminhos para escalar seus resultados.
          </p>
          <div className="pt-6">
            <Link href="/contact" className="btn btn-primary">
              Falar com especialista
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
