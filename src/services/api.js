const API_BASE = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('vk_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res, fallbackMsg) => {
  if (res.status === 401) {
    localStorage.removeItem('vk_admin_token');
    localStorage.removeItem('vk_admin_user');
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Session expired or unauthorized. Please log in again.');
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || fallbackMsg);
  return data;
};

export const api = {
  // Check backend status
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return res.ok;
    } catch {
      return false;
    }
  },

  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async getProfile() {
    const res = await fetch(`${API_BASE}/auth/profile`, { headers: getHeaders() });
    return handleResponse(res, 'Failed to fetch profile');
  },

  async getCustomers() {
    const res = await fetch(`${API_BASE}/auth/customers`, { headers: getHeaders() });
    return handleResponse(res, 'Failed to fetch customers');
  },

  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/products?${query}`);
    return res.json();
  },

  async getProductById(id) {
    const res = await fetch(`${API_BASE}/products/${id}`);
    return res.json();
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

  // Orders
  async getOrders(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/orders?${query}`, { headers: getHeaders() });
    return handleResponse(res, 'Failed to fetch orders');
  },

  async getOrderById(id) {
    const res = await fetch(`${API_BASE}/orders/${id}`, { headers: getHeaders() });
    return handleResponse(res, 'Failed to fetch order');
  },

  async updateOrderStatus(id, updateData) {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updateData),
    });
    return handleResponse(res, 'Failed to update order status');
  },

  // Dashboard Stats
  async getDashboardStats() {
    const res = await fetch(`${API_BASE}/dashboard/stats`, { headers: getHeaders() });
    return handleResponse(res, 'Failed to fetch dashboard stats');
  },
};
