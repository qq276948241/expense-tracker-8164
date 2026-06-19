import { useMemo, useState } from 'react';
import { Plus, Filter, X, Edit3, Trash2, TrendingDown, TrendingUp } from 'lucide-react';
import Modal from '@/components/Modal';
import CategoryBadge from '@/components/CategoryBadge';
import EmptyState from '@/components/EmptyState';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Transaction, TransactionType, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '@/types';
import { formatCurrency, formatDate } from '@/utils/format';

type FilterType = 'all' | 'expense' | 'income';

interface FormState {
  type: TransactionType;
  amount: string;
  categoryId: string;
  date: string;
  note: string;
}

function emptyForm(type: TransactionType = 'expense'): FormState {
  const today = new Date().toISOString().slice(0, 10);
  const defaultCat = type === 'expense'
    ? DEFAULT_EXPENSE_CATEGORIES[0]?.id || ''
    : DEFAULT_INCOME_CATEGORIES[0]?.id || '';
  return { type, amount: '', categoryId: defaultCat, date: today, note: '' };
}

function Transactions() {
  const currency = useSettingsStore((s) => s.currency);
  const transactions = useTransactionStore((s) => s.transactions);
  const categories = useCategoryStore((s) => s.categories);
  const getCategoryById = useCategoryStore((s) => s.getCategoryById);
  const addTransaction = useTransactionStore((s) => s.addTransaction);
  const updateTransaction = useTransactionStore((s) => s.updateTransaction);
  const deleteTransaction = useTransactionStore((s) => s.deleteTransaction);

  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());

  const incomeCatIds = DEFAULT_INCOME_CATEGORIES.map((c) => c.id);

  const incomeCategories = useMemo(
    () => categories.filter((c) => incomeCatIds.includes(c.id)),
    [categories, incomeCatIds],
  );

  const expenseCategories = useMemo(
    () => categories.filter((c) => !incomeCatIds.includes(c.id)),
    [categories, incomeCatIds],
  );

  const filteredCategories = useMemo(() => {
    if (filterType === 'expense') return expenseCategories;
    if (filterType === 'income') return incomeCategories;
    return categories;
  }, [filterType, categories, expenseCategories, incomeCategories]);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (filterType !== 'all' && t.type !== filterType) return false;
      if (selectedCategoryIds.length > 0 && !selectedCategoryIds.includes(t.categoryId)) return false;
      if (startDate && t.date < startDate) return false;
      if (endDate && t.date > endDate) return false;
      return true;
    });
  }, [transactions, filterType, selectedCategoryIds, startDate, endDate]);

  const totals = useMemo(() => {
    let expense = 0;
    let income = 0;
    filtered.forEach((t) => {
      if (t.type === 'expense') expense += t.amount;
      else income += t.amount;
    });
    return { expense, income, balance: income - expense };
  }, [filtered]);

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const resetFilters = () => {
    setFilterType('all');
    setSelectedCategoryIds([]);
    setStartDate('');
    setEndDate('');
  };

  const openAdd = () => {
    setEditing(null);
    const type = filterType === 'income' ? 'income' : 'expense';
    setForm(emptyForm(type));
    setModalOpen(true);
  };

  const openEdit = (txn: Transaction) => {
    setEditing(txn);
    setForm({
      type: txn.type,
      amount: txn.amount.toString(),
      categoryId: txn.categoryId,
      date: txn.date,
      note: txn.note,
    });
    setModalOpen(true);
  };

  const switchFormType = (type: TransactionType) => {
    const defaultCat = type === 'expense'
      ? DEFAULT_EXPENSE_CATEGORIES[0]?.id || ''
      : DEFAULT_INCOME_CATEGORIES[0]?.id || '';
    setForm({ ...form, type, categoryId: defaultCat });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!amount || amount <= 0 || !form.categoryId || !form.date) return;

    const data = {
      type: form.type,
      amount,
      categoryId: form.categoryId,
      date: form.date,
      note: form.note.trim(),
    };

    if (editing) {
      updateTransaction(editing.id, data);
    } else {
      addTransaction(data);
    }
    setModalOpen(false);
  };

  const FilterTab = ({ value, label, icon: Icon }: { value: FilterType; label: string; icon: any }) => {
    const active = filterType === value;
    return (
      <button
        onClick={() => setFilterType(value)}
        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          active
            ? 'bg-white/10 text-white'
            : 'text-slate-400 hover:text-slate-300 hover:bg-white/5'
        }`}
      >
        <Icon className="w-4 h-4" />
        {label}
      </button>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">流水</h1>
          <p className="text-sm text-slate-400">
            共 {filtered.length} 条记录，支出{' '}
            <span className="font-mono font-semibold text-rose-400">
              -{formatCurrency(totals.expense, currency)}
            </span>
            ，收入{' '}
            <span className="font-mono font-semibold text-emerald-400">
              +{formatCurrency(totals.income, currency)}
            </span>
            {filterType === 'all' && (
              <>
                {' '}结余{' '}
                <span className={`font-mono font-semibold ${totals.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {totals.balance >= 0 ? '+' : ''}{formatCurrency(totals.balance, currency)}
                </span>
              </>
            )}
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-4 h-4" />
          新增记录
        </button>
      </div>

      <div className="card p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Filter className="w-4 h-4 text-slate-500" />
          筛选条件
          {(filterType !== 'all' || selectedCategoryIds.length > 0 || startDate || endDate) && (
            <button
              onClick={resetFilters}
              className="ml-auto text-xs text-primary-400 hover:text-primary-300 inline-flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              重置
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 bg-slate-900/50 rounded-lg p-1 w-fit">
          <FilterTab value="all" label="全部" icon={Filter} />
          <FilterTab value="expense" label="支出" icon={TrendingDown} />
          <FilterTab value="income" label="收入" icon={TrendingUp} />
        </div>

        <div className="flex flex-wrap gap-2">
          {filteredCategories.map((cat) => {
            const active = selectedCategoryIds.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  active
                    ? 'border-transparent text-white'
                    : 'border-white/10 text-slate-400 hover:text-slate-300 hover:border-white/20 bg-white/[0.02]'
                }`}
                style={active ? { backgroundColor: cat.color + '33', color: cat.color, borderColor: cat.color + '55' } : undefined}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                {cat.name}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500">开始</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-base w-44 text-sm py-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500">结束</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-base w-44 text-sm py-2"
            />
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            title="没有匹配的记录"
            description="试试调整筛选条件，或者添加一条新记录"
            action={
              <button onClick={openAdd} className="btn-primary">
                添加记录
              </button>
            }
          />
        ) : (
          <div className="divide-y divide-white/5 max-h-[calc(100vh-460px)] overflow-y-auto">
            {filtered.map((txn) => {
              const cat = getCategoryById(txn.categoryId);
              const isIncome = txn.type === 'income';
              return (
                <div
                  key={txn.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors group cursor-pointer"
                  onClick={() => openEdit(txn)}
                >
                  {cat && <CategoryBadge category={cat} size="md" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-medium text-slate-200 truncate">
                        {txn.note || (cat?.name ?? '未分类')}
                      </p>
                      {txn.note && cat && (
                        <span className="text-xs text-slate-500 shrink-0">
                          {cat.name}
                        </span>
                      )}
                      <span className={`text-xs shrink-0 px-2 py-0.5 rounded-full font-medium ${
                        isIncome ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                      }`}>
                        {isIncome ? '收入' : '支出'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {formatDate(txn.date)}
                    </p>
                  </div>
                  <div className="text-right shrink-0 mr-2">
                    <p className={`font-mono text-lg font-semibold ${
                      isIncome ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {isIncome ? '+' : '-'}{formatCurrency(txn.amount, currency)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(txn);
                      }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('确定删除这条记录吗？')) deleteTransaction(txn.id);
                      }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? '编辑记录' : '新增记录'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              类型
            </label>
            <div className="flex items-center gap-2 bg-slate-900/50 rounded-lg p-1">
              <button
                type="button"
                onClick={() => switchFormType('expense')}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  form.type === 'expense'
                    ? 'bg-rose-500/20 text-rose-400'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <TrendingDown className="w-4 h-4" />
                支出
              </button>
              <button
                type="button"
                onClick={() => switchFormType('income')}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  form.type === 'income'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                收入
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              金额
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">
                {currency}
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0.00"
                className="input-base pl-10 font-mono text-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              分类
            </label>
            <select
              required
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="input-base appearance-none pr-10"
            >
              <option value="">请选择分类</option>
              {(form.type === 'expense' ? expenseCategories : incomeCategories).map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              日期
            </label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="input-base"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              备注
            </label>
            <input
              type="text"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="例如：午餐、打车..."
              className="input-base"
              maxLength={50}
            />
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
              {editing ? '保存修改' : '添加记录'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Transactions;
