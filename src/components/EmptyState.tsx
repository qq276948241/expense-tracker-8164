import { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

function EmptyState({
  title = '暂无数据',
  description = '还没有任何记录，开始添加第一笔吧',
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 mb-4">
        {icon || <Inbox className="w-10 h-10" />}
      </div>
      <h3 className="text-lg font-semibold text-slate-200 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 max-w-xs">{description}</p>
      {action}
    </div>
  );
}

export default EmptyState;
