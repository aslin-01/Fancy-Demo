import React, { useState } from 'react';
import {
  Search,
  X,
  Printer,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { api } from '../services/api';
import { theme } from '../theme';

export const OrdersPage = ({ orders, onOrderUpdated, onNotify }) => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statuses = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrders = (orders || []).filter((o) => {
    const matchesStatus = statusFilter === 'All' || o.orderStatus === statusFilter;
    const matchesSearch =
      o.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerPhone?.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, { orderStatus: newStatus });
      onOrderUpdated();
      onNotify(`Order status changed to ${newStatus}`);
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, orderStatus: newStatus }));
      }
    } catch (err) {
      onNotify(err.message || 'Error updating order status', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold font-display text-foreground">Customer Orders</h2>
          <div className={theme.dividers.goldLeft} />
          <p className={`${theme.typography.bodyMuted} mt-2`}>
            Track customer deliveries, update fulfillment status, and generate shipping invoices
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className={`${theme.cards.base} p-4 flex flex-col md:flex-row items-center justify-between gap-4`}>
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={
                statusFilter === s
                  ? theme.badges.filterChipActive
                  : theme.badges.filterChipInactive
              }
            >
              {s}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search order ID, customer, phone..."
            className={`${theme.forms.input} pl-9`}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className={`${theme.cards.base} overflow-hidden`}>
        <div className={theme.table.container}>
          <table className={theme.table.table}>
            <thead className="bg-secondary/40 border-b border-border">
              <tr>
                <th className={theme.table.th}>Order ID</th>
                <th className={theme.table.th}>Date</th>
                <th className={theme.table.th}>Customer</th>
                <th className={theme.table.th}>Items</th>
                <th className={theme.table.th}>Payment</th>
                <th className={theme.table.th}>Total Amount</th>
                <th className={theme.table.th}>Order Status</th>
                <th className={`${theme.table.th} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-muted-foreground text-xs">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord._id || ord.orderNumber} className={theme.table.trHover}>
                    <td className={`${theme.table.td} font-body font-semibold tracking-wider text-[#B87802]`}>
                      {ord.orderNumber}
                    </td>
                    <td className={`${theme.table.td} text-muted-foreground`}>
                      {ord.createdAt
                        ? new Date(ord.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Today'}
                    </td>
                    <td className={theme.table.td}>
                      <p className="font-semibold text-foreground">{ord.customerName}</p>
                      <p className="text-[10px] text-muted-foreground">{ord.customerPhone}</p>
                    </td>
                    <td className={`${theme.table.td} text-muted-foreground`}>
                      {ord.items?.length || 1} saree{(ord.items?.length || 1) > 1 ? 's' : ''}
                    </td>
                    <td className={theme.table.td}>
                      <span className="uppercase text-[10px] font-semibold px-2 py-0.5 rounded-sm bg-secondary text-foreground border border-border">
                        {ord.paymentMethod || 'UPI'} • {ord.paymentStatus || 'Paid'}
                      </span>
                    </td>
                    <td className={`${theme.table.td} font-bold text-foreground text-sm`}>
                      ₹{ord.totalAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className={theme.table.td}>
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        className={theme.forms.select}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className={`${theme.table.td} text-right`}>
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className={theme.buttons.secondarySm}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

// Sub-component: Order Detail Modal
const OrderDetailModal = ({ order, onClose }) => {
  return (
    <div className={theme.modal.backdrop} onClick={onClose}>
      <div
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card p-6 space-y-5 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <span className="text-[10px] uppercase font-body text-[#B87802] font-bold tracking-widest">
              Official Tax Invoice
            </span>
            <h3 className="text-xl font-display font-semibold text-foreground mt-0.5">
              Order {order.orderNumber}
            </h3>
            <div className={theme.dividers.goldLeft} />
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer & Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-secondary/40 p-4 rounded-md border border-border text-xs">
          <div>
            <h4 className="font-semibold text-foreground mb-1 uppercase tracking-wider text-[11px]">
              Patron Details
            </h4>
            <p className="font-bold text-foreground">{order.customerName}</p>
            <p className="text-muted-foreground">{order.customerEmail}</p>
            <p className="text-muted-foreground">{order.customerPhone}</p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1 uppercase tracking-wider text-[11px]">
              Shipping Destination
            </h4>
            <p className="text-foreground">{order.shippingAddress?.address}</p>
            <p className="text-muted-foreground">
              {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pin}
            </p>
          </div>
        </div>

        {/* Items List */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.15em] mb-2">
            Order Items
          </h4>
          <div className="space-y-2">
            {(order.items || []).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-secondary/30 rounded-md border border-border text-xs"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-14 object-cover rounded-md bg-secondary border border-border"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    Qty: {item.qty} × ₹{item.price?.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="text-right font-bold text-foreground">
                  ₹{((item.qty || 1) * (item.price || 0)).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Summary */}
        <div className="bg-secondary/40 p-4 rounded-md border border-border text-xs space-y-1.5">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>₹{order.subtotal?.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span>
            <span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
          </div>
          <div className="flex justify-between text-foreground font-bold text-sm pt-2 border-t border-border">
            <span>Total Paid</span>
            <span className="text-[#B87802]">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Status Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Status:</span>
            <StatusBadge status={order.orderStatus} />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs text-foreground hover:border-[#B87802] transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#B87802]" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className={theme.buttons.primary}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
