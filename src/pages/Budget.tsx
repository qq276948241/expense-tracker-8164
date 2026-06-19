import { useState, useMemo } from 'react';
import { Target, AlertTriangle, CheckCircle2, TrendingUp, Calendar } from 'lucide-react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { formatCurrency, getMonthKey } from '@/utils/format';

function Budget() {
  const currency = useSettingsStore((s) => s.currency);
  const categories = useCategoryStore((s) => s.categories);

  const [monthKey, setMonthKey] = useState(getMonthKey());
  const budgetLimit = useBudgetStore((s) => s.getBudgetLimit(monthKey));
  const setBudgetLimit = useBudgetStore((s) => s.setBudgetLimit);

  const getTotalByMonth = useTransactionStore((s) => s.getTotalByMonth);
  const getTotalByCategory = useTransactionStore((s) => s.getTotalByCategory);

  const [limitInput, setLimitInput] = useState(budgetLimit.toString());
  const spent = getTotalByMonth(monthKey, 'expense');

  const isOverBudget = budgetLimit > 0 && spent > budgetLimit;
  const percent = budgetLimit > 0 ? Math.min((spent / budgetLimit) * 100, 100) : 0;
  const remaining = Math.max(budgetLimit - spent, 0);

  const handleSaveBudget = () => {
    const v = Number(limitInput);
    if (v >= 0) {
      setBudgetLimit(monthKey, v);
    }
  };

  const categoryBreakdown = useMemo(() => {
    const totals = getTotalByCategory(monthKey, 'expense');
    const items: Array<{ id: string; name: string; color: string; spent: number; percent: number }> = [];
    categories.forEach((cat) => {
      const s = totals.get(cat.id) || 0;
      if (s > 0) {
        items.push({
          id: cat.id,
          name: cat.name,
          color: cat.color,
          spent: s,
          percent: budgetLimit > 0 ? (s / budgetLimit) * 100 : 0,
        });
      }
    });
    return items.sort((a, b) => b.spent - a.spent);
  }, [monthKey, categories, getTotalByCategory, budgetLimit]);

  const today = new Date();
  const months: { key: string; label: string }[] = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const key = getMonthKey(d);
    const label = d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' });
    months.push({ key, label });
  }

  const daysInMonth = new Date(
    Number(monthKey.slice(0, 4)),
    Number(monthKey.slice(5, 7)),
    0,
  ).getDate();
  const currentDay =
    monthKey === getMonthKey() ? today.getDate() : daysInMonth;
  const daysRemaining = daysInMonth - currentDay;
  const dailyAvgLeft = daysRemaining > 0 && remaining > 0 ? remaining / daysRemaining : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">预算管理</h1>
          <p className="text-sm text-slate-400">设定月度预算上限，跟踪消费进度</p>
        </div>

        <div className="relative">
          <Calendar className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <select
            value={monthKey}
            onChange={(e) => {
              setMonthKey(e.target.value);
              setLimitInput(
                useBudgetStore.getState().getBudgetLimit(e.target.value).toString(),
              );
            }}
            className="input-base pl-10 pr-8 py-2 text-sm w-48 appearance-none"
          >
            {months.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        className={`card p-8 relative overflow-hidden transition-all ${
          isOverBudget ? 'border-rose-500/30' : ''
        }`}
      >
        {isOverBudget && (
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent pointer-events-none" />
        )}

        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-medium text-slate-300">月度预算</span>
              </div>
              <div className="flex items-end gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-lg">
                    {currency}
                  </span>
                  <input
                    type="number"
                    step="100"
                    min="0"
                    value={limitInput}
                    onChange={(e) => setLimitInput(e.target.value)}
                    onBlur={handleSaveBudget}
                    onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                    placeholder="0"
                    className="input-base pl-12 py-4 font-mono text-3xl font-bold text-white"
                  />
                </div>
                <button onClick={handleSaveBudget} className="btn-primary py-4 px-6 text-base">
                  保存
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">输入 0 表示不设置预算</p>
            </div>

            {budgetLimit > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isOverBudget ? (
                      <AlertTriangle className="w-5 h-5 text-rose-400 animate-pulse-slow" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    )}
                    <span className="text-sm text-slate-300">
                      {isOverBudget ? '已超出预算' : '消费进度'}
                    </span>
                  </div>
                  <span
                    className={`font-mono text-sm font-semibold ${
                      isOverBudget ? 'text-rose-400' : 'text-slate-200'
                    }`}
                  >
                    {percent.toFixed(1)}%
                  </span>
                </div>

                <div className="relative h-4 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isOverBudget
                        ? 'bg-gradient-to-r from-rose-500 to-rose-600'
                        : 'bg-gradient-to-r from-primary-500 via-primary-400 to-violet-500'
                    } ${isOverBudget ? 'animate-pulse-slow' : ''}`}
                    style={{ width: `${Math.max(percent, 2)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="card p-5 bg-white/[0.02]">
              <p className="text-xs text-slate-500 mb-1">已支出</p>
              <p
                className={`font-mono text-2xl font-bold ${
                  isOverBudget ? 'text-rose-400' : 'text-white'
                }`}
              >
                {formatCurrency(spent, currency)}
              </p>
            </div>

            {budgetLimit > 0 && (
              <>
                <div className="card p-5 bg-white/[0.02]">
                  <p className="text-xs text-slate-500 mb-1">剩余额度</p>
                  <p
                    className={`font-mono text-2xl font-bold ${
                      isOverBudget ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {isOverBudget ? '-' : ''}
                    {formatCurrency(isOverBudget ? spent - budgetLimit : remaining, currency)}
                  </p>
                </div>

                {!isOverBudget && daysRemaining > 0 && (
                  <div className="card p-5 bg-white/[0.02]">
                    <div className="flex items-center gap-1.5 mb-1">
                      <TrendingUp className="w-3 h-3 text-slate-500" />
                      <p className="text-xs text-slate-500">建议日均消费</p>
                    </div>
                    <p className="font-mono text-2xl font-bold text-primary-400">
                      {formatCurrency(dailyAvgLeft, currency)}
                      <span className="text-xs font-medium text-slate-500 ml-1">/天</span>
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      本月还剩 {daysRemaining} 天
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {categoryBreakdown.length > 0 && budgetLimit > 0 && (
        <div className="card p-6">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-white">分类支出对比预算</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              各分类消费占总预算的比例
            </p>
          </div>
          <div className="space-y-4">
            {categoryBreakdown.map((cat) => (
              <div key={cat.id}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-slate-300 truncate">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="font-mono text-xs text-slate-500 w-12 text-right">
                      {cat.percent.toFixed(1)}%
                    </span>
                    <span className="font-mono text-sm text-slate-200 w-24 text-right">
                      {formatCurrency(cat.spent, currency)}
                    </span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(cat.percent, 100)}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Budget;
