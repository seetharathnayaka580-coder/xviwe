import { Bot, Database, Gauge, LayoutDashboard, LogOut, Settings, Shield, Wifi } from 'lucide-react';

export type TabType = 'dashboard' | 'server-monitor' | 'subscription' | 'bot-session';

interface Props {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  isLive: boolean;
}

export function Navbar({ activeTab, setActiveTab, onOpenSettings, onLogout, isLive }: Props) {
  // STRICT TAB NAMES AS REQUESTED: Dashboard, Server Monitor, Subscription Services, Bot Session
  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'server-monitor' as TabType, label: 'Server Monitor', icon: Gauge },
    { id: 'subscription' as TabType, label: 'Subscription Services', icon: Database },
    { id: 'bot-session' as TabType, label: 'Bot Session', icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070b16]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.6)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 gap-3">
        {/* Real VPN Badge & Logo - Multi-Color Combined Gradient */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-emerald-400 p-[1px] shadow-[0_0_16px_rgba(59,130,246,0.35)]">
              <div className="w-full h-full rounded-[11px] bg-slate-950 flex items-center justify-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-emerald-500/20" />
                <Shield className="w-5 h-5 text-white drop-shadow-md z-10" />
                <Wifi className="w-3 h-3 text-cyan-300 absolute opacity-80 animate-pulse z-10" />
              </div>
            </div>
            {/* Live Multi-color Beacon */}
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#070b16] shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white font-sans">
                X-VIWE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold tracking-wide bg-gradient-to-r from-blue-500/15 via-purple-500/15 to-emerald-500/15 border border-cyan-500/30 text-cyan-300">
                VPN NETWORK
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mt-0.5">
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {isLive ? 'Tunnel Active' : 'Standby Node'}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-cyan-300 font-medium">sudda.store:7575</span>
            </div>
          </div>
        </div>

        {/* Real VPN Navigation Tabs - Strict Tab Names */}
        <nav className="flex items-center gap-1 bg-[#060a14] p-1 rounded-xl border border-slate-800/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`btn-real px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-[0_2px_12px_rgba(37,99,235,0.4)] border border-cyan-400/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 mr-2 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Multi-Color Combined Live Status Strip & Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Multi-Color Node Tag */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Reality
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-blue-400 font-medium">TLS 1.3</span>
            <span className="text-slate-700">|</span>
            <span className="text-purple-400 font-medium">BBR</span>
          </div>

          <button
            onClick={onOpenSettings}
            title="Cluster & Node Settings"
            className="btn-real btn-real-secondary p-2.5 rounded-xl text-slate-300 hover:text-white hover:border-cyan-500/40"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={onLogout}
            title="Disconnect VPN Session"
            className="btn-real btn-real-danger p-2.5 rounded-xl"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
