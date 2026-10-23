import React from 'react';
import { 
  IndianRupee, 
  ShoppingBag, 
  PackagePlus, 
  Users, 
  TrendingUp, 
  AlertCircle, 
  ExternalLink, 
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { STORE_URL } from '../services/api';

const GOLD_PALETTE = ['#B87802', '#F5B815', '#FEE63E', '#800000', '#0C0A07'];

export function DashboardView({
  stats,
  products = [],
  onNavigateProducts,
  onNavigateUserAccess,
}) {
  const overview = stats?.overview || {};
  const revenueTrend = stats?.revenueTrend || [
    { month: 'May', revenue: 9881, orders: 1 },
    { month: 'Jun', revenue: 10523, orders: 1 },
    { month: 'Jul', revenue: 11164, orders: 1 },
    { month: 'Aug', revenue: 11806, orders: 1 },
    { month: 'Sep', revenue: 12448, orders: 1 },
    { month: 'Oct', revenue: 13089, orders: 2 },
  ];

  const categoryStats = stats?.categoryStats || [
    { name: 'Silk', count: 4, avgPrice: 11249 },
    { name: 'Wedding', count: 2, avgPrice: 30999 },
    { name: 'Cotton', count: 2, avgPrice: 2899 },
    { name: 'Designer', count: 2, avgPrice: 7749 },
    { name: 'Party Wear', count: 1, avgPrice: 11499 },
  ];

  const totalProducts = products.length || overview.totalProducts || 11;
  const totalRevenue = overview.totalRevenue || 76995;
  const totalOrders = overview.totalOrders || 4;

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner — Website Onyx (#0C0A07) & Emblem Gold (#F5B815) */}
      <div className="relative overflow-hidden rounded-lg bg-[#0C0A07] border border-[#F5B815]/30 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#1A1610] text-[#F5B815] border border-[#F5B815]/40 text-xs font-semibold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Connected to Storefront: http://localhost:3000/
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold font-display tracking-tight text-[#FAF8F2]">
              CF Handlooms Admin Portal
            </h2>
            <p className="text-xs sm:text-sm text-[#D9CEBA] font-body leading-relaxed">
              Curate and publish authentic handwoven sarees. Every product and price update here reflects instantaneously on your live storefront.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <a
              href={STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3.5 rounded-md border border-[#F5B815]/50 bg-[#14100B] text-[#F5B815] hover:bg-[#B87802] hover:text-white text-xs font-semibold uppercase tracking-wider transition-all duration-200 group shadow-md"
            >
              <span>View Storefront (localhost:3000)</span>
              <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        {/* Ambient gold glow matching website banner */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-[#F5B815]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4 Stat Cards with website luxury hover shadow [0_16px_40px_-16px_rgba(184,120,2,0.25)] */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Products */}
        <div 
          onClick={onNavigateProducts}
          className="bg-white rounded-lg border border-[#E8D8B5] p-5 transition-all duration-300 hover:shadow-[0_16px_40px_-16px_rgba(184,120,2,0.25)] hover:border-[#B87802] cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#6B6457]">
              Live Products
            </span>
            <div className="w-9 h-9 rounded-md bg-[#FAF8F2] border border-[#E8D8B5] flex items-center justify-center text-[#B87802] group-hover:bg-[#B87802] group-hover:text-white transition-colors">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-semibold font-display text-[#B87802]">
              {totalProducts}
            </span>
            <span className="text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-sm bg-[#0C0A07] text-[#F5B815] border border-[#F5B815]/30">
              On Store
            </span>
          </div>
          <p className="text-[11px] text-[#6B6457] mt-1.5 flex items-center gap-1 font-body">
            <span>Click to view product catalog</span>
            <ArrowUpRight className="w-3 h-3 text-[#B87802]" />
          </p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-lg border border-[#E8D8B5] p-5 transition-all duration-300 hover:shadow-[0_16px_40px_-16px_rgba(184,120,2,0.25)] hover:border-[#B87802]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#6B6457]">
              Store Revenue
            </span>
            <div className="w-9 h-9 rounded-md bg-[#FAF8F2] border border-[#E8D8B5] flex items-center justify-center text-[#B87802]">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-semibold font-display text-[#12100D]">
              ₹{Number(totalRevenue).toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +14.2%
            </span>
          </div>
          <p className="text-[11px] text-[#6B6457] mt-1.5 font-body">
            Average order value: ₹19,249
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-lg border border-[#E8D8B5] p-5 transition-all duration-300 hover:shadow-[0_16px_40px_-16px_rgba(184,120,2,0.25)] hover:border-[#B87802]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#6B6457]">
              Customer Orders
            </span>
            <div className="w-9 h-9 rounded-md bg-[#FAF8F2] border border-[#E8D8B5] flex items-center justify-center text-[#B87802]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-semibold font-display text-[#12100D]">
              {totalOrders}
            </span>
            <span className="text-[11px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-sm border border-sky-200">
              1 Pending
            </span>
          </div>
          <p className="text-[11px] text-[#6B6457] mt-1.5 font-body">
            All orders processed smoothly
          </p>
        </div>

        {/* User Access Setup Pill */}
        <div 
          onClick={onNavigateUserAccess}
          className="bg-white rounded-lg border border-[#E8D8B5] p-5 transition-all duration-300 hover:shadow-[0_16px_40px_-16px_rgba(184,120,2,0.25)] hover:border-[#B87802] cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#6B6457]">
              User Access
            </span>
            <div className="w-9 h-9 rounded-md bg-[#FAF8F2] border border-[#E8D8B5] flex items-center justify-center text-[#B87802] group-hover:bg-[#B87802] group-hover:text-white transition-colors">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-semibold font-display text-[#12100D]">
              Setup
            </span>
            <span className="text-[11px] font-bold text-[#F5B815] bg-[#0C0A07] px-2 py-0.5 rounded-sm border border-[#F5B815]/40 uppercase tracking-wider">
              Super Admin
            </span>
          </div>
          <p className="text-[11px] text-[#6B6457] mt-1.5 flex items-center gap-1 font-body">
            <span>Manage staff roles & permissions</span>
            <ArrowUpRight className="w-3 h-3 text-[#B87802]" />
          </p>
        </div>

      </div>

      {/* Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Revenue Trend Area Chart */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-[#E8D8B5] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-xl font-semibold text-[#12100D]">
                Sales & Revenue Trajectory
              </h3>
              <p className="text-xs text-[#6B6457] font-body">
                Monthly performance overview for handloom sarees
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-sm bg-[#FAF8F2] text-[#B87802] border border-[#E8D8B5]">
              Last 6 Months
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F5B815" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#B87802" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#A89D8B" fontSize={12} tickLine={false} />
                <YAxis 
                  stroke="#A89D8B" 
                  fontSize={12} 
                  tickLine={false} 
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} 
                />
                <Tooltip 
                  formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#0C0A07', borderColor: '#F5B815', borderRadius: '8px', color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#B87802" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#goldGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Bar Chart */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-[#E8D8B5] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-xl font-semibold text-[#12100D]">
                Category Distribution
              </h3>
              <span className="text-xs text-[#6B6457]">By Product Count</span>
            </div>
            <p className="text-xs text-[#6B6457] font-body mb-4">
              Breakdown of sarees currently showcased across store categories
            </p>

            <div className="space-y-3">
              {categoryStats.map((cat, idx) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#12100D]">{cat.name}</span>
                    <span className="text-[#6B6457]">
                      {cat.count} items • Avg ₹{Number(cat.avgPrice).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#FAF8F2] rounded-full overflow-hidden border border-[#E8D8B5]/50">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${Math.min(100, (cat.count / Math.max(...categoryStats.map(c => c.count))) * 100)}%`,
                        backgroundColor: GOLD_PALETTE[idx % GOLD_PALETTE.length]
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#E8D8B5]/60 flex items-center justify-between">
            <span className="text-xs text-[#6B6457]">View all active categories</span>
            <button
              onClick={onNavigateProducts}
              className="text-xs font-bold uppercase tracking-wider text-[#B87802] hover:text-[#996300] flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Catalog</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Recent Products Showcase */}
      <div className="bg-white rounded-lg border border-[#E8D8B5] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-2xl font-semibold text-[#12100D]">
              Recently Added Handloom Sarees
            </h3>
            <p className="text-xs text-[#6B6457] font-body">
              Latest products synchronized with the live catalog at localhost:3000
            </p>
          </div>
          <button
            onClick={onNavigateProducts}
            className="text-xs font-bold uppercase tracking-wider text-[#B87802] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({products.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {products.slice(0, 4).map((p) => (
            <div
              key={p._id || p.id}
              className="rounded-lg border border-[#E8D8B5] p-3 bg-[#FAF8F2] flex items-center gap-3 hover:border-[#B87802] hover:shadow-sm transition-all"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-14 h-14 rounded-md object-cover border border-[#E8D8B5] shrink-0"
                onError={(e) => {
                  e.target.src =
                    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80';
                }}
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B87802]">
                  {p.category}
                </span>
                <p className="font-display text-sm font-medium text-[#12100D] truncate">{p.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-semibold text-[#B87802]">
                    ₹{Number(p.price || 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-[#6B6457]">{p.color}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
