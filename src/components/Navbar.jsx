import React from 'react';
import { ExternalLink, RefreshCw, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';

export const Navbar = ({ title, subtitle, onRefresh, isRefreshing }) => {
  const { backendOnline, logout } = useAuth();

  return (
    <header className="h-18 bg-card/95 backdrop-blur border-b border-border px-8 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h2 className="text-xl font-semibold font-display text-foreground">{title}</h2>
        {subtitle && <p className={theme.typography.bodyMuted}>{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Backend health status badge */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
            backendOnline
              ? theme.colors.status.success
              : theme.colors.status.warning
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full animate-pulse ${
              backendOnline ? 'bg-emerald-600' : 'bg-amber-600'
            }`}
          />
          <Database className="w-3.5 h-3.5" />
          <span>{backendOnline ? 'API & Database Live' : 'Demo Local Mode'}</span>
        </div>

        {/* Refresh button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-colors border border-border cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#B87802]' : ''}`} />
          </button>
        )}

        {/* Visit store button */}
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-[#B87802] px-4 py-1.5 text-xs font-medium tracking-[0.08em] uppercase text-[#B87802] bg-transparent transition-all duration-200 hover:bg-[#B87802] hover:text-white active:scale-[0.98] cursor-pointer"
        >
          <span>Live Store</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        {/* Logout */}
        <button
          onClick={logout}
          className="text-xs px-3 py-1.5 rounded-md border border-border bg-card hover:bg-destructive hover:text-white text-muted-foreground transition-all duration-200 font-medium cursor-pointer"
        >
          Logout
        </button>
      </div>
    </header>
  );
};
