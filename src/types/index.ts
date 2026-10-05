export interface Client {
  id: string;
  email: string;
  flow?: string;
  limitIp?: number;
  totalGB: number;
  expiryTime: number;
  enable: boolean;
  tgId?: string;
  subId?: string;
  reset?: number;
}

export interface ClientStat {
  id: number;
  inboundId: number;
  enable: boolean;
  email: string;
  up: number;
  down: number;
  expiryTime: number;
  total: number;
}

export interface Inbound {
  id: number;
  up: number;
  down: number;
  total: number;
  remark: string;
  enable: boolean;
  expiryTime: number;
  listen: string;
  port: number;
  protocol: 'vless' | 'vmess' | 'trojan' | 'shadowsocks';
  settings: string;
  streamSettings: string;
  tag: string;
  sniffing: string;
  clientStats?: ClientStat[];
}

export interface ServerStatus {
  cpu: number;
  mem: {
    current: number;
    total: number;
  };
  swap: {
    current: number;
    total: number;
  };
  disk: {
    current: number;
    total: number;
  };
  xray: {
    state: string;
    errorMsg: string;
    version: string;
  };
  uptime: number;
  loads: number[];
  tcpCount: number;
  udpCount: number;
  netIO: {
    up: number;
    down: number;
  };
  netTraffic: {
    sent: number;
    recv: number;
  };
}

export interface ClientLookupResult {
  uuid: string;
  email: string;
  enable: boolean;
  expiryTime: number;
  isExpired: boolean;
  limitIp: number;
  activeConnections: number;
  traffic: {
    up: number;
    down: number;
    totalUsed: number;
    totalAllocated: number;
    remaining: number;
    usagePercent: string;
  };
  inbound: {
    id: number;
    remark: string;
    port: number;
    protocol: string;
  };
  vpnUrl: string;
}

export interface BotInfo {
  id: number;
  is_bot: boolean;
  first_name: string;
  username: string;
}

export interface AppConfig {
  panelUrl: string;
  panelUser: string;
  hasPassword: boolean;
  botTokenMasked: string;
  adminChatId: string;
}
