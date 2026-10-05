import { Bot, Database, Gauge, LayoutDashboard, LogOut, Settings } from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full bg-[#070b14]/95 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.6)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 gap-3">
        {/* Zone 1: Wordmark adhering to single-element brand zone */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 border border-cyan-500/40 flex items-center justify-center text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_2px_8px_rgba(6,182,212,0.25)] font-bold text-sm tracking-wider select-none shrink-0">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">X</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
              X-VIWE SUITE
            </span>
            <div className="flex items-center gap-1.5 text-[11px] font-mono leading-none mt-0.5">
              <span className={`inline-flex rounded-full h-2 w-2 ${isLive ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-amber-400'}`} />
              <span className="text-slate-400">
                {isLive ? 'sudda.store · Live' : 'Panel Standby'}
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Segmented Control Navigation with real tactile push buttons */}
        <nav className="flex items-center gap-1 bg-slate-950/90 p-1 rounded-xl border border-slate-800/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`btn-real px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                  isActive
                    ? 'btn-real-secondary text-cyan-300 border-cyan-500/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_2px_8px_rgba(0,0,0,0.5)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 mr-2 transition-transform ${isActive ? 'text-cyan-400 scale-110' : 'text-slate-400'}`} />
                <span className="hidden md:inline">{tab.label}</span>
                <span className="inline md:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Real tactile action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSettings}
            title="Cluster & API Settings"
            className="btn-real btn-real-secondary p-2.5 rounded-xl text-slate-300 hover:text-cyan-300"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={onLogout}
            title="Sign Out"
            className="btn-real btn-real-danger p-2.5 rounded-xl"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
