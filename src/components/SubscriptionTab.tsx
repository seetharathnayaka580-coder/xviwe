import { useState } from 'react';
import { 
  Database, Plus, Trash2, RefreshCw, QrCode, Copy, Check, 
  Clock, Shield, UserPlus, Key, Wifi, AlertTriangle, X, Power, Search
} from 'lucide-react';
import { api, formatBytes } from '../services/api';
import { Client, Inbound } from '../types';
import { ClientQrModal } from './ClientQrModal';

interface Props {
  inbounds: Inbound[];
  onlineClientsList?: string[];
  onRefresh: () => void;
}

export function SubscriptionTab({ inbounds, onlineClientsList = [], onRefresh }: Props) {
  const [selectedInboundId, setSelectedInboundId] = useState<number>(inbounds[0]?.id || 0);
  const [clientSearch, setClientSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'online' | 'expired'>('all');

  // Modals state
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showAddInboundModal, setShowAddInboundModal] = useState(false);
  const [renewClientTarget, setRenewClientTarget] = useState<{ client: Client; inboundId: number } | null>(null);
  const [deleteClientTarget, setDeleteClientTarget] = useState<{ client: Client; inboundId: number } | null>(null);
  const [deleteInboundTarget, setDeleteInboundTarget] = useState<Inbound | null>(null);
  const [selectedQr, setSelectedQr] = useState<{ title: string; vpnUrl: string; email?: string } | null>(null);
  const [copiedUuid, setCopiedUuid] = useState<string | null>(null);

  // New Client Form State
  const [newClientInboundId, setNewClientInboundId] = useState<number>(inbounds[0]?.id || 1);
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientUuid, setNewClientUuid] = useState('');
  const [newClientGb, setNewClientGb] = useState<number>(100);
  const [newClientDays, setNewClientDays] = useState<number>(30);
  const [newClientIpLimit, setNewClientIpLimit] = useState<number>(2);
  const [newClientFlow, setNewClientFlow] = useState('xtls-rprx-vision');
  const [savingClient, setSavingClient] = useState(false);

  // New Inbound Form State
  const [newIbRemark, setNewIbRemark] = useState('');
  const [newIbProtocol, setNewIbProtocol] = useState<'vless' | 'vmess' | 'trojan' | 'shadowsocks'>('vless');
  const [newIbPort, setNewIbPort] = useState<number>(8443);
  const [newIbNetwork, setNewIbNetwork] = useState('tcp');
  const [newIbSecurity, setNewIbSecurity] = useState('reality');
  const [savingInbound, setSavingInbound] = useState(false);

  // Renew Client Form State
  const [renewDaysToAdd, setRenewDaysToAdd] = useState<number>(30);
  const [renewGbToAdd, setRenewGbToAdd] = useState<number>(50);
  const [resetTrafficOnRenew, setResetTrafficOnRenew] = useState(false);
  const [renewing, setRenewing] = useState(false);

  // Active inbound object
  const activeInbound = inbounds.find((ib) => ib.id === selectedInboundId) || inbounds[0];

  // Extract clients for active inbound
  let clients: Client[] = [];
  try {
    if (activeInbound) {
      const st = typeof activeInbound.settings === 'string' ? JSON.parse(activeInbound.settings) : activeInbound.settings;
      clients = Array.isArray(st?.clients) ? st.clients : [];
    }
  } catch (e) {}

  // Filter clients
  const filteredClients = clients.filter((c) => {
    const isExp = c.expiryTime > 0 && Date.now() > c.expiryTime;
    const isOnline = onlineClientsList.includes(c.email) || onlineClientsList.includes(c.id);
    if (statusFilter === 'active' && (!c.enable || isExp)) return false;
    if (statusFilter === 'online' && !isOnline) return false;
    if (statusFilter === 'expired' && !isExp) return false;

    if (!clientSearch) return true;
    const q = clientSearch.toLowerCase();
    return c.email.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
  });

  const handleGenerateUuid = () => {
    setNewClientUuid(crypto.randomUUID());
  };

  const openAddClient = (inboundId?: number) => {
    setNewClientInboundId(inboundId || activeInbound?.id || 1);
    setNewClientEmail(`user-${Math.floor(Math.random() * 9000 + 1000)}@vpn`);
    setNewClientUuid(crypto.randomUUID());
    setNewClientGb(100);
    setNewClientDays(30);
    setNewClientIpLimit(2);
    setShowAddClientModal(true);
  };

  const handleAddClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingClient(true);
    try {
      const expiryTime = newClientDays > 0 ? Date.now() + newClientDays * 86400 * 1000 : 0;
      const totalGB = newClientGb * 1024 * 1024 * 1024;
      await api.addClient(newClientInboundId, {
        id: newClientUuid,
        email: newClientEmail,
        flow: newClientFlow,
        limitIp: newClientIpLimit,
        totalGB,
        expiryTime,
        enable: true,
      });
      setShowAddClientModal(false);
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setSavingClient(false);
    }
  };

  const handleAddInboundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingInbound(true);
    try {
      await api.addInbound({
        remark: newIbRemark || `${newIbProtocol.toUpperCase()}-${newIbPort}`,
        protocol: newIbProtocol,
        port: Number(newIbPort),
        network: newIbNetwork,
        security: newIbSecurity,
      });
      setShowAddInboundModal(false);
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setSavingInbound(false);
    }
  };

  const handleDeleteClientSubmit = async () => {
    if (!deleteClientTarget) return;
    try {
      await api.deleteClient(deleteClientTarget.client.id, deleteClientTarget.inboundId);
      setDeleteClientTarget(null);
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteInboundSubmit = async () => {
    if (!deleteInboundTarget) return;
    try {
      await api.deleteInbound(deleteInboundTarget.id);
      setDeleteInboundTarget(null);
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRenewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renewClientTarget) return;
    setRenewing(true);
    try {
      const currentExpiry = renewClientTarget.client.expiryTime > Date.now() 
        ? renewClientTarget.client.expiryTime 
        : Date.now();
      const newExpiry = currentExpiry + renewDaysToAdd * 86400 * 1000;
      const newTotalBytes = (renewClientTarget.client.totalGB || 0) + (renewGbToAdd * 1024 * 1024 * 1024);

      await api.updateClient({
        uuid: renewClientTarget.client.id,
        inboundId: renewClientTarget.inboundId,
        expiryTime: newExpiry,
        totalGB: newTotalBytes,
        enable: true,
      });

      if (resetTrafficOnRenew) {
        await api.resetClientTraffic(renewClientTarget.inboundId, renewClientTarget.client.email);
      }

      setRenewClientTarget(null);
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setRenewing(false);
    }
  };

  const toggleClientEnable = async (client: Client, inboundId: number) => {
    try {
      await api.updateClient({
        uuid: client.id,
        inboundId,
        enable: !client.enable,
      });
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const openQrForClient = (client: Client, inbound: Inbound) => {
    const host = 'sudda.store';
    const port = inbound.port;
    const remark = encodeURIComponent(`${inbound.remark} - ${client.email}`);
    let url = '';

    if (inbound.protocol === 'vless') {
      url = `vless://${client.id}@${host}:${port}?type=tcp&security=reality&pbk=7g92Kls_xray_pubkey_real_sg_nodes_001&fp=chrome&sni=www.yahoo.com&flow=${client.flow || 'xtls-rprx-vision'}#${remark}`;
    } else if (inbound.protocol === 'vmess') {
      const vmessConfig = {
        v: "2",
        ps: inbound.remark,
        add: host,
        port: port,
        id: client.id,
        aid: 0,
        scy: "auto",
        net: "ws",
        type: "none",
        host: host,
        path: "/vmess-ws",
        tls: "tls"
      };
      url = `vmess://${btoa(JSON.stringify(vmessConfig))}`;
    } else {
      url = `${inbound.protocol}://${client.id}@${host}:${port}#${remark}`;
    }

    setSelectedQr({
      title: `${inbound.protocol.toUpperCase()} Configuration (${client.email})`,
      vpnUrl: url,
      email: client.email,
    });
  };

  const copyUuid = (uuid: string) => {
    navigator.clipboard.writeText(uuid);
    setCopiedUuid(uuid);
    setTimeout(() => setCopiedUuid(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Subscription Services
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
              PROVISIONING
            </span>
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>Client Lifecycle Management</span>
            <span aria-hidden="true">·</span>
            <span>Inbound Gateways & Access Provisioning</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setNewIbRemark(`Node-${inbounds.length + 1}`);
              setNewIbPort(Math.floor(Math.random() * 20000 + 10000));
              setShowAddInboundModal(true);
            }}
            className="btn-real btn-real-secondary px-4 py-2 rounded-xl text-xs gap-2"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>New Inbound</span>
          </button>

          <button
            onClick={() => openAddClient(activeInbound?.id)}
            className="btn-real btn-real-primary px-4 py-2 rounded-xl text-xs gap-2"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Client</span>
          </button>
        </div>
      </div>

      {/* Inbound Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800/80 scrollbar-thin">
        {inbounds.map((ib) => {
          const isActive = (activeInbound?.id === ib.id);
          let clientCount = 0;
          try {
            const st = JSON.parse(ib.settings);
            clientCount = st.clients?.length || 0;
          } catch (e) {}

          return (
            <div
              key={ib.id}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl border-t border-x text-xs font-medium transition-all whitespace-nowrap cursor-pointer select-none ${
                isActive
                  ? 'bg-gradient-to-b from-slate-900 to-[#0f172a] border-slate-700 text-cyan-300 font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                  : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
              onClick={() => setSelectedInboundId(ib.id)}
            >
              <div className="flex items-center gap-2">
                <span className="uppercase text-[10px] px-2 py-0.5 rounded-md bg-cyan-950/70 text-cyan-400 font-mono font-bold border border-cyan-800/40">
                  {ib.protocol}
                </span>
                <span className="font-semibold">{ib.remark}</span>
                <span className="text-slate-500 font-mono">(:{ib.port})</span>
                <span className="text-[11px] text-slate-400 font-mono bg-slate-950/50 px-1.5 py-0.5 rounded border border-slate-800">{clientCount} users</span>
              </div>

              {inbounds.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteInboundTarget(ib);
                  }}
                  title="Delete Inbound"
                  className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors ml-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Inbound Details Bar */}
      {activeInbound && (
        <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="flex items-center gap-4 text-slate-300">
            <div>
              <span className="text-slate-500 block text-[11px]">INBOUND REMARK</span>
              <span className="font-semibold text-white">{activeInbound.remark}</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-slate-500 block text-[11px]">PROTOCOL & PORT</span>
              <span className="uppercase text-cyan-400 font-bold">{activeInbound.protocol}</span>
              <span className="text-white"> on :{activeInbound.port}</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-slate-500 block text-[11px]">TOTAL INBOUND DATA</span>
              <span className="text-white">{formatBytes(activeInbound.up + activeInbound.down)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openAddClient(activeInbound.id)}
              className="btn-real btn-real-cyan px-3 py-1.5 rounded-lg text-xs gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Client to this Inbound</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar for Clients */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={clientSearch}
            onChange={(e) => setClientSearch(e.target.value)}
            placeholder="Filter clients by email, remark, or UUID..."
            className="w-full bg-[#080c14] border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Status segmented control */}
        <div className="flex items-center bg-[#080c14] border border-slate-800 rounded-lg p-1 text-xs">
          {(['all', 'online', 'active', 'expired'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`btn-real px-3 py-1 rounded font-medium capitalize transition-all ${
                statusFilter === st
                  ? 'btn-real-secondary text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st === 'online' ? `Online (${clients.filter(c => onlineClientsList.includes(c.email)).length})` : st}
            </button>
          ))}
        </div>
      </div>

      {/* Clients Table */}
      <div className="rounded-xl bg-[#0f172a] border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-medium">
              <tr>
                <th className="py-3 px-4">Client Remark / Email</th>
                <th className="py-3 px-4">UUID Key</th>
                <th className="py-3 px-4 text-right">Data Usage</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4 text-center">IP Limit</th>
                <th className="py-3 px-4 text-center">State</th>
                <th className="py-3 px-4 text-right">Subscription Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-sans">
                    No clients found for current criteria. Click "Add Client" to provision one.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client, idx) => {
                  const stat = activeInbound?.clientStats?.find((s) => s.email === client.email);
                  const used = (stat?.up || 0) + (stat?.down || 0);
                  const total = client.totalGB || 107374182400;
                  const isExp = client.expiryTime > 0 && Date.now() > client.expiryTime;
                  const isOnline = onlineClientsList.includes(client.email) || onlineClientsList.includes(client.id) || (stat && ((stat.up || 0) + (stat.down || 0) > 0));
                  const pct = Math.min(100, (used / total) * 100).toFixed(0);

                  return (
                    <tr key={`sub-client-${client.id || client.email}-${idx}`} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-sans font-medium text-white">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isExp
                                ? 'bg-rose-500'
                                : isOnline
                                ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                                : client.enable
                                ? 'bg-emerald-400/50'
                                : 'bg-slate-500'
                            }`}
                          />
                          <span>{client.email}</span>
                          {isOnline && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-semibold flex items-center gap-1 shadow-sm">
                              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                              Online
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-slate-400 truncate max-w-[130px]">
                            {client.id}
                          </span>
                          <button
                            onClick={() => copyUuid(client.id)}
                            title="Copy UUID"
                            className="p-1 text-slate-500 hover:text-cyan-400 transition-colors"
                          >
                            {copiedUuid === client.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <span className="font-semibold text-white">{formatBytes(used)}</span>
                        <span className="text-slate-500"> / {formatBytes(total)}</span>
                        <div className="text-[10px] text-slate-400">({pct}% used)</div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={isExp ? 'text-rose-400 font-semibold' : 'text-slate-300'}>
                          {client.expiryTime > 0 ? new Date(client.expiryTime).toLocaleDateString() : 'Never'}
                        </span>
                        {client.expiryTime > 0 && (
                          <div className="text-[10px] text-slate-500">
                            {isExp
                              ? 'Expired'
                              : `${Math.ceil((client.expiryTime - Date.now()) / (86400 * 1000))}d left`}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        {client.limitIp ? `${client.limitIp} IPs` : 'Unlimited'}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleClientEnable(client, activeInbound.id)}
                          title={client.enable ? 'Disable client' : 'Enable client'}
                          className={`btn-real p-1.5 rounded-lg border transition-all ${
                            client.enable
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                              : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* QR Code */}
                          <button
                            onClick={() => openQrForClient(client, activeInbound)}
                            title="Show VPN QR & URI"
                            className="btn-real btn-real-secondary p-1.5 rounded-lg"
                          >
                            <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                          </button>

                          {/* Renew Client */}
                          <button
                            onClick={() => setRenewClientTarget({ client, inboundId: activeInbound.id })}
                            title="Renew subscription (extend expiry / add GB)"
                            className="btn-real btn-real-cyan px-2.5 py-1 rounded-lg font-sans font-medium text-[11px] gap-1"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Renew</span>
                          </button>

                          {/* Delete Client */}
                          <button
                            onClick={() => setDeleteClientTarget({ client, inboundId: activeInbound.id })}
                            title="Delete client"
                            className="btn-real btn-real-danger p-1.5 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD CLIENT */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#0d131f] border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base">Add New VPN Client</h3>
                  <p className="text-xs text-slate-400">Provision fresh credentials on inbound node</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddClientModal(false)}
                className="btn-real btn-real-secondary p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddClientSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Target Inbound Gateway
                </label>
                <select
                  value={newClientInboundId}
                  onChange={(e) => setNewClientInboundId(Number(e.target.value))}
                  className="w-full bg-[#080c14] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {inbounds.map((ib) => (
                    <option key={ib.id} value={ib.id}>
                      {ib.remark} ({ib.protocol.toUpperCase()} on port {ib.port})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Client Email / Remark Name
                </label>
                <input
                  type="text"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  required
                  placeholder="e.g. client-john@vpn"
                  className="w-full bg-[#080c14] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-300">
                    Client UUID
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateUuid}
                    className="btn-real btn-real-secondary px-2 py-0.5 rounded text-[11px] text-cyan-400 gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Auto-Generate</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={newClientUuid}
                  onChange={(e) => setNewClientUuid(e.target.value)}
                  required
                  className="w-full bg-[#080c14] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Traffic Allocation (GB)
                  </label>
                  <input
                    type="number"
                    value={newClientGb}
                    onChange={(e) => setNewClientGb(Number(e.target.value))}
                    min={1}
                    className="w-full bg-[#080c14] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Validity (Days)
                  </label>
                  <input
                    type="number"
                    value={newClientDays}
                    onChange={(e) => setNewClientDays(Number(e.target.value))}
                    min={0}
                    placeholder="0 = Unlimited"
                    className="w-full bg-[#080c14] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Max IP Devices
                  </label>
                  <input
                    type="number"
                    value={newClientIpLimit}
                    onChange={(e) => setNewClientIpLimit(Number(e.target.value))}
                    min={0}
                    className="w-full bg-[#080c14] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Flow Protocol
                  </label>
                  <select
                    value={newClientFlow}
                    onChange={(e) => setNewClientFlow(e.target.value)}
                    className="w-full bg-[#080c14] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="xtls-rprx-vision">xtls-rprx-vision</option>
                    <option value="">none</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddClientModal(false)}
                  className="btn-real btn-real-secondary px-4 py-2 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingClient}
                  className="btn-real btn-real-primary px-4 py-2 text-xs font-semibold rounded-lg gap-1.5"
                >
                  {savingClient && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Provision Client</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RENEW CLIENT */}
      {renewClientTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#0d131f] border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base">Renew Client Subscription</h3>
                  <p className="text-xs text-slate-400 font-mono">{renewClientTarget.client.email}</p>
                </div>
              </div>
              <button
                onClick={() => setRenewClientTarget(null)}
                className="btn-real btn-real-secondary p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRenewSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Add Days to Expiry
                </label>
                <div className="flex gap-2 mb-2">
                  {[7, 30, 90, 180].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setRenewDaysToAdd(d)}
                      className={`btn-real flex-1 py-1.5 rounded-lg border text-xs font-mono font-medium transition-colors cursor-pointer ${
                        renewDaysToAdd === d
                          ? 'btn-real-cyan'
                          : 'btn-real-secondary text-slate-400'
                      }`}
                    >
                      +{d}d
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={renewDaysToAdd}
                  onChange={(e) => setRenewDaysToAdd(Number(e.target.value))}
                  min={1}
                  className="w-full bg-[#080c14] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Add Extra Data Volume (GB)
                </label>
                <div className="flex gap-2 mb-2">
                  {[20, 50, 100, 200].map((gb) => (
                    <button
                      key={gb}
                      type="button"
                      onClick={() => setRenewGbToAdd(gb)}
                      className={`btn-real flex-1 py-1.5 rounded-lg border text-xs font-mono font-medium transition-colors cursor-pointer ${
                        renewGbToAdd === gb
                          ? 'btn-real-cyan'
                          : 'btn-real-secondary text-slate-400'
                      }`}
                    >
                      +{gb}GB
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={renewGbToAdd}
                  onChange={(e) => setRenewGbToAdd(Number(e.target.value))}
                  min={0}
                  className="w-full bg-[#080c14] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-200 block">Reset Consumed Traffic</span>
                  <span className="text-[11px] text-slate-500">Zero out download/upload counters</span>
                </div>
                <input
                  type="checkbox"
                  checked={resetTrafficOnRenew}
                  onChange={(e) => setResetTrafficOnRenew(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 text-cyan-600 focus:ring-cyan-500"
                />
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setRenewClientTarget(null)}
                  className="btn-real btn-real-secondary px-4 py-2 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={renewing}
                  className="btn-real btn-real-primary px-4 py-2 text-xs font-semibold rounded-lg gap-1.5"
                >
                  {renewing && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirm Renewal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CLIENT CONFIRMATION */}
      {deleteClientTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm bg-[#0d131f] border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-center gap-3 text-rose-400 mb-3">
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white text-base">Delete Client?</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to remove client <strong className="text-white font-mono">{deleteClientTarget.client.email}</strong>? They will immediately lose access to this inbound node.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setDeleteClientTarget(null)}
                className="btn-real btn-real-secondary px-4 py-2 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteClientSubmit}
                className="btn-real btn-real-danger px-4 py-2 text-xs font-semibold rounded-lg"
              >
                Delete Client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD INBOUND */}
      {showAddInboundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#0d131f] border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base">New Inbound Gateway</h3>
                  <p className="text-xs text-slate-400">Add routing protocol endpoint to 3x-UI</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddInboundModal(false)}
                className="btn-real btn-real-secondary p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddInboundSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Inbound Remark
                </label>
                <input
                  type="text"
                  value={newIbRemark}
                  onChange={(e) => setNewIbRemark(e.target.value)}
                  required
                  placeholder="e.g. VLESS-Reality-Direct"
                  className="w-full bg-[#080c14] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Protocol
                  </label>
                  <select
                    value={newIbProtocol}
                    onChange={(e: any) => setNewIbProtocol(e.target.value)}
                    className="w-full bg-[#080c14] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="vless">VLESS</option>
                    <option value="vmess">VMess</option>
                    <option value="trojan">Trojan</option>
                    <option value="shadowsocks">Shadowsocks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Listening Port
                  </label>
                  <input
                    type="number"
                    value={newIbPort}
                    onChange={(e) => setNewIbPort(Number(e.target.value))}
                    min={1}
                    max={65535}
                    required
                    className="w-full bg-[#080c14] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Network Transport
                  </label>
                  <select
                    value={newIbNetwork}
                    onChange={(e) => setNewIbNetwork(e.target.value)}
                    className="w-full bg-[#080c14] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="tcp">TCP</option>
                    <option value="ws">WebSocket (WS)</option>
                    <option value="grpc">gRPC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Security
                  </label>
                  <select
                    value={newIbSecurity}
                    onChange={(e) => setNewIbSecurity(e.target.value)}
                    className="w-full bg-[#080c14] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="reality">Reality</option>
                    <option value="tls">TLS</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddInboundModal(false)}
                  className="btn-real btn-real-secondary px-4 py-2 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingInbound}
                  className="btn-real btn-real-primary px-4 py-2 text-xs font-semibold rounded-lg gap-1.5"
                >
                  {savingInbound && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create Inbound</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE INBOUND CONFIRMATION */}
      {deleteInboundTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm bg-[#0d131f] border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-center gap-3 text-rose-400 mb-3">
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white text-base">Delete Inbound?</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to delete inbound <strong className="text-white font-mono">{deleteInboundTarget.remark}</strong> (Port {deleteInboundTarget.port})? All clients associated with this port will be disconnected.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setDeleteInboundTarget(null)}
                className="btn-real btn-real-secondary px-4 py-2 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteInboundSubmit}
                className="btn-real btn-real-danger px-4 py-2 text-xs font-semibold rounded-lg"
              >
                Delete Inbound
              </button>
            </div>
          </div>
        </div>
      )}

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
