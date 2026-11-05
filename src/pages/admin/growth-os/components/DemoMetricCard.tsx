import React from 'react';
import { GrowthOsCurrency } from '../../../../types/growthOs';
import { CurrencyCodeBadge, DemoDataBadge } from './GrowthOsBadges';

interface DemoMetricCardProps {
  title: string;
  demoValue: string;
  subtitle: string;
  currency?: GrowthOsCurrency;
  icon: React.ReactNode;
}

export const DemoMetricCard: React.FC<DemoMetricCardProps> = ({
  title,
  demoValue,
  subtitle,
  currency,
  icon,
}) => {
  return (
    <article className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 shadow-sm flex flex-col justify-between gap-4">
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div className="p-2.5 rounded-xl bg-umbu-primary/10 text-umbu-primary dark:bg-umbu-primary/20 dark:text-umbu-secondary shrink-0">
          {icon}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          {currency && <CurrencyCodeBadge currency={currency} />}
          <DemoDataBadge label="Fictício" />
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
          {title}
        </h3>
        <p className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white mt-1.5 tracking-tight">
          {demoValue}
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-2 leading-relaxed">
          {subtitle}
        </p>
      </div>
    </article>
  );
};

