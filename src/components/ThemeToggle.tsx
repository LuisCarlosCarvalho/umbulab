import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 p-1 bg-zinc-200/80 dark:bg-zinc-800/80 backdrop-blur-md rounded-full border border-zinc-300 dark:border-zinc-700/60 shadow-inner">
      <button
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-full transition-all duration-200 ${
          theme === 'light'
            ? 'bg-white text-yellow-500 shadow-sm'
            : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
        }`}
        title="Modo Claro"
        aria-label="Modo Claro"
      >
        <Sun size={16} />
      </button>

      <button
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-full transition-all duration-200 ${
          theme === 'dark'
            ? 'bg-zinc-900 text-umbu-neon shadow-sm'
            : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
        }`}
        title="Modo Escuro"
        aria-label="Modo Escuro"
      >
        <Moon size={16} />
      </button>

      <button
        onClick={() => setTheme('system')}
        className={`p-1.5 rounded-full transition-all duration-200 ${
          theme === 'system'
            ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-900 dark:text-white shadow-sm'
            : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
        }`}
        title="Automático (Sistema)"
        aria-label="Automático (Sistema)"
      >
        <Laptop size={16} />
      </button>
    </div>
  );
}
