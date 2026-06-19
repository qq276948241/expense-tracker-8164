import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Wallet, Receipt, PieChart as PieIcon, TrendingUp } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import {
  formatCurrency,
  formatDateShort,
  getMonthKey,
  getPreviousMonthKey,
  calcChangePercent,
} from '@/utils/format';

function Dashboard() {
  const currency = useSettingsStore((s) => s.currency);
  const categories = useCategoryStore((s) => s.categories);
  const getTotalByMonth = useTransactionStore((s) => s.getTotalByMonth);
  const getDailyTotals = useTransactionStore((s) => s.getDailyTotals);
  const getTotalByCategory = useTransactionStore((s) => s.getTotalByCategory);
  const getTransactionsByMonth = useTransactionStore((s) => s.getTransactionsByMonth);

  const currentMonth = getMonthKey();
  const prevMonth = getPreviousMonthKey(currentMonth);

  const currentTotal = getTotalByMonth(currentMonth);
  const prevTotal = getTotalByMonth(prevMonth);
  const changePercent = calcChangePercent(currentTotal, prevTotal);

  const txnCount = getTransactionsByMonth(currentMonth).length;
  const avgPerDay = txnCount > 0 ? currentTotal / new Date().getDate() : 0;

  const dailyData = useMemo(() => {
    const raw = getDailyTotals(currentMonth);
    const today = new Date();
    const todayDay = today.getDate();
    return raw
      .filter((d) => {
        const day = Number(d.date.slice(-2));
        return day <= todayDay;
      })
      .map((d) => ({
        ...d,
        label: formatDateShort(d.date),
      }));
  }, [currentMonth, getDailyTotals]);

  const categoryData = useMemo(() => {
    const totals = getTotalByCategory(currentMonth);
    const result: Array<{ id: string; name: string; value: number; color: string }> = [];
    categories.forEach((cat) => {
      const v = totals.get(cat.id) || 0;
      if (v > 0) {
        result.push({ id: cat.id, name: cat.name, value: v, color: cat.color });
      }
    });
    return result.sort((a, b) => b.value - a.value);
  }, [currentMonth, categories, getTotalByCategory]);

  const topCategory = categoryData[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-end justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">仪表盘</h1>
          <p className="text-sm text-slate-400">
            {new Date().toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
            })}{' '}
            消费概览
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="本月总支出"
          value={formatCurrency(currentTotal, currency)}
          change={changePercent}
          icon={<Wallet className="w-5 h-5" />}
          highlight
        />
        <StatCard
          title="本月交易笔数"
          value={txnCount.toString()}
          icon={<Receipt className="w-5 h-5" />}
        />
        <StatCard
          title="日均支出"
          value={formatCurrency(avgPerDay, currency)}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatCard
          title="最多消费分类"
          value={topCategory?.name || '--'}
          icon={<PieIcon className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-white">每日花销</h3>
              <p className="text-xs text-slate-500 mt-0.5">本月每日支出金额（元）</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.3} />
                  </linearGradient>
                  <linearGradient id="barHover" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity={1} />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  interval={Math.floor(dailyData.length / 10)}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  }}
                  labelStyle={{ color: '#94a3b8', marginBottom: 4, fontSize: 12 }}
                  itemStyle={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}
                  formatter={(value: number) => formatCurrency(value, currency)}
                />
                <Bar
                  dataKey="total"
                  fill="url(#barGradient)"
                  radius={[6, 6, 0, 0]}
                  activeBar={{ fill: 'url(#barHover)' }}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-white">分类占比</h3>
            <p className="text-xs text-slate-500 mt-0.5">本月各分类支出占比</p>
          </div>

          {categoryData.length > 0 ? (
            <>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          className="cursor-pointer transition-all hover:opacity-80"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                      }}
                      formatter={(value: number, name: string) => [
                        formatCurrency(value, currency),
                        name,
                      ]}
                      labelStyle={{ color: '#94a3b8' }}
                      itemStyle={{ color: '#e2e8f0', fontSize: 13 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 space-y-2 max-h-40 overflow-y-auto pr-1">
                {categoryData.map((cat) => {
                  const pct = (cat.value / currentTotal) * 100;
                  return (
                    <div key={cat.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-slate-300 truncate">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono text-xs text-slate-500 w-10 text-right">
                          {pct.toFixed(1)}%
                        </span>
                        <span className="font-mono text-xs text-slate-200 w-20 text-right">
                          {formatCurrency(cat.value, currency)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="h-72 flex items-center justify-center">
              <p className="text-sm text-slate-500">暂无数据</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
