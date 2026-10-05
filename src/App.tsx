import { useState, useEffect } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { DashboardTab } from './components/DashboardTab';
import { ServerMonitorTab } from './components/ServerMonitorTab';
import { SubscriptionTab } from './components/SubscriptionTab';
import { BotSessionTab } from './components/BotSessionTab';
import { LoginModal } from './components/LoginModal';
import { SettingsModal } from './components/SettingsModal';
import { api } from './services/api';
import { Inbound, ServerStatus } from './types';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('xview_auth_token'));
  });
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [inbounds, setInbounds] = useState<Inbound[]>([]);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState(false);

  const loadAllData = async () => {
    try {
      const [statusRes, inboundsRes] = await Promise.all([
        api.getServerStatus(),
        api.getInbounds(),
      ]);

      if (statusRes.success && statusRes.data) {
        setServerStatus(statusRes.data);
      }

      if (inboundsRes.success && inboundsRes.inbounds) {
        setInbounds(inboundsRes.inbounds);
      }

      setIsLive(Boolean(statusRes?.isLive || inboundsRes?.isLive));
    } catch (e) {
      console.error('Error fetching cluster data', e);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
      const interval = setInterval(loadAllData, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('xview_auth_token');
    localStorage.removeItem('xview_auth_user');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginModal onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#050811] cyber-grid-bg text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* Top Bar Contract adhering navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setShowSettings(true)}
        onLogout={handleLogout}
        isLive={isLive}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
        {activeTab === 'dashboard' && (
          <DashboardTab
            serverStatus={serverStatus}
            inbounds={inbounds}
            onRefresh={loadAllData}
            onNavigateToSubscription={() => setActiveTab('subscription')}
          />
        )}

        {activeTab === 'server-monitor' && (
          <ServerMonitorTab
            initialStatus={serverStatus}
            isLive={isLive}
          />
        )}

        {activeTab === 'subscription' && (
          <SubscriptionTab
            inbounds={inbounds}
            onRefresh={loadAllData}
          />
        )}

        {activeTab === 'bot-session' && (
          <BotSessionTab
            onRefresh={loadAllData}
          />
        )}
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onConfigSaved={loadAllData}
        />
      )}

      {/* Quiet Footer */}
      <footer className="border-t border-cyan-500/10 py-6 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>X-VIWE CYBER COMMAND · 3x-UI & Cloudflare Edge Controller</span>
          </span>
          <span className="text-slate-400">Gateway: sudda.store:7575/yhSuh09ZWZ0RTNT</span>
        </div>
      </footer>
    </div>
  );
}
