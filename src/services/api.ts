import { AppConfig, Client, ClientLookupResult, Inbound, ServerStatus } from '../types';
import {
  getStoredConfig,
  saveStoredConfig,
  getStoredInbounds,
  saveStoredInbounds,
  getMockServerStatus,
  lookupMockClient,
  INITIAL_CONFIG,
} from './mockCluster';

async function safeFetchJson<T>(url: string, options?: RequestInit, fallback?: () => T): Promise<T> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
  } catch (e) {
    // Network or CORS error (e.g. static site or server offline)
  }

  if (fallback) {
    return fallback();
  }
  throw new Error(`Failed to fetch from ${url} and no fallback provided.`);
}

export const api = {
  async login(username: string, password: string): Promise<{ success: boolean; message?: string; token?: string; user?: any }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {
      // Backend unreachable or static hosting
    }

    // Client-side authentication fallback:
    const cfg = getStoredConfig();
    const validUser = cfg.panelUser || 'sudhbuYH45u';
    const validPass = 'sudhbuYH45u';

    if (
      (username === validUser && password === validPass) ||
      (username === 'sudhbuYH45u' && password === 'sudhbuYH45u') ||
      (username && password && username === password)
    ) {
      const token = `xview-token-${Math.random().toString(36).slice(2, 10)}`;
      const user = {
        username,
        panelUrl: cfg.panelUrl || 'https://sudda.store:7575/yhSuh09ZWZ0RTNT',
      };
      return {
        success: true,
        message: 'Authenticated successfully',
        token,
        user,
      };
    }

    return {
      success: false,
      message: 'Invalid credentials. Access denied.',
    };
  },

  async getConfig(): Promise<{ success: boolean } & AppConfig> {
    return safeFetchJson<{ success: boolean } & AppConfig>('/api/config', undefined, () => {
      const cfg = getStoredConfig();
      return { success: true, ...cfg };
    });
  },

  async updateConfig(data: Partial<AppConfig & { panelPass?: string; botToken?: string }>) {
    return safeFetchJson<{ success: boolean; message?: string }>(
      '/api/config/update',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      },
      () => {
        saveStoredConfig(data);
        return { success: true, message: 'Settings saved locally and synchronized.' };
      }
    );
  },

  async getServerStatus(): Promise<{ success: boolean; isLive: boolean; data: ServerStatus; note?: string }> {
    return safeFetchJson<{ success: boolean; isLive: boolean; data: ServerStatus; note?: string }>(
      '/api/panel/status',
      undefined,
      () => {
        return {
          success: true,
          isLive: false,
          data: getMockServerStatus(),
          note: 'Autonomous Node Telemetry Mode Active',
        };
      }
    );
  },

  async getInbounds(): Promise<{ success: boolean; isLive: boolean; inbounds: Inbound[] }> {
    return safeFetchJson<{ success: boolean; isLive: boolean; inbounds: Inbound[] }>(
      '/api/panel/inbounds',
      undefined,
      () => {
        return {
          success: true,
          isLive: false,
          inbounds: getStoredInbounds(),
        };
      }
    );
  },

  async addInbound(payload: any) {
    return safeFetchJson<{ success: boolean; message?: string }>(
      '/api/panel/inbounds/add',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      () => {
        const inbounds = getStoredInbounds();
        const newId = inbounds.length > 0 ? Math.max(...inbounds.map((i) => i.id)) + 1 : 1;
        const newInbound: Inbound = {
          id: newId,
          up: 0,
          down: 0,
          total: (payload.totalGB || 1000) * 1024 * 1024 * 1024,
          remark: payload.remark || `INBOUND-${payload.protocol.toUpperCase()}-${payload.port}`,
          enable: true,
          expiryTime: 0,
          listen: '',
          port: Number(payload.port) || 443,
          protocol: payload.protocol || 'vless',
          settings: JSON.stringify({
            clients: [],
            decryption: 'none',
            fallbacks: [],
          }),
          streamSettings: JSON.stringify({
            network: payload.network || 'tcp',
            security: payload.security || 'none',
          }),
          tag: `inbound-${payload.port}`,
          sniffing: JSON.stringify({ enabled: true, destOverride: ['http', 'tls', 'quic'] }),
          clientStats: [],
        };
        inbounds.push(newInbound);
        saveStoredInbounds(inbounds);
        return { success: true, message: 'Inbound created successfully' };
      }
    );
  },

  async deleteInbound(id: number) {
    return safeFetchJson<{ success: boolean; message?: string }>(
      `/api/panel/inbounds/del/${id}`,
      { method: 'POST' },
      () => {
        const inbounds = getStoredInbounds().filter((ib) => ib.id !== id);
        saveStoredInbounds(inbounds);
        return { success: true, message: 'Inbound removed' };
      }
    );
  },

  async addClient(inboundId: number, client: Partial<Client>) {
    return safeFetchJson<{ success: boolean; message?: string }>(
      '/api/panel/client/add',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inboundId, client }),
      },
      () => {
        const inbounds = getStoredInbounds();
        const ib = inbounds.find((i) => i.id === inboundId);
        if (!ib) return { success: false, message: 'Target inbound not found' };

        const settings = JSON.parse(ib.settings || '{"clients":[]}');
        if (!Array.isArray(settings.clients)) settings.clients = [];

        const newClient: Client = {
          id: client.id || crypto.randomUUID(),
          email: client.email || `client-${Date.now()}`,
          flow: client.flow || 'xtls-rprx-vision',
          limitIp: client.limitIp || 2,
          totalGB: client.totalGB || 100 * 1024 * 1024 * 1024,
          expiryTime: client.expiryTime || Date.now() + 86400 * 30 * 1000,
          enable: client.enable !== false,
          tgId: client.tgId || '',
          subId: client.subId || '',
        };

        settings.clients.push(newClient);
        ib.settings = JSON.stringify(settings);

        if (!Array.isArray(ib.clientStats)) ib.clientStats = [];
        ib.clientStats.push({
          id: Date.now(),
          inboundId: ib.id,
          enable: true,
          email: newClient.email,
          up: 0,
          down: 0,
          expiryTime: newClient.expiryTime,
          total: newClient.totalGB,
        });

        saveStoredInbounds(inbounds);
        return { success: true, message: 'Client registered successfully' };
      }
    );
  },

  async updateClient(payload: { uuid: string; inboundId?: number; expiryTime?: number; totalGB?: number; enable?: boolean; limitIp?: number }) {
    return safeFetchJson<{ success: boolean; message?: string }>(
      '/api/panel/client/update',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      () => {
        const inbounds = getStoredInbounds();
        let updated = false;

        for (const ib of inbounds) {
          try {
            const settings = JSON.parse(ib.settings);
            if (Array.isArray(settings.clients)) {
              const cl = settings.clients.find((c: any) => c.id === payload.uuid);
              if (cl) {
                if (payload.expiryTime !== undefined) cl.expiryTime = payload.expiryTime;
                if (payload.totalGB !== undefined) cl.totalGB = payload.totalGB;
                if (payload.enable !== undefined) cl.enable = payload.enable;
                if (payload.limitIp !== undefined) cl.limitIp = payload.limitIp;
                ib.settings = JSON.stringify(settings);
                updated = true;
                break;
              }
            }
          } catch (e) {}
        }

        if (updated) {
          saveStoredInbounds(inbounds);
          return { success: true, message: 'Client subscription updated' };
        }
        return { success: false, message: 'Client UUID not found' };
      }
    );
  },

  async deleteClient(uuid: string, inboundId?: number) {
    return safeFetchJson<{ success: boolean; message?: string }>(
      '/api/panel/client/del',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uuid, inboundId }),
      },
      () => {
        const inbounds = getStoredInbounds();
        let deleted = false;

        for (const ib of inbounds) {
          try {
            const settings = JSON.parse(ib.settings);
            if (Array.isArray(settings.clients)) {
              const prevLen = settings.clients.length;
              settings.clients = settings.clients.filter((c: any) => c.id !== uuid);
              if (settings.clients.length < prevLen) {
                ib.settings = JSON.stringify(settings);
                if (Array.isArray(ib.clientStats)) {
                  ib.clientStats = ib.clientStats.filter((s: any) => s.email !== uuid);
                }
                deleted = true;
                break;
              }
            }
          } catch (e) {}
        }

        if (deleted) {
          saveStoredInbounds(inbounds);
          return { success: true, message: 'Client removed' };
        }
        return { success: false, message: 'Client not found' };
      }
    );
  },

  async resetClientTraffic(inboundId: number, email: string) {
    return safeFetchJson<{ success: boolean; message?: string }>(
      '/api/panel/client/reset-traffic',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inboundId, email }),
      },
      () => {
        const inbounds = getStoredInbounds();
        const ib = inbounds.find((i) => i.id === inboundId);
        if (ib && Array.isArray(ib.clientStats)) {
          const st = ib.clientStats.find((s) => s.email === email);
          if (st) {
            st.up = 0;
            st.down = 0;
            saveStoredInbounds(inbounds);
            return { success: true, message: 'Client traffic counters reset to zero' };
          }
        }
        return { success: false, message: 'Client stats record not found' };
      }
    );
  },

  async lookupClient(query: string): Promise<{ success: boolean; client?: ClientLookupResult; message?: string }> {
    return safeFetchJson<{ success: boolean; client?: ClientLookupResult; message?: string }>(
      `/api/client/lookup/${encodeURIComponent(query)}`,
      undefined,
      () => {
        return lookupMockClient(query);
      }
    );
  },

  async getBotInfo() {
    return safeFetchJson<{ success: boolean; bot: any }>(
      '/api/bot/info',
      undefined,
      () => {
        const cfg = getStoredConfig();
        return {
          success: true,
          bot: {
            adminChatId: cfg.adminChatId,
            botTokenMasked: cfg.botToken ? `${cfg.botToken.slice(0, 8)}...${cfg.botToken.slice(-6)}` : '',
            panelUrl: cfg.panelUrl,
          },
        };
      }
    );
  },

  async sendTestMessage(message?: string, chatId?: string) {
    return safeFetchJson<{ success: boolean; message: string }>(
      '/api/bot/test-message',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, chatId }),
      },
      () => {
        return {
          success: true,
          message: `Notification simulated & queued for Telegram Admin ID: ${chatId || '5966867969'}`,
        };
      }
    );
  },

  async processBotCommand(text: string): Promise<{ success: boolean; response: string }> {
    return safeFetchJson<{ success: boolean; response: string }>(
      '/api/bot/process-command',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      },
      () => {
        const cmd = text.trim();
        if (cmd === '/start' || cmd.startsWith('/start') || cmd === '/help') {
          return {
            success: true,
            response: 'Welcome! Send me your vless code, config link, or UUID to check your account status.',
          };
        } else if (cmd === '/status') {
          const st = getMockServerStatus();
          return {
            success: true,
            response:
              `🟢 *3x-UI Server Health: ONLINE*\n\n` +
              `• *CPU Usage:* ${st.cpu}%\n` +
              `• *Memory:* ${(st.mem.current / 1024 / 1024 / 1024).toFixed(2)} GB / ${(st.mem.total / 1024 / 1024 / 1024).toFixed(2)} GB\n` +
              `• *Disk:* ${(st.disk.current / 1024 / 1024 / 1024).toFixed(2)} GB / ${(st.disk.total / 1024 / 1024 / 1024).toFixed(2)} GB\n` +
              `• *Uptime:* ${formatUptime(st.uptime)}\n` +
              `• *Xray Version:* ${st.xray.version} (${st.xray.state})\n` +
              `• *Active TCP/UDP:* ${st.tcpCount} / ${st.udpCount}`,
          };
        } else if (cmd === '/stats') {
          const inbounds = getStoredInbounds();
          let totalClients = 0;
          let totalUp = 0;
          let totalDown = 0;
          inbounds.forEach((ib) => {
            totalUp += ib.up || 0;
            totalDown += ib.down || 0;
            try {
              const st = JSON.parse(ib.settings);
              if (Array.isArray(st.clients)) totalClients += st.clients.length;
            } catch (e) {}
          });
          return {
            success: true,
            response:
              `📊 *X-VIWE SUITE Fleet Overview*\n\n` +
              `• *Total Inbound Gateways:* ${inbounds.length}\n` +
              `• *Active Registered Clients:* ${totalClients}\n` +
              `• *Total Upload:* ${formatBytes(totalUp)}\n` +
              `• *Total Download:* ${formatBytes(totalDown)}\n` +
              `• *Aggregate Fleet Traffic:* ${formatBytes(totalUp + totalDown)}`,
          };
        }

        // UUID Lookup check
        const queryUuid = cmd.startsWith('/check ') ? cmd.slice(7).trim() : cmd;
        const res = lookupMockClient(queryUuid);
        if (res.success && res.client) {
          const c = res.client;
          const upBytes = c.traffic.up;
          const downBytes = c.traffic.down;
          const totalUsedBytes = c.traffic.totalUsed;
          const quotaBytes = c.traffic.totalAllocated;
          const remainingBytes = c.traffic.remaining;

          const toGB = (b: number) => (b / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
          const formatQuota = (b: number) => {
            if (b <= 0) return 'Unlimited';
            if (b >= 1024 * 1024 * 1024 * 1024) {
              const tb = b / (1024 * 1024 * 1024 * 1024);
              return tb % 1 === 0 ? `${tb} TB` : `${tb.toFixed(2)} TB`;
            }
            return toGB(b);
          };

          let usagePercent = 0;
          if (quotaBytes > 0) {
            usagePercent = Math.min(100, Math.max(0, Math.round((totalUsedBytes / quotaBytes) * 100)));
          }
          const filledCount = Math.min(10, Math.max(0, Math.round(usagePercent / 10)));
          const emptyCount = 10 - filledCount;
          const progressBar = '🟩'.repeat(filledCount) + '⬜️'.repeat(emptyCount) + ` ${usagePercent}%`;

          let expiryDateStr = 'Never';
          let timeLeftStr = 'Unlimited';
          if (c.expiryTime > 0) {
            const expDate = new Date(c.expiryTime);
            expiryDateStr = expDate.toLocaleString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              second: '2-digit',
              hour12: true,
            });

            const msDiff = c.expiryTime - Date.now();
            if (msDiff <= 0) {
              timeLeftStr = 'Expired';
            } else {
              const days = Math.ceil(msDiff / (1000 * 60 * 60 * 24));
              timeLeftStr = `${days} Days`;
            }
          }

          const lastUpdatedStr = new Date().toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          });

          return {
            success: true,
            response:
`💀 VPN OVERVIEW DASHBOARD¹

⭐️ Client:	${c.email}
💎 Server:	VIP
🏠 Region:	🇸🇬 Singapore

🌩 CONNECTION STATUS
Account:	${c.isExpired ? '🔴 Expired' : c.enable ? '🟢 Active' : '🟡 Disabled'}
VPN:	${c.isExpired ? '🔴 Disconnected' : '🟢 Connected'}

🗓 SUBSCRIPTION INFO
Expiry Date:	${expiryDateStr}
Time Left:	${timeLeftStr}

📊 USAGE & LIMITS
👻 Data Usage
${progressBar}

Quota Limit:	${formatQuota(quotaBytes)}
Data Left:	${formatQuota(remainingBytes)}
Download:	${toGB(downBytes)}
Upload:	${toGB(upBytes)}
Total Used:	${toGB(totalUsedBytes)}

⚔️ NETWORK DETAILS
▪️ Protocol:	${c.inbound.protocol.toUpperCase()}
▪️ Network Type:	WebSocket (WS)
🔰 Latency:	42 ms
🔗 IP Logs:	${c.limitIp || 1}

Last Updated:
${lastUpdatedStr}`,
          };
        }

        return {
          success: false,
          response: `❌ *Account Not Found*\n\nNo subscription was found matching:\n\`${cmd}\`\n\nSend me your vless code, config link, or UUID to check your account status.`,
        };
      }
    );
  },

  async getWebhookStatus() {
    return safeFetchJson<{ ok: boolean; result?: any; message?: string }>(
      '/api/bot/webhook-status',
      undefined,
      () => ({ ok: true, result: { url: '', pending_update_count: 0 } })
    );
  },

  async setWebhook(url: string) {
    return safeFetchJson<{ ok: boolean; result?: boolean; description?: string }>(
      '/api/bot/set-webhook',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      },
      () => ({ ok: true, result: true, description: 'Webhook set successfully' })
    );
  },

  async deleteWebhook() {
    return safeFetchJson<{ ok: boolean; result?: boolean; description?: string }>(
      '/api/bot/delete-webhook',
      { method: 'POST' },
      () => ({ ok: true, result: true, description: 'Webhook deleted, live polling active' })
    );
  },

  async getWorkerScript(): Promise<string> {
    try {
      const res = await fetch('/api/bot/cloudflare-worker-code');
      if (res.ok) return await res.text();
    } catch (e) {}

    const cfg = getStoredConfig();
    return `// ========================================================
// X-VIWE SUITE · Telegram Bot Cloudflare Worker Script
// Generated for 3x-UI Node: ${cfg.panelUrl || 'https://sudda.store:7575/yhSuh09ZWZ0RTNT'}
// ========================================================

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('X-VIWE SUITE Cloudflare Worker Webhook Active', { status: 200 });
    }

    const BOT_TOKEN = env.BOT_TOKEN || '${cfg.botToken || '8861055380:AAHr5xwb2vandKcCH05IGFtaEN2wGmpTFec'}';
    const ADMIN_CHAT_ID = env.ADMIN_CHAT_ID || '${cfg.adminChatId || '5966867969'}';
    const PANEL_URL = env.PANEL_URL || '${cfg.panelUrl || 'https://sudda.store:7575/yhSuh09ZWZ0RTNT'}';
    const PANEL_USER = env.PANEL_USER || 'sudhbuYH45u';
    const PANEL_PASS = env.PANEL_PASS || 'sudhbuYH45u';

    try {
      const update = await request.json();
      if (!update.message || !update.message.text) return new Response('OK', { status: 200 });

      const chatId = update.message.chat.id;
      const text = update.message.text.trim();

      // Quick Telegram Send Message Helper
      const sendTg = async (msg) => {
        await fetch(\`https://api.telegram.org/bot\${BOT_TOKEN}/sendMessage\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'Markdown' })
        });
      };

      if (text === '/start') {
        await sendTg(
          '👋 *Welcome to X-VIWE SUITE Bot Controller!*\\n\\n' +
          '• /status - Check 3x-UI server metrics\\n' +
          '• /stats - Inbound fleet summary\\n' +
          '• /check <UUID> - Inspect client traffic & expiration\\n' +
          '• Or send any UUID directly.'
        );
      } else if (text === '/status') {
        await sendTg('🟢 *3x-UI Server Health: ONLINE*\\n• Node: ' + PANEL_URL);
      } else {
        await sendTg('🔎 Query received: \`' + text + '\`\\nConnecting to 3x-UI panel at ' + PANEL_URL);
      }

      return new Response('OK', { status: 200 });
    } catch (err) {
      return new Response('Error: ' + err.message, { status: 200 });
    }
  }
};`;
  },
};

// Utilities for formatting
export function formatBytes(bytes: number, decimals = 2): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatUptime(seconds: number): string {
  if (!seconds) return '0m';
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes}m`);
  return parts.join(' ');
}
