import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeftRight,
  Search,
  Eye,
  X,
  CheckCircle,
  XCircle,
  RefreshCw,
  PackageSearch,
  Clock,
  Loader2,
} from 'lucide-react';
import { theme } from '../theme';
import { api } from '../services/api';

// ─── Demo Data (Exchange requests only — no return policy) ───────────────────
const DEMO_REQUESTS = [
  {
    _id: 'exc-001',
    requestNumber: 'EXC-2026-001',
    orderNumber: 'CF-2026-089',
    customerName: 'Priya Sharma',
    customerEmail: 'priya.sharma@example.com',
    customerPhone: '+91 98401 22334',
    productName: 'Kanchipuram Pure Silk Zari Saree',
    originalAmount: 18499,
    reason: 'Size Issue',
    description:
      'The saree is too large for me. I would like to exchange it for a smaller blouse size. The product quality is excellent otherwise.',
    requestedProduct: 'Kanchipuram Pure Silk Zari Saree – Smaller Blouse Size',
    status: 'Pending Review',
    requestedAt: '2026-10-26T10:00:00Z',
    resolvedAt: null,
    shippingCity: 'Chennai',
    shippingState: 'Tamil Nadu',
  },
  {
    _id: 'exc-002',
    requestNumber: 'EXC-2026-002',
    orderNumber: 'CF-2026-088',
    customerName: 'Ananya Deshmukh',
    customerEmail: 'ananya.d@example.com',
    customerPhone: '+91 98202 33445',
    productName: 'Banarasi Soft Silk Brocade',
    originalAmount: 14299,
    reason: 'Colour Mismatch',
    description:
      'The colour shown online is significantly different from the actual product received. The saree appears much darker in person. I would like to exchange it for the correct shade.',
    requestedProduct: 'Banarasi Soft Silk Brocade – Lighter Shade',
    status: 'Approved',
    requestedAt: '2026-10-25T14:20:00Z',
    resolvedAt: null,
    shippingCity: 'Mumbai',
    shippingState: 'Maharashtra',
  },
  {
    _id: 'exc-003',
    requestNumber: 'EXC-2026-003',
    orderNumber: 'CF-2026-087',
    customerName: 'Kavitha Raman',
    customerEmail: 'kavitha.raman@example.com',
    customerPhone: '+91 94441 55667',
    productName: 'Royal Crimson Wedding Silk Saree',
    originalAmount: 30999,
    reason: 'Defective Product',
    description:
      'There is a weaving defect near the pallu area — a loose thread pattern that is clearly a manufacturing issue. I would like an exchange for a defect-free piece.',
    requestedProduct: 'Royal Crimson Wedding Silk Saree – Defect-Free Replacement',
    status: 'Pending Review',
    requestedAt: '2026-10-24T09:10:00Z',
    resolvedAt: null,
    shippingCity: 'Bengaluru',
    shippingState: 'Karnataka',
  },
  {
    _id: 'exc-004',
    requestNumber: 'EXC-2026-004',
    orderNumber: 'CF-2026-085',
    customerName: 'Meera Nair',
    customerEmail: 'meera.nair@example.com',
    customerPhone: '+91 97001 88223',
    productName: 'Mysore Crepe Silk Saree',
    originalAmount: 9999,
    reason: 'Wrong Size Delivered',
    description:
      'I ordered size medium but received a large. I would like to exchange for the correct size as per my original order.',
    requestedProduct: 'Mysore Crepe Silk Saree – Medium Size',
    status: 'Rejected',
    requestedAt: '2026-10-20T18:45:00Z',
    resolvedAt: '2026-10-22T11:00:00Z',
    shippingCity: 'Kochi',
    shippingState: 'Kerala',
  },
  {
    _id: 'exc-005',
    requestNumber: 'EXC-2026-005',
    orderNumber: 'CF-2026-082',
    customerName: 'Deepa Krishnaswamy',
    customerEmail: 'deepa.k@example.com',
    customerPhone: '+91 95551 77889',
    productName: 'Chanderi Silk Cotton Saree',
    originalAmount: 7499,
    reason: 'Wrong Item Delivered',
    description:
      'I ordered the Chanderi Silk Cotton in ivory but received the one in dusty rose. Kindly arrange an exchange for the correct colour.',
    requestedProduct: 'Chanderi Silk Cotton Saree – Ivory',
    status: 'Exchanged',
    requestedAt: '2026-10-18T12:00:00Z',
    resolvedAt: '2026-10-25T16:30:00Z',
    shippingCity: 'Hyderabad',
    shippingState: 'Telangana',
  },
  {
    _id: 'exc-006',
    requestNumber: 'EXC-2026-006',
    orderNumber: 'CF-2026-080',
    customerName: 'Lalitha Subramaniam',
    customerEmail: 'lalitha.s@example.com',
    customerPhone: '+91 98881 44556',
    productName: 'Pochampally Ikat Silk Saree',
    originalAmount: 11299,
    reason: 'Damaged in Transit',
    description:
      'The saree arrived with a visible tear along one border due to improper packaging. I would like an exchange for an undamaged piece.',
    requestedProduct: 'Pochampally Ikat Silk Saree – Undamaged',
    status: 'Exchanged',
    requestedAt: '2026-10-15T10:00:00Z',
    resolvedAt: '2026-10-21T09:00:00Z',
    shippingCity: 'Coimbatore',
    shippingState: 'Tamil Nadu',
  },
];

// ─── Status Config (Exchange-only — no Refunded) ──────────────────────────────
const STATUS_CONFIG = {
  'Pending Review': {
    classes: 'text-amber-800 bg-amber-50 border border-amber-200',
    icon: Clock,
  },
  Approved: {
    classes: 'text-sky-800 bg-sky-50 border border-sky-200',
    icon: CheckCircle,
  },
  Rejected: {
    classes: 'text-rose-800 bg-rose-50 border border-rose-200',
    icon: XCircle,
  },
  Exchanged: {
    classes: 'text-emerald-800 bg-emerald-50 border border-emerald-200',
    icon: RefreshCw,
  },
};

const ALL_STATUSES = ['All', 'Pending Review', 'Approved', 'Rejected', 'Exchanged'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatAmount(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─── StatusBadge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Pending Review'];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${cfg.classes}`}
    >
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({ request, onClose, onUpdateStatus }) {
  const [updating, setUpdating] = useState(false);

  if (!request) return null;

  const handleAction = (status) => {
    setUpdating(true);
    setTimeout(() => {
      onUpdateStatus(request._id, status);
      setUpdating(false);
      onClose();
    }, 400);
  };

  const isPending = request.status === 'Pending Review';
  const isApproved = request.status === 'Approved';

  return (
    <>
      {/* Backdrop */}
      <div className={theme.modal.backdrop} onClick={onClose} />

      {/* Modal Container */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card p-0 overflow-hidden">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-[#FAF8F2]">
          <div>
            <h2 className={theme.modal.title}>Exchange Request Details</h2>
            <p className={`${theme.modal.description} mt-0.5`}>
              {request.requestNumber}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Exchange badge — always gold */}
            <span className="inline-flex items-center gap-1.5 rounded-sm bg-[#F5B815] text-[#0C0A07] px-2.5 py-0.5 text-[11px] font-bold tracking-wide">
              <ArrowLeftRight className="w-3 h-3" />
              Exchange
            </span>
            <StatusBadge status={request.status} />
            <button
              onClick={onClose}
              className="ml-2 rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">

          {/* Customer & Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`${theme.cards.padded} space-y-3`}>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Customer Info
              </p>
              <div className="space-y-1.5">
                <p className={`${theme.typography.fontDisplay} text-base font-semibold text-foreground`}>
                  {request.customerName}
                </p>
                <p className="text-xs text-muted-foreground">{request.customerEmail}</p>
                <p className="text-xs text-muted-foreground">{request.customerPhone}</p>
                <p className="text-xs text-muted-foreground">
                  {request.shippingCity}, {request.shippingState}
                </p>
              </div>
            </div>

            <div className={`${theme.cards.padded} space-y-3`}>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Original Order
              </p>
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-foreground font-body tracking-wider">
                  {request.orderNumber}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {request.productName}
                </p>
                <p className="text-sm font-semibold text-[#B87802]">
                  {formatAmount(request.originalAmount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Requested: {formatDate(request.requestedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Reason & Description */}
          <div className={`${theme.cards.base} p-4 space-y-2`}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Reason for Exchange
            </p>
            <p className="text-sm font-semibold text-foreground">{request.reason}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{request.description}</p>
          </div>

          {/* Requested Replacement Product */}
          {request.requestedProduct && (
            <div className={`${theme.cards.base} p-4 border-l-4 border-l-[#F5B815] space-y-1`}>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Requested Replacement Product
              </p>
              <p className="text-sm text-foreground font-medium">{request.requestedProduct}</p>
            </div>
          )}

          {/* Resolution date */}
          {request.resolvedAt && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Resolved on {formatDate(request.resolvedAt)}
            </div>
          )}

          {/* Divider */}
          <div className={theme.dividers.goldLeft} />

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {isPending && (
              <>
                <button
                  onClick={() => handleAction('Approved')}
                  disabled={updating}
                  className={`${theme.buttons.primary} gap-2 !py-2.5 !px-5 disabled:opacity-50`}
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve Exchange
                </button>
                <button
                  onClick={() => handleAction('Rejected')}
                  disabled={updating}
                  className="inline-flex items-center gap-2 rounded-md border border-rose-300 px-5 py-2.5 text-sm font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  Reject Request
                </button>
              </>
            )}
            {isApproved && (
              <button
                onClick={() => handleAction('Exchanged')}
                disabled={updating}
                className={`${theme.buttons.primary} gap-2 !py-2.5 !px-5 disabled:opacity-50`}
              >
                <RefreshCw className="w-4 h-4" />
                Mark as Exchanged
              </button>
            )}
            <button
              onClick={onClose}
              className={`${theme.buttons.secondarySm} !py-2.5 !px-5`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function ReturnsPage({ onNotify }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);
  const [activeStatus, setActiveStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);

  // ── Load from API, fall back to demo data if backend is offline ──
  const loadExchanges = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getExchanges();
      if (res.success && Array.isArray(res.data) && res.data.length >= 0) {
        // If DB is empty seed with demo data (first run only)
        if (res.data.length === 0) {
          setRequests(DEMO_REQUESTS);
          setUsingDemo(true);
        } else {
          setRequests(res.data);
          setUsingDemo(false);
        }
      } else {
        throw new Error('Bad response');
      }
    } catch {
      // Backend offline — use demo data silently
      setRequests(DEMO_REQUESTS);
      setUsingDemo(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExchanges();
  }, [loadExchanges]);

  // Stats
  const total    = requests.length;
  const pending  = requests.filter((r) => r.status === 'Pending Review').length;
  const approved = requests.filter((r) => r.status === 'Approved').length;
  const exchanged = requests.filter((r) => r.status === 'Exchanged').length;

  // Filter
  const filtered = requests.filter((r) => {
    const matchStatus = activeStatus === 'All' || r.status === activeStatus;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      (r.requestNumber || '').toLowerCase().includes(q) ||
      (r.customerName  || '').toLowerCase().includes(q) ||
      (r.orderNumber   || '').toLowerCase().includes(q) ||
      (r.productName   || '').toLowerCase().includes(q) ||
      (r.reason        || '').toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  // Update status — calls API if live, updates local state otherwise
  const handleUpdateStatus = async (id, status) => {
    // Optimistic local update
    setRequests((prev) =>
      prev.map((r) =>
        (r._id === id || r.requestNumber === id)
          ? {
              ...r,
              status,
              resolvedAt: status === 'Exchanged' || status === 'Rejected'
                ? new Date().toISOString()
                : r.resolvedAt,
            }
          : r
      )
    );

    if (!usingDemo) {
      try {
        await api.updateExchangeStatus(id, status);
      } catch (err) {
        console.warn('Status update API error:', err);
      }
    }

    if (onNotify) {
      onNotify(`Exchange request updated to "${status}" successfully.`, 'success');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 animate-spin text-[#B87802]" />
        <span className="ml-3 text-sm text-muted-foreground">Loading exchange requests…</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Demo mode banner (shown when backend is offline) ── */}
      {usingDemo && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Demo Mode</span>
          <span className="text-xs text-amber-700">
            Backend offline — showing sample data. Start the backend server and refresh to load live exchange requests.
          </span>
        </div>
      )}

      {/* ── Page Header ── */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-lg bg-[#0C0A07] flex items-center justify-center shrink-0">
            <ArrowLeftRight className="w-4 h-4 text-[#F5B815]" strokeWidth={2} />
          </div>
          <h1 className={theme.typography.h1Page}>Exchange Requests</h1>
        </div>
        <div className={`${theme.dividers.goldLeft} mb-2`} />
        <p className={`${theme.typography.bodyMuted} mt-2`}>
          Manage customer exchange requests for purchased products. CF Handlooms offers an
          <span className="font-semibold text-[#B87802]"> exchange-only policy </span>
          — no returns or refunds.
        </p>
      </div>

      {/* ── Stats Row ── */}
      <div className={theme.layout.grid4Cols}>
        {[
          { label: 'Total Requests', value: total,    icon: PackageSearch, color: 'text-[#B87802]' },
          { label: 'Pending Review', value: pending,  icon: Clock,         color: 'text-amber-600' },
          { label: 'Approved',       value: approved, icon: CheckCircle,   color: 'text-sky-600'   },
          { label: 'Exchanged',      value: exchanged,icon: RefreshCw,     color: 'text-emerald-600'},
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`${theme.cards.padded} flex items-center gap-4`}>
              <div className="w-10 h-10 rounded-lg bg-[#FAF8F2] border border-border flex items-center justify-center shrink-0">
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground font-display">{stat.value}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Filter Bar ── */}
      <div className={`${theme.cards.base} px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`}>
        {/* Status chips */}
        <div className="flex flex-wrap gap-2">
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              className={
                activeStatus === s
                  ? theme.badges.filterChipActive
                  : theme.badges.filterChipInactive
              }
            >
              {s}
              {s !== 'All' && (
                <span className="ml-1 opacity-70">
                  ({requests.filter((r) => r.status === s).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, order, product…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${theme.forms.input} pl-9 !w-64`}
          />
        </div>
      </div>

      {/* ── Exchange-Only Policy Note ── */}
      <div className="flex items-start gap-3 rounded-lg border border-[#F5B815]/40 bg-[#F5B815]/8 px-4 py-3">
        <ArrowLeftRight className="w-4 h-4 text-[#B87802] shrink-0 mt-0.5" />
        <p className="text-xs text-[#6B6457] leading-relaxed">
          <span className="font-semibold text-[#B87802]">Exchange Policy:</span> CF Handlooms accepts exchanges only. Products can be exchanged for a different size, colour, or variant within 7 days of delivery, subject to quality inspection. No refunds or returns are processed.
        </p>
      </div>

      {/* ── Requests Table ── */}
      <div className={`${theme.cards.base} overflow-hidden`}>
        <div className={theme.table.container}>
          <table className={theme.table.table}>
            <thead>
              <tr>
                {[
                  'Request #',
                  'Order Ref',
                  'Customer',
                  'Product',
                  'Reason',
                  'Replacement Requested',
                  'Status',
                  'Date',
                  'Actions',
                ].map((h) => (
                  <th key={h} className={theme.table.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-muted-foreground text-sm">
                    <PackageSearch className="w-8 h-8 mx-auto mb-3 opacity-30" />
                    No exchange requests found for the selected filter.
                  </td>
                </tr>
              ) : (
                filtered.map((req) => (
                  <tr key={req._id} className={theme.table.trHover}>
                    {/* Request # */}
                    <td className={`${theme.table.td} font-semibold tracking-wide text-[#B87802] whitespace-nowrap`}>
                      {req.requestNumber}
                    </td>
                    {/* Order Ref */}
                    <td className={`${theme.table.td} font-mono text-xs text-muted-foreground whitespace-nowrap`}>
                      {req.orderNumber}
                    </td>
                    {/* Customer */}
                    <td className={theme.table.td}>
                      <p className="font-medium text-foreground whitespace-nowrap">{req.customerName}</p>
                      <p className="text-[11px] text-muted-foreground">{req.customerEmail}</p>
                    </td>
                    {/* Product */}
                    <td className={`${theme.table.td} max-w-[160px]`}>
                      <p className="truncate text-foreground text-xs">{req.productName}</p>
                      <p className="text-[11px] text-[#B87802] font-semibold">
                        {formatAmount(req.originalAmount)}
                      </p>
                    </td>
                    {/* Reason */}
                    <td className={`${theme.table.td} max-w-[110px]`}>
                      <span className="text-xs bg-secondary px-2 py-0.5 rounded-sm text-muted-foreground whitespace-nowrap">
                        {req.reason}
                      </span>
                    </td>
                    {/* Replacement */}
                    <td className={`${theme.table.td} max-w-[160px]`}>
                      <p className="truncate text-xs text-foreground">{req.requestedProduct}</p>
                    </td>
                    {/* Status */}
                    <td className={theme.table.td}>
                      <StatusBadge status={req.status} />
                    </td>
                    {/* Date */}
                    <td className={`${theme.table.td} text-xs text-muted-foreground whitespace-nowrap`}>
                      {formatDate(req.requestedAt)}
                    </td>
                    {/* Actions */}
                    <td className={theme.table.td}>
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:border-[#B87802] hover:text-[#B87802] transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-border flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Showing {filtered.length} of {total} exchange requests
            </p>
            <p className="text-xs">
              {pending > 0 && (
                <span className="text-amber-700 font-semibold">
                  {pending} pending review
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      {selectedRequest && (
        <DetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}

export default ReturnsPage;
