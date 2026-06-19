import { useState } from 'react';
import { Plus, Edit3, Trash2, Check } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import Modal from '@/components/Modal';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useTransactionStore } from '@/store/useTransactionStore';
import { Category } from '@/types';

const COLOR_PALETTE = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#64748b', '#6b7280', '#1e293b',
];

const ICON_OPTIONS = [
  'utensils', 'car', 'shopping-bag', 'gamepad-2', 'home',
  'heart-pulse', 'book-open', 'package', 'coffee', 'bus',
  'plane', 'dumbbell', 'music', 'film', 'gift',
  'dog', 'flower-2', 'smartphone', 'laptop', 'lightbulb',
];

interface FormState {
  name: string;
  color: string;
  icon: string;
}

function Categories() {
  const categories = useCategoryStore((s) => s.categories);
  const addCategory = useCategoryStore((s) => s.addCategory);
  const updateCategory = useCategoryStore((s) => s.updateCategory);
  const deleteCategory = useCategoryStore((s) => s.deleteCategory);
  const transactions = useTransactionStore((s) => s.transactions);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<FormState>({
    name: '',
    color: COLOR_PALETTE[0],
    icon: ICON_OPTIONS[0],
  });

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', color: COLOR_PALETTE[0], icon: ICON_OPTIONS[0] });
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, color: cat.color, icon: cat.icon });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const data = {
      name: form.name.trim(),
      color: form.color,
      icon: form.icon,
    };
    if (editing) {
      updateCategory(editing.id, data);
    } else {
      addCategory(data);
    }
    setModalOpen(false);
  };

  const handleDelete = (cat: Category) => {
    const used = transactions.some((t) => t.categoryId === cat.id);
    const msg = used
      ? `分类"${cat.name}"下还有交易记录，删除后这些记录将变为未分类。确定删除吗？`
      : `确定删除分类"${cat.name}"吗？`;
    if (confirm(msg)) {
      deleteCategory(cat.id);
    }
  };

  const getIconComponent = (iconName: string, className = 'w-5 h-5') => {
    const key = iconName
      .split('-')
      .map((s, i) => (i === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1)))
      .join('');
    const iconMap = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
    const Cmp = iconMap[key] || LucideIcons.Package;
    return <Cmp className={className} />;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">分类管理</h1>
          <p className="text-sm text-slate-400">
            管理你的消费分类，自定义颜色和图标
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-4 h-4" />
          新增分类
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const txnCount = transactions.filter((t) => t.categoryId === cat.id).length;
          return (
            <div
              key={cat.id}
              className="card card-hover p-5 relative group"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: cat.color + '22',
                    color: cat.color,
                    boxShadow: `0 0 20px ${cat.color}22`,
                  }}
                >
                  {getIconComponent(cat.icon, 'w-7 h-7')}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white truncate">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {txnCount} 条记录
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span
                      className="w-4 h-4 rounded-md shrink-0 border border-white/10"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-xs font-mono text-slate-500">
                      {cat.color.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(cat)}
                  className="flex-1 btn-secondary text-xs py-2 inline-flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  编辑
                </button>
                <button
                  onClick={() => handleDelete(cat)}
                  className="flex-1 px-3 py-2 text-xs font-medium rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors inline-flex items-center justify-center gap-1.5 border border-rose-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  删除
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? '编辑分类' : '新增分类'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              分类名称
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="例如：餐饮、交通..."
              className="input-base"
              maxLength={10}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              颜色
            </label>
            <div className="grid grid-cols-10 gap-2">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm({ ...form, color: c })}
                  className={`w-full aspect-square rounded-lg transition-all relative ${
                    form.color === c
                      ? 'ring-2 ring-offset-2 ring-offset-surface-800 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                >
                  {form.color === c && (
                    <Check className="w-3 h-3 text-white absolute inset-0 m-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              图标
            </label>
            <div className="grid grid-cols-10 gap-2">
              {ICON_OPTIONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setForm({ ...form, icon: i })}
                  className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all ${
                    form.icon === i
                      ? 'bg-primary-600/30 border-primary-500/50'
                      : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]'
                  } border`}
                  style={
                    form.icon === i
                      ? { color: form.color, borderColor: form.color + '66', backgroundColor: form.color + '22' }
                      : { color: '#94a3b8' }
                  }
                >
                  {getIconComponent(i, 'w-4 h-4')}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-4 bg-white/[0.02]">
            <p className="text-xs text-slate-500 mb-3">预览</p>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: form.color + '22',
                  color: form.color,
                }}
              >
                {getIconComponent(form.icon, 'w-6 h-6')}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {form.name || '分类名称'}
                </p>
                <p className="text-xs text-slate-500">预览效果</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn-secondary flex-1"
            >
              取消
            </button>
            <button type="submit" className="btn-primary flex-1">
              {editing ? '保存修改' : '添加分类'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Categories;
