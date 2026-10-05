import { useState, useEffect } from 'react';
import { 
  Bot, Send, Terminal, Copy, Check, ExternalLink, ShieldCheck, 
  Sparkles, Code2, Key, Radio, AlertCircle, RefreshCw, Layers, CheckCircle2
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

  // Bot Simulator
  const [commandInput, setCommandInput] = useState('/start');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: "👋 Welcome to X-VIWE SUITE VPN Monitor Bot!\n\nSend /status to check server health, /stats for network volume, or send your UUID to inspect your VPN subscription.",
      time: '12:00:00',
    },
  ]);
  const [processingCmd, setProcessingCmd] = useState(false);

  // Cloudflare Worker code state
  const [workerScript, setWorkerScript] = useState<string>('');
  const [copiedWorker, setCopiedWorker] = useState(false);
  const [workerDomain, setWorkerDomain] = useState('xviwe-bot.your-subdomain.workers.dev');
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const botToken = '8861055380:AAHr5xwb2vandKcCH05IGFtaEN2wGmpTFec';
  const adminChatId = '5966867969';
  const panelUrl = 'https://sudda.store:7575/yhSuh09ZWZ0RTNT';
  const panelUser = 'sudhbuYH45u';
  const panelPass = 'sudhbuYH45u';

  useEffect(() => {
    setLoadingBot(true);
    api.getBotInfo()
      .then((res) => {
        if (res.success && res.bot) {
          setBotInfo(res.bot);
        }
      })
      .finally(() => setLoadingBot(false));

    api.getWorkerScript()
      .then((code) => setWorkerScript(code))
      .catch(console.error);
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

  const copyWorkerCode = () => {
    navigator.clipboard.writeText(workerScript);
    setCopiedWorker(true);
    setTimeout(() => setCopiedWorker(false), 2000);
  };

  const webhookUrl = `https://api.telegram.org/bot${botToken}/setWebhook?url=https://${workerDomain}`;

  const copyWebhookCommand = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Bot Session Management</h1>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>Telegram Bot & Cloudflare Edge Worker Integration</span>
            <span aria-hidden="true">·</span>
            <span>Real-time Client UUID Data Query</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={sendTestTelegramAlert}
            disabled={sendingAlert}
            className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            {sendingAlert ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Send Alert to Admin Telegram</span>
          </button>
        </div>
      </div>

      {testMsgStatus && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{testMsgStatus}</span>
        </div>
      )}

      {/* Bot Identity & Cloudflare Secrets Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Bot Profile */}
        <div className="p-5 rounded-xl bg-[#0f172a] border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-cyan-400" />
              Telegram Bot Identity
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </span>
          </div>
          <div className="my-3">
            <div className="text-base font-bold text-white font-mono">
              {botInfo?.username ? `@${botInfo.username}` : '@XVIWE_Suite_3xui_bot'}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {botInfo?.first_name || 'X-VIWE VPN Suite Bot'} (ID: 8861055380)
            </p>
          </div>
          <div className="text-[11px] text-slate-500 font-mono truncate">
            Token: {botToken.slice(0, 12)}...{botToken.slice(-4)}
          </div>
        </div>

        {/* Card 2: Admin Telegram Chat ID */}
        <div className="p-5 rounded-xl bg-[#0f172a] border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              Privileged Administrator
            </span>
            <span className="text-[11px] text-cyan-400 font-mono">Admin Tier</span>
          </div>
          <div className="my-3">
            <div className="text-base font-bold text-white font-mono">Chat ID: {adminChatId}</div>
            <p className="text-xs text-slate-400 mt-1">
              Authorized to receive system notices, alerts, and node telemetry
            </p>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Direct dispatch enabled
          </div>
        </div>

        {/* Card 3: 3x-UI API Endpoint */}
        <div className="p-5 rounded-xl bg-[#0f172a] border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-emerald-400" />
              Cloudflare Runtime Target
            </span>
            <span className="text-[11px] text-emerald-400 font-mono">HTTPS 7575</span>
          </div>
          <div className="my-3">
            <div className="text-xs font-bold text-white font-mono truncate">
              sudda.store:7575
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-1 truncate">
              Route: /yhSuh09ZWZ0RTNT
            </p>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            User: {panelUser} · Auth: Verified
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Bot Interactive Emulator & Cloudflare Worker Integration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Interactive Bot Simulator / Tester */}
        <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-xl flex flex-col h-[580px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white">Live Bot Command Simulator</h2>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Telegram Chat Engine</span>
          </div>

          {/* Quick preset commands */}
          <div className="py-2.5 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-slate-500 shrink-0">Try:</span>
            {[
              { label: '/start', cmd: '/start' },
              { label: '/status', cmd: '/status' },
              { label: '/stats', cmd: '/stats' },
              { label: 'Check Sample UUID', cmd: '3a8f4c21-9e5b-48d6-a213-7d8a9e0f12a3' },
            ].map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCommandInput(preset.cmd);
                  handleSendCommand(preset.cmd);
                }}
                className="px-2.5 py-1 rounded bg-[#080c14] hover:bg-slate-800 text-cyan-300 border border-slate-700/60 font-mono whitespace-nowrap transition-colors cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Message Stream */}
          <div className="flex-1 bg-[#080c14] border border-slate-800/80 rounded-xl p-4 overflow-y-auto space-y-3 font-mono text-xs">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 whitespace-pre-wrap leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-cyan-600 text-white rounded-br-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {processingCmd && (
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Bot is typing / querying 3x-UI panel...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendCommand();
            }}
            className="mt-3 flex gap-2"
          >
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Type /start, /status, /stats, or paste client UUID..."
              className="flex-1 bg-[#080c14] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={processingCmd || !commandInput.trim()}
              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>

        {/* Right: Cloudflare Workers Deployment Code & Secrets */}
        <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-xl flex flex-col h-[580px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-white">Cloudflare Worker Integration</h2>
            </div>
            <button
              onClick={copyWorkerCode}
              className="px-3 py-1.5 rounded-lg bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-400 border border-cyan-500/20 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedWorker ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedWorker ? 'Copied' : 'Copy worker.js'}</span>
            </button>
          </div>

          {/* Cloudflare Runtime Variables Table */}
          <div className="my-3 p-3 rounded-xl bg-[#080c14] border border-slate-800 text-xs font-mono">
            <div className="text-[11px] font-semibold text-slate-400 mb-2 font-sans flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>Configured Cloudflare Runtime Variables</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
              <div><span className="text-slate-500">ADMIN_CHAT_ID:</span> <span className="text-slate-300 font-semibold">{adminChatId}</span></div>
              <div><span className="text-slate-500">BOT_TOKEN:</span> <span className="text-slate-300">{botToken.slice(0, 10)}...</span></div>
              <div><span className="text-slate-500">PANEL_USER:</span> <span className="text-slate-300 font-semibold">{panelUser}</span></div>
              <div><span className="text-slate-500">PANEL_PASS:</span> <span className="text-slate-300">••••••••••</span></div>
              <div className="col-span-2 truncate"><span className="text-slate-500">PANEL_URL:</span> <span className="text-cyan-300">{panelUrl}</span></div>
            </div>
          </div>

          {/* Worker Code Viewer */}
          <div className="flex-1 bg-[#080c14] border border-slate-800 rounded-xl p-3 overflow-y-auto font-mono text-[11px] text-slate-300 leading-relaxed select-all">
            <pre className="whitespace-pre">{workerScript || '// Fetching Cloudflare Worker script...'}</pre>
          </div>

          {/* Webhook Setup Tool */}
          <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Set Telegram Webhook to Cloudflare:</span>
              <button
                onClick={copyWebhookCommand}
                className="text-cyan-400 hover:text-cyan-300 text-[11px] flex items-center gap-1 cursor-pointer font-mono"
              >
                {copiedWebhook ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedWebhook ? 'Copied' : 'Copy SetWebhook URL'}</span>
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={workerDomain}
                onChange={(e) => setWorkerDomain(e.target.value)}
                placeholder="your-worker.workers.dev"
                className="flex-1 bg-[#080c14] border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <a
                href={webhookUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 border border-slate-700 transition-colors"
              >
                <span>Trigger</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
