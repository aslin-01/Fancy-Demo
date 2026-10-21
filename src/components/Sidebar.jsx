import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  Settings,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { theme } from '../theme';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Saree Catalog', icon: ShoppingBag, badge: 'Active' },
    { id: 'orders', label: 'Orders', icon: Package, badge: 'Live' },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0 shrink-0 select-none shadow-sm">
      {/* Brand Header */}
      <div className="p-5 border-b border-border bg-[#FAF8F2]">
        <div className="flex items-center gap-3">
          <img
            src="/favicon.png"
            alt="CF Handlooms logo"
            className="w-10 h-10 object-contain shrink-0"
          />
          <div className="flex flex-col">
            <span className={theme.typography.cursiveBrand}>
              CF Handlooms
            </span>
            <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-semibold">
              Admin Portal
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.18em] px-3 mb-2">
          Management
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#B87802] to-[#996300] text-white border border-[#F5B815]/30 shadow-md font-semibold'
                  : 'text-foreground/80 hover:text-foreground hover:bg-secondary/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#FEE63E]' : 'text-muted-foreground'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-sm font-semibold tracking-wide ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.badge === 'Live'
                      ? theme.badges.newArrival
                      : theme.badges.discount
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-6 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.18em] px-3 mb-2">
          Storefront
        </div>
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-md text-sm font-medium text-foreground/80 hover:text-[#B87802] hover:bg-secondary/60 border border-transparent hover:border-[#E8D8B5] transition-all duration-200 group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-[#B87802] group-hover:scale-110 transition-transform" />
            <span>Customer Website</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-[#B87802]" />
        </a>
      </nav>

      {/* Admin Profile Footer */}
      <div className="p-4 border-t border-border bg-[#FAF8F2]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#B87802] to-[#996300] text-white border border-[#F5B815]/40 flex items-center justify-center font-semibold text-xs shadow-sm">
              CF
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-foreground truncate">CF Admin</p>
              <p className="text-[10px] text-muted-foreground tracking-wider uppercase truncate">Super Admin</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
