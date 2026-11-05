import React, { useRef } from 'react';
import {
  LayoutGrid,
  Bot,
  Radar,
  SplitSquareVertical,
  Palette,
  ClipboardCheck,
  Wallet,
  BarChart2,
  Sliders,
} from 'lucide-react';
import { GrowthOsSection, GrowthOsSectionMeta } from '../../../../types/growthOs';

interface GrowthOsSubNavProps {
  sections: GrowthOsSectionMeta[];
  activeSection: GrowthOsSection;
  onSelectSection: (section: GrowthOsSection) => void;
}

const SECTION_ICONS: Record<GrowthOsSection, React.ElementType> = {
  overview: LayoutGrid,
  agents: Bot,
  opportunities: Radar,
  ab_campaigns: SplitSquareVertical,
  creative_studio: Palette,
  tasks_approvals: ClipboardCheck,
  finance: Wallet,
  reports: BarChart2,
  settings: Sliders,
};

export const GrowthOsSubNav: React.FC<GrowthOsSubNavProps> = ({
  sections,
  activeSection,
  onSelectSection,
}) => {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const count = sections.length;
    let nextIndex: number | null = null;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (index + 1) % count;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (index - 1 + count) % count;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = count - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      const targetSection = sections[nextIndex];
      onSelectSection(targetSection.key);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <nav aria-label="Navegação interna do AI Growth OS">
      {/* Ecrãs inferiores a 1024px (mobile e tablet): apenas seletor nativo acessível */}
      <div className="lg:hidden">
        <label
          htmlFor="growth-os-mobile-section-select"
          className="block text-xs font-extrabold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2"
        >
          Secção ativa do AI Growth OS ({sections.length} áreas)
        </label>
        <select
          id="growth-os-mobile-section-select"
          value={activeSection}
          onChange={(e) => onSelectSection(e.target.value as GrowthOsSection)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-umbu-primary"
        >
          {sections.map((section) => (
            <option
              key={section.key}
              value={section.key}
              className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
            >
              {section.step_number}. {section.short_label}
            </option>
          ))}
        </select>
      </div>

      {/* Ecrãs a partir de 1024px: barra WAI-ARIA com flex-wrap, sem scroll horizontal oculto */}
      <div
        role="tablist"
        aria-label="Secções do UmbuLab AI Growth OS"
        className="hidden lg:flex lg:flex-wrap items-center gap-2 p-2 rounded-2xl bg-umbu-cardLight dark:bg-umbu-cardDark border border-zinc-200 dark:border-zinc-800"
      >
        {sections.map((section, index) => {
          const Icon = SECTION_ICONS[section.key];
          const isActive = section.key === activeSection;

          return (
            <button
              key={section.key}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`growth-os-tab-${section.key}`}
              aria-selected={isActive}
              aria-controls={`growth-os-panel-${section.key}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onSelectSection(section.key)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-umbu-primary ${
                isActive
                  ? 'bg-umbu-primary text-white shadow-sm dark:bg-umbu-primary dark:text-white ring-1 ring-umbu-primary dark:ring-umbu-neon/40'
                  : 'text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800/80'
              }`}
            >
              <Icon size={16} className="shrink-0" aria-hidden="true" />
              <span>{section.short_label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

