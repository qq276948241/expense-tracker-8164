import { useState } from 'react';
import { Download, Globe, FileSpreadsheet, Check } from 'lucide-react';
import { Currency } from '@/types';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { exportTransactionsToCSV } from '@/utils/csv';

const CURRENCY_OPTIONS: { value: Currency; label: string; symbol: string; locale: string }[] = [
  { value: 'CNY', label: '人民币', symbol: '¥', locale: 'zh-CN' },
  { value: 'USD', label: '美元', symbol: '$', locale: 'en-US' },
  { value: 'EUR', label: '欧元', symbol: '€', locale: 'de-DE' },
  { value: 'JPY', label: '日元', symbol: '¥', locale: 'ja-JP' },
  { value: 'GBP', label: '英镑', symbol: '£', locale: 'en-GB' },
];

function Settings() {
  const currency = useSettingsStore((s) => s.currency);
  const setCurrency = useSettingsStore((s) => s.setCurrency);
  const transactions = useTransactionStore((s) => s.transactions);
  const categories = useCategoryStore((s) => s.categories);

  const [exported, setExported] = useState(false);

  const handleExport = () => {
    exportTransactionsToCSV(transactions, categories);
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">设置</h1>
        <p className="text-sm text-slate-400">个性化你的记账应用</p>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-primary-500/15 flex items-center justify-center text-primary-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">货币设置</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              选择显示金额时使用的币种，所有数据会自动应用该符号
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {CURRENCY_OPTIONS.map((opt) => {
            const selected = currency === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setCurrency(opt.value)}
                className={`p-4 rounded-xl border transition-all text-left ${
                  selected
                    ? 'bg-primary-600/15 border-primary-500/40'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-2xl font-bold text-white">
                    {opt.symbol}
                  </span>
                  {selected && (
                    <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-xs font-medium text-slate-200">{opt.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{opt.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-white">导出数据</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              将所有交易记录导出为 CSV 文件，可用 Excel 或表格软件打开
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-500">交易记录</p>
                <p className="font-mono text-lg font-semibold text-white">
                  {transactions.length}
                  <span className="text-xs text-slate-500 ml-1 font-normal">条</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">分类数量</p>
                <p className="font-mono text-lg font-semibold text-white">
                  {categories.length}
                  <span className="text-xs text-slate-500 ml-1 font-normal">个</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">文件格式</p>
                <p className="text-lg font-semibold text-white">.CSV</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleExport}
            disabled={transactions.length === 0}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
              exported
                ? 'bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/30'
                : 'btn-primary'
            } ${transactions.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {exported ? (
              <>
                <Check className="w-4 h-4" />
                已导出
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                导出 CSV
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-3 leading-relaxed">
          导出字段包括：日期、分类、金额、备注。数据按日期倒序排列，文件编码为 UTF-8 BOM，
          可在 Excel 中直接打开正常显示中文。
        </p>
      </div>

      <div className="card p-6 border-white/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center text-violet-400">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">关于</h3>
            <p className="text-xs text-slate-500 mt-0.5">记账看板 v1.0.0</p>
          </div>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">
          一个简洁高效的个人财务管理工具。所有数据均存储在你的浏览器本地（LocalStorage），
          不会上传到任何服务器，请定期导出 CSV 进行备份。
        </p>
      </div>
    </div>
  );
}

export default Settings;
