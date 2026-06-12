import { useState } from 'react';
import { 
  Globe, 
  Palette, 
  TrendingUp, 
  Package, 
  ArrowRight,
  Search
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function ServicesPage() {
  const [propostaCode, setPropostaCode] = useState('');
  const navigate = useNavigate();

  const handlePropostaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (propostaCode.trim()) {
      navigate(`/proposta/${propostaCode.trim().toLowerCase()}`);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-[#0d0d0d] dot-pattern">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(46,125,50,0.1),_transparent_50%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="relative text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          
          {/* Campo de Proposta no Topo Direito */}
          <div className="absolute top-0 right-0 hidden md:block">
            <form onSubmit={handlePropostaSubmit} className="flex flex-col items-start">
              <label htmlFor="proposta" className="text-neutral-300 text-sm font-medium mb-1">Proposta:</label>
              <div className="relative">
                <input
                  id="proposta"
                  type="text"
                  placeholder="Digite seu código"
                  value={propostaCode}
                  onChange={(e) => setPropostaCode(e.target.value)}
                  className="bg-green-500 text-white placeholder:text-green-100 font-medium px-4 py-2 pr-10 rounded-lg outline-none focus:ring-2 focus:ring-green-400 border border-green-400 w-56 shadow-lg shadow-green-500/20"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-green-200">
                  <Search size={16} />
                </button>
              </div>
            </form>
          </div>

          <span className="text-xs font-extrabold uppercase tracking-widest text-green-400 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
            NOSSAS SOLUÇÕES
          </span>
          <h1 className="text-5xl font-black text-white mt-6 mb-6 tracking-tight">Nossos Serviços</h1>
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
            Oferecemos soluções digitais completas para estruturar a presença online e acelerar o crescimento do seu negócio.
          </p>

          {/* Campo de Proposta versão Mobile */}
          <div className="md:hidden mt-8 max-w-xs mx-auto">
            <form onSubmit={handlePropostaSubmit} className="flex flex-col items-center">
              <label htmlFor="proposta-mobile" className="text-neutral-300 text-sm font-medium mb-2">Proposta do Cliente</label>
              <div className="relative w-full">
                <input
                  id="proposta-mobile"
                  type="text"
                  placeholder="Digite seu código"
                  value={propostaCode}
                  onChange={(e) => setPropostaCode(e.target.value)}
                  className="bg-green-500 text-white placeholder:text-green-100 font-medium px-4 py-3 pr-10 rounded-xl outline-none focus:ring-2 focus:ring-green-400 border border-green-400 w-full shadow-lg shadow-green-500/20 text-center"
                />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-green-200">
                  <Search size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Service 1: Sites */}
          <div className="bg-[#121212] rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-white/5 group">
            <div className="bg-gradient-to-br from-[#1b3d22]/50 to-[#121212]/50 p-8 text-white relative overflow-hidden border-b border-white/5">
              <Globe size={120} className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-500 text-green-400" />
              <Globe size={48} className="mb-4 text-green-400" />
              <h2 className="text-3xl font-black mb-2 tracking-tight">Criação de Sites</h2>
              <p className="text-green-300 font-medium">Desenvolvimento Web de Alta Conversão</p>
            </div>
            <div className="p-8">
              <p className="text-neutral-400 mb-6 leading-relaxed">
                Sites profissionais, responsivos e otimizados para conversão. Desenvolvemos sua
                presença digital do zero, com design moderno e tecnologia de ponta.
              </p>
              <ul className="space-y-3 mb-8">
                {['Design responsivo e mobile-first', 'Otimizado técnica e estruturalmente para SEO', 'Foco total em performance (Lighthouse 90+)', 'Painel administrativo integrado para gestão'].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="bg-green-500/10 rounded-full p-1 mt-1 text-green-400 border border-green-500/20">
                      <ArrowRight size={14} />
                    </div>
                    <span className="text-neutral-300 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact?service=Criação de Sites"
                className="btn btn-outline w-full md:w-auto justify-center"
              >
                Solicitar Orçamento
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Service 2: Branding */}
          <div className="bg-[#121212] rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-white/5 group">
            <div className="bg-gradient-to-br from-[#121212] to-neutral-900/40 p-8 text-white relative overflow-hidden border-b border-white/5">
               <Palette size={120} className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-500 text-green-400" />
              <Palette size={48} className="mb-4 text-green-400" />
              <h2 className="text-3xl font-black mb-2 tracking-tight">Criação de Logos & Branding</h2>
              <p className="text-green-300 font-medium">Marcas Visuais Inesquecíveis</p>
            </div>
            <div className="p-8">
              <p className="text-neutral-400 mb-6 leading-relaxed">
                Identidade visual profissional que representa a essência da sua marca.
                Criamos logos únicos, memoráveis e aplicáveis em diversos formatos.
              </p>
              <ul className="space-y-3 mb-8">
                {['Design exclusivo e original', 'Mapeamento de posicionamento de mercado', 'Manual completo de identidade visual', 'Tipografia e cores estratégicas'].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="bg-green-500/10 rounded-full p-1 mt-1 text-green-400 border border-green-500/20">
                      <ArrowRight size={14} />
                    </div>
                    <span className="text-neutral-300 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact?service=Criação de Logos"
                className="btn btn-outline w-full md:w-auto justify-center"
              >
                Solicitar Orçamento
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Service 3: Tráfego */}
          <div className="bg-[#121212] rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-white/5 group">
            <div className="bg-gradient-to-br from-[#1b3d22]/40 to-[#121212]/50 p-8 text-white relative overflow-hidden border-b border-white/5">
                <TrendingUp size={120} className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-500 text-green-400" />
              <TrendingUp size={48} className="mb-4 text-green-400" />
              <h2 className="text-3xl font-black mb-2 tracking-tight">Gestão de Tráfego</h2>
              <p className="text-green-300 font-medium">Mais Leads, Clientes e Vendas Recorrentes</p>
            </div>
            <div className="p-8">
              <p className="text-neutral-400 mb-6 leading-relaxed">
                Campanhas de tráfego pago gerenciadas por especialistas. Maximizamos seu ROI
                com estratégias testadas e otimização constante.
              </p>
              <ul className="space-y-3 mb-8">
                {['Google Ads e Meta Ads (Instagram/Facebook)', 'Análise de conversão e otimização diária', 'Relatórios transparentes de investimento', 'Estratégias de remarketing de alta performance'].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="bg-green-500/10 rounded-full p-1 mt-1 text-green-400 border border-green-500/20">
                      <ArrowRight size={14} />
                    </div>
                    <span className="text-neutral-300 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact?service=Gerenciamento de Tráfego"
                className="btn btn-outline w-full md:w-auto justify-center"
              >
                Solicitar Orçamento
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Service 4: SEO */}
          <div className="bg-[#121212] rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-white/5 group">
            <div className="bg-gradient-to-br from-[#3d341b]/30 to-[#121212]/50 p-8 text-white relative overflow-hidden border-b border-white/5">
                <Package size={120} className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-500 text-amber-400" />
              <Package size={48} className="mb-4 text-amber-400" />
              <h2 className="text-3xl font-black mb-2 tracking-tight">SEO de Gestão</h2>
              <p className="text-amber-300 font-medium">Busca Orgânica e Domínio do Google</p>
            </div>
            <div className="p-8">
              <p className="text-neutral-400 mb-6 leading-relaxed">
                Otimização completa de SEO e gestão de presença digital. Melhoramos seu posicionamento
                nos mecanismos de busca e gerenciamos sua estratégia online.
              </p>
              <ul className="space-y-3 mb-8">
                {['Auditoria técnica completa e correções estruturais', 'Pesquisa estratégica de palavras-chave do setor', 'Criação de artigos focados em intenção de busca', 'Link building profissional para autoridade'].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="bg-green-500/10 rounded-full p-1 mt-1 text-green-400 border border-green-500/20">
                      <ArrowRight size={14} />
                    </div>
                    <span className="text-neutral-300 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact?service=SEO de Gestão"
                className="btn btn-outline w-full md:w-auto justify-center"
              >
                Solicitar Orçamento
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* Custom Project block */}
        <div className="bg-gradient-to-r from-green-950/40 to-neutral-900/60 rounded-3xl p-12 text-center text-white border border-white/5 relative overflow-hidden group shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(46,125,50,0.1),_transparent_60%)]" />
          <h2 className="text-4xl font-black mb-4 relative z-10 tracking-tight text-white">Precisa de um Projeto Personalizado?</h2>
          <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto relative z-10 leading-relaxed font-medium">
            Desenvolvemos sistemas web, softwares dedicados e consultorias estratégicas complexas sob medida para as necessidades específicas do seu negócio.
          </p>
          <Link
            to="/contact?service=Projeto Personalizado"
            className="btn btn-primary relative z-10 shadow-lg justify-center"
          >
            Falar com Especialista
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

