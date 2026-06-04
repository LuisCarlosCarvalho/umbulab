import { Mail, Phone, MapPin, Facebook, Instagram, Send } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-white py-16 border-t border-green-950/30">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <Logo showText={true} textColor="text-white" iconSize={46} />
            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
              Crescimento digital com raízes fortes. Especializados em SEO, criação de websites de alta performance e branding estratégico para destacar seu negócio.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-neutral-900 p-3 rounded-xl hover:bg-green-700 hover:text-white transition-all text-neutral-400"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com/umbulab"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-neutral-900 p-3 rounded-xl hover:bg-green-700 hover:text-white transition-all text-neutral-400"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-neutral-900 p-3 rounded-xl hover:bg-green-700 hover:text-white transition-all text-neutral-400"
                aria-label="Telegram"
              >
                <Send size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-bold uppercase tracking-wider text-green-400 mb-6 font-sans">
              Links Rápidos
            </h4>
            <ul className="space-y-3 text-neutral-400 text-sm font-medium">
              <li><a href="/" className="hover:text-white hover:underline transition-all">Inicio</a></li>
              <li><a href="/services" className="hover:text-white hover:underline transition-all">Serviços</a></li>
              <li><a href="/portfolio" className="hover:text-white hover:underline transition-all">Portfolio</a></li>
              <li><a href="/infoproducts" className="hover:text-white hover:underline transition-all">SEO de Gestão</a></li>
              <li><a href="/contact" className="hover:text-white hover:underline transition-all">Contato</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-base font-bold uppercase tracking-wider text-green-400 mb-6 font-sans">
              Contato
            </h4>
            <ul className="space-y-4 text-neutral-400 text-sm">
              <li className="flex items-center gap-3">
                <div className="bg-neutral-900 p-2.5 rounded-lg text-green-500">
                  <Mail size={18} />
                </div>
                <a href="mailto:contato@umbulab.com" className="hover:text-white transition-colors">
                  contato@umbulab.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-neutral-900 p-2.5 rounded-lg text-green-500 mt-0.5">
                  <Phone size={18} />
                </div>
                <div>
                  <div className="font-semibold text-white">Brasil: +55 77 99809-2910</div>
                  <div>Portugal: +351 928 485 483</div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-neutral-900 p-2.5 rounded-lg text-green-500">
                  <MapPin size={18} />
                </div>
                <span>Brasil / Portugal</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-neutral-900 mt-12 pt-8 text-center text-neutral-500 text-xs font-semibold uppercase tracking-wider">
          <p>&copy; {new Date().getFullYear()} UmbuLab. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
