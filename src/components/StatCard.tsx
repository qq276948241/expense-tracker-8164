import { ReactNode } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon?: ReactNode;
  className?: string;
  highlight?: boolean;
}

function StatCard({ title, value, change, icon, className, highlight }: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div
      className={cn(
        'card card-hover p-6 relative overflow-hidden',
        highlight && 'bg-gradient-to-br from-primary-900/40 via-surface-800/80 to-surface-800/80 border-primary-500/20',
        className,
      )}
    >
      {highlight && (
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
      )}

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <p className="text-sm font-medium text-slate-400">{title}</p>
          {icon && (
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
              {icon}
            </div>
          )}
        </div>

        <p className="font-mono text-4xl font-bold text-white tracking-tight mb-3">
          {value}
        </p>

        {change !== undefined && (
          <div
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
              isPositive
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/15 text-rose-400 border border-rose-500/20',
            )}
          >
            {isPositive ? (
              <ArrowUp className="w-3.5 h-3.5" />
            ) : (
              <ArrowDown className="w-3.5 h-3.5" />
            )}
            <span>
              {isPositive ? '+' : ''}
              {change.toFixed(1)}%
            </span>
            <span className="text-slate-500 font-normal ml-0.5">环比</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;
