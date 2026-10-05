import { useState, useEffect } from 'react';
import { X, Save, Server, Bot, Key, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { AppConfig } from '../types';

interface Props {
  onClose: () => void;
  onConfigSaved: () => void;
}

export function SettingsModal({ onClose, onConfigSaved }: Props) {
  const [panelUrl, setPanelUrl] = useState('https://sudda.store:7575/yhSuh09ZWZ0RTNT');
  const [panelUser, setPanelUser] = useState('sudhbuYH45u');
  const [panelPass, setPanelPass] = useState('sudhbuYH45u');
  const [botToken, setBotToken] = useState('8861055380:AAHr5xwb2vandKcCH05IGFtaEN2wGmpTFec');
  const [adminChatId, setAdminChatId] = useState('5966867969');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    api.getConfig().then((res) => {
      if (res.success) {
        if (res.panelUrl) setPanelUrl(res.panelUrl);
        if (res.panelUser) setPanelUser(res.panelUser);
        if (res.adminChatId) setAdminChatId(res.adminChatId);
      }
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const res = await api.updateConfig({
        panelUrl,
        panelUser,
        panelPass,
        botToken,
        adminChatId,
      });
      if (res.success) {
        setMsg({ text: 'Configuration saved & session re-initialized', type: 'success' });
        onConfigSaved();
        setTimeout(onClose, 1200);
      } else {
        setMsg({ text: res.message || 'Failed to update configuration', type: 'error' });
      }
    } catch (e: any) {
      setMsg({ text: 'Network request error', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-[#0d131f] border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Cluster & API Settings</h3>
              <p className="text-xs text-slate-400">Manage 3x-UI backend endpoint & Telegram Bot secrets</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {msg && (
          <div
            className={`mt-4 p-3 rounded-lg text-xs flex items-center gap-2 ${
              msg.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
            }`}
          >
            {msg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{msg.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              3x-UI Panel URL (including path token)
            </label>
            <input
              type="text"
              value={panelUrl}
              onChange={(e) => setPanelUrl(e.target.value)}
              className="w-full bg-[#080c14] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Panel Username
              </label>
              <input
                type="text"
                value={panelUser}
                onChange={(e) => setPanelUser(e.target.value)}
                autoComplete="off"
                className="w-full bg-[#080c14] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Panel Password
              </label>
              <input
                type="password"
                value={panelPass}
                onChange={(e) => setPanelPass(e.target.value)}
                autoComplete="new-password"
                className="w-full bg-[#080c14] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 mb-3">
              <Bot className="w-4 h-4" />
              <span>Telegram Bot Runtime Secrets</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Telegram Bot Token
                </label>
                <input
                  type="text"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  className="w-full bg-[#080c14] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Admin Telegram Chat ID
                </label>
                <input
                  type="text"
                  value={adminChatId}
                  onChange={(e) => setAdminChatId(e.target.value)}
                  className="w-full bg-[#080c14] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="btn-real btn-real-secondary px-4 py-2 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-real btn-real-primary px-4 py-2 text-xs font-bold rounded-lg gap-1.5"
            >
              {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save & Reconnect</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
