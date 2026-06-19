import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  Tags,
  Wallet,
  Settings as SettingsIcon,
  Wallet as WalletIcon,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: '仪表盘', icon: LayoutDashboard },
  { path: '/transactions', label: '流水', icon: Receipt },
  { path: '/categories', label: '分类管理', icon: Tags },
  { path: '/budget', label: '预算', icon: Wallet },
  { path: '/settings', label: '设置', icon: SettingsIcon },
];

function Sidebar() {
  return (
    <aside className="w-60 h-screen flex flex-col bg-surface-900/70 backdrop-blur-xl border-r border-white/5 shrink-0 sticky top-0">
      <div className="px-6 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow">
            <WalletIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">记账看板</h1>
            <p className="text-xs text-slate-400">掌控每一笔开销</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                  isActive
                    ? 'bg-primary-600/20 text-primary-300 shadow-inner border-primary-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="card p-4">
          <p className="text-xs text-slate-400 mb-2">💡 小贴士</p>
          <p className="text-xs text-slate-300 leading-relaxed">
            坚持每天记录开销，养成良好理财习惯！
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
