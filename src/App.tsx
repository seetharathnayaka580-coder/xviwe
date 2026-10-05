import { useState, useEffect } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { DashboardTab } from './components/DashboardTab';
import { ServerMonitorTab } from './components/ServerMonitorTab';
import { SubscriptionTab } from './components/SubscriptionTab';
import { BotSessionTab } from './components/BotSessionTab';
import { LoginModal } from './components/LoginModal';
import { SettingsModal } from './components/SettingsModal';
import { LiveNetworkCanvas } from './components/LiveNetworkCanvas';
import { api } from './services/api';
import { Inbound, ServerStatus } from './types';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('xview_auth_token'));
  });
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [inbounds, setInbounds] = useState<Inbound[]>([]);
  const [onlineClients, setOnlineClients] = useState<string[]>([]);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState(false);

  const loadAllData = async () => {
    try {
      const [statusRes, inboundsRes, onlinesRes] = await Promise.all([
        api.getServerStatus(),
        api.getInbounds(),
        api.getOnlineClients(),
      ]);

      if (statusRes.success && statusRes.data) {
        setServerStatus(statusRes.data);
      }

      if (inboundsRes.success && inboundsRes.inbounds) {
        setInbounds(inboundsRes.inbounds);
      }

      if (onlinesRes.success && Array.isArray(onlinesRes.onlines)) {
        setOnlineClients(onlinesRes.onlines);
      }

      setIsLive(Boolean(statusRes?.isLive || inboundsRes?.isLive || onlinesRes?.isLive));
    } catch (e) {
      console.error('Error fetching cluster data', e);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
      // Fast 3-second interval for genuine real-time telemetry updates
      const interval = setInterval(loadAllData, 3000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('xview_auth_token');
    localStorage.removeItem('xview_auth_user');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-[#070b16] text-slate-100 flex flex-col justify-center items-center overflow-hidden">
        {/* All Colors Combined Live Animated Canvas */}
        <LiveNetworkCanvas />
        <LoginModal onSuccess={() => setIsAuthenticated(true)} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#070b16] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* All Colors Combined Live Animated Canvas Background */}
      <LiveNetworkCanvas />

      {/* Top Bar Contract adhering navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setShowSettings(true)}
        onLogout={handleLogout}
        isLive={isLive}
      />

      {/* Main Viewport Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
        {activeTab === 'dashboard' && (
          <DashboardTab
            serverStatus={serverStatus}
            inbounds={inbounds}
            onlineClientsList={onlineClients}
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
            onlineClientsList={onlineClients}
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
      <footer className="relative z-10 border-t border-slate-800/80 py-6 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent font-bold">
              X-VIWE · VPN Network Controller
            </span>
          </span>
          <span className="text-slate-400">Gateway: sudda.store:7575/yhSuh09ZWZ0RTNT</span>
        </div>
      </footer>
    </div>
  );
}
