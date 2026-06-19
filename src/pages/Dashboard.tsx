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
} from 'recharts';
import { Receipt, PieChart as PieIcon, TrendingDown, TrendingUp, PiggyBank, Scale } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useMonthStats } from '@/hooks/useMonthStats';
import {
  formatCurrency,
  getMonthKey,
  getPreviousMonthKey,
  calcChangePercent,
} from '@/utils/format';

function Dashboard() {
  const currency = useSettingsStore((s) => s.currency);

  const currentMonth = getMonthKey();
  const prevMonth = getPreviousMonthKey(currentMonth);

  const cur = useMonthStats(currentMonth);
  const prev = useMonthStats(prevMonth, false);

  const expenseChange = calcChangePercent(cur.expenseTotal, prev.expenseTotal);
  const incomeChange = calcChangePercent(cur.incomeTotal, prev.incomeTotal);
  const balanceChange = cur.balance - prev.balance;

  const todayDate = new Date().getDate();
  const avgPerDay = todayDate > 0 ? cur.expenseTotal / todayDate : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-end justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">仪表盘</h1>
          <p className="text-sm text-slate-400">
            {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}{' '}
            财务概览
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="本月支出"
          value={formatCurrency(cur.expenseTotal, currency)}
          change={expenseChange}
          icon={<TrendingDown className="w-5 h-5" />}
          highlight
        />
        <StatCard
          title="本月收入"
          value={formatCurrency(cur.incomeTotal, currency)}
          change={incomeChange}
          icon={<TrendingUp className="w-5 h-5" />}
          variant="income"
        />
        <StatCard
          title="本月结余"
          value={formatCurrency(cur.balance, currency)}
          change={balanceChange}
          icon={<Scale className="w-5 h-5" />}
          variant="balance"
        />
        <StatCard
          title="交易笔数"
          value={cur.txnCount.toString()}
          icon={<Receipt className="w-5 h-5" />}
        />
        <StatCard
          title="日均支出"
          value={formatCurrency(avgPerDay, currency)}
          icon={<PiggyBank className="w-5 h-5" />}
        />
        <StatCard
          title="最多支出分类"
          value={cur.topExpenseCategory?.name || '--'}
          icon={<PieIcon className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-white">每日花销</h3>
              <p className="text-xs text-slate-500 mt-0.5">本月每日支出金额</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cur.dailyExpenses} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  interval={Math.floor(cur.dailyExpenses.length / 10)}
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
            <h3 className="text-base font-semibold text-white">支出分类占比</h3>
            <p className="text-xs text-slate-500 mt-0.5">本月各分类支出占比</p>
          </div>

          {cur.categoryExpenses.length > 0 ? (
            <>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cur.categoryExpenses}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {cur.categoryExpenses.map((entry, index) => (
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
                {cur.categoryExpenses.map((cat) => {
                  const pct = cur.expenseTotal > 0 ? (cat.value / cur.expenseTotal) * 100 : 0;
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
