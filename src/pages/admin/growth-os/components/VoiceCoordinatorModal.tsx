import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Bot,
  Rocket,
  CheckCircle2,
} from 'lucide-react';
import {
  sendCoordinatorMessage,
  useGrowthOsRuntime,
} from '../services/growthOsRuntime';
import type { GrowthOsSection } from '../../../../types/growthOs';
import { showToast } from '../../../../components/ui/Toast';

interface VoiceCoordinatorModalProps {
  onClose: () => void;
  onNavigateSection?: (section: GrowthOsSection) => void;
}

export const VoiceCoordinatorModal: React.FC<VoiceCoordinatorModalProps> = ({
  onClose,
  onNavigateSection,
}) => {
  const state = useGrowthOsRuntime();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [sending, setSending] = useState(false);
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.coordinator_messages.length]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakResponse = (text: string) => {
    if (!ttsEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-PT';
      utterance.rate = 1.04;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Browser sem suporte TTS ativo
    }
  };

  const handleToggleMic = () => {
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      showToast(
        'O seu navegador atual não suporta reconhecimento de voz nativo. Utilize o campo de texto abaixo.',
        'info'
      );
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'pt-PT';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      if (transcript) {
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt ?? inputText).trim();
    if (!textToSend || sending) return;
    setSending(true);
    if (!customPrompt) setInputText('');

    try {
      const reply = await sendCoordinatorMessage(textToSend);
      speakResponse(reply.text);
      if (reply.created_mission_id) {
        showToast('Missão criada e executada pela equipa de agentes! Verifique o Centro de Aprovações.', 'success');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao comunicar com o Coordenador';
      showToast(msg, 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-coordinator-title"
    >
      <div className="flex h-[84vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="voice-coordinator-title" className="text-base font-bold text-zinc-900 dark:text-white">
                  Sala de Comando por Voz & Texto — Diretor de Operações (ops_director)
                </h2>
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Orquestrador Ativo
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Discuta projetos por voz ou texto, consulte o estado dos 10 agentes e lance missões reais com aprovação humana.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (ttsEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                setTtsEnabled(!ttsEnabled);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              title="Ativar ou silenciar resposta falada do Coordenador"
            >
              {ttsEnabled ? <Volume2 className="h-4 w-4 text-blue-600" /> : <VolumeX className="h-4 w-4" />}
              <span>{ttsEnabled ? 'Voz Ativa' : 'Silenciado'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-200/60 dark:text-zinc-400 dark:hover:bg-zinc-800"
              aria-label="Fechar sala do coordenador"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Atalhos Rápidos de Comando */}
        <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 bg-zinc-100/60 px-6 py-2.5 dark:border-zinc-800 dark:bg-zinc-950/40">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Comandos Rápidos:
          </span>
          <button
            type="button"
            onClick={() => handleSend('Pesquisar oportunidades de produtos digitais para a UmbuLab')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700"
          >
            <Rocket className="h-3.5 w-3.5" />
            Executar Missão: Oportunidades de Produtos Digitais
          </button>
          <button
            type="button"
            onClick={() => handleSend('Qual é o estado atual dos 10 agentes e das aprovações pendentes?')}
            className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
          >
            Relatório da Equipa
          </button>
          <button
            type="button"
            onClick={() => handleSend('Qual é o saldo disponível nos envelopes de orçamento EUR, BRL e USD?')}
            className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
          >
            Consultar Orçamentos
          </button>
        </div>

        {/* Histórico de Conversa com o Coordenador */}
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {state.coordinator_messages.map((msg) => {
            const isAdmin = msg.sender === 'admin';
            return (
              <div
                key={msg.message_id}
                className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                    isAdmin
                      ? 'bg-blue-600 text-white'
                      : 'border border-zinc-200 bg-zinc-50 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-100'
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between gap-4 text-[11px] font-semibold opacity-80">
                    <span>{msg.speaker_label}</span>
                    <span className="font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString('pt-PT', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p>{msg.text}</p>

                  {msg.created_mission_id && onNavigateSection && (
                    <div className="mt-3 flex flex-wrap gap-2 border-t border-zinc-200/50 pt-2.5 dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={() => {
                          onNavigateSection('tasks_approvals');
                          onClose();
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Abrir Missão no Centro de Aprovações
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Barra de Entrada por Voz / Texto */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="border-t border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60"
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleMic}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all ${
                isListening
                  ? 'animate-pulse border-red-500 bg-red-600 text-white shadow-lg'
                  : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200'
              }`}
              title={isListening ? 'Parar gravação de voz' : 'Falar com o Coordenador por microfone'}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isListening
                  ? 'A ouvir a sua voz... fale agora'
                  : 'Fale ao microfone ou escreva uma instrução para o Diretor de Operações...'
              }
              className="h-11 flex-1 rounded-xl border border-zinc-300 bg-white px-4 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            />

            <button
              type="submit"
              disabled={sending || !inputText.trim()}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>Enviar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

