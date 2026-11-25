export const API_BASE = 'http://localhost:5000/api';
export const STORE_URL = 'http://localhost:3000';

import {
  HARDCODED_JEWELLERY_PRODUCTS,
  HARDCODED_JEWELLERY_CATEGORIES,
  HARDCODED_MATERIALS,
  HARDCODED_OCCASIONS,
} from '../data/hardcodedProducts';

const getHeaders = () => {
  const token = localStorage.getItem('cf_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res, fallbackMsg) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || fallbackMsg || `Request failed with status ${res.status}`);
  }
  return data;
};

export const api = {
  // Check backend status
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(4000) });
      if (!res.ok) return { online: false, data: null };
      const data = await res.json();
      return { online: true, data };
    } catch {
      return { online: false, data: null };
    }
  },

  // Products
  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const url = query ? `${API_BASE}/products?${query}` : `${API_BASE}/products`;
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
        const nonSareeList = list.filter((p) => !String(p.category || '').toLowerCase().includes('saree'));
        if (nonSareeList.length > 0) {
          return { success: true, data: nonSareeList };
        }
      }
    } catch (err) {
      console.warn('API getProducts failed, using hardcoded fallback:', err);
    }
    return { success: true, data: HARDCODED_JEWELLERY_PRODUCTS };
  },

  async getProductById(id) {
    const res = await fetch(`${API_BASE}/products/${id}`);
    return handleResponse(res, 'Failed to fetch product details');
  },

  async createProduct(productData) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(productData),
    });
    return handleResponse(res, 'Failed to create product');
  },

  async updateProduct(id, productData) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(productData),
    });
    return handleResponse(res, 'Failed to update product');
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res, 'Failed to delete product');
  },

  // Attributes: Categories, Fabrics, Occasions
  async getCategories() {
    try {
      const res = await fetch(`${API_BASE}/attributes/categories`);
      if (res.ok) {
        const data = await res.json();
        if (data.data && Array.isArray(data.data)) {
          return data.data.map((c) => (typeof c === 'string' ? c : c.name));
        }
      }
    } catch {
      // fallback
    }
    return HARDCODED_JEWELLERY_CATEGORIES;
  },

  async createCategory(categoryData) {
    const payload = typeof categoryData === 'string' ? { name: categoryData } : categoryData;
    const res = await fetch(`${API_BASE}/attributes/categories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res, 'Failed to add category');
  },

  async deleteCategory(nameOrId) {
    const res = await fetch(`${API_BASE}/attributes/categories/${encodeURIComponent(nameOrId)}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res, 'Failed to delete category');
  },

  async getFabrics() {
    try {
      const res = await fetch(`${API_BASE}/attributes/fabrics`);
      if (res.ok) {
        const data = await res.json();
        if (data.data && Array.isArray(data.data)) {
          return data.data.map((f) => (typeof f === 'string' ? f : f.name));
        }
      }
    } catch {
      // fallback
    }
    return HARDCODED_MATERIALS;
  },

  async createFabric(fabricData) {
    const payload = typeof fabricData === 'string' ? { name: fabricData } : fabricData;
    const res = await fetch(`${API_BASE}/attributes/fabrics`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res, 'Failed to add fabric weave');
  },

  async deleteFabric(nameOrId) {
    const res = await fetch(`${API_BASE}/attributes/fabrics/${encodeURIComponent(nameOrId)}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res, 'Failed to delete fabric weave');
  },

  async getOccasions() {
    try {
      const res = await fetch(`${API_BASE}/attributes/occasions`);
      if (res.ok) {
        const data = await res.json();
        if (data.data && Array.isArray(data.data)) {
          return data.data.map((o) => (typeof o === 'string' ? o : o.name));
        }
      }
    } catch {
      // fallback
    }
    return HARDCODED_OCCASIONS;
  },

  async createOccasion(occasionData) {
    const payload = typeof occasionData === 'string' ? { name: occasionData } : occasionData;
    const res = await fetch(`${API_BASE}/attributes/occasions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res, 'Failed to add occasion');
  },

  async deleteOccasion(nameOrId) {
    const res = await fetch(`${API_BASE}/attributes/occasions/${encodeURIComponent(nameOrId)}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res, 'Failed to delete occasion');
  },

  // Orders
  async getOrders(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const url = query ? `${API_BASE}/orders?${query}` : `${API_BASE}/orders`;
      const res = await fetch(url, { headers: getHeaders(), signal: AbortSignal.timeout(6000) });
      return handleResponse(res, 'Failed to fetch orders');
    } catch (err) {
      console.warn('Could not fetch orders from API:', err);
      return { success: false, data: [] };
    }
  },

  async updateOrderStatus(id, updates) {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    return handleResponse(res, 'Failed to update order status');
  },

  // Dashboard Stats
  async getDashboardStats() {
    const res = await fetch(`${API_BASE}/dashboard/stats`, {
      headers: getHeaders(),
      signal: AbortSignal.timeout(6000),
    });
    return handleResponse(res, 'Failed to fetch dashboard stats');
  },

  // Customers & User Access
  async getCustomers() {
    try {
      const res = await fetch(`${API_BASE}/auth/customers`, {
        headers: getHeaders(),
        signal: AbortSignal.timeout(6000),
      });
      return handleResponse(res, 'Failed to fetch customer users');
    } catch (err) {
      console.warn('Could not fetch customers from API:', err);
      return { success: false, data: [] };
    }
  },

  // ── Exchange Requests ──────────────────────────────────────────────────────

  // GET /api/exchanges?status=&search=
  async getExchanges(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const url = query ? `${API_BASE}/exchanges?${query}` : `${API_BASE}/exchanges`;
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      return handleResponse(res, 'Failed to fetch exchange requests');
    } catch (err) {
      console.warn('Could not fetch exchanges from API:', err);
      return { success: false, data: [] };
    }
  },

  // GET /api/exchanges/stats
  async getExchangeStats() {
    try {
      const res = await fetch(`${API_BASE}/exchanges/stats`, {
        signal: AbortSignal.timeout(6000),
      });
      return handleResponse(res, 'Failed to fetch exchange stats');
    } catch (err) {
      console.warn('Could not fetch exchange stats:', err);
      return { success: false, data: null };
    }
  },

  // GET /api/exchanges/:id
  async getExchangeById(id) {
    const res = await fetch(`${API_BASE}/exchanges/${id}`);
    return handleResponse(res, 'Failed to fetch exchange request');
  },

  // POST /api/exchanges
  async createExchange(exchangeData) {
    const res = await fetch(`${API_BASE}/exchanges`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(exchangeData),
    });
    return handleResponse(res, 'Failed to create exchange request');
  },

  // PUT /api/exchanges/:id/status
  async updateExchangeStatus(id, status, adminNotes = '') {
    const res = await fetch(`${API_BASE}/exchanges/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status, adminNotes }),
    });
    return handleResponse(res, 'Failed to update exchange status');
  },

  // DELETE /api/exchanges/:id
  async deleteExchange(id) {
    const res = await fetch(`${API_BASE}/exchanges/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res, 'Failed to delete exchange request');
  },

  // ── Authorized Website Users & Access Control ──────────────────────────────

  // GET /api/auth/authorized-users
  async getAuthorizedUsers() {
    try {
      const res = await fetch(`${API_BASE}/auth/authorized-users`, {
        headers: getHeaders(),
        signal: AbortSignal.timeout(6000),
      });
      return handleResponse(res, 'Failed to fetch authorized users');
    } catch (err) {
      console.warn('Could not fetch authorized users from API:', err);
      return { success: false, data: [] };
    }
  },

  // POST /api/auth/authorized-users
  async createAuthorizedUser(userData) {
    const res = await fetch(`${API_BASE}/auth/authorized-users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(res, 'Failed to create authorized user');
  },

  // PUT /api/auth/authorized-users/:id
  async updateUserAccess(id, updates) {
    const res = await fetch(`${API_BASE}/auth/authorized-users/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    return handleResponse(res, 'Failed to update user access');
  },

  // DELETE /api/auth/authorized-users/:id
  async deleteAuthorizedUser(id) {
    const res = await fetch(`${API_BASE}/auth/authorized-users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res, 'Failed to delete authorized user');
  },

  // GET /api/auth/verify-access?email=...
  async verifyWebsiteAccess(email) {
    const res = await fetch(`${API_BASE}/auth/verify-access?email=${encodeURIComponent(email)}`);
    return handleResponse(res, 'Failed to verify website access');
  },

  // ── Hero Banner / Advertisement Slider API ────────────────────────────────
  // GET /api/banners?all=true
  async getBanners(params = { all: true }) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_BASE}/banners?${query}` : `${API_BASE}/banners`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    return handleResponse(res, 'Failed to fetch hero banners');
  },

  // GET /api/banners/:id
  async getBannerById(id) {
    const res = await fetch(`${API_BASE}/banners/${id}`);
    return handleResponse(res, 'Failed to fetch banner details');
  },

  // POST /api/banners
  async createBanner(bannerData) {
    const res = await fetch(`${API_BASE}/banners`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(bannerData),
    });
    return handleResponse(res, 'Failed to create banner');
  },

  // PUT /api/banners/:id
  async updateBanner(id, bannerData) {
    const res = await fetch(`${API_BASE}/banners/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(bannerData),
    });
    return handleResponse(res, 'Failed to update banner');
  },

  // DELETE /api/banners/:id
  async deleteBanner(id) {
    const res = await fetch(`${API_BASE}/banners/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res, 'Failed to delete banner');
  },

  // POST /api/banners/reset
  async resetBanners() {
    const res = await fetch(`${API_BASE}/banners/reset`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(res, 'Failed to reset banners');
  },

  // ── Offers & Discounts API ────────────────────────────────────────────────
  // GET /api/offers?all=true
  async getOffers(params = { all: true }) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_BASE}/offers?${query}` : `${API_BASE}/offers`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    return handleResponse(res, 'Failed to fetch offers');
  },

  // GET /api/offers/:idOrCode
  async getOfferById(idOrCode) {
    const res = await fetch(`${API_BASE}/offers/${idOrCode}`);
    return handleResponse(res, 'Failed to fetch offer details');
  },

  // POST /api/offers
  async createOffer(offerData) {
    const res = await fetch(`${API_BASE}/offers`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(offerData),
    });
    return handleResponse(res, 'Failed to create offer');
  },

  // PUT /api/offers/:id
  async updateOffer(id, offerData) {
    const res = await fetch(`${API_BASE}/offers/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(offerData),
    });
    return handleResponse(res, 'Failed to update offer');
  },

  // DELETE /api/offers/:id
  async deleteOffer(id) {
    const res = await fetch(`${API_BASE}/offers/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res, 'Failed to delete offer');
  },

  // POST /api/offers/reset
  async resetOffers() {
    const res = await fetch(`${API_BASE}/offers/reset`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(res, 'Failed to reset offers');
  },
};
