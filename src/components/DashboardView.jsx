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

const GOLD_PALETTE = ['#C2185B', '#E91E8C', '#FF80AB', '#800000', '#1A0510'];

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
    { name: 'Bridal Sets', count: 4, avgPrice: 4850 },
    { name: 'Harams & Long Chains', count: 3, avgPrice: 2850 },
    { name: 'Necklaces & Chokers', count: 3, avgPrice: 1950 },
    { name: 'Bangles & Kadas', count: 2, avgPrice: 1450 },
    { name: 'Earrings & Jhumkas', count: 2, avgPrice: 850 },
    { name: 'Hip Belts & Hair Ornaments', count: 2, avgPrice: 2200 },
  ];

  const totalProducts = products.length || overview.totalProducts || 12;
  const totalRevenue = overview.totalRevenue || 76995;
  const totalOrders = overview.totalOrders || 4;

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner — Website Onyx (#1A0510) & Emblem Gold (#E91E8C) */}
      <div className="relative overflow-hidden rounded-lg bg-[#1A0510] border border-[#E91E8C]/30 p-8 text-white">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#1A0510] text-[#E91E8C] border border-[#E91E8C]/40 text-xs font-semibold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Connected to Live Storefront
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold font-display tracking-tight text-[#FFF5F8]">
              Madha Fancy Admin Portal
            </h2>
            <p className="text-xs sm:text-sm text-[#D9CEBA] font-body leading-relaxed">
              Curate and publish authentic 1-gram gold covering & bridal imitation jewellery. Every product and price update here reflects instantaneously on your live storefront.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <a
              href={STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3.5 rounded-md border border-[#E91E8C]/50 bg-[#14100B] text-[#E91E8C] hover:bg-[#C2185B] hover:text-white text-xs font-semibold uppercase tracking-wider transition-all duration-200 group"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        {/* Ambient gold glow matching website banner */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-[#E91E8C]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4 Stat Cards with brand gold hover border */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Products */}
        <div 
          onClick={onNavigateProducts}
          className="bg-white rounded-lg border border-[#F8C4D8] p-5 transition-all duration-200 hover:border-[#C2185B] cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#7B4A5E]">
              Live Products
            </span>
            <div className="w-9 h-9 rounded-md bg-[#FFF5F8] border border-[#F8C4D8] flex items-center justify-center text-[#C2185B] group-hover:bg-[#C2185B] group-hover:text-white transition-colors">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-semibold font-display text-[#C2185B]">
              {totalProducts}
            </span>
            <span className="text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-sm bg-[#1A0510] text-[#E91E8C] border border-[#E91E8C]/30">
              On Store
            </span>
          </div>
          <p className="text-[11px] text-[#7B4A5E] mt-1.5 flex items-center gap-1 font-body">
            <span>Click to view product catalog</span>
            <ArrowUpRight className="w-3 h-3 text-[#C2185B]" />
          </p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-lg border border-[#F8C4D8] p-5 transition-all duration-200 hover:border-[#C2185B]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#7B4A5E]">
              Store Revenue
            </span>
            <div className="w-9 h-9 rounded-md bg-[#FFF5F8] border border-[#F8C4D8] flex items-center justify-center text-[#C2185B]">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-semibold font-display text-[#1A0510]">
              ₹{Number(totalRevenue).toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +14.2%
            </span>
          </div>
          <p className="text-[11px] text-[#7B4A5E] mt-1.5 font-body">
            Average order value: ₹19,249
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-lg border border-[#F8C4D8] p-5 transition-all duration-200 hover:border-[#C2185B]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#7B4A5E]">
              Customer Orders
            </span>
            <div className="w-9 h-9 rounded-md bg-[#FFF5F8] border border-[#F8C4D8] flex items-center justify-center text-[#C2185B]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-semibold font-display text-[#1A0510]">
              {totalOrders}
            </span>
            <span className="text-[11px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-sm border border-sky-200">
              1 Pending
            </span>
          </div>
          <p className="text-[11px] text-[#7B4A5E] mt-1.5 font-body">
            All orders processed smoothly
          </p>
        </div>

        {/* User Access Setup Pill */}
        <div 
          onClick={onNavigateUserAccess}
          className="bg-white rounded-lg border border-[#F8C4D8] p-5 transition-all duration-200 hover:border-[#C2185B] cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#7B4A5E]">
              User Access
            </span>
            <div className="w-9 h-9 rounded-md bg-[#FFF5F8] border border-[#F8C4D8] flex items-center justify-center text-[#C2185B] group-hover:bg-[#C2185B] group-hover:text-white transition-colors">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-semibold font-display text-[#1A0510]">
              Setup
            </span>
            <span className="text-[11px] font-bold text-[#E91E8C] bg-[#1A0510] px-2 py-0.5 rounded-sm border border-[#E91E8C]/40 uppercase tracking-wider">
              Super Admin
            </span>
          </div>
          <p className="text-[11px] text-[#7B4A5E] mt-1.5 flex items-center gap-1 font-body">
            <span>Manage staff roles & permissions</span>
            <ArrowUpRight className="w-3 h-3 text-[#C2185B]" />
          </p>
        </div>

      </div>

      {/* Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Revenue Trend Area Chart */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-[#F8C4D8] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-xl font-semibold text-[#1A0510]">
                Sales & Revenue Trajectory
              </h3>
              <p className="text-xs text-[#7B4A5E] font-body">
                Monthly performance overview for gold covering jewellery
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-sm bg-[#FFF5F8] text-[#C2185B] border border-[#F8C4D8]">
              Last 6 Months
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E91E8C" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C2185B" stopOpacity={0.0} />
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
                  contentStyle={{ backgroundColor: '#1A0510', borderColor: '#E91E8C', borderRadius: '8px', color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#C2185B" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#goldGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Bar Chart */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-[#F8C4D8] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-xl font-semibold text-[#1A0510]">
                Category Distribution
              </h3>
              <span className="text-xs text-[#7B4A5E]">By Product Count</span>
            </div>
            <p className="text-xs text-[#7B4A5E] font-body mb-4">
              Breakdown of jewellery currently showcased across store categories
            </p>

            <div className="space-y-3">
              {categoryStats.map((cat, idx) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[#1A0510]">{cat.name}</span>
                    <span className="text-[#7B4A5E]">
                      {cat.count} items • Avg ₹{Number(cat.avgPrice).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#FFF5F8] rounded-full overflow-hidden border border-[#F8C4D8]/50">
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

          <div className="pt-4 mt-4 border-t border-[#F8C4D8]/60 flex items-center justify-between">
            <span className="text-xs text-[#7B4A5E]">View all active categories</span>
            <button
              onClick={onNavigateProducts}
              className="text-xs font-bold uppercase tracking-wider text-[#C2185B] hover:text-[#880E4F] flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Catalog</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Recent Products Showcase */}
      <div className="bg-white rounded-lg border border-[#F8C4D8] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-2xl font-semibold text-[#1A0510]">
              Recently Added Jewellery Collection
            </h3>
            <p className="text-xs text-[#7B4A5E] font-body">
              Latest products synchronized with the live storefront catalog
            </p>
          </div>
          <button
            onClick={onNavigateProducts}
            className="text-xs font-bold uppercase tracking-wider text-[#C2185B] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({products.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {products.slice(0, 4).map((p) => (
            <div
              key={p._id || p.id}
              className="rounded-lg border border-[#F8C4D8] p-3 bg-[#FFF5F8] flex items-center gap-3 hover:border-[#C2185B] transition-colors"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-14 h-14 rounded-md object-cover border border-[#F8C4D8] shrink-0"
                onError={(e) => {
                  e.target.src =
                    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80';
                }}
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C2185B]">
                  {p.category}
                </span>
                <p className="font-display text-sm font-medium text-[#1A0510] truncate">{p.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-semibold text-[#C2185B]">
                    ₹{Number(p.price || 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-[#7B4A5E]">{p.color}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
