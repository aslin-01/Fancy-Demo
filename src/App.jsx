import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { OrdersPage } from './pages/OrdersPage';
import { CustomersPage } from './pages/CustomersPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { api } from './services/api';
import { theme } from './theme';

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toast, setToast] = useState(null);

  const showNotification = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const [statsRes, productsRes, ordersRes, customersRes] = await Promise.allSettled([
        api.getDashboardStats(),
        api.getProducts(),
        api.getOrders(),
        api.getCustomers(),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
        setStats(statsRes.value.data);
      }
      if (productsRes.status === 'fulfilled' && productsRes.value?.data) {
        setProducts(productsRes.value.data);
      }
      if (ordersRes.status === 'fulfilled' && ordersRes.value?.data) {
        setOrders(ordersRes.value.data);
      }
      if (customersRes.status === 'fulfilled' && customersRes.value?.data) {
        setCustomers(customersRes.value.data);
      }
    } catch (err) {
      console.warn('API sync notice:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <LoginPage onNotify={showNotification} />;
  }

  const titles = {
    dashboard: { title: 'Dashboard Overview', subtitle: 'CF Handlooms sales and operations performance' },
    products: { title: 'Saree Inventory & Catalog', subtitle: `${products.length} active weaves in collection` },
    orders: { title: 'Customer Orders', subtitle: `${orders.length} orders tracked in system` },
    customers: { title: 'Registered Customers', subtitle: 'Customer lifetime records & contacts' },
    analytics: { title: 'Revenue Analytics', subtitle: 'Category performance and sales breakdowns' },
    settings: { title: 'Portal Settings', subtitle: 'Store configurations, shipping & API' },
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          title={titles[activeTab]?.title}
          subtitle={titles[activeTab]?.subtitle}
          onRefresh={loadData}
          isRefreshing={isRefreshing}
        />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardPage
              stats={stats}
              orders={orders}
              products={products}
              onNavigate={(tab) => setActiveTab(tab)}
              onSelectOrder={() => setActiveTab('orders')}
            />
          )}

          {activeTab === 'products' && (
            <ProductsPage
              products={products}
              onProductUpdated={loadData}
              onNotify={showNotification}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersPage
              orders={orders}
              onOrderUpdated={loadData}
              onNotify={showNotification}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersPage customers={customers} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsPage stats={stats} />
          )}

          {activeTab === 'settings' && (
            <SettingsPage onNotify={showNotification} />
          )}
        </main>
      </div>

      {/* Floating Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 border animate-fade-up ${
            toast.type === 'error'
              ? theme.colors.status.error
              : theme.colors.status.success
          }`}
        >
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
