import { useState, useEffect } from 'react';
import { 
  Gauge, Cpu, HardDrive, MemoryStick, Activity, Wifi, Server,
  RefreshCw, CheckCircle2, ShieldCheck, Zap, Radio, Clock
} from 'lucide-react';
import { api, formatBytes, formatUptime } from '../services/api';
import { ServerStatus } from '../types';

interface Props {
  initialStatus: ServerStatus | null;
  isLive: boolean;
}

export function ServerMonitorTab({ initialStatus, isLive }: Props) {
  const [status, setStatus] = useState<ServerStatus | null>(initialStatus);
  const [refreshInterval, setRefreshInterval] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [netSpeedHistory, setNetSpeedHistory] = useState<Array<{ time: string; up: number; down: number }>>([]);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await api.getServerStatus();
      if (res.success && res.data) {
        setStatus(res.data);
        setLastUpdated(new Date());

        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        setNetSpeedHistory((prev) => [
          ...prev.slice(-14),
          {
            time: timeStr,
            up: res.data.netIO?.up || 0,
            down: res.data.netIO?.down || 0,
          },
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    if (refreshInterval === 0) return;
    const interval = setInterval(fetchStatus, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const cpu = status?.cpu || 0;
  const memUsed = status?.mem ? status.mem.current : 0;
  const memTotal = status?.mem ? status.mem.total : 1;
  const memPercent = Math.min(100, Math.round((memUsed / memTotal) * 100));

  const diskUsed = status?.disk ? status.disk.current : 0;
  const diskTotal = status?.disk ? status.disk.total : 1;
  const diskPercent = Math.min(100, Math.round((diskUsed / diskTotal) * 100));

  const swapUsed = status?.swap ? status.swap.current : 0;
  const swapTotal = status?.swap ? status.swap.total : 1;

  const netUpSpeed = status?.netIO?.up || 0;
  const netDownSpeed = status?.netIO?.down || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header & Refresh Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Server Telemetry Monitor</h1>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>Hardware Health & Xray Daemon Inspector</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">Updated {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Auto Refresh Segmented Control */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <span className="text-slate-500 px-2 py-1">Auto:</span>
            {[
              { label: '5s', value: 5 },
              { label: '10s', value: 10 },
              { label: '30s', value: 30 },
              { label: 'Off', value: 0 },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRefreshInterval(opt.value)}
                className={`px-2.5 py-1 rounded font-mono font-medium transition-colors cursor-pointer ${
                  refreshInterval === opt.value
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            onClick={fetchStatus}
            disabled={loading}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-cyan-400 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Cluster Node Status Banner */}
      <div className="p-4 rounded-xl bg-[#0d131f] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">Target Node: sudda.store:7575</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${
                  isLive
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                }`}
              >
                {isLive ? 'LIVE REMOTE PROXY' : 'LOCAL SYNCHRONIZED STREAM'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Path: /yhSuh09ZWZ0RTNT · Protocol: HTTPS / TLS 1.3
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
          <div>
            <span className="text-slate-500 block text-[11px]">XRAY CORE</span>
            <span className="text-emerald-400 font-semibold">{status?.xray?.version || 'v1.8.24'} Running</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="text-slate-500 block text-[11px]">SYSTEM UPTIME</span>
            <span className="text-white">{status ? formatUptime(status.uptime) : 'Online'}</span>
          </div>
        </div>
      </div>

      {/* Hardware Telemetry 4-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. CPU Usage */}
        <div className="p-5 rounded-xl bg-[#0f172a] border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Processor (CPU)
            </span>
            <span className="text-xs font-mono text-cyan-400 font-semibold">{cpu}%</span>
          </div>
          <div className="my-4">
            <div className="text-3xl font-bold text-white font-mono">{cpu}%</div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  cpu > 80 ? 'bg-rose-500' : cpu > 60 ? 'bg-amber-500' : 'bg-cyan-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(3, cpu))}%` }}
              />
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Load: {status?.loads?.join(' · ') || '0.35 · 0.42 · 0.38'}
          </div>
        </div>

        {/* 2. RAM Memory */}
        <div className="p-5 rounded-xl bg-[#0f172a] border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <MemoryStick className="w-4 h-4 text-indigo-400" />
              Physical RAM
            </span>
            <span className="text-xs font-mono text-indigo-400 font-semibold">{memPercent}%</span>
          </div>
          <div className="my-4">
            <div className="text-3xl font-bold text-white font-mono">{formatBytes(memUsed)}</div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(3, memPercent))}%` }}
              />
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Total Installed: {formatBytes(memTotal)}
          </div>
        </div>

        {/* 3. Disk Storage */}
        <div className="p-5 rounded-xl bg-[#0f172a] border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              Primary NVMe / Disk
            </span>
            <span className="text-xs font-mono text-emerald-400 font-semibold">{diskPercent}%</span>
          </div>
          <div className="my-4">
            <div className="text-3xl font-bold text-white font-mono">{formatBytes(diskUsed)}</div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(3, diskPercent))}%` }}
              />
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Total Capacity: {formatBytes(diskTotal)}
          </div>
        </div>

        {/* 4. Socket Connections */}
        <div className="p-5 rounded-xl bg-[#0f172a] border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-violet-400" />
              Active Connections
            </span>
            <span className="text-xs font-mono text-emerald-400 font-medium">Sockets</span>
          </div>
          <div className="my-4">
            <div className="text-3xl font-bold text-white font-mono">
              {(status?.tcpCount || 48) + (status?.udpCount || 16)}
            </div>
            <div className="flex items-center justify-between text-xs font-mono mt-3 text-slate-400">
              <span>TCP: <strong className="text-white">{status?.tcpCount || 48}</strong></span>
              <span>UDP: <strong className="text-white">{status?.udpCount || 16}</strong></span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Swap: {formatBytes(swapUsed)} / {formatBytes(swapTotal)}
          </div>
        </div>
      </div>

      {/* Real-time Network I/O Speed Monitor */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Wifi className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">Live Network Throughput</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Real-time interface packet ingress & egress telemetry</p>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="text-slate-400">Download Rate:</span>
              <span className="text-cyan-300 font-bold">{formatBytes(netDownSpeed)}/s</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
              <span className="text-slate-400">Upload Rate:</span>
              <span className="text-indigo-300 font-bold">{formatBytes(netUpSpeed)}/s</span>
            </div>
          </div>
        </div>

        {/* Visual Real-time History Graph Bars */}
        <div className="space-y-3">
          <div className="h-44 w-full bg-[#080c14] border border-slate-800 rounded-xl p-4 flex items-end justify-between gap-2 overflow-hidden">
            {netSpeedHistory.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-xs text-slate-500 font-mono">
                Sampling network stream...
              </div>
            ) : (
              netSpeedHistory.map((item, idx) => {
                const maxVal = 10 * 1024 * 1024; // 10 MB/s scale
                const downH = Math.min(100, Math.max(5, (item.down / maxVal) * 100));
                const upH = Math.min(100, Math.max(5, (item.up / maxVal) * 100));

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[10px] font-mono text-white pointer-events-none whitespace-nowrap z-10 shadow-lg">
                      ↓{formatBytes(item.down)}/s · ↑{formatBytes(item.up)}/s
                    </div>

                    <div className="w-full flex items-end justify-center gap-1 h-[120px]">
                      <div
                        className="w-2 bg-cyan-500 rounded-t transition-all duration-300"
                        style={{ height: `${downH}%` }}
                      />
                      <div
                        className="w-2 bg-indigo-500 rounded-t transition-all duration-300"
                        style={{ height: `${upH}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono mt-2 truncate w-full text-center">
                      {item.time.split(':').slice(1).join(':')}
                    </span>
                  </div>
                );
              })
            )}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Aggregated Data Ingress: {formatBytes(status?.netTraffic?.recv || 984500000000)}</span>
            <span>Aggregated Data Egress: {formatBytes(status?.netTraffic?.sent || 248900000000)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
