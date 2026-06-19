import { ReactNode } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type StatVariant = 'default' | 'expense' | 'income' | 'balance';

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon?: ReactNode;
  className?: string;
  highlight?: boolean;
  variant?: StatVariant;
}

function StatCard({
  title,
  value,
  change,
  icon,
  className,
  highlight,
  variant = 'default',
}: StatCardProps) {
  const hasValidChange = change !== undefined && !Number.isNaN(change);
  const isChangePositive = hasValidChange && (change as number) >= 0;

  let changeColorClass = '';
  if (variant === 'income') {
    changeColorClass = !hasValidChange || isChangePositive
      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
      : 'bg-rose-500/15 text-rose-400 border-rose-500/20';
  } else if (variant === 'balance') {
    changeColorClass = !hasValidChange || isChangePositive
      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
      : 'bg-rose-500/15 text-rose-400 border-rose-500/20';
  } else {
    changeColorClass = !hasValidChange
      ? 'bg-slate-500/15 text-slate-400 border-slate-500/20'
      : isChangePositive
      ? 'bg-rose-500/15 text-rose-400 border-rose-500/20'
      : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20';
  }

  const gradientClass =
    variant === 'income'
      ? 'bg-gradient-to-br from-emerald-900/40 via-surface-800/80 to-surface-800/80 border-emerald-500/20'
      : variant === 'balance'
      ? 'bg-gradient-to-br from-violet-900/40 via-surface-800/80 to-surface-800/80 border-violet-500/20'
      : highlight
      ? 'bg-gradient-to-br from-primary-900/40 via-surface-800/80 to-surface-800/80 border-primary-500/20'
      : '';

  const glowColor =
    variant === 'income'
      ? 'bg-emerald-500/10'
      : variant === 'balance'
      ? 'bg-violet-500/10'
      : 'bg-primary-500/10';

  const iconBgClass =
    variant === 'income'
      ? 'bg-emerald-500/15 text-emerald-400'
      : variant === 'balance'
      ? 'bg-violet-500/15 text-violet-400'
      : highlight
      ? 'bg-primary-500/15 text-primary-400'
      : 'bg-white/5 text-slate-400';

  const hasAccent = highlight || variant === 'income' || variant === 'balance';

  return (
    <div
      className={cn(
        'card card-hover p-6 relative overflow-hidden',
        hasAccent && gradientClass,
        className,
      )}
    >
      {hasAccent && (
        <div
          className={cn(
            'absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl pointer-events-none',
            glowColor,
          )}
        />
      )}

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <p className="text-sm font-medium text-slate-400">{title}</p>
          {icon && (
            <div
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center',
                iconBgClass,
              )}
            >
              {icon}
            </div>
          )}
        </div>

        <p className="font-mono text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
          {value}
        </p>

        {change !== undefined && (
          <div
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
              changeColorClass,
            )}
          >
            {hasValidChange ? (
              isChangePositive ? (
                <ArrowUp className="w-3.5 h-3.5" />
              ) : (
                <ArrowDown className="w-3.5 h-3.5" />
              )
            ) : null}
            <span>
              {hasValidChange
                ? `${isChangePositive ? '+' : ''}${variant === 'balance' ? Math.abs(change as number).toFixed(0) : (change as number).toFixed(1)}${variant === 'balance' ? '' : '%'}`
                : '新数据'}
            </span>
            {hasValidChange && (
              <span className="text-slate-500 font-normal ml-0.5">环比</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;
