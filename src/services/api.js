export const API_BASE = 'http://localhost:5000/api';
export const STORE_URL = 'http://localhost:3000';

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
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_BASE}/products?${query}` : `${API_BASE}/products`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    return handleResponse(res, 'Failed to fetch products');
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
    return ['Silk', 'Cotton', 'Designer', 'Wedding', 'Party Wear', 'Bridal', 'Festive', 'Other'];
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
    return [
      'Pure Mulberry Silk',
      'Kanchipuram Silk',
      'Banarasi Silk',
      'Tussar Silk',
      'Chanderi Silk',
      'Organza Silk',
      'Georgette',
      'Linen Silk',
      'Raw Silk',
      'Cotton Silk',
      'Crepe Silk',
    ];
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
    return [
      'Festive',
      'Wedding',
      'Bridal',
      'Party Wear',
      'Reception',
      'Pooja / Traditional',
      'Casual Wear',
      'Cocktail',
      'Formal Event',
    ];
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
};
