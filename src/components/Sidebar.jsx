import React from 'react';
import { 
  LayoutDashboard, 
  PackagePlus, 
  ShoppingBag, 
  ShieldCheck, 
  ExternalLink, 
  Activity,
  Sparkles
} from 'lucide-react';
import { STORE_URL } from '../services/api';

export function Sidebar({ activeTab, setActiveTab, backendOnline, productCount }) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'products',
      label: 'Products',
      icon: ShoppingBag,
      badge: productCount !== null ? productCount : null,
    },
    {
      id: 'user-access',
      label: 'User Access',
      icon: ShieldCheck,
      badge: 'Roles',
    },
  ];

  return (
    <aside className="w-72 bg-[#0C0A07] text-[#FAF8F2] flex flex-col justify-between border-r border-[#241F18] select-none h-screen sticky top-0 z-30">
      {/* Brand Header — Styled exactly like http://localhost:3000/ Header */}
      <div>
        <div className="p-6 border-b border-[#241F18] bg-gradient-to-b from-[#14100B] to-[#0C0A07]">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#FEE63E] via-[#F5B815] to-[#B87802] text-[#0C0A07] flex items-center justify-center font-bold text-xl shadow-lg shadow-[#B87802]/30 tracking-wider">
              CF
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-cursive text-2xl leading-none text-[#F5B815] truncate">
                  CF Handlooms
                </span>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-sm bg-[#B87802] text-white border border-[#F5B815]/40 shrink-0">
                  Admin
                </span>
              </div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#A89D8B] font-medium mt-0.5">
                Handwoven Heritage
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items (Dashboard, Products, User Access ONLY) */}
        <nav className="px-3 py-2 space-y-1.5">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#736858]">
            Main Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs tracking-wide uppercase font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#B87802] to-[#996300] text-white border border-[#F5B815]/40 shadow-lg shadow-[#B87802]/25'
                    : 'text-[#D9CEBA] hover:bg-[#1C1813] hover:text-[#F5B815]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-[#FEE63E]' : 'text-[#A89D8B]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-[#0C0A07]/40 text-[#FEE63E]'
                        : 'bg-[#241F18] text-[#F5B815] border border-[#382E21]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Section: Store Link & Live Status */}
      <div className="p-4 border-t border-[#241F18] space-y-3 bg-[#080705]">
        {/* Link to http://localhost:3000 with website brand colors */}
        <a
          href={STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-[#14100B] border border-[#B87802]/40 hover:border-[#F5B815] text-[#F5B815] hover:text-[#FEE63E] transition-all text-xs font-semibold group shadow-sm"
          title="Open live customer store at http://localhost:3000/"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="tracking-wide">Store Preview</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#A89D8B] group-hover:text-[#F5B815]">
            <span>localhost:3000</span>
            <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </a>

        {/* Backend Connectivity Status */}
        <div className="px-3 py-2 rounded-md bg-[#120F0B] flex items-center justify-between text-xs text-[#8F8372]">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-[#B87802]" />
            <span className="text-[11px]">Backend API</span>
          </div>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
              backendOnline
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : 'bg-rose-950 text-rose-400 border border-rose-800'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                backendOnline ? 'bg-emerald-400' : 'bg-rose-400'
              }`}
            />
            {backendOnline ? 'Online (5000)' : 'Offline'}
          </span>
        </div>

        {/* User Access Identity Badge */}
        <div className="flex items-center gap-3 pt-1 px-1">
          <div className="w-8 h-8 rounded-full bg-[#1C1813] border border-[#B87802]/50 flex items-center justify-center text-xs font-bold text-[#F5B815]">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">Super Admin</p>
            <p className="text-[10px] uppercase tracking-wider text-[#A89D8B] truncate">CF Handlooms</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
