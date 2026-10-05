import { useState } from 'react';
import { Shield, KeyRound, Eye, EyeOff, Lock, Server, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

interface Props {
  onSuccess: (user: { username: string }) => void;
}

export function LoginModal({ onSuccess }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please provide authentication credentials');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.login(username.trim(), password.trim());
      if (res.success) {
        localStorage.setItem('xview_auth_token', res.token);
        localStorage.setItem('xview_auth_user', JSON.stringify(res.user));
        onSuccess(res.user);
      } else {
        setError(res.message || 'Invalid credentials. Access denied.');
      }
    } catch (err: any) {
      setError('Authentication failed. Server could not be reached.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickAccess = () => {
    setUsername('sudhbuYH45u');
    setPassword('sudhbuYH45u');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060a12]/95 backdrop-blur-md">
      {/* Decorative ambient subtle glow */}
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#0d131f] border border-slate-800 rounded-2xl shadow-2xl p-8 text-slate-100">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center shadow-inner text-cyan-400 mb-4">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">X-VIWE SUITE</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Next-generation 3x-UI network gateway, realtime telemetry & Telegram bot controller
          </p>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-mono truncate">sudda.store:7575</span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Gateway Ready
          </span>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form with strict Anti-Autofill protection */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
          autoComplete="off"
          data-lpignore="true"
        >
          {/* Fake hidden dummy inputs to confuse browser autofill engines */}
          <input type="text" name="fakeusernameremembered" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
          <input type="password" name="fakepasswordremembered" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Operator / Panel Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                data-lpignore="true"
                data-form-type="other"
                placeholder="Enter access ID"
                className="w-full bg-[#080c14] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
                <KeyRound className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Panel Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                data-lpignore="true"
                data-form-type="other"
                placeholder="••••••••••••"
                className="w-full bg-[#080c14] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-cyan-900/30 flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Authorize & Connect Suite</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Configured Credentials Helper */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={fillQuickAccess}
            className="text-xs text-slate-400 hover:text-cyan-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Use Configured Server Passkey</span>
          </button>
        </div>
      </div>
    </div>
  );
}
