import { AppConfig, Inbound, ServerStatus, ClientLookupResult } from '../types';

export const INITIAL_CONFIG: AppConfig = {
  adminChatId: '5966867969',
  botToken: '8861055380:AAHr5xwb2vandKcCH05IGFtaEN2wGmpTFec',
  panelUrl: 'https://sudda.store:7575/yhSuh09ZWZ0RTNT',
  panelUser: 'sudhbuYH45u',
};

export const INITIAL_INBOUNDS: Inbound[] = [
  {
    id: 1,
    up: 17179869184, // 16 GB
    down: 128849018880, // 120 GB
    total: 1099511627776, // 1 TB
    remark: "SG-VLESS-REALITY-PRIMARY",
    enable: true,
    expiryTime: 0,
    listen: "",
    port: 443,
    protocol: "vless",
    settings: JSON.stringify({
      clients: [
        {
          id: "3a8f4c21-9e5b-48d6-a213-7d8a9e0f12a3",
          email: "vip-john-user@client",
          flow: "xtls-rprx-vision",
          limitIp: 2,
          totalGB: 100 * 1024 * 1024 * 1024,
          expiryTime: Date.now() + 86400 * 28 * 1000,
          enable: true,
          tgId: "5966867969",
          subId: "sg-vip-01"
        },
        {
          id: "8f1a23bc-7456-42d1-93e8-5b12a3c4d5e6",
          email: "business-mark@vpn",
          flow: "xtls-rprx-vision",
          limitIp: 3,
          totalGB: 250 * 1024 * 1024 * 1024,
          expiryTime: Date.now() + 86400 * 65 * 1000,
          enable: true,
          tgId: "",
          subId: "sg-biz-02"
        },
        {
          id: "c4d5e6f7-1234-4567-89ab-cdef01234567",
          email: "alex-mobile@stream",
          flow: "xtls-rprx-vision",
          limitIp: 1,
          totalGB: 50 * 1024 * 1024 * 1024,
          expiryTime: Date.now() + 86400 * 12 * 1000,
          enable: true,
          tgId: "",
          subId: "sg-mob-03"
        }
      ],
      decryption: "none",
      fallbacks: []
    }),
    streamSettings: JSON.stringify({
      network: "tcp",
      security: "reality",
      realitySettings: {
        show: false,
        xver: 0,
        dest: "www.yahoo.com:443",
        serverNames: ["www.yahoo.com", "yahoo.com"],
        privateKey: "mH9_dummy_private_key_xray_reality_panel",
        settings: {
          publicKey: "7g92Kls_xray_pubkey_real_sg_nodes_001",
          fingerprint: "chrome",
          serverName: "",
          spiderX: "/"
        }
      }
    }),
    tag: "inbound-443",
    sniffing: JSON.stringify({ enabled: true, destOverride: ["http", "tls", "quic"] }),
    clientStats: [
      {
        id: 1,
        inboundId: 1,
        enable: true,
        email: "vip-john-user@client",
        up: 3221225472,
        down: 24696061952,
        expiryTime: Date.now() + 86400 * 28 * 1000,
        total: 100 * 1024 * 1024 * 1024
      },
      {
        id: 2,
        inboundId: 1,
        enable: true,
        email: "business-mark@vpn",
        up: 12884901888,
        down: 85899345920,
        expiryTime: Date.now() + 86400 * 65 * 1000,
        total: 250 * 1024 * 1024 * 1024
      },
      {
        id: 3,
        inboundId: 1,
        enable: true,
        email: "alex-mobile@stream",
        up: 1073741824,
        down: 18253611008,
        expiryTime: Date.now() + 86400 * 12 * 1000,
        total: 50 * 1024 * 1024 * 1024
      }
    ]
  },
  {
    id: 2,
    up: 8589934592, // 8 GB
    down: 42949672960, // 40 GB
    total: 536870912000, // 500 GB
    remark: "SG-VMESS-WS-CDN-EDGE",
    enable: true,
    expiryTime: 0,
    listen: "",
    port: 2083,
    protocol: "vmess",
    settings: JSON.stringify({
      clients: [
        {
          id: "e5f6a7b8-9012-3456-789a-bcdef0123456",
          email: "clt-fast-cdn@speed",
          security: "auto",
          alterId: 0,
          limitIp: 2,
          totalGB: 80 * 1024 * 1024 * 1024,
          expiryTime: Date.now() + 86400 * 45 * 1000,
          enable: true,
          tgId: "",
          subId: "vm-fast-01"
        }
      ]
    }),
    streamSettings: JSON.stringify({
      network: "ws",
      security: "none",
      wsSettings: {
        path: "/vmess-edge-ws",
        headers: { Host: "sudda.store" }
      }
    }),
    tag: "inbound-2083",
    sniffing: JSON.stringify({ enabled: true, destOverride: ["http", "tls"] }),
    clientStats: [
      {
        id: 4,
        inboundId: 2,
        enable: true,
        email: "clt-fast-cdn@speed",
        up: 8589934592,
        down: 42949672960,
        expiryTime: Date.now() + 86400 * 45 * 1000,
        total: 80 * 1024 * 1024 * 1024
      }
    ]
  }
];

// Local storage helper
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
  const cpu = Math.floor(10 + Math.random() * 8 + Math.sin(Date.now() / 10000) * 5);
  return {
    cpu,
    mem: {
      current: 1536 * 1024 * 1024 + Math.floor(Math.random() * 50 * 1024 * 1024),
      total: 4096 * 1024 * 1024,
    },
    swap: {
      current: 128 * 1024 * 1024,
      total: 2048 * 1024 * 1024,
    },
    disk: {
      current: 14.2 * 1024 * 1024 * 1024,
      total: 60 * 1024 * 1024 * 1024,
    },
    xray: {
      state: 'running',
      errorMsg: '',
      version: '1.8.24',
    },
    uptime,
    loads: [0.35, 0.42, 0.38],
    tcpCount: 142 + Math.floor(Math.random() * 15),
    udpCount: 68 + Math.floor(Math.random() * 8),
    netIO: {
      up: 104857600 + Math.floor(Math.random() * 1000000),
      down: 943718400 + Math.floor(Math.random() * 5000000),
    },
    netTraffic: {
      sent: 247891234567,
      recv: 1894234567890,
    },
  };
}

export function lookupMockClient(query: string): { success: boolean; client?: ClientLookupResult; message?: string } {
  const inbounds = getStoredInbounds();
  const q = query.trim().toLowerCase();

  for (const ib of inbounds) {
    try {
      const settings = JSON.parse(ib.settings);
      if (Array.isArray(settings.clients)) {
        const found = settings.clients.find(
          (c: any) =>
            (c.id && c.id.toLowerCase() === q) ||
            (c.email && c.email.toLowerCase() === q) ||
            (c.email && c.email.toLowerCase().includes(q))
        );

        if (found) {
          const stat = ib.clientStats?.find((s) => s.email === found.email);
          const up = stat?.up || 0;
          const down = stat?.down || 0;
          const totalUsed = up + down;
          const totalAllocated = found.totalGB || 107374182400;
          const remaining = Math.max(0, totalAllocated - totalUsed);
          const isExpired = found.expiryTime > 0 && Date.now() > found.expiryTime;

          let vpnUrl = '';
          if (ib.protocol === 'vless') {
            vpnUrl = `vless://${found.id}@sudda.store:${ib.port}?type=tcp&security=reality&pbk=7g92Kls_xray_pubkey_real_sg_nodes_001&fp=chrome&sni=www.yahoo.com&sid=/&spx=%2F&flow=${found.flow || 'xtls-rprx-vision'}#${encodeURIComponent(found.email)}`;
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
              host: 'sudda.store',
              path: '/vmess-edge-ws',
              tls: '',
            };
            vpnUrl = 'vmess://' + btoa(JSON.stringify(vmessObj));
          }

          return {
            success: true,
            client: {
              uuid: found.id,
              email: found.email,
              enable: found.enable !== false,
              expiryTime: found.expiryTime || 0,
              isExpired,
              activeConnections: Math.floor(Math.random() * (found.limitIp || 2)) + 1,
              limitIp: found.limitIp || 0,
              traffic: {
                up,
                down,
                totalUsed,
                totalAllocated,
                remaining,
                usagePercent: ((totalUsed / totalAllocated) * 100).toFixed(1),
              },
              inbound: {
                id: ib.id,
                remark: ib.remark,
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
