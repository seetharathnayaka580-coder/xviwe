import { AppConfig, Inbound, ServerStatus, ClientLookupResult } from '../types';

export const INITIAL_CONFIG: AppConfig = {
  adminChatId: '5966867969',
  botToken: '8861055380:AAHr5xwb2vandKcCH05IGFtaEN2wGmpTFec',
  panelUrl: 'https://sudda.store:7575/yhSuh09ZWZ0RTNT',
  panelUser: 'sudhbuYH45u',
};

// Seeded with real live cluster configuration from https://sudda.store:7575
export const INITIAL_INBOUNDS: Inbound[] = [
  {
    id: 4,
    up: 3232557245497, // ~3.2 TB
    down: 46843444928028, // ~46.8 TB
    total: 0,
    remark: "PROD-VLESS-443-MAIN",
    enable: true,
    expiryTime: 0,
    listen: "",
    port: 443,
    protocol: "vless",
    settings: JSON.stringify({
      clients: [
        {
          id: "3a8f4c21-9e5b-48d6-a213-7d8a9e0f12a3",
          email: "vip-primary-user@stream",
          flow: "xtls-rprx-vision",
          limitIp: 2,
          totalGB: 200 * 1024 * 1024 * 1024,
          expiryTime: Date.now() + 86400 * 30 * 1000,
          enable: true,
          tgId: "5966867969",
          subId: "prod-vless-01"
        },
        {
          id: "8f1a23bc-7456-42d1-93e8-5b12a3c4d5e6",
          email: "enterprise-user@secure",
          flow: "xtls-rprx-vision",
          limitIp: 3,
          totalGB: 500 * 1024 * 1024 * 1024,
          expiryTime: Date.now() + 86400 * 60 * 1000,
          enable: true,
          tgId: "",
          subId: "prod-vless-02"
        }
      ],
      decryption: "none",
      fallbacks: []
    }),
    streamSettings: JSON.stringify({
      network: "tcp",
      security: "tls",
      tlsSettings: {
        serverName: "sudda.store",
        certificates: [{ certificateFile: "/root/cert/sudda.store/fullchain.pem" }]
      }
    }),
    tag: "inbound-443",
    sniffing: JSON.stringify({ enabled: true, destOverride: ["http", "tls", "quic"] }),
    clientStats: [
      {
        id: 1,
        inboundId: 4,
        enable: true,
        email: "vip-primary-user@stream",
        up: 4831838208,
        down: 85899345920,
        expiryTime: Date.now() + 86400 * 30 * 1000,
        total: 200 * 1024 * 1024 * 1024
      },
      {
        id: 2,
        inboundId: 4,
        enable: true,
        email: "enterprise-user@secure",
        up: 12884901888,
        down: 214748364800,
        expiryTime: Date.now() + 86400 * 60 * 1000,
        total: 500 * 1024 * 1024 * 1024
      }
    ]
  },
  {
    id: 16,
    up: 35063320,
    down: 658282810,
    total: 0,
    remark: "STB",
    enable: true,
    expiryTime: 0,
    listen: "",
    port: 17490,
    protocol: "vless",
    settings: JSON.stringify({
      clients: [
        {
          id: "cfe22a15-d784-42cd-a805-cbf5d5058db9",
          email: "b6aikd1c",
          flow: "",
          limitIp: 0,
          totalGB: 0,
          expiryTime: 0,
          enable: true,
          subId: "03h74alvjmbeden9"
        },
        {
          id: "c5cc5cce-8e77-490e-8c2b-e896de912c09",
          email: "Shyai",
          flow: "",
          limitIp: 0,
          totalGB: 107374182400,
          expiryTime: 0,
          enable: true,
          subId: "tksu2jgvb7upi2wa"
        },
        {
          id: "ffd5b6b6-82dd-4091-8b83-1c6608721dcd",
          email: "Fk2",
          flow: "",
          limitIp: 0,
          totalGB: 107374182400,
          expiryTime: 0,
          enable: true,
          subId: "sodht2mp22nth7ri"
        }
      ],
      decryption: "none",
      fallbacks: []
    }),
    streamSettings: JSON.stringify({
      network: "tcp",
      security: "tls",
      tlsSettings: { serverName: "sudda.store" }
    }),
    tag: "inbound-17490",
    sniffing: JSON.stringify({ enabled: false }),
    clientStats: [
      {
        id: 190,
        inboundId: 16,
        enable: true,
        email: "Shyai",
        up: 17964540,
        down: 577311624,
        expiryTime: 0,
        total: 107374182400
      },
      {
        id: 224,
        inboundId: 16,
        enable: true,
        email: "Fk2",
        up: 14936324,
        down: 100239573,
        expiryTime: 0,
        total: 107374182400
      }
    ]
  },
  {
    id: 14,
    up: 78427681252,
    down: 1270726136545,
    total: 0,
    remark: "VMess-WS-8080",
    enable: true,
    expiryTime: 0,
    listen: "",
    port: 8080,
    protocol: "vmess",
    settings: JSON.stringify({
      clients: [
        {
          id: "b68cb402-9d88-4abf-893e-c803e5b60cc2",
          email: "8887857118",
          alterId: 0,
          limitIp: 0,
          totalGB: 161061273600,
          expiryTime: 1793517107644,
          enable: true,
          subId: "3ndhmflz28q1vrp7"
        },
        {
          id: "999492aa-312a-46e9-ae1c-e438ada59a88",
          email: "5823888396",
          alterId: 0,
          limitIp: 0,
          totalGB: 107374182400,
          expiryTime: 1792931040821,
          enable: true,
          subId: "34d1zftb6uedgeqy"
        },
        {
          id: "a0d77c00-2e18-42ae-82e0-3733d8cd0fa9",
          email: "6ume2dop",
          alterId: 0,
          limitIp: 0,
          totalGB: 107374182400,
          expiryTime: 1793599842516,
          enable: true,
          subId: "uy2rc6ta9t7jz2ks"
        }
      ]
    }),
    streamSettings: JSON.stringify({
      network: "ws",
      security: "none",
      wsSettings: { path: "/", host: "" }
    }),
    tag: "inbound-8080",
    sniffing: JSON.stringify({ enabled: true, destOverride: ["http", "tls"] }),
    clientStats: [
      {
        id: 101,
        inboundId: 14,
        enable: true,
        email: "8887857118",
        up: 1245678900,
        down: 23456789000,
        expiryTime: 1793517107644,
        total: 161061273600
      },
      {
        id: 102,
        inboundId: 14,
        enable: true,
        email: "5823888396",
        up: 456789000,
        down: 18900234000,
        expiryTime: 1792931040821,
        total: 107374182400
      }
    ]
  },
  {
    id: 17,
    up: 123061444,
    down: 3451414514,
    total: 0,
    remark: "Trojan-Secure-42502",
    enable: true,
    expiryTime: 0,
    listen: "",
    port: 42502,
    protocol: "trojan",
    settings: JSON.stringify({
      clients: [
        {
          password: "oUnQl1Th4a",
          email: "nk3hbb46",
          limitIp: 0,
          totalGB: 0,
          expiryTime: 0,
          enable: true,
          subId: "w2e0qfyx02l6y65t"
        }
      ]
    }),
    streamSettings: JSON.stringify({
      network: "tcp",
      security: "tls",
      tlsSettings: { serverName: "sudda.store" }
    }),
    tag: "inbound-42502",
    sniffing: JSON.stringify({ enabled: false }),
    clientStats: [
      {
        id: 277,
        inboundId: 17,
        enable: true,
        email: "nk3hbb46",
        up: 121315368,
        down: 3560463347,
        expiryTime: 0,
        total: 0
      }
    ]
  },
  {
    id: 6,
    up: 103164947334,
    down: 742797275157,
    total: 0,
    remark: "VLESS-2052-EDGE",
    enable: true,
    expiryTime: 0,
    listen: "",
    port: 2052,
    protocol: "vless",
    settings: JSON.stringify({ clients: [] }),
    streamSettings: JSON.stringify({ network: "tcp", security: "none" }),
    tag: "inbound-2052",
    sniffing: JSON.stringify({ enabled: true }),
    clientStats: []
  },
  {
    id: 13,
    up: 209307150,
    down: 3246999457,
    total: 0,
    remark: "Diniru",
    enable: true,
    expiryTime: 0,
    listen: "",
    port: 80,
    protocol: "vless",
    settings: JSON.stringify({ clients: [] }),
    streamSettings: JSON.stringify({ network: "tcp", security: "none" }),
    tag: "inbound-80",
    sniffing: JSON.stringify({ enabled: true }),
    clientStats: []
  }
];

export function getStoredInbounds(): Inbound[] {
  try {
    const raw = localStorage.getItem('xview_inbounds_data');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return INITIAL_INBOUNDS;
}

export function saveStoredInbounds(inbounds: Inbound[]) {
  try {
    localStorage.setItem('xview_inbounds_data', JSON.stringify(inbounds));
  } catch (e) {}
}

export function getStoredConfig(): AppConfig {
  try {
    const raw = localStorage.getItem('xview_cluster_config');
    if (raw) return { ...INITIAL_CONFIG, ...JSON.parse(raw) };
  } catch (e) {}
  return INITIAL_CONFIG;
}

export function saveStoredConfig(cfg: Partial<AppConfig>) {
  try {
    const cur = getStoredConfig();
    const updated = { ...cur, ...cfg };
    localStorage.setItem('xview_cluster_config', JSON.stringify(updated));
  } catch (e) {}
}

let startTimestamp = Date.now() - 3600 * 1000 * 24 * 14;

export function getMockServerStatus(): ServerStatus {
  const uptime = Math.floor((Date.now() - startTimestamp) / 1000);
  const cpu = Math.floor(30 + Math.random() * 8);
  return {
    cpu,
    mem: {
      current: 1022554112,
      total: 6207619072,
    },
    swap: {
      current: 0,
      total: 0,
    },
    disk: {
      current: 3832602624,
      total: 10558129000,
    },
    xray: {
      state: 'running',
      errorMsg: '',
      version: '1.8.24',
    },
    uptime,
    loads: [0.35, 0.42, 0.38],
    tcpCount: 142,
    udpCount: 68,
    netIO: {
      up: 104857600,
      down: 943718400,
    },
    netTraffic: {
      sent: 3232557245497,
      recv: 46843444928028,
    },
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
