import { Activity, Bot, Database, Gauge, LayoutDashboard, LogOut, Settings } from 'lucide-react';

export type TabType = 'dashboard' | 'server-monitor' | 'subscription' | 'bot-session';

interface Props {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  isLive: boolean;
}

export function Navbar({ activeTab, setActiveTab, onOpenSettings, onLogout, isLive }: Props) {
  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'server-monitor' as TabType, label: 'Server Monitor', icon: Gauge },
    { id: 'subscription' as TabType, label: 'Subscription Services', icon: Database },
    { id: 'bot-session' as TabType, label: 'Bot Session', icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080c14]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-sm font-bold text-base">
            X
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            X-VIWE SUITE
          </span>
          <div className="hidden sm:flex items-center gap-1.5 ml-2 text-xs font-mono">
            <span
              className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}
            />
            <span className="text-slate-400">
              {isLive ? 'sudda.store (Live)' : 'Panel Standby'}
            </span>
          </div>
        </div>

        {/* Zone 2: 4-6 nav links, single-line */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className="hidden md:inline">{tab.label}</span>
                <span className="inline md:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSettings}
            title="Cluster & API Settings"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={onLogout}
            title="Sign Out"
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
