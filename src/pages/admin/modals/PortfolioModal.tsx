import { Plus } from 'lucide-react';
import { Portfolio } from '../../../types';

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPortfolio: Portfolio | null;
  portfolioForm: {
    title: string;
    category: string;
    image_url: string;
    project_url: string;
    description: string;
    client_name: string;
    project_type: string;
    gallery_images: string[];
    challenge: string;
    solution: string;
    is_active: boolean;
    is_featured: boolean;
    laptop_image_url: string;
    tablet_image_url: string;
    mobile_image_url: string;
  };
  setPortfolioForm: (form: any) => void;
  handleSavePortfolio: () => Promise<void>;
}

export function PortfolioModal({
  isOpen,
  onClose,
  editingPortfolio,
  portfolioForm,
  setPortfolioForm,
  handleSavePortfolio,
}: PortfolioModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99999] p-4 sm:p-6 ">
      <div className="bg-white rounded-[32px] p-8 md:p-10 max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              {editingPortfolio ? 'Editar Projeto' : 'Novo Case Study'}
            </h2>
            <p className="text-gray-500 font-medium">Configure os detalhes visuais e técnicos do projeto.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
             <Plus className="rotate-45" size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Informações Básicas */}
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 border-b border-blue-50 pb-2">Informações Básicas</h3>
            
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Título do Projeto</label>
              <input
                type="text"
                value={portfolioForm.title}
                onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 transition-all"
                placeholder="Ex: Sanzza Agency Website"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Categoria</label>
                <select
                  value={portfolioForm.category}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, category: e.target.value })}
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 appearance-none cursor-pointer"
                >
                  <option value="Criação de Website">Criação de Website</option>
                  <option value="Designer de logo">Designer de logo</option>
                  <option value="Blog">Blog</option>
                  <option value="Branding">Branding</option>
                  <option value="EmailMarketing">EmailMarketing</option>
                  <option value="landing page">landing page</option>
                  <option value="Paginas Convite">Paginas Convite</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Tipo de Projeto</label>
                <input
                  type="text"
                  value={portfolioForm.project_type}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, project_type: e.target.value })}
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 transition-all"
                  placeholder="Ex: UI/UX Design"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Nome do Cliente</label>
              <input
                type="text"
                value={portfolioForm.client_name}
                onChange={(e) => setPortfolioForm({ ...portfolioForm, client_name: e.target.value })}
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 transition-all"
                placeholder="Ex: Sanzza Ltd"
              />
            </div>

             <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Descrição Curta (Grid)</label>
              <textarea
                value={portfolioForm.description}
                onChange={(e) => setPortfolioForm({ ...portfolioForm, description: e.target.value })}
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-gray-700 transition-all"
                rows={3}
                placeholder="Aparece no grid principal e cabeçalho..."
              />
            </div>
          </div>

          {/* Mídia e Assets */}
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 border-b border-blue-50 pb-2">Mídia e URLs</h3>
            
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Imagem de Capa (URL)</label>
              <input
                type="text"
                value={portfolioForm.image_url}
                onChange={(e) => setPortfolioForm({ ...portfolioForm, image_url: e.target.value })}
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 transition-all"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Galeria de Imagens (URLs separadas por vírgula)</label>
              <textarea
                value={portfolioForm.gallery_images.join(', ')}
                onChange={(e) => setPortfolioForm({ 
                  ...portfolioForm, 
                  gallery_images: e.target.value.split(',').map(u => u.trim()).filter(u => u) 
                })}
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-gray-700 transition-all"
                rows={4}
                placeholder="Coloque várias URLs separadas por vírgula para o mosaico..."
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">URL Final do Projeto</label>
              <input
                type="text"
                value={portfolioForm.project_url}
                onChange={(e) => setPortfolioForm({ ...portfolioForm, project_url: e.target.value })}
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 transition-all"
                placeholder="https://site-do-cliente.com"
              />
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-l-2 border-blue-500 pl-2">Imagens p/ Mockups</h4>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  value={portfolioForm.laptop_image_url}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, laptop_image_url: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  placeholder="MacBook / Laptop Image URL"
                />
                <input
                  type="text"
                  value={portfolioForm.tablet_image_url}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, tablet_image_url: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  placeholder="iPad / Tablet Image URL"
                />
                <input
                  type="text"
                  value={portfolioForm.mobile_image_url}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, mobile_image_url: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  placeholder="iPhone / Mobile Image URL"
                />
              </div>
            </div>
          </div>

          {/* Case Study Narrative */}
          <div className="md:col-span-2 space-y-6 pt-4">
             <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 border-b border-blue-50 pb-2">Narrativa (Case Study)</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">O Desafio</label>
                  <textarea
                    value={portfolioForm.challenge}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, challenge: e.target.value })}
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-gray-700"
                    rows={4}
                    placeholder="Quais eram os problemas do cliente?"
                  />
               </div>
               <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Nossa Solução</label>
                  <textarea
                    value={portfolioForm.solution}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, solution: e.target.value })}
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-gray-700"
                    rows={4}
                    placeholder="Como resolvemos e quais tecnologias usamos?"
                  />
               </div>
             </div>
          </div>

          {/* Settings */}
          <div className="md:col-span-2 flex flex-wrap gap-8 items-center bg-gray-50 p-6 rounded-[24px] border border-gray-100">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={portfolioForm.is_active}
                onChange={(e) => setPortfolioForm({ ...portfolioForm, is_active: e.target.checked })}
                className="w-6 h-6 rounded-lg text-blue-600 border-gray-300 focus:ring-blue-500 bg-white"
              />
              <span className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-all uppercase tracking-widest">Publicado</span>
            </label>

             <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={portfolioForm.is_featured}
                onChange={(e) => setPortfolioForm({ ...portfolioForm, is_featured: e.target.checked })}
                className="w-6 h-6 rounded-lg text-amber-500 border-gray-300 focus:ring-amber-500 bg-white"
              />
              <span className="text-sm font-black text-gray-900 group-hover:text-amber-600 transition-all uppercase tracking-widest">Destaque (Featured)</span>
            </label>
          </div>
        </div>

        <div className="flex gap-4 mt-12">
          <button
            onClick={handleSavePortfolio}
            className="flex-grow bg-blue-600 text-white px-10 py-5 rounded-[24px] font-black text-lg hover:bg-blue-700 transition-all active:scale-[0.98] shadow-2xl shadow-blue-200"
          >
            {editingPortfolio ? 'Atualizar Case Study' : 'Publicar Projeto'}
          </button>
          <button
            onClick={onClose}
            className="px-8 py-5 bg-gray-100 text-gray-500 rounded-[24px] font-black text-lg hover:bg-gray-200 transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
