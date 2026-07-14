import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Rss, RefreshCw, Save, CheckCircle } from 'lucide-react';

export function AdminRssSettings() {
  const [rssUrl, setRssUrl] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const { data } = await supabase
        .from('configuracoes')
        .select('valor')
        .eq('chave', 'blog_rss_sync')
        .single();
      
      if (data && data.valor) {
        setRssUrl(data.valor.url || '');
        setEnabled(data.valor.enabled || false);
        setLastSynced(data.valor.last_synced || null);
      }
    } catch (error) {
      console.error('Error fetching RSS config:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const configObj = {
        url: rssUrl,
        enabled: enabled,
        last_synced: lastSynced
      };

      const { error } = await supabase
        .from('configuracoes')
        .upsert({ chave: 'blog_rss_sync', valor: configObj });

      if (error) throw error;
      setMessage({ text: 'Configurações salvas com sucesso!', type: 'success' });
    } catch (error) {
      console.error('Error saving RSS config:', error);
      setMessage({ text: 'Erro ao salvar configurações.', type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleSyncNow = async () => {
    if (window.location.hostname === 'localhost') {
      setMessage({ text: 'O botão "Sincronizar Agora" de teste manual funciona apenas após o site ser publicado (Produção).', type: 'error' });
      return;
    }

    setSyncing(true);
    setMessage(null);
    try {
      // Fazemos uma chamada direta para a nossa API serverless na Vercel
      const response = await fetch('/api/cron-rss');
      
      let data;
      try {
        data = await response.json();
      } catch (err) {
        throw new Error('A API não retornou dados válidos. O site precisa estar publicado na Vercel para testar manualmente.');
      }
      
      if (response.ok) {
        setMessage({ text: data.message || 'Sincronização concluída!', type: 'success' });
        fetchConfig(); // Atualiza a data de última sincronização
      } else {
        throw new Error(data.error || data.message || 'Erro desconhecido');
      }
    } catch (error: any) {
      console.error('Sync error:', error);
      setMessage({ text: 'Erro: ' + error.message, type: 'error' });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
          <Rss size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Sincronização Automática (RSS)</h3>
          <p className="text-sm text-gray-500">Puxe artigos automaticamente de outros blogs (WordPress, Medium, etc).</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-end">
        <div className="flex-grow w-full">
          <label className="block text-sm font-semibold mb-2 text-gray-700">URL do Feed RSS</label>
          <input
            type="text"
            value={rssUrl}
            onChange={(e) => setRssUrl(e.target.value)}
            placeholder="Ex: https://meusite.com/feed ou https://medium.com/feed/@usuario"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
          />
        </div>
        
        <div className="flex items-center gap-3 pb-3">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="w-5 h-5 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600">Automação Ligada</span>
          </label>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            {loading ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
            Salvar
          </button>
          <button
            onClick={handleSyncNow}
            disabled={syncing || !rssUrl}
            className="px-5 py-3 bg-orange-50 text-orange-600 border border-orange-200 rounded-xl font-bold hover:bg-orange-100 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={syncing ? 'animate-spin' : ''} size={18} />
            Sincronizar Agora
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-gray-500 font-medium">
          Última sincronização: {lastSynced ? new Date(lastSynced).toLocaleString('pt-BR') : 'Nunca sincronizado'}
        </div>
        {message && (
          <div className={`text-sm font-bold flex items-center gap-1 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.type === 'success' && <CheckCircle size={16} />}
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
