import * as LucideIcons from 'lucide-react';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md';
  showName?: boolean;
}

function CategoryBadge({ category, size = 'sm', showName = true }: CategoryBadgeProps) {
  const key = category.icon
    .split('-')
    .map((s, i) => (i === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1)))
    .join('');
  const iconMap = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  const IconComponent = iconMap[key] || LucideIcons.Package;

  const sizeClasses = size === 'sm' ? 'w-8 h-8 rounded-lg' : 'w-10 h-10 rounded-xl';
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={cn(sizeClasses, 'flex items-center justify-center shrink-0')}
        style={{ backgroundColor: `${category.color}22`, color: category.color }}
      >
        <IconComponent className={iconSize} />
      </span>
      {showName && (
        <span className="text-sm font-medium text-slate-200">{category.name}</span>
      )}
    </span>
  );
}

export default CategoryBadge;
