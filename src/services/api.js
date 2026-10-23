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

  async getCategories() {
    try {
      const res = await fetch(`${API_BASE}/products/categories/list`);
      if (res.ok) {
        const data = await res.json();
        if (data.categories && Array.isArray(data.categories)) return data.categories;
      }
    } catch {
      // fallback
    }
    return ['Silk', 'Cotton', 'Designer', 'Wedding', 'Party Wear', 'Bridal', 'Festive', 'Other'];
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
};
