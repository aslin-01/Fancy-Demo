import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { ProductsView } from './components/ProductsView';
import { OrdersPage } from './pages/OrdersPage';
import { ReturnsPage } from './pages/ReturnsPage';
import { LowStockPage } from './pages/LowStockPage';
import { UserAccessView } from './components/UserAccessView';
import { AddProductPage } from './pages/AddProductPage';
import { api, STORE_URL } from './services/api';
import { Check, ExternalLink, X, AlertCircle } from 'lucide-react';
import { theme } from './theme';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'products' | 'orders' | 'user-access'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([
    {
      _id: 'ord-101',
      orderNumber: 'CF-2026-089',
      customerName: 'Priya Sharma',
      customerEmail: 'priya.sharma@example.com',
      customerPhone: '+91 98401 22334',
      items: [{ name: 'Kanchipuram Pure Silk Zari Saree', quantity: 1, price: 18499 }],
      totalAmount: 18499,
      orderStatus: 'Processing',
      paymentMethod: 'Prepaid (UPI)',
      createdAt: '2026-10-24T10:30:00Z',
      shippingAddress: { city: 'Chennai', state: 'Tamil Nadu', pincode: '600001' }
    },
    {
      _id: 'ord-102',
      orderNumber: 'CF-2026-088',
      customerName: 'Ananya Deshmukh',
      customerEmail: 'ananya.d@example.com',
      customerPhone: '+91 98202 33445',
      items: [{ name: 'Banarasi Soft Silk Brocade', quantity: 1, price: 14299 }],
      totalAmount: 14299,
      orderStatus: 'Shipped',
      paymentMethod: 'Credit Card',
      createdAt: '2026-10-23T16:15:00Z',
      shippingAddress: { city: 'Mumbai', state: 'Maharashtra', pincode: '400050' }
    },
    {
      _id: 'ord-103',
      orderNumber: 'CF-2026-087',
      customerName: 'Kavitha Raman',
      customerEmail: 'kavitha.raman@example.com',
      customerPhone: '+91 94441 55667',
      items: [{ name: 'Royal Crimson Wedding Silk Saree', quantity: 1, price: 30999 }],
      totalAmount: 30999,
      orderStatus: 'Delivered',
      paymentMethod: 'Net Banking',
      createdAt: '2026-10-22T11:00:00Z',
      shippingAddress: { city: 'Bengaluru', state: 'Karnataka', pincode: '560001' }
    }
  ]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [backendOnline, setBackendOnline] = useState(true);

  // Add / Edit Product page state
  const [editingProduct, setEditingProduct] = useState(null);

  // Toast Notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success', link = STORE_URL) => {
    setToast({ message, type, link });
    setTimeout(() => {
      setToast(null);
    }, 6000);
  };

  // Handle Tab Switch (clears editing state if navigating away)
  const handleTabChange = (tabId) => {
    if (tabId !== 'add-product') {
      setEditingProduct(null);
    }
    setActiveTab(tabId);
  };

  // Fetch all initial data
  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsRefreshing(true);
    try {
      // 1. Check backend health
      const health = await api.checkHealth();
      setBackendOnline(health.online);

      // 2. Fetch products
      const productsRes = await api.getProducts().catch(() => ({ data: [] }));
      const fetchedProducts = Array.isArray(productsRes.data)
        ? productsRes.data
        : Array.isArray(productsRes)
        ? productsRes
        : [];
      setProducts(fetchedProducts);

      // 3. Fetch dashboard stats
      const statsRes = await api.getDashboardStats().catch(() => null);
      if (statsRes?.data) {
        setStats(statsRes.data);
      }
    } catch (err) {
      console.error('Error fetching data from backend:', err);
      setBackendOnline(false);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Periodic health check every 30s
    const timer = setInterval(() => {
      api.checkHealth().then((h) => setBackendOnline(h.online));
    }, 30000);

    return () => clearInterval(timer);
  }, [loadData]);

  // Handle Add Product opening (navigate to Add Product page)
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setActiveTab('add-product');
  };

  // Handle Edit Product opening (navigate to Add/Edit Product page)
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setActiveTab('add-product');
  };

  // Handle Product Added / Updated
  const handleProductSuccess = (savedProduct) => {
    showToast(
      `Product "${savedProduct.name}" is now live! View it on localhost:3000`,
      'success',
      STORE_URL
    );
    loadData(true);
  };

  // Handle Delete Product
  const handleDeleteProduct = async (product) => {
    if (confirm(`Are you sure you want to delete "${product.name}"? This will remove it from http://localhost:3000/.`)) {
      try {
        await api.deleteProduct(product._id || product.id);
        setProducts((prev) => prev.filter((p) => (p._id || p.id) !== (product._id || product.id)));
        showToast(`Product "${product.name}" removed from store`, 'info');
        loadData(true);
      } catch (err) {
        alert(`Failed to delete product: ${err.message}`);
      }
    }
  };

  return (
    <div className={`min-h-screen bg-[#FAF8F2] flex text-[#12100D] ${theme.fonts.body} selection:bg-[#B87802] selection:text-white`}>
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#0C0A07] text-white border border-[#F5B815]/40 animate-in slide-in-from-bottom-5 max-w-md">
          <div className="w-8 h-8 rounded-full bg-[#F5B815] text-[#0C0A07] flex items-center justify-center shrink-0 font-bold">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold leading-snug">{toast.message}</p>
            {toast.link && (
              <a
                href={toast.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#F5B815] hover:underline flex items-center gap-1 font-semibold mt-0.5"
              >
                <span>Open http://localhost:3000/</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          <button
            onClick={() => setToast(null)}
            className="p-1 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        productCount={products.length}
        orderCount={orders.length}
        lowStockCount={
          products.length > 0
            ? products.filter((p) => (p.stockCount ?? 0) <= 10 || !p.inStock).length
            : 5
        }
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        

        {/* Dynamic Page Views */}
        <main className="p-8 flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              stats={stats}
              products={products}
              onNavigateProducts={() => setActiveTab('products')}
              onNavigateUserAccess={() => setActiveTab('user-access')}
            />
          )}

          {activeTab === 'products' && (
            <ProductsView
              products={products}
              loading={loading}
              onOpenAddProduct={handleOpenAddProduct}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
              onRefresh={() => loadData(true)}
            />
          )}

          {activeTab === 'low-stock' && (
            <LowStockPage
              products={products}
              onEditProduct={handleEditProduct}
              onRefresh={() => loadData(true)}
              onNotify={showToast}
            />
          )}

          {activeTab === 'add-product' && (
            <AddProductPage
              initialProduct={editingProduct}
              products={products}
              onBack={() => {
                setEditingProduct(null);
                setActiveTab('products');
              }}
              onSuccess={handleProductSuccess}
              onAddAnother={() => {
                setEditingProduct(null);
              }}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersPage
              orders={orders}
              onOrderUpdated={() => loadData(true)}
              onNotify={showToast}
            />
          )}

          {activeTab === 'returns' && (
            <ReturnsPage onNotify={showToast} orders={orders} />
          )}

          {activeTab === 'user-access' && <UserAccessView />}
        </main>
      </div>

    </div>
  );
}

export default App;
