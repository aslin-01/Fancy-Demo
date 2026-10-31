import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';

export const LoginPage = ({ onNotify }) => {
  const { login, quickAdminLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      onNotify('Welcome back, Admin!');
    } catch (err) {
      onNotify(err.message || 'Invalid email or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    setLoading(true);
    try {
      await quickAdminLogin();
      onNotify('Logged in with Super Admin privileges!');
    } catch (err) {
      onNotify(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative luxury lighting */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#F5B815]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#B87802]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-card border border-border rounded-lg p-8 relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <img
            src="/favicon.png"
            alt="CF Handlooms logo"
            className="w-16 h-16 mx-auto object-contain mb-3"
          />
          <div className="flex flex-col items-center">
            <span className={theme.typography.cursiveBrand}>
              CF Handlooms
            </span>
            <div className={theme.dividers.goldCentered} />
            <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-semibold mt-3">
              Administrative Portal
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className={theme.forms.label}>Email Address</label>
            <div className="relative mt-1.5">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cfhandlooms.com"
                className={`pl-9 ${theme.forms.input}`}
              />
            </div>
          </div>

          <div>
            <label className={theme.forms.label}>Password</label>
            <div className="relative mt-1.5">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`pl-9 ${theme.forms.input}`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 ${theme.buttons.primaryWide}`}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </form>

        {/* 1-Click Quick Demo Login */}
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-[11px] text-muted-foreground text-center mb-3">
            Instant Access for Administrative Testing:
          </p>
          <button
            onClick={handleQuickLogin}
            disabled={loading}
            className={`w-full ${theme.buttons.outline}`}
          >
            <ShieldCheck className="w-4 h-4 mr-2" />
            <span>1-Click Super Admin Login</span>
          </button>
          <p className="text-[10px] text-muted-foreground text-center mt-3">
            Default credentials: <span className="font-body text-foreground font-semibold">admin@cfhandlooms.com / admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
};
