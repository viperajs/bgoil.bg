'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, User, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { inputClass } from '@/components/admin/ui';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Грешно потребителско име или парола');
      }
    } catch {
      setError('Възникна грешка при влизане');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(239,68,68,0.08), transparent 65%)', filter: 'blur(80px)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/bg-oil-logo.webp" alt="BG OIL" className="h-10 w-auto object-contain mx-auto mb-5" />
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/[0.07] border border-primary/20 mb-4">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Защитена зона</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
            Админ вход
          </h1>
          <p className="text-sm text-white/35 mt-1.5">Въведете вашите данни за достъп</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-6 sm:p-7 space-y-5 shadow-2xl"
        >
          <div>
            <label htmlFor="username" className="block text-xs font-semibold uppercase tracking-[0.12em] text-white/45 mb-2">
              Потребителско име
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <input
                id="username"
                className={`${inputClass} pl-10`}
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-[0.12em] text-white/45 mb-2">
              Парола
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <input
                id="password"
                className={`${inputClass} pl-10`}
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div role="alert" className="text-sm font-semibold text-red-300 bg-red-500/[0.08] border border-red-500/25 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-red-500 text-sm font-bold text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_28px_rgba(239,68,68,0.3)]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Влизане…
              </>
            ) : (
              <>
                Влез
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-white/25 mt-6">BG OIL Враца • Административна система</p>
      </div>
    </div>
  );
}
