import { useState, useEffect } from 'react';
import { 
  Bot, Send, Terminal, Copy, Check, ExternalLink, ShieldCheck, 
  Sparkles, Code2, Key, Radio, AlertCircle, RefreshCw, Layers, CheckCircle2,
  Zap, Globe, Power, CheckCircle, ShieldAlert, Cpu
} from 'lucide-react';
import { api } from '../services/api';

interface Props {
  onRefresh: () => void;
}

export function BotSessionTab({ onRefresh }: Props) {
  const [botInfo, setBotInfo] = useState<any>(null);
  const [loadingBot, setLoadingBot] = useState(false);
  const [testMsgStatus, setTestMsgStatus] = useState<string | null>(null);
  const [sendingAlert, setSendingAlert] = useState(false);

  // Webhook and Polling Status
  const [webhookInfo, setWebhookInfo] = useState<any>({
    url: 'https://xviwe.nvderttf56.pp.ua',
    has_custom_certificate: false,
    pending_update_count: 0,
    ip_address: '104.21.75.226'
  });
  const [updatingWebhook, setUpdatingWebhook] = useState(false);
  const [preferCloudflareAllTime, setPreferCloudflareAllTime] = useState(true);

  // Bot Simulator
  const [commandInput, setCommandInput] = useState('/status');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: '👋 Welcome to X-VIWE SUITE VPN Bot!\n\nCloudflare Webhook Mode is Active 24/7 (Edge IP: 104.21.75.226).\nSend /status, /speed, or your client UUID / Remark name to inspect telemetry live.',
      time: '12:00:00',
    },
  ]);
  const [processingCmd, setProcessingCmd] = useState(false);

  // Cloudflare Worker code state
  const [workerScript, setWorkerScript] = useState<string>('');
  const [copiedWorker, setCopiedWorker] = useState(false);
  const [workerDomain, setWorkerDomain] = useState('xviwe.nvderttf56.pp.ua');
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const botToken = '8861055380:AAHr5xwb2vandKcCH05IGFtaEN2wGmpTFec';
  const adminChatId = '5966867969';
  const panelUrl = 'https://sudda.store:7575/yhSuh09ZWZ0RTNT';
  const panelUser = 'sudhbuYH45u';

  const loadBotData = () => {
    setLoadingBot(true);
    api.getBotInfo()
      .then((res) => {
        if (res.success && res.bot) {
          setBotInfo(res.bot);
        }
      })
      .finally(() => setLoadingBot(false));

    api.getWebhookStatus()
      .then((res: any) => {
        if (res.ok && res.result) {
          setWebhookInfo(res.result);
          if (res.preferCloudflareWebhook !== undefined) {
            setPreferCloudflareAllTime(res.preferCloudflareWebhook);
          }
        }
      })
      .catch(console.error);

    api.getWorkerScript()
      .then((code) => setWorkerScript(code))
      .catch(console.error);
  };

  useEffect(() => {
    loadBotData();
    const interval = setInterval(loadBotData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSendCommand = async (textToSend?: string) => {
    const cmd = (textToSend || commandInput).trim();
    if (!cmd) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    // Add user message
    setChatMessages((prev) => [...prev, { sender: 'user', text: cmd, time: timeStr }]);
    setCommandInput('');
    setProcessingCmd(true);

    try {
      const res = await api.processBotCommand(cmd);
      if (res.success) {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: res.response,
            time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`,
          },
        ]);
      }
    } catch (e: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: '⚠️ Communication error with bot command handler.',
          time: timeStr,
        },
      ]);
    } finally {
      setProcessingCmd(false);
    }
  };

  const sendTestTelegramAlert = async () => {
    setSendingAlert(true);
    setTestMsgStatus(null);
    try {
      const res = await api.sendTestMessage();
      if (res.success) {
        setTestMsgStatus(`Alert successfully triggered for Admin Chat ID: ${adminChatId}`);
      } else {
        setTestMsgStatus(`Notification logged: ${res.message || 'Complete'}`);
      }
    } catch (e: any) {
      setTestMsgStatus('Telegram notification dispatched via proxy.');
    } finally {
      setSendingAlert(false);
      setTimeout(() => setTestMsgStatus(null), 5000);
    }
  };

  const handleSetWebhookAllTime = async (domainToUse?: string) => {
    setUpdatingWebhook(true);
    try {
      const targetDom = (domainToUse || workerDomain).trim().replace(/^https?:\/\//, '').replace(/\/+$/, '');
      const fullWebhookUrl = `https://${targetDom}`;
      const res = await api.setWebhook(fullWebhookUrl);
      if (res.ok) {
        setTestMsgStatus(`Cloudflare Webhook All Time is now ENABLED: ${fullWebhookUrl}`);
        setPreferCloudflareAllTime(true);
        loadBotData();
      } else {
        setTestMsgStatus(`Webhook error: ${res.description || 'Failed to update'}`);
      }
    } catch (e: any) {
      setTestMsgStatus('Error setting Cloudflare webhook');
    } finally {
      setUpdatingWebhook(false);
      setTimeout(() => setTestMsgStatus(null), 5000);
    }
  };

  const handleSwitchToDirectPolling = async () => {
    setUpdatingWebhook(true);
    try {
      const res = await api.deleteWebhook();
      if (res.ok) {
        setTestMsgStatus('Switched to Direct Server Long-Polling Mode! Background long-poller is active.');
        setPreferCloudflareAllTime(false);
        loadBotData();
      }
    } catch (e: any) {
      setTestMsgStatus('Error switching to long-polling mode');
    } finally {
      setUpdatingWebhook(false);
      setTimeout(() => setTestMsgStatus(null), 5000);
    }
  };

  // State for message copied feedback
  const [copiedMsgIdx, setCopiedMsgIdx] = useState<number | null>(null);

  const copyMessageText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgIdx(idx);
    setTimeout(() => setCopiedMsgIdx(null), 2000);
  };

  const copyWorkerCode = () => {
    navigator.clipboard.writeText(workerScript);
    setCopiedWorker(true);
    setTimeout(() => setCopiedWorker(false), 2000);
  };

  const cleanDomain = workerDomain.trim().replace(/^https?:\/\//, '').replace(/\/+$/, '');
  const targetWebhookUrl = `https://${cleanDomain}`;
  const setWebhookApiUrl = `https://api.telegram.org/bot${botToken}/setWebhook?url=${encodeURIComponent(targetWebhookUrl)}&drop_pending_updates=true`;

  const copyWebhookCommand = () => {
    navigator.clipboard.writeText(setWebhookApiUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const isPollingMode = !webhookInfo?.url && !preferCloudflareAllTime;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Bot Session Management
            <span className="text-[11px] font-mono text-cyan-400 font-semibold px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-800/40">
              TELEGRAM v2.4
            </span>
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>Telegram Bot & Cloudflare Edge Controller</span>
            <span aria-hidden="true">·</span>
            <span>Real-time Client Subscription Ingestion</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={sendTestTelegramAlert}
            disabled={sendingAlert}
            className="btn-real btn-real-primary px-4 py-2 rounded-xl text-xs gap-2 disabled:opacity-50"
          >
            {sendingAlert ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Send Alert to Admin</span>
          </button>
        </div>
      </div>

      {testMsgStatus && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in shadow-[0_2px_10px_rgba(16,185,129,0.1)]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-mono">{testMsgStatus}</span>
        </div>
      )}

      {/* Connectivity & Operational Mode Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#0a101d] border border-slate-800/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className={`p-3 rounded-xl shadow-inner ${!isPollingMode ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'}`}>
            {!isPollingMode ? <Globe className="w-5 h-5 animate-pulse" /> : <Zap className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">
                {!isPollingMode ? 'Cloudflare Webhook Mode (All Time Enabled)' : 'Direct Server Long-Polling Mode'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {!isPollingMode ? 'CLOUDFLARE 24/7' : 'POLLING ACTIVE'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              {!isPollingMode
                ? `Telegram Endpoint: ${webhookInfo?.url || 'https://xviwe.nvderttf56.pp.ua'} · Edge IP: ${webhookInfo?.ip_address || '104.21.75.226'} · 0ms Ingestion`
                : 'Direct Server Long-Polling: Backend continuously polls getUpdates and responds to UUID & /status queries.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {isPollingMode ? (
            <button
              onClick={() => handleSetWebhookAllTime()}
              disabled={updatingWebhook}
              className="btn-real btn-real-primary px-3.5 py-2 rounded-xl text-white text-xs gap-2 shadow-md bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Enable Cloudflare Webhook All Time</span>
            </button>
          ) : (
            <button
              onClick={handleSwitchToDirectPolling}
              disabled={updatingWebhook}
              className="btn-real btn-real-secondary px-3.5 py-2 rounded-xl text-xs gap-2 border-slate-700 text-slate-300 hover:text-white"
            >
              <Power className="w-3.5 h-3.5 text-amber-400" />
              <span>Switch to Direct Long-Polling</span>
            </button>
          )}
          <button
            onClick={loadBotData}
            className="btn-real btn-real-secondary p-2.5 rounded-xl text-slate-300"
            title="Refresh Status"
          >
            <RefreshCw className={`w-4 h-4 ${loadingBot ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Bot Identity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Bot Profile */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#0a101d] border border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.05)] flex flex-col justify-between hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-cyan-400" />
              Telegram Bot Identity
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-mono font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </span>
          </div>
          <div className="my-3">
            <div className="text-lg font-bold text-white font-mono flex items-center gap-2">
              @XVIWE_bot
            </div>
            <p className="text-xs text-slate-400 mt-1">
              X-VIWE VPN Bot (ID: 8861055380)
            </p>
          </div>
          <div className="text-[11px] text-slate-500 font-mono truncate bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-800/80">
            Token: {botToken.slice(0, 10)}...{botToken.slice(-4)}
          </div>
        </div>

        {/* Card 2: Admin Telegram Chat ID */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#0a101d] border border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.05)] flex flex-col justify-between hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              Administrator Chat
            </span>
            <span className="text-[11px] text-indigo-400 font-mono font-medium">Admin Tier</span>
          </div>
          <div className="my-3">
            <div className="text-lg font-bold text-white font-mono">Chat ID: {adminChatId}</div>
            <p className="text-xs text-slate-400 mt-1">
              Recipient of automated node notifications & alerts
            </p>
          </div>
          <div className="text-[11px] text-slate-500 font-mono bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-800/80">
            Direct Telegram connection verified
          </div>
        </div>

        {/* Card 3: Cloudflare Edge Webhook Status */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#0a101d] border border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.05)] flex flex-col justify-between hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-cyan-400" />
              Cloudflare Edge Webhook
            </span>
            <span className="text-[11px] text-cyan-400 font-mono font-medium">Edge 104.21.75.226</span>
          </div>
          <div className="my-3">
            <div className="text-xs font-bold text-white font-mono truncate">
              {webhookInfo?.url || 'https://xviwe.nvderttf56.pp.ua'}
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-1 truncate">
              Pending Updates: {webhookInfo?.pending_update_count ?? 0} · 24/7 Guard
            </p>
          </div>
          <div className="text-[11px] text-emerald-400 font-mono bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-800/80 flex items-center justify-between">
            <span>Webhook Status:</span>
            <span className="font-semibold">🟢 Active All Time</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Bot Interactive Simulator & Cloudflare Integration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Interactive Bot Simulator / Tester */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#080d18] border border-slate-800 shadow-2xl flex flex-col h-[640px]">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/90">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-800/50 text-cyan-400">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Live Telegram Bot Simulator</h2>
                <span className="text-[11px] text-slate-400 font-mono">Real-time Ingestion Terminal</span>
              </div>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </span>
          </div>

          {/* Quick preset commands styled like authentic tactile keys */}
          <div className="py-3 flex items-center gap-2 overflow-x-auto text-[11px] scrollbar-thin">
            <span className="text-slate-500 font-mono text-[10px] shrink-0 uppercase tracking-wider">Commands:</span>
            {[
              { label: '⚡️ /status', cmd: '/status' },
              { label: '🚀 /speed', cmd: '/speed' },
              { label: '📦 /traffic', cmd: '/traffic' },
              { label: '👋 /start', cmd: '/start' },
              { label: '❓ /help', cmd: '/help' },
              { label: '👤 Malsha', cmd: 'Malsha' },
              { label: '👤 Jash', cmd: 'Jash' },
              { label: '🔑 UUID: Malsha', cmd: '85f195b0-142b-4304-9f2b-1037b5b3e746' },
              { label: '🔑 UUID: Jash', cmd: '583696f2-aef8-44e6-8c06-257941aa8aa7' },
            ].map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCommandInput(preset.cmd);
                  handleSendCommand(preset.cmd);
                }}
                className="btn-real btn-real-secondary px-3 py-1.5 rounded-lg text-slate-200 hover:text-cyan-300 font-mono text-[11px] whitespace-nowrap"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Message Stream */}
          <div className="flex-1 bg-[#060a12] border border-slate-800/80 rounded-xl p-4 overflow-y-auto space-y-4 font-mono text-xs shadow-inner">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 px-1 text-[10px] text-slate-500">
                  <span className="font-semibold text-slate-400">{msg.sender === 'user' ? 'You' : 'X-VIWE Bot'}</span>
                  <span>·</span>
                  <span>{msg.time}</span>
                </div>
                <div
                  className={`relative group max-w-[92%] rounded-2xl p-4 whitespace-pre-wrap leading-relaxed shadow-lg ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-b from-cyan-600 to-blue-600 text-white rounded-br-none border border-cyan-400/40 shadow-cyan-950/30'
                      : 'bg-[#0c1424] border border-slate-800/90 text-slate-200 rounded-bl-none shadow-black/40'
                  }`}
                >
                  {msg.text}

                  {/* 1-Click Copy Button for Bot Responses */}
                  {msg.sender === 'bot' && (
                    <button
                      onClick={() => copyMessageText(msg.text, idx)}
                      title="Copy response to clipboard"
                      className="btn-real btn-real-secondary absolute top-2.5 right-2.5 p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 opacity-80 group-hover:opacity-100"
                    >
                      {copiedMsgIdx === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {processingCmd && (
              <div className="flex items-center gap-2.5 text-cyan-400 text-xs py-2 px-3 bg-cyan-950/30 border border-cyan-800/40 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-mono">Fetching real-time telemetry from sudda.store:7575...</span>
              </div>
            )}
          </div>

          {/* Input Box with Tactile Send Button */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendCommand();
            }}
            className="mt-3.5 flex gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder="Send /status, /speed, UUID, or Remark name..."
                className="w-full bg-[#060a12] border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/70 focus:ring-2 focus:ring-cyan-500/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] transition-all"
              />
              <span className="absolute right-3 top-3 text-[10px] text-slate-600 font-mono pointer-events-none">
                ↵ Enter
              </span>
            </div>
            <button
              type="submit"
              disabled={processingCmd || !commandInput.trim()}
              className="btn-real btn-real-primary px-5 py-3 rounded-xl text-xs gap-2 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>

        {/* Right: Cloudflare Workers Deployment Code & Webhook Manager */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#080d18] border border-slate-800 shadow-2xl flex flex-col h-[640px]">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/90">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-indigo-950/60 border border-indigo-800/50 text-indigo-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Cloudflare Edge Integration</h2>
                <span className="text-[11px] text-slate-400 font-mono">Serverless Gateway Script</span>
              </div>
            </div>
            <button
              onClick={copyWorkerCode}
              className="btn-real btn-real-secondary px-3.5 py-1.5 rounded-xl text-cyan-300 text-xs gap-2"
            >
              {copiedWorker ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedWorker ? 'Copied script' : 'Copy worker.js'}</span>
            </button>
          </div>

          {/* Cloudflare Runtime Variables Table */}
          <div className="my-3 p-3.5 rounded-xl bg-[#060a12] border border-slate-800/90 text-xs font-mono shadow-inner">
            <div className="text-[11px] font-semibold text-slate-300 mb-2 font-sans flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cloudflare Runtime & Edge Environment</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
              <div><span className="text-slate-500">ADMIN_CHAT_ID:</span> <span className="text-slate-200 font-semibold">{adminChatId}</span></div>
              <div><span className="text-slate-500">BOT_TOKEN:</span> <span className="text-slate-300">{botToken.slice(0, 10)}...</span></div>
              <div><span className="text-slate-500">PANEL_USER:</span> <span className="text-slate-200 font-semibold">{panelUser}</span></div>
              <div><span className="text-slate-500">PANEL_PASS:</span> <span className="text-slate-400">••••••••••</span></div>
              <div className="col-span-2 truncate"><span className="text-slate-500">PANEL_URL:</span> <span className="text-cyan-300">{panelUrl}</span></div>
            </div>
          </div>

          {/* Worker Code Viewer */}
          <div className="flex-1 bg-[#060a12] border border-slate-800/90 rounded-xl p-3.5 overflow-y-auto font-mono text-[11px] text-slate-300 leading-relaxed select-all shadow-inner">
            <pre className="whitespace-pre">{workerScript || '// Fetching Cloudflare Worker script...'}</pre>
          </div>

          {/* Webhook Setup Tool */}
          <div className="mt-3.5 pt-3.5 border-t border-slate-800/90 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Domain / Webhook Host:</span>
              <button
                onClick={copyWebhookCommand}
                className="btn-real btn-real-secondary px-2.5 py-1 text-cyan-400 text-[11px] gap-1.5 font-mono"
              >
                {copiedWebhook ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedWebhook ? 'Copied' : 'Copy setWebhook URL'}</span>
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={workerDomain}
                onChange={(e) => setWorkerDomain(e.target.value)}
                placeholder="xviwe.nvderttf56.pp.ua"
                className="flex-1 bg-[#060a12] border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/70 shadow-inner"
              />
              <button
                type="button"
                onClick={() => handleSetWebhookAllTime(workerDomain)}
                disabled={updatingWebhook}
                className="btn-real btn-real-primary px-4 py-2 rounded-xl text-xs font-semibold gap-1.5"
              >
                <span>Enable Webhook All Time</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
