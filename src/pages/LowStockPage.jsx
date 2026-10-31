import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  PackageX,
  Search,
  RefreshCw,
  Edit2,
  ExternalLink,
  TrendingDown,
  ShieldAlert,
  Layers,
  CheckCircle2,
  Plus,
  Loader2,
  ArrowUpRight,
} from 'lucide-react';
import { theme } from '../theme';
import { STORE_URL, api } from '../services/api';

// ─── Threshold Config ─────────────────────────────────────────────────────────
const THRESHOLDS = {
  OUT_OF_STOCK: 0,       // stockCount === 0 or inStock === false
  CRITICAL:     3,       // 1 – 3
  LOW:          10,      // 4 – 10
  MODERATE:     25,      // 11 – 25  (watch zone)
};

// ─── Demo Products Fallback (displayed when backend is offline or empty) ─────
const DEMO_PRODUCTS = [
  {
    _id: 'demo-ls-1',
    name: 'Kanchipuram Pure Silk Zari Saree',
    sku: 'VK-KP-001',
    category: 'Silk',
    fabric: 'Pure Kanchipuram Silk',
    color: 'Royal Red',
    price: 18499,
    mrp: 22999,
    stockCount: 0,
    inStock: false,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'demo-ls-2',
    name: 'Banarasi Soft Silk Brocade Saree',
    sku: 'VK-BN-004',
    category: 'Silk',
    fabric: 'Banarasi Brocade',
    color: 'Emerald Green',
    price: 14299,
    mrp: 17500,
    stockCount: 2,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'demo-ls-3',
    name: 'Chanderi Silk Cotton Festive Saree',
    sku: 'VK-CH-008',
    category: 'Cotton',
    fabric: 'Chanderi Silk Cotton',
    color: 'Ivory Gold',
    price: 7499,
    mrp: 9999,
    stockCount: 5,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'demo-ls-4',
    name: 'Mysore Crepe Silk Temple Border Saree',
    sku: 'VK-MY-012',
    category: 'Silk',
    fabric: 'Mysore Crepe Silk',
    color: 'Mustard Yellow',
    price: 9999,
    mrp: 12499,
    stockCount: 8,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'demo-ls-5',
    name: 'Royal Crimson Wedding Silk Saree',
    sku: 'VK-WD-019',
    category: 'Wedding',
    fabric: 'Heavy Bridal Silk',
    color: 'Deep Crimson',
    price: 30999,
    mrp: 36000,
    stockCount: 18,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'demo-ls-6',
    name: 'Pochampally Handwoven Ikat Silk Saree',
    sku: 'VK-PC-025',
    category: 'Designer',
    fabric: 'Pochampally Ikat',
    color: 'Indigo Blue',
    price: 11299,
    mrp: 13999,
    stockCount: 0,
    inStock: false,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
  },
];

// ─── Alert Level Helper ───────────────────────────────────────────────────────
function getAlertLevel(product) {
  const count = product.stockCount ?? 0;
  if (!product.inStock || count === 0) return 'out';
  if (count <= THRESHOLDS.CRITICAL)   return 'critical';
  if (count <= THRESHOLDS.LOW)        return 'low';
  if (count <= THRESHOLDS.MODERATE)   return 'moderate';
  return null;
}

const LEVEL_CONFIG = {
  out:      { label: 'Out of Stock', classes: 'text-rose-800 bg-rose-50 border border-rose-300',     dot: 'bg-rose-500',     icon: PackageX,       sort: 0 },
  critical: { label: 'Critical',     classes: 'text-rose-700 bg-rose-50 border border-rose-200',     dot: 'bg-rose-400',     icon: ShieldAlert,    sort: 1 },
  low:      { label: 'Low Stock',    classes: 'text-amber-800 bg-amber-50 border border-amber-200',  dot: 'bg-amber-500',    icon: AlertTriangle,  sort: 2 },
  moderate: { label: 'Watch Zone',   classes: 'text-sky-800 bg-sky-50 border border-sky-200',        dot: 'bg-sky-400',      icon: TrendingDown,   sort: 3 },
};

const FILTER_TABS = ['All Alerts', 'Out of Stock', 'Critical (≤3)', 'Low Stock (≤10)', 'Watch (≤25)'];

// ─── Alert Badge ──────────────────────────────────────────────────────────────
function AlertBadge({ level }) {
  const cfg = LEVEL_CONFIG[level];
  if (!cfg) return null;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide whitespace-nowrap ${cfg.classes}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

// ─── Stock Bar ────────────────────────────────────────────────────────────────
function StockBar({ count, max = 25 }) {
  const pct = Math.min(100, Math.round((count / max) * 100));
  const color =
    count === 0       ? 'bg-rose-500' :
    count <= 3        ? 'bg-rose-400' :
    count <= 10       ? 'bg-amber-400' :
                        'bg-sky-400';
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-1.5 bg-[#F0E8D8] rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-foreground w-6 text-right font-mono">{count}</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function LowStockPage({ products = [], onEditProduct, onRefresh, onNotify }) {
  const isDemo = products.length === 0;
  const [demoState, setDemoState] = useState(DEMO_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Alerts');
  const [updatingId, setUpdatingId] = useState(null);

  // Active pool of products (either real or demo fallback)
  const productPool = isDemo ? demoState : products;

  // Derive alerted products
  const alertedProducts = useMemo(() => {
    return productPool
      .map((p) => ({ ...p, _alertLevel: getAlertLevel(p) }))
      .filter((p) => p._alertLevel !== null)
      .sort((a, b) => {
        const sa = LEVEL_CONFIG[a._alertLevel]?.sort ?? 99;
        const sb = LEVEL_CONFIG[b._alertLevel]?.sort ?? 99;
        if (sa !== sb) return sa - sb;
        return (a.stockCount ?? 0) - (b.stockCount ?? 0);
      });
  }, [productPool]);

  // Count per level
  const counts = useMemo(() => ({
    out:      alertedProducts.filter((p) => p._alertLevel === 'out').length,
    critical: alertedProducts.filter((p) => p._alertLevel === 'critical').length,
    low:      alertedProducts.filter((p) => p._alertLevel === 'low').length,
    moderate: alertedProducts.filter((p) => p._alertLevel === 'moderate').length,
  }), [alertedProducts]);

  // Active filter
  const filtered = useMemo(() => {
    let list = alertedProducts;

    if (activeFilter === 'Out of Stock')     list = list.filter((p) => p._alertLevel === 'out');
    if (activeFilter === 'Critical (≤3)')    list = list.filter((p) => p._alertLevel === 'critical');
    if (activeFilter === 'Low Stock (≤10)')  list = list.filter((p) => p._alertLevel === 'low');
    if (activeFilter === 'Watch (≤25)')      list = list.filter((p) => p._alertLevel === 'moderate');

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          (p.name   || '').toLowerCase().includes(q) ||
          (p.sku    || '').toLowerCase().includes(q) ||
          (p.fabric || '').toLowerCase().includes(q) ||
          (p.category || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [alertedProducts, activeFilter, searchQuery]);

  // Quick Restock handler (+10 units directly)
  const handleQuickRestock = async (product, addUnits = 10) => {
    const id = product._id || product.id;
    const newStock = Math.max(0, (product.stockCount || 0) + addUnits);

    setUpdatingId(id);
    try {
      if (isDemo) {
        setDemoState((prev) =>
          prev.map((item) =>
            (item._id === id || item.sku === product.sku)
              ? { ...item, stockCount: newStock, inStock: true }
              : item
          )
        );
      } else {
        await api.updateProduct(id, { stockCount: newStock, inStock: true });
        if (onRefresh) onRefresh();
      }

      if (onNotify) {
        onNotify(`Restocked ${product.name} (+${addUnits} units). New stock: ${newStock}`, 'success');
      }
    } catch (err) {
      alert(`Failed to restock product: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">

      {/* ── Demo Mode Indicator ── */}
      {isDemo && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Demo Mode</span>
          <span className="text-xs text-amber-700">
            Backend offline or empty catalog — displaying sample inventory low-stock alerts. You can test quick restock buttons below.
          </span>
        </div>
      )}

      {/* ── Page Header ── */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-lg bg-[#0C0A07] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4.5 h-4.5 text-[#F5B815]" strokeWidth={2.5} />
            </div>
            <h1 className={theme.typography.h1Page}>Low Stock Alerts</h1>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className={`${theme.buttons.secondarySm} flex items-center gap-2`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          )}
        </div>
        <div className={`${theme.dividers.goldLeft} mb-2`} />
        <p className={`${theme.typography.bodyMuted} mt-2`}>
          Track real-time inventory levels, out-of-stock items, and critical stock depletion alerts.
        </p>
      </div>

      {/* ── No Alerts State ── */}
      {alertedProducts.length === 0 && (
        <div className={`${theme.cards.padded} text-center py-20 space-y-4`}>
          <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          </div>
          <div>
            <h3 className={`${theme.typography.h3Card} mb-1`}>All Products Well Stocked!</h3>
            <p className={theme.typography.bodyMuted}>
              Every active product is above the low-stock alert threshold.
            </p>
          </div>
        </div>
      )}

      {alertedProducts.length > 0 && (
        <>
          {/* ── Stats Row ── */}
          <div className={theme.layout.grid4Cols}>
            {[
              { label: 'Out of Stock', value: counts.out,      icon: PackageX,      color: 'text-rose-600',   bg: 'bg-rose-50 border-rose-200'  },
              { label: 'Critical (≤3)', value: counts.critical, icon: ShieldAlert,   color: 'text-rose-500',   bg: 'bg-rose-50 border-rose-100'  },
              { label: 'Low Stock (≤10)', value: counts.low,    icon: AlertTriangle, color: 'text-amber-600',  bg: 'bg-amber-50 border-amber-200'},
              { label: 'Watch Zone (≤25)', value: counts.moderate, icon: TrendingDown,color: 'text-sky-600',  bg: 'bg-sky-50 border-sky-200'    },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className={`${theme.cards.padded} flex items-center gap-4`}>
                  <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${stat.bg}`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-foreground font-display">{stat.value}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider leading-tight">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Critical Urgent Alert Banner ── */}
          {(counts.out + counts.critical) > 0 && (
            <div className="flex items-start gap-3 rounded-lg border border-rose-300 bg-rose-50 px-4 py-3">
              <ShieldAlert className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-800 leading-relaxed">
                <span className="font-bold">Urgent Action Required:</span>{' '}
                {counts.out > 0 && <span><strong>{counts.out}</strong> product{counts.out > 1 ? 's are' : ' is'} out of stock. </span>}
                {counts.critical > 0 && <span><strong>{counts.critical}</strong> product{counts.critical > 1 ? 's have' : ' has'} critically low stock (≤ 3 units left). </span>}
                Restock now to prevent checkout disruptions on the storefront.
              </p>
            </div>
          )}

          {/* ── Filter Bar ── */}
          <div className={`${theme.cards.base} px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`}>
            {/* Filter chips */}
            <div className="flex flex-wrap gap-2">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={activeFilter === tab ? theme.badges.filterChipActive : theme.badges.filterChipInactive}
                >
                  {tab}
                  {tab !== 'All Alerts' && (
                    <span className="ml-1 opacity-70">
                      ({
                        tab === 'Out of Stock'     ? counts.out :
                        tab === 'Critical (≤3)'   ? counts.critical :
                        tab === 'Low Stock (≤10)' ? counts.low :
                        counts.moderate
                      })
                    </span>
                  )}
                  {tab === 'All Alerts' && (
                    <span className="ml-1 opacity-70">({alertedProducts.length})</span>
                  )}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search by saree name, SKU, fabric…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${theme.forms.input} pl-9 !w-64`}
              />
            </div>
          </div>

          {/* ── Requests Table ── */}
          <div className={`${theme.cards.base} overflow-hidden`}>
            <div className={theme.table.container}>
              <table className={theme.table.table}>
                <thead>
                  <tr>
                    {['Product', 'SKU', 'Category', 'Fabric', 'Price', 'Stock Level', 'Status Alert', 'Restock Actions'].map((h) => (
                      <th key={h} className={theme.table.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-14 text-center text-muted-foreground text-sm">
                        <Layers className="w-8 h-8 mx-auto mb-3 opacity-30" />
                        No products match the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((p) => {
                      const level = p._alertLevel;
                      const cfg   = LEVEL_CONFIG[level];
                      const isUpdating = updatingId === (p._id || p.id);

                      return (
                        <tr key={p._id || p.id} className={theme.table.trHover}>

                          {/* Product */}
                          <td className={theme.table.td}>
                            <div className="flex items-center gap-3">
                              <div className="relative shrink-0">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-11 h-11 rounded-sm object-cover border border-border"
                                  onError={(e) => { e.target.style.opacity = '0.3'; }}
                                />
                                <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white ${cfg.dot}`} />
                              </div>
                              <div className="min-w-0">
                                <p className="font-display font-medium text-sm text-foreground leading-snug line-clamp-1 max-w-[200px]">
                                  {p.name}
                                </p>
                                {p.color && (
                                  <p className="text-[11px] text-muted-foreground">{p.color}</p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* SKU */}
                          <td className={`${theme.table.td} font-mono text-xs text-muted-foreground whitespace-nowrap`}>
                            {p.sku}
                          </td>

                          {/* Category */}
                          <td className={theme.table.td}>
                            <span className="text-xs bg-[#FAF8F2] border border-[#E8D8B5] px-2 py-0.5 rounded-sm text-[#B87802] font-semibold whitespace-nowrap">
                              {p.category || 'Silk'}
                            </span>
                          </td>

                          {/* Fabric */}
                          <td className={`${theme.table.td} text-xs text-muted-foreground max-w-[130px]`}>
                            <span className="truncate block">{p.fabric || '—'}</span>
                          </td>

                          {/* Price */}
                          <td className={theme.table.td}>
                            <p className="text-sm font-semibold text-[#B87802] whitespace-nowrap">
                              ₹{Number(p.price || 0).toLocaleString('en-IN')}
                            </p>
                            {p.mrp > p.price && (
                              <p className="text-[10px] text-muted-foreground line-through whitespace-nowrap">
                                ₹{Number(p.mrp).toLocaleString('en-IN')}
                              </p>
                            )}
                          </td>

                          {/* Stock Level */}
                          <td className={theme.table.td}>
                            <StockBar count={p.stockCount ?? 0} />
                            {!p.inStock && p.stockCount > 0 && (
                              <p className="text-[10px] text-rose-600 font-semibold mt-0.5 whitespace-nowrap">Marked Out</p>
                            )}
                          </td>

                          {/* Alert Badge */}
                          <td className={theme.table.td}>
                            <AlertBadge level={level} />
                          </td>

                          {/* Restock Actions */}
                          <td className={theme.table.td}>
                            <div className="flex items-center gap-2">
                              {/* Quick +10 Restock */}
                              <button
                                onClick={() => handleQuickRestock(p, 10)}
                                disabled={isUpdating}
                                className="inline-flex items-center gap-1 rounded-md bg-[#FAF8F2] border border-[#B87802] px-2.5 py-1 text-xs font-semibold text-[#B87802] hover:bg-[#B87802] hover:text-white transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap"
                                title="Quick restock +10 units"
                              >
                                {isUpdating ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Plus className="w-3 h-3 stroke-[2.5]" />
                                )}
                                <span>+10</span>
                              </button>

                              {/* Edit / Full Restock */}
                              {onEditProduct && (
                                <button
                                  onClick={() => onEditProduct(p)}
                                  className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:border-[#B87802] hover:text-[#B87802] transition-colors cursor-pointer whitespace-nowrap"
                                  title="Edit product catalog details"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  <span>Edit</span>
                                </button>
                              )}

                              {/* Storefront Link */}
                              <a
                                href={STORE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded-md border border-border hover:border-[#B87802] text-muted-foreground hover:text-[#B87802] transition-colors"
                                title="View product on storefront"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            {filtered.length > 0 && (
              <div className="px-4 py-3 border-t border-border flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Showing {filtered.length} of {alertedProducts.length} low-stock alerts
                </p>
                <div className="hidden sm:flex items-center gap-3 text-[11px]">
                  {Object.entries(LEVEL_CONFIG).map(([key, cfg]) => (
                    <span key={key} className="flex items-center gap-1 text-muted-foreground">
                      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default LowStockPage;
