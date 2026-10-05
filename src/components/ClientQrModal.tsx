import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Check, Copy, Download, QrCode, X, ShieldCheck } from 'lucide-react';

interface Props {
  title: string;
  vpnUrl: string;
  email?: string;
  onClose: () => void;
}

export function ClientQrModal({ title, vpnUrl, email, onClose }: Props) {
  const [qrSrc, setQrSrc] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (vpnUrl) {
      QRCode.toDataURL(vpnUrl, {
        width: 360,
        margin: 2,
        color: {
          dark: '#080c14',
          light: '#ffffff',
        },
      })
        .then(setQrSrc)
        .catch(console.error);
    }
  }, [vpnUrl]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(vpnUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQr = () => {
    const a = document.createElement('a');
    a.href = qrSrc;
    a.download = `${email || 'vpn-config'}-qr.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#0f172a] border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base leading-tight">{title}</h3>
              {email && <p className="text-xs text-slate-400 font-mono mt-0.5">{email}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 flex flex-col items-center">
          <div className="p-3 bg-white rounded-xl shadow-lg border border-slate-200">
            {qrSrc ? (
              <img src={qrSrc} alt="VPN QR Code" className="w-64 h-64 rounded-lg block" />
            ) : (
              <div className="w-64 h-64 flex items-center justify-center text-slate-400 text-xs">
                Generating QR Code...
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Scan with v2rayNG, Nekoray, Shadowrocket, or Streisand</span>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <label className="text-xs font-medium text-slate-400">VPN Configuration URI</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={vpnUrl}
              className="w-full bg-[#080c14] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 truncate focus:outline-none"
            />
            <button
              onClick={copyToClipboard}
              className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={downloadQr}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-2 border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Save QR Image</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
