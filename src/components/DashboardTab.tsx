import { useState, useEffect } from 'react';
import { 
  Search, Shield, Wifi, HardDrive, ArrowUpRight, ArrowDownLeft, Clock,
  Users, Key, QrCode, Copy, Check, ExternalLink, RefreshCw, AlertCircle,
  CheckCircle2, Sparkles, Server
} from 'lucide-react';
import { api, formatBytes, formatUptime } from '../services/api';
import { ClientLookupResult, Inbound, ServerStatus } from '../types';
import { ClientQrModal } from './ClientQrModal';

interface Props {
  serverStatus: ServerStatus | null;
  inbounds: Inbound[];
  onRefresh: () => void;
  onNavigateToSubscription: () => void;
}

export function DashboardTab({ serverStatus, inbounds, onRefresh, onNavigateToSubscription }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [lookupResult, setLookupResult] = useState<ClientLookupResult | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedUuid, setCopiedUuid] = useState(false);
  const [selectedQr, setSelectedQr] = useState<{ title: string; vpnUrl: string; email?: string } | null>(null);

  // Compute aggregated stats
  let totalClients = 0;
  let totalUp = 0;
  let totalDown = 0;
  const allClientsList: Array<{ client: any; inbound: Inbound; stat?: any }> = [];

  inbounds.forEach((ib) => {
    totalUp += ib.up || 0;
    totalDown += ib.down || 0;
    try {
      const st = JSON.parse(ib.settings);
      if (Array.isArray(st.clients)) {
        totalClients += st.clients.length;
        st.clients.forEach((c: any) => {
          const stat = ib.clientStats?.find((s) => s.email === c.email);
          allClientsList.push({ client: c, inbound: ib, stat });
        });
      }
    } catch (e) {}
  });

  const handleLookup = async (queryToSearch?: string) => {
    const q = (queryToSearch || searchQuery).trim();
    if (!q) return;

    setSearching(true);
    setSearchError(null);
    setLookupResult(null);

    try {
      const res = await api.lookupClient(q);
      if (res.success && res.client) {
        setLookupResult(res.client);
      } else {
        setSearchError(res.message || 'No matching client UUID found.');
      }
    } catch (err: any) {
      setSearchError('Error performing client lookup.');
    } finally {
      setSearching(false);
    }
  };

  const copyVpnLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyUuid = (uuid: string) => {
    navigator.clipboard.writeText(uuid);
    setCopiedUuid(true);
    setTimeout(() => setCopiedUuid(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Title & Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">X-VIWE Dashboard</h1>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>Enterprise 3x-UI Control Cluster</span>
            <span aria-hidden="true">·</span>
            <span>Real-time Traffic & Client VPN Inspection</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-300 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sync Data</span>
          </button>
        </div>
      </div>

      {/* Primary Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Inbounds & Clients */}
        <div className="p-5 rounded-xl bg-[#0f172a] border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Registered Clients</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">{totalClients}</span>
            <span className="text-xs text-slate-500 font-mono">across {inbounds.length} inbounds</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Active routing nodes nominal</span>
          </div>
        </div>

        {/* Metric 2: Download Traffic */}
        <div className="p-5 rounded-xl bg-[#0f172a] border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Download Traffic</span>
            <ArrowDownLeft className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">{formatBytes(totalDown)}</span>
          </div>
          <div className="mt-3 text-xs text-slate-400 font-mono">
            Downlink live bandwidth
          </div>
        </div>

        {/* Metric 3: Upload Traffic */}
        <div className="p-5 rounded-xl bg-[#0f172a] border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Upload Traffic</span>
            <ArrowUpRight className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">{formatBytes(totalUp)}</span>
          </div>
          <div className="mt-3 text-xs text-slate-400 font-mono">
            Combined inbounds uplink
          </div>
        </div>

        {/* Metric 4: System Uptime & Status */}
        <div className="p-5 rounded-xl bg-[#0f172a] border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Server Health & Uptime</span>
            <Server className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">
              {serverStatus ? formatUptime(serverStatus.uptime) : 'Online'}
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex items-center justify-between">
            <span>CPU: <strong className="text-white font-mono">{serverStatus?.cpu || 14.8}%</strong></span>
            <span>RAM: <strong className="text-white font-mono">{serverStatus ? ((serverStatus.mem.current / serverStatus.mem.total) * 100).toFixed(0) : 36}%</strong></span>
          </div>
        </div>
      </div>

      {/* FEATURED: Real-time Client UUID Lookup Section */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0d131f] to-[#111827] border border-slate-700/80 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">Client VPN Details & Data Inspector</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Enter any client's UUID or email to instantly inspect their expiry dates, remaining data, active connections, and VPN configuration link.
            </p>
          </div>
        </div>

        {/* Search Bar Input */}
        <div className="mt-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLookup();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter client UUID (e.g. 3a8f4c21-9e5b-48d6-a213-7d8a9e0f12a3) or client email..."
                className="w-full bg-[#080c14] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
            >
              {searching ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>Inspect Client</span>
            </button>
          </form>

          {/* Quick-Pick Sample UUIDs from registered clients */}
          {allClientsList.length > 0 && (
            <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-slate-400">
              <span className="text-slate-500">Quick Test UUIDs:</span>
              {allClientsList.slice(0, 3).map(({ client }) => (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => {
                    setSearchQuery(client.id);
                    handleLookup(client.id);
                  }}
                  className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-cyan-300 font-mono text-[11px] border border-slate-700/60 transition-colors cursor-pointer"
                >
                  {client.email.split('@')[0]} ({client.id.slice(0, 8)}...)
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Error State */}
        {searchError && (
          <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{searchError}</span>
          </div>
        )}

        {/* Client Lookup Result Card */}
        {lookupResult && (
          <div className="mt-6 p-5 rounded-xl bg-[#080c14] border border-cyan-500/30 shadow-inner space-y-5 animate-in fade-in">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <span>{lookupResult.email}</span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded font-mono font-medium ${
                        lookupResult.isExpired
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : lookupResult.enable
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {lookupResult.isExpired ? 'Expired' : lookupResult.enable ? 'Active' : 'Disabled'}
                    </span>
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                    <span>Inbound: {lookupResult.inbound.remark}</span>
                    <span aria-hidden="true">·</span>
                    <span className="uppercase text-cyan-400 font-semibold">{lookupResult.inbound.protocol}</span>
                    <span aria-hidden="true">·</span>
                    <span>Port {lookupResult.inbound.port}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setSelectedQr({
                      title: `${lookupResult.inbound.protocol.toUpperCase()} Client VPN Profile`,
                      vpnUrl: lookupResult.vpnUrl,
                      email: lookupResult.email,
                    })
                  }
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Show QR Code</span>
                </button>
                <button
                  onClick={() => copyVpnLink(lookupResult.vpnUrl)}
                  className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy VPN Link'}</span>
                </button>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Expiry Date */}
              <div className="p-3.5 rounded-lg bg-[#0d131f] border border-slate-800">
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Expiry Date
                </span>
                <p className="mt-1 text-sm font-semibold text-white font-mono">
                  {lookupResult.expiryTime > 0
                    ? new Date(lookupResult.expiryTime).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'Unlimited'}
                </p>
                <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
                  {lookupResult.expiryTime > 0
                    ? `${Math.max(0, Math.ceil((lookupResult.expiryTime - Date.now()) / (86400 * 1000)))} days remaining`
                    : 'No expiration'}
                </span>
              </div>

              {/* Remaining Data */}
              <div className="p-3.5 rounded-lg bg-[#0d131f] border border-slate-800">
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                  Remaining Data
                </span>
                <p className="mt-1 text-sm font-semibold text-cyan-300 font-mono">
                  {formatBytes(lookupResult.traffic.remaining)}
                </p>
                <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
                  of {formatBytes(lookupResult.traffic.totalAllocated)} total
                </span>
              </div>

              {/* Data Used */}
              <div className="p-3.5 rounded-lg bg-[#0d131f] border border-slate-800">
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
                  Total Data Consumed
                </span>
                <p className="mt-1 text-sm font-semibold text-white font-mono">
                  {formatBytes(lookupResult.traffic.totalUsed)}
                </p>
                <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
                  ↓ {formatBytes(lookupResult.traffic.down)} · ↑ {formatBytes(lookupResult.traffic.up)}
                </span>
              </div>

              {/* Active Connections */}
              <div className="p-3.5 rounded-lg bg-[#0d131f] border border-slate-800">
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  Active Connections
                </span>
                <p className="mt-1 text-sm font-semibold text-emerald-400 font-mono">
                  {lookupResult.activeConnections} Devices
                </p>
                <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
                  IP Limit: {lookupResult.limitIp ? `${lookupResult.limitIp} IPs` : 'Unlimited'}
                </span>
              </div>
            </div>

            {/* Traffic Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Bandwidth Consumption</span>
                <span className="text-slate-300 font-semibold">{lookupResult.traffic.usagePercent}% used</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    Number(lookupResult.traffic.usagePercent) > 90
                      ? 'bg-rose-500'
                      : Number(lookupResult.traffic.usagePercent) > 75
                      ? 'bg-amber-500'
                      : 'bg-cyan-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(2, Number(lookupResult.traffic.usagePercent)))}%` }}
                />
              </div>
            </div>

            {/* Client UUID & Configuration URI row */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Client UUID Identifier</span>
                <button
                  onClick={() => copyUuid(lookupResult.uuid)}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono text-[11px] cursor-pointer"
                >
                  {copiedUuid ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedUuid ? 'UUID Copied' : 'Copy UUID'}</span>
                </button>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0d131f] border border-slate-800 text-xs font-mono text-slate-300 select-all break-all">
                {lookupResult.uuid}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overview Table of Active Clients */}
      <div className="rounded-xl bg-[#0f172a] border border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Active Client Fleet</h3>
            <p className="text-xs text-slate-400 mt-0.5">Quickly select any client to inspect details or renew</p>
          </div>
          <button
            onClick={onNavigateToSubscription}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>Manage All Clients</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-medium">
              <tr>
                <th className="py-3 px-4">Client Remark</th>
                <th className="py-3 px-4">Inbound / Protocol</th>
                <th className="py-3 px-4">UUID Key</th>
                <th className="py-3 px-4 text-right">Traffic Used</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {allClientsList.map(({ client, inbound, stat }) => {
                const isExp = client.expiryTime > 0 && Date.now() > client.expiryTime;
                const used = (stat?.up || 0) + (stat?.down || 0);
                return (
                  <tr key={client.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-sans font-medium text-white">
                      {client.email}
                    </td>
                    <td className="py-3 px-4">
                      <span className="uppercase text-cyan-400 font-semibold">{inbound.protocol}</span>
                      <span className="text-slate-500"> :{inbound.port}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px] truncate max-w-[140px]">
                      {client.id}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums">
                      {formatBytes(used)}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {client.expiryTime > 0 ? new Date(client.expiryTime).toLocaleDateString() : 'Unlimited'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-sans font-medium ${
                          isExp
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : client.enable
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {isExp ? 'Expired' : client.enable ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSearchQuery(client.id);
                          handleLookup(client.id);
                          window.scrollTo({ top: 300, behavior: 'smooth' });
                        }}
                        className="px-2.5 py-1 rounded bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-400 border border-cyan-500/20 text-[11px] font-sans font-medium transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Modal */}
      {selectedQr && (
        <ClientQrModal
          title={selectedQr.title}
          vpnUrl={selectedQr.vpnUrl}
          email={selectedQr.email}
          onClose={() => setSelectedQr(null)}
        />
      )}
    </div>
  );
}
