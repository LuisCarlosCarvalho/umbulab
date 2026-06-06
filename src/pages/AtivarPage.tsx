import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Logo } from '../components/Logo';
import { Eye, EyeOff, Shield, Power, Loader2 } from 'lucide-react';
import { showToast } from '../components/ui/Toast';

export function AtivarPage() {
  const [isActive, setIsActive] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [secretKey, setSecretKey] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);

  useEffect(() => {
    async function loadStatus() {
      try {
        const { data, error } = await supabase
          .from('configuracoes')
          .select('valor')
          .eq('chave', 'maintenance_settings')
          .maybeSingle();

        if (error) throw error;

        if (data?.valor && typeof data.valor === 'object' && 'is_active' in data.valor) {
          // If maintenance is active, then the site is NOT active (offline)
          setIsActive(!data.valor.is_active);
        } else {
          setIsActive(true); // Default to site active (maintenance off)
        }
      } catch (err) {
        console.error('Erro ao buscar status de manutenção:', err);
        showToast('Erro ao carregar o status atual.', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadStatus();
  }, []);

  const handleToggle = async () => {
    if (!secretKey.trim()) {
      showToast('Digite a chave de segurança para autorizar.', 'error');
      return;
    }

    setActionLoading(true);
    try {
      // If we want the site to be Active, maintenance must be false (is_active_val = false)
      // If we want the site to be in Maintenance, maintenance must be true (is_active_val = true)
      const maintenanceVal = !isActive;

      const { data, error } = await supabase.rpc('toggle_maintenance', {
        secret_key: secretKey,
        is_active_val: maintenanceVal
      });

      if (error) throw error;

      if (data && typeof data === 'object' && 'success' in data) {
        if (data.success) {
          setIsActive(!isActive);
          showToast(
            !isActive 
              ? 'Site ativado com sucesso! Todos os usuários já podem acessar.' 
              : 'Modo de manutenção ativado! Visitantes verão a tela de aviso.', 
            'success'
          );
          setSecretKey(''); // Clear passcode field
        } else {
          showToast(data.error || 'Erro ao atualizar.', 'error');
        }
      }
    } catch (err: any) {
      console.error('Erro ao atualizar estado:', err);
      showToast('Falha na autenticação ou erro de conexão.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-green-500 animate-spin mb-4" />
          <p className="text-gray-400 font-medium">Carregando painel de controle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <Logo showText={true} textColor="text-white" iconSize={64} />
        </div>

        <div className="glass-card bg-slate-900/80 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-500/10 rounded-2xl text-green-400">
              <Shield size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white font-sans">Controle de Status</h1>
              <p className="text-xs text-gray-400">Altere o estado global do site da UmbuLab</p>
            </div>
          </div>

          {/* Status Indicator Card */}
          <div className={`p-6 rounded-2xl mb-8 flex items-center justify-between transition-all duration-500 ${
            isActive 
              ? 'bg-green-500/10 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.05)]' 
              : 'bg-amber-500/10 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.05)]'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full animate-ping ${isActive ? 'bg-green-500' : 'bg-amber-500'}`}></div>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Status Atual</p>
                <h2 className="text-lg font-black text-white font-sans mt-0.5">
                  {isActive ? 'SITE ONLINE' : 'MODO MANUTENÇÃO'}
                </h2>
              </div>
            </div>
            <div className={`p-3 rounded-xl ${isActive ? 'bg-green-500/20 text-green-300' : 'bg-amber-500/20 text-amber-300'}`}>
              <Power size={20} />
            </div>
          </div>

          <div className="space-y-6">
            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Chave de Segurança
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="Digite a chave autorizadora..."
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Toggle Button */}
            <button
              onClick={handleToggle}
              disabled={actionLoading}
              className={`w-full py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                isActive 
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20 hover:shadow-amber-600/30' 
                  : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 hover:shadow-green-600/30'
              } disabled:opacity-50`}
            >
              {actionLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Power size={18} />
                  <span>{isActive ? 'Ativar Modo Manutenção' : 'Ativar Site Online'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-sm font-semibold text-green-400 hover:text-green-300 transition-colors">
            Voltar para o Início
          </a>
        </div>
      </div>
    </div>
  );
}
