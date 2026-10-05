import { AppConfig, Inbound, ServerStatus, ClientLookupResult } from '../types';
import realInboundsData from './realInbounds.json';

export const INITIAL_CONFIG: AppConfig = {
  adminChatId: '5966867969',
  botToken: '8861055380:AAHr5xwb2vandKcCH05IGFtaEN2wGmpTFec',
  panelUrl: 'https://sudda.store:7575/yhSuh09ZWZ0RTNT',
  panelUser: 'sudhbuYH45u',
};

// Seeded with complete real live cluster configuration (all 6 inbounds and 226 real registered clients)
export const INITIAL_INBOUNDS: Inbound[] = (realInboundsData as any[]) || [];

export const REAL_ONLINE_FALLBACK: string[] = [
  "1144852475", "1287143974", "1293708143", "1374045534", "140286753", 
  "1408207005", "1452635151", "1495634671", "1561619304", "1670451837", 
  "1741219245", "1817087389", "1842224097", "5273639962", "5308624395", 
  "5640980297", "5852461746", "5941316642", "5smokiz8", "6250596486", 
  "6343139670", "6521449554", "6548509907", "6562374898", "6601219142", 
  "6610243375", "6652043574", "6657239668", "6753767654", "6868540422", 
  "7078402796", "7158225771", "7173723787", "7582098115", "759238227888888", 
  "7756958475", "7950505496", "7jyyolg9", "8063084642", "8243660827", 
  "8365300053", "8464630383", "8473795606", "8554196520", "8589425795", 
  "8887857118", "915713477", "93gzkx7o", "985855309", "9hhlo6wv", 
  "Dami", "Dineth", "Emosh", "Jash", "Kavi", 
  "Lakmal", "Ramesh", "Shadow", "Sulaiman", "agasthi_", 
  "blcw9gm1", "f1g2020h", "inda", "lnm6v3sh", "madhuni", 
  "pw5ish99", "robin", "ru1gkzjx", "sudda", "tulitha", 
  "ud3kyp48", "znra4hcj", "zs00q8xc"
];

export function getStoredConfig(): AppConfig {
  try {
    const raw = localStorage.getItem('xview_suite_config');
    if (raw) return { ...INITIAL_CONFIG, ...JSON.parse(raw) };
  } catch (e) {}
  return INITIAL_CONFIG;
}

export function saveStoredConfig(config: Partial<AppConfig>) {
  try {
    const current = getStoredConfig();
    const merged = { ...current, ...config };
    localStorage.setItem('xview_suite_config', JSON.stringify(merged));
  } catch (e) {}
}

export function getStoredInbounds(): Inbound[] {
  try {
    const raw = localStorage.getItem('xview_suite_inbounds');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return INITIAL_INBOUNDS;
}

export function saveStoredInbounds(inbounds: Inbound[]) {
  try {
    localStorage.setItem('xview_suite_inbounds', JSON.stringify(inbounds));
  } catch (e) {}
}

export function getMockServerStatus(): ServerStatus {
  const uptime = Math.floor(1415795 + (Date.now() % 100000) / 1000);
  return {
    cpu: 24.8,
    cpuCores: 4,
    logicalPro: 4,
    cpuSpeedMhz: 2645.032,
    mem: {
      current: 990375936 + Math.floor(Math.random() * 20000000),
      total: 6207619072
    },
    swap: { current: 0, total: 0 },
    disk: { current: 3918766080, total: 105581297664 },
    xray: { state: "running", errorMsg: "", version: "25.1.30" },
    uptime,
    loads: [1.54, 1.36, 1.26],
    tcpCount: 6394 + Math.floor(Math.random() * 100),
    udpCount: 2140 + Math.floor(Math.random() * 50),
    netIO: {
      up: 12899401 + Math.floor(Math.random() * 1000000),
      down: 13825639 + Math.floor(Math.random() * 1000000)
    },
    netTraffic: {
      sent: 14044658476188,
      recv: 14262188525715,
    },
    publicIP: {
      ipv4: "173.234.14.99",
      ipv6: "2402:a7c0:3003:102:1c00:7bff:fe00:44"
    },
    appStats: {
      threads: 24,
      mem: 93546776,
      uptime: 1671
    }
  };
}

export function lookupMockClient(query: string): { success: boolean; client?: ClientLookupResult; message?: string } {
  const inbounds = getStoredInbounds();
  let q = query.trim().toLowerCase();
  const prefixes = ['/check ', '/find ', '/uuid ', '/user ', '/client ', 'check ', 'find ', 'uuid ', 'user '];
  for (const p of prefixes) {
    if (q.startsWith(p)) {
      q = q.slice(p.length).trim();
      break;
    }
  }

  for (const ib of inbounds) {
    try {
      const settings = typeof ib.settings === 'string' ? JSON.parse(ib.settings) : ib.settings;
      if (Array.isArray(settings.clients)) {
        let found = settings.clients.find(
          (c: any) =>
            (c.id && c.id.toLowerCase() === q) ||
            (c.email && c.email.toLowerCase() === q) ||
            (c.subId && c.subId.toLowerCase() === q) ||
            (c.password && c.password.toLowerCase() === q)
        );
        if (!found) {
          found = settings.clients.find(
            (c: any) =>
              (c.email && c.email.toLowerCase().includes(q)) ||
              (q.length >= 3 && c.email && q.includes(c.email.toLowerCase())) ||
              (q.length >= 8 && c.id && c.id.toLowerCase().includes(q))
          );
        }

        if (found) {
          const stat = ib.clientStats?.find((s) => s.email === found.email);
          const up = stat?.up || 0;
          const down = stat?.down || 0;
          const totalUsed = up + down;
          const totalAllocated = found.totalGB || 107374182400;
          const remaining = totalAllocated > 0 ? Math.max(0, totalAllocated - totalUsed) : 0;
          const isExpired = found.expiryTime > 0 && Date.now() > found.expiryTime;

          let vpnUrl = '';
          if (ib.protocol === 'vless') {
            vpnUrl = `vless://${found.id}@sudda.store:${ib.port}?type=tcp&security=tls#${encodeURIComponent(found.email)}`;
          } else if (ib.protocol === 'vmess') {
            const vmessObj = {
              v: '2',
              ps: found.email,
              add: 'sudda.store',
              port: ib.port,
              id: found.id,
              aid: found.alterId || 0,
              scy: 'auto',
              net: 'ws',
              type: 'none',
              host: '',
              path: '/',
              tls: '',
            };
            vpnUrl = 'vmess://' + btoa(JSON.stringify(vmessObj));
          } else if (ib.protocol === 'trojan') {
            vpnUrl = `trojan://${found.password || found.id}@sudda.store:${ib.port}?security=tls#${encodeURIComponent(found.email)}`;
          }

          return {
            success: true,
            client: {
              uuid: found.id || found.password,
              email: found.email,
              enable: found.enable !== false,
              expiryTime: found.expiryTime || 0,
              isExpired,
              activeConnections: 1,
              limitIp: found.limitIp || 0,
              traffic: {
                up,
                down,
                totalUsed,
                totalAllocated,
                remaining,
                usagePercent: totalAllocated > 0 ? ((totalUsed / totalAllocated) * 100).toFixed(1) : '0',
              },
              inbound: {
                id: ib.id,
                remark: ib.remark || `Inbound-${ib.port}`,
                protocol: ib.protocol,
                port: ib.port,
              },
              vpnUrl,
            },
          };
        }
      }
    } catch (e) {}
  }

  return { success: false, message: 'Client not found in panel database.' };
}
