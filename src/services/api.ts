import { AppConfig, Client, ClientLookupResult, Inbound, ServerStatus } from '../types';

export const api = {
  async login(username: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return res.json();
  },

  async getConfig(): Promise<{ success: boolean } & AppConfig> {
    const res = await fetch('/api/config');
    return res.json();
  },

  async updateConfig(data: Partial<AppConfig & { panelPass?: string; botToken?: string }>) {
    const res = await fetch('/api/config/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getServerStatus(): Promise<{ success: boolean; isLive: boolean; data: ServerStatus; note?: string }> {
    const res = await fetch('/api/panel/status');
    return res.json();
  },

  async getInbounds(): Promise<{ success: boolean; isLive: boolean; inbounds: Inbound[] }> {
    const res = await fetch('/api/panel/inbounds');
    return res.json();
  },

  async addInbound(payload: any) {
    const res = await fetch('/api/panel/inbounds/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async deleteInbound(id: number) {
    const res = await fetch(`/api/panel/inbounds/del/${id}`, {
      method: 'POST',
    });
    return res.json();
  },

  async addClient(inboundId: number, client: Partial<Client>) {
    const res = await fetch('/api/panel/client/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inboundId, client }),
    });
    return res.json();
  },

  async updateClient(payload: { uuid: string; inboundId?: number; expiryTime?: number; totalGB?: number; enable?: boolean; limitIp?: number }) {
    const res = await fetch('/api/panel/client/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async deleteClient(uuid: string, inboundId?: number) {
    const res = await fetch('/api/panel/client/del', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uuid, inboundId }),
    });
    return res.json();
  },

  async resetClientTraffic(inboundId: number, email: string) {
    const res = await fetch('/api/panel/client/reset-traffic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inboundId, email }),
    });
    return res.json();
  },

  async lookupClient(query: string): Promise<{ success: boolean; client?: ClientLookupResult; message?: string }> {
    const res = await fetch(`/api/client/lookup/${encodeURIComponent(query)}`);
    return res.json();
  },

  async getBotInfo() {
    const res = await fetch('/api/bot/info');
    return res.json();
  },

  async sendTestMessage(message?: string, chatId?: string) {
    const res = await fetch('/api/bot/test-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, chatId }),
    });
    return res.json();
  },

  async processBotCommand(text: string): Promise<{ success: boolean; response: string }> {
    const res = await fetch('/api/bot/process-command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    return res.json();
  },

  async getWorkerScript(): Promise<string> {
    const res = await fetch('/api/bot/cloudflare-worker-code');
    return res.text();
  }
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
