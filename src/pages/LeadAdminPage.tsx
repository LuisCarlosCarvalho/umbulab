import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, RefreshCw, FileText, Mail, Building, Clock, ChevronDown } from 'lucide-react';
import { showToast } from '../components/ui/Toast';

interface Lead {
  id: string;
  email: string;
  name: string;
  business_type: string;
  status: 'novo' | 'em_contato' | 'fechado';
  pdf_url: string | null;
  created_at: string;
  data: any;
}

export function LeadAdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('aprovacoes_usuario')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Erro ao carregar leads:', error);
      showToast('Erro ao carregar os leads', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: Lead['status']) => {
    setUpdating(id);
    try {
      const { error } = await supabase
        .from('aprovacoes_usuario')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
      showToast('Status atualizado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      showToast('Erro ao atualizar status', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'novo': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'em_contato': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'fechado': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'novo': return 'Novo';
      case 'em_contato': return 'Em Contato';
      case 'fechado': return 'Fechado';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Leads (IA)</h1>
            <p className="text-gray-500 mt-1">Acompanhe as propostas geradas pela Inteligência Artificial.</p>
          </div>
          <button 
            onClick={loadLeads}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm self-start md:self-auto"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Atualizar
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 text-gray-500">
               <Loader2 className="animate-spin h-10 w-10 text-green-600 mb-4" />
               <p>Carregando leads...</p>
             </div>
          ) : leads.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 text-gray-500">
               <Building className="h-12 w-12 text-gray-300 mb-4" />
               <h3 className="text-lg font-medium text-gray-900">Nenhum Lead Encontrado</h3>
               <p className="text-sm">Os leads gerados pela IA aparecerão aqui.</p>
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Negócio</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">PDF</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.map(lead => (
                    <tr key={lead.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{lead.name}</span>
                          <a href={`mailto:${lead.email}`} className="text-sm text-gray-500 hover:text-green-600 flex items-center gap-1 mt-1">
                            <Mail size={12} /> {lead.email}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-900 capitalize">{lead.business_type}</span>
                          <span className="text-xs text-gray-500 line-clamp-1 truncate max-w-xs mt-1" title={lead.data?.description}>
                            {lead.data?.description || '-'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500 gap-1.5">
                          <Clock size={14} />
                          {new Date(lead.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {lead.pdf_url ? (
                          <a href={lead.pdf_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition">
                            <FileText size={16} className="text-red-500" />
                            PDF
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">Sem PDF</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative inline-block text-left w-full max-w-[140px]">
                          {updating === lead.id ? (
                            <div className="flex items-center justify-center py-1">
                              <Loader2 className="animate-spin h-5 w-5 text-gray-400" />
                            </div>
                          ) : (
                            <select
                              value={lead.status}
                              onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                              className={`appearance-none w-full border text-sm rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition cursor-pointer font-medium ${getStatusColor(lead.status)}`}
                            >
                              <option value="novo">Novo</option>
                              <option value="em_contato">Em Contato</option>
                              <option value="fechado">Fechado</option>
                            </select>
                          )}
                          {!updating && (
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                              <ChevronDown size={14} />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
