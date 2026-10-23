import React from 'react';
import { 
  ExternalLink, 
  RefreshCw, 
  ShieldCheck, 
  LayoutDashboard, 
  ShoppingBag
} from 'lucide-react';
import { STORE_URL } from '../services/api';

export function Header({ activeTab, onRefresh, isRefreshing, backendOnline }) {
  const getPageInfo = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Store Executive Dashboard',
          subtitle: 'Real-time overview of revenue, inventory, sales trends, and live catalogue',
          icon: LayoutDashboard,
        };
      case 'products':
        return {
          title: 'Product Catalog & Management',
          subtitle: 'View, filter, manage, and add handloom sarees synchronized with localhost:3000',
          icon: ShoppingBag,
        };
      case 'user-access':
        return {
          title: 'User Access & Permissions Setup',
          subtitle: 'Configure administrator roles, staff credentials, access levels, and security controls',
          icon: ShieldCheck,
        };
      default:
        return {
          title: 'Admin Portal',
          subtitle: 'CF Handlooms Store Management',
          icon: LayoutDashboard,
        };
    }
  };

  const pageInfo = getPageInfo();
  const Icon = pageInfo.icon;

  return (
    <header className="sticky top-0 z-20">
      {/* Top Gold Border Announcement Bar matching http://localhost:3000/ */}
      <div className="bg-[#0C0A07] text-[#F5B815] border-b border-[#F5B815]/20 px-8 py-1.5 flex items-center justify-between text-[11px] tracking-[0.18em] uppercase font-medium">
        <span>CF Handlooms Luxury Admin Suite • Connected to MongoDB</span>
        <div className="flex items-center gap-3">
          <span className="text-[#A89D8B] normal-case tracking-normal">Storefront:</span>
          <a
            href={STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F5B815] hover:text-[#FEE63E] underline font-bold flex items-center gap-1"
          >
            http://localhost:3000
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="bg-[#FAF8F2]/95 backdrop-blur-md border-b border-[#E8D8B5] px-8 py-4 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Title & Description */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-white border border-[#E8D8B5] flex items-center justify-center text-[#B87802] shadow-xs">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-[#12100D] font-display tracking-tight flex items-center gap-2">
              {pageInfo.title}
            </h1>
            <p className="text-xs text-[#6B6457] font-body">
              {pageInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2.5 rounded-md border border-[#E8D8B5] bg-white text-[#6B6457] hover:text-[#B87802] hover:border-[#B87802] active:scale-95 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
            title="Refresh data from backend"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#B87802]' : ''}`} />
          </button>

          {/* View Store Button matching website secondary button */}
          <a
            href={STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-[#B87802] bg-white text-[#B87802] hover:bg-[#B87802] hover:text-white text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-xs group"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Store Preview</span>
            <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
