import { Bot, Database, Gauge, LayoutDashboard, LogOut, Settings, ShieldCheck, Radio } from 'lucide-react';

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
    { id: 'dashboard' as TabType, label: 'Cyber Dashboard', code: '01', icon: LayoutDashboard },
    { id: 'server-monitor' as TabType, label: 'Hardware Telemetry', code: '02', icon: Gauge },
    { id: 'subscription' as TabType, label: 'Routing & Inbounds', code: '03', icon: Database },
    { id: 'bot-session' as TabType, label: 'Bot Controller', code: '04', icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#050811]/95 backdrop-blur-xl border-b border-cyan-500/20 px-4 lg:px-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 gap-3">
        {/* Brand Zone: High-security cyber emblem */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-cyan-950 via-[#0a1526] to-[#040810] border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_14px_rgba(6,182,212,0.4),inset_0_1px_0_rgba(255,255,255,0.2)] font-bold text-sm select-none shrink-0">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white whitespace-nowrap font-mono">
                X-VIWE
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-semibold leading-none">
                CYBER
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 leading-none mt-1">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>sudda.store:7575</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-emerald-400">{isLive ? 'Online' : 'Standby'}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs: Cyber-themed segmented buttons */}
        <nav className="flex items-center gap-1 bg-[#060a14] p-1 rounded-xl border border-slate-800/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`btn-real px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                  isActive
                    ? 'btn-real-cyber text-cyan-300 border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.35),inset_0_1px_0_rgba(255,255,255,0.15)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60 font-mono'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 mr-2 transition-transform ${isActive ? 'text-cyan-400 scale-110' : 'text-slate-400'}`} />
                <span className="hidden md:inline font-mono">{tab.label}</span>
                <span className="inline md:hidden font-mono">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSettings}
            title="Cluster & Node Configuration"
            className="btn-real btn-real-secondary p-2.5 rounded-xl text-slate-300 hover:text-cyan-300 border-slate-800"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={onLogout}
            title="Disconnect Cyber Gateway"
            className="btn-real btn-real-danger p-2.5 rounded-xl"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
