import React from 'react';
import {
  IndianRupee,
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  Plus,
  Eye,
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { theme } from '../theme';

export const DashboardPage = ({ stats, orders, products, onNavigate, onSelectOrder }) => {
  const metrics = stats?.metrics || {
    totalRevenue: 248990,
    totalOrders: 142,
    totalProducts: 11,
    totalCustomers: 84,
    pendingOrdersCount: 1,
    averageOrderValue: 8490,
  };

  const revenueTrend = stats?.revenueTrend || [
    { month: 'May', revenue: 65000, orders: 8 },
    { month: 'Jun', revenue: 98000, orders: 12 },
    { month: 'Jul', revenue: 145000, orders: 18 },
    { month: 'Aug', revenue: 189000, orders: 24 },
    { month: 'Sep', revenue: 215000, orders: 27 },
    { month: 'Oct', revenue: 248990, orders: 32 },
  ];

  const statusData = [
    { name: 'Delivered', value: stats?.ordersByStatus?.Delivered || 48, color: '#059669' },
    { name: 'Shipped', value: stats?.ordersByStatus?.Shipped || 18, color: '#4f46e5' },
    { name: 'Processing', value: stats?.ordersByStatus?.Processing || 12, color: '#0284c7' },
    { name: 'Pending', value: stats?.ordersByStatus?.Pending || 6, color: '#d97706' },
  ];

  const recentOrdersList = (orders && orders.length > 0) ? orders.slice(0, 5) : [];

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0C0A07] text-[#FAF8F2] border border-[#B87802]/30 p-6 rounded-lg shadow-lg relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#B87802]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <p className={theme.typography.cursiveEyebrow}>Heritage Weaves & Royal Craft</p>
          <h1 className="text-2xl sm:text-3xl font-display font-semibold text-white mt-0.5">
            CF Handlooms Executive Portal
          </h1>
          <p className="text-sm text-[#F3EBDD]/80 mt-1 max-w-xl">
            Real-time handloom sales tracking, saree catalog management, and prompt order fulfillment.
          </p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => onNavigate('products')}
            className={theme.buttons.primary}
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>Add Saree</span>
          </button>
          <button
            onClick={() => onNavigate('orders')}
            className={theme.buttons.outlineLight}
          >
            <span>All Orders</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`₹${metrics.totalRevenue.toLocaleString('en-IN')}`}
          change="+18.4%"
          isPositive={true}
          icon={IndianRupee}
        />
        <StatCard
          title="Total Orders"
          value={metrics.totalOrders.toString()}
          change="+12.5%"
          isPositive={true}
          icon={Package}
        />
        <StatCard
          title="Active Saree Catalog"
          value={metrics.totalProducts.toString()}
          change="Catalog Live"
          isPositive={true}
          icon={ShoppingBag}
        />
        <StatCard
          title="Registered Patrons"
          value={metrics.totalCustomers.toString()}
          change="+8.2%"
          isPositive={true}
          icon={Users}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Area Chart */}
        <div className={`lg:col-span-2 ${theme.cards.padded}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={theme.typography.h3Card}>Revenue Performance</h3>
              <p className={theme.typography.bodyMuted}>Monthly revenue trends in INR (₹)</p>
            </div>
            <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-sm border ${theme.colors.status.success}`}>
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Steady Growth</span>
            </div>
          </div>
          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B87802" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F5B815" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#6B6457" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="#6B6457"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E8D8B5',
                    borderRadius: '6px',
                    color: '#12100D',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                  formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#B87802"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className={`${theme.cards.padded} flex flex-col justify-between`}>
          <div>
            <h3 className={theme.typography.h3Card}>Order Fulfillment</h3>
            <p className={theme.typography.bodyMuted}>Live order status distribution</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E8D8B5',
                    borderRadius: '6px',
                    color: '#12100D',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {statusData.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-2 bg-secondary/50 p-2 rounded-sm border border-border"
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-foreground/80 font-medium">{item.name}</span>
                <span className="ml-auto font-bold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders & Top Sarees */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className={`lg:col-span-2 ${theme.cards.padded}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={theme.typography.h3Card}>Recent Customer Orders</h3>
              <p className={theme.typography.bodyMuted}>Latest transactions from CF Handlooms web store</p>
            </div>
            <button
              onClick={() => onNavigate('orders')}
              className="text-xs font-semibold text-[#B87802] hover:text-[#996300] transition-colors cursor-pointer"
            >
              View all →
            </button>
          </div>

          <div className={theme.table.container}>
            <table className={theme.table.table}>
              <thead>
                <tr>
                  <th className={theme.table.th}>Order ID</th>
                  <th className={theme.table.th}>Customer</th>
                  <th className={theme.table.th}>Items</th>
                  <th className={theme.table.th}>Total</th>
                  <th className={theme.table.th}>Status</th>
                  <th className={`${theme.table.th} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentOrdersList.map((order) => (
                  <tr key={order._id || order.orderNumber} className={theme.table.trHover}>
                    <td className={`${theme.table.td} font-body font-semibold tracking-wider text-[#B87802]`}>
                      {order.orderNumber}
                    </td>
                    <td className={theme.table.td}>
                      <p className="font-medium text-foreground">{order.customerName}</p>
                      <p className="text-[10px] text-muted-foreground">{order.customerPhone || order.customerEmail}</p>
                    </td>
                    <td className={`${theme.table.td} text-muted-foreground`}>
                      {order.items?.length || 1} saree{(order.items?.length || 1) > 1 ? 's' : ''}
                    </td>
                    <td className={`${theme.table.td} font-semibold text-foreground`}>
                      ₹{order.totalAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className={theme.table.td}>
                      <StatusBadge status={order.orderStatus} />
                    </td>
                    <td className={`${theme.table.td} text-right`}>
                      <button
                        onClick={() => onSelectOrder(order)}
                        className={theme.buttons.secondarySm}
                        title="View details"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#B87802]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Sarees Showcase */}
        <div className={theme.cards.padded}>
          <h3 className={theme.typography.h3Card}>Top Selling Sarees</h3>
          <p className={`${theme.typography.bodyMuted} mb-4`}>Highest rated pieces in collection</p>

          <div className="space-y-3">
            {(products || []).slice(0, 4).map((item) => (
              <div
                key={item._id || item.sku}
                className="flex items-center gap-3 p-2.5 rounded-md bg-secondary/30 border border-border hover:border-[#B87802] transition-colors"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-14 object-cover rounded-md bg-secondary border border-border"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
                  <p className="text-[11px] text-[#B87802] font-semibold">
                    ₹{item.price?.toLocaleString('en-IN')}
                  </p>
                  <span className={theme.badges.discount}>
                    {item.category}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#B87802]">★ {item.rating || 4.8}</span>
                  <p className="text-[10px] text-muted-foreground">{item.reviews || 95} reviews</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
