import { products as initialProducts, categories as initialCategories } from '@/data/products';
import sareeSilk from "@/assets/saree-silk.jpg";
import sareeCotton from "@/assets/saree-cotton.jpg";
import sareeBridal from "@/assets/saree-bridal.jpg";
import sareeOrganza from "@/assets/saree-organza.jpg";
import sareeChiffon from "@/assets/saree-chiffon.jpg";
import sareeDesigner from "@/assets/saree-designer.jpg";
import sareeFestive from "@/assets/saree-festive.jpg";
import hero from "@/assets/hero.jpg";

export const PRESET_IMAGES = [
  { label: 'Pure Silk — Maroon & Gold', src: sareeSilk, id: 'silk' },
  { label: 'Kanchipuram Silk — Bridal Red', src: sareeBridal, id: 'bridal' },
  { label: 'Chettinad Cotton — Mustard', src: sareeCotton, id: 'cotton' },
  { label: 'Organza Silk — Mint Green', src: sareeOrganza, id: 'organza' },
  { label: 'Chiffon Georgette — Rose Pink', src: sareeChiffon, id: 'chiffon' },
  { label: 'Designer Brocade — Royal Navy', src: sareeDesigner, id: 'designer' },
  { label: 'Festive Banarasi — Sunset Gold', src: sareeFestive, id: 'festive' },
  { label: 'Heritage Editorial Hero', src: hero, id: 'hero' },
];

const STORAGE_PRODUCTS_KEY = 'cf_products_list_v2';
const STORAGE_CATEGORIES_KEY = 'cf_categories_list_v2';
const API_URL = 'http://localhost:5000/api';

class ProductService {
  constructor() {
    this.subscribers = new Set();
    this.products = this.loadProducts();
    this.categories = this.loadCategories();
    this.syncWithBackend();
  }

  // Load products with fallback to initial data
  loadProducts() {
    if (typeof window === 'undefined') return initialProducts;
    try {
      const stored = window.localStorage.getItem(STORAGE_PRODUCTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p) => {
            const foundPreset = PRESET_IMAGES.find((img) => img.id === p.presetImageId || img.src === p.image);
            return {
              ...p,
              image: foundPreset ? foundPreset.src : (p.image || sareeSilk),
              isActive: p.isActive !== false,
              inStock: p.inStock !== false,
            };
          });
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored products, falling back to defaults:', e);
    }
    const normalized = initialProducts.map((p) => ({
      ...p,
      isActive: true,
      inStock: p.inStock !== false,
      createdAt: p.createdAt || new Date().toISOString(),
    }));
    this.saveProducts(normalized);
    return normalized;
  }

  // Load categories
  loadCategories() {
    if (typeof window === 'undefined') return initialCategories;
    try {
      const stored = window.localStorage.getItem(STORAGE_CATEGORIES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((c) => {
            const foundPreset = PRESET_IMAGES.find((img) => img.id === c.presetImageId || img.src === c.image);
            return {
              ...c,
              image: foundPreset ? foundPreset.src : (c.image || sareeSilk),
              isActive: c.isActive !== false,
            };
          });
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored categories, falling back to defaults:', e);
    }
    const normalized = initialCategories.map((c) => ({
      ...c,
      isActive: true,
      description: c.description || `Handcrafted ${c.name} collection for festive & everyday luxury.`,
    }));
    this.saveCategories(normalized);
    return normalized;
  }

  saveProducts(list) {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save products to localStorage:', e);
    }
  }

  saveCategories(list) {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save categories to localStorage:', e);
    }
  }

  notify() {
    this.subscribers.forEach((cb) => {
      try {
        cb({ products: [...this.products], categories: [...this.categories] });
      } catch (err) {
        console.error('Subscriber notify error:', err);
      }
    });
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  // Backend sync helper
  async syncWithBackend() {
    try {
      const res = await fetch(`${API_URL}/products`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        const serverProducts = json.data || json;
        if (Array.isArray(serverProducts) && serverProducts.length > 0) {
          console.log(`Synced ${serverProducts.length} products from backend API`);
        }
      }
    } catch (e) {}
  }

  // --- Products API ---

  getAllProducts() {
    return [...this.products];
  }

  getActiveProducts() {
    return this.products.filter((p) => p.isActive !== false && p.inStock !== false);
  }

  getProductById(id) {
    if (!id) return null;
    const strId = String(id).toLowerCase();
    return this.products.find(
      (p) => String(p.id).toLowerCase() === strId ||
             String(p._id).toLowerCase() === strId ||
             String(p.sku).toLowerCase() === strId
    ) || null;
  }

  async addProduct(data) {
    const slug = (data.name || 'product')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const uniqueId = `${slug}-${Date.now().toString().slice(-4)}`;
    const uniqueSku = data.sku || `CF-${(data.category || 'SAR').slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newProduct = {
      id: uniqueId,
      _id: uniqueId,
      sku: uniqueSku,
      name: data.name.trim(),
      category: data.category || 'Silk',
      subcategory: data.subcategory || '',
      fabric: data.fabric || 'Pure Handloom Silk',
      color: data.color || 'Multicolor',
      occasion: data.occasion || 'Festive',
      price: Number(data.price) || 0,
      mrp: Number(data.mrp) || Math.round(Number(data.price) * 1.25),
      rating: Number(data.rating) || 5.0,
      reviews: Number(data.reviews) || 1,
      image: data.image || sareeSilk,
      images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [data.image || sareeSilk],
      presetImageId: data.presetImageId || '',
      description: data.description || 'Exclusive pure handwoven saree with rich craftsmanship and timeless elegance.',
      length: data.length || '6.3 metres (with blouse piece)',
      blousePiece: data.blousePiece || 'Included — 0.8 m running blouse',
      washCare: data.washCare || 'Dry clean only',
      inStock: data.inStock !== false,
      isActive: data.isActive !== false,
      isBestSeller: Boolean(data.isBestSeller),
      isNew: Boolean(data.isNew),
      brand: data.brand || 'CF Handlooms',
      stock: data.stock !== undefined ? Number(data.stock) : 15,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.products = [newProduct, ...this.products];
    this.saveProducts(this.products);
    this.notify();

    try {
      fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      }).catch(() => {});
    } catch {}

    return newProduct;
  }

  async updateProduct(id, updates) {
    let targetIndex = this.products.findIndex((p) => p.id === id || p._id === id);
    if (targetIndex === -1) {
      throw new Error(`Product with ID "${id}" not found`);
    }

    const current = this.products[targetIndex];
    const updatedProduct = {
      ...current,
      ...updates,
      price: updates.price !== undefined ? Number(updates.price) : current.price,
      mrp: updates.mrp !== undefined ? Number(updates.mrp) : current.mrp,
      stock: updates.stock !== undefined ? Number(updates.stock) : current.stock,
      inStock: updates.inStock !== undefined ? Boolean(updates.inStock) : current.inStock,
      isActive: updates.isActive !== undefined ? Boolean(updates.isActive) : current.isActive,
      updatedAt: new Date().toISOString(),
    };

    if (updates.image && (!updates.images || updates.images.length === 0)) {
      updatedProduct.images = [updates.image];
    }

    this.products[targetIndex] = updatedProduct;
    this.saveProducts(this.products);
    this.notify();

    try {
      fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      }).catch(() => {});
    } catch {}

    return updatedProduct;
  }

  async deleteProduct(id) {
    const target = this.products.find((p) => p.id === id || p._id === id);
    if (!target) return false;

    this.products = this.products.filter((p) => p.id !== id && p._id !== id);
    this.saveProducts(this.products);
    this.notify();

    try {
      fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
      }).catch(() => {});
    } catch {}

    return true;
  }

  async toggleProductStatus(id) {
    const p = this.getProductById(id);
    if (!p) return null;
    const newStatus = p.isActive === false ? true : false;
    return await this.updateProduct(p.id, { isActive: newStatus });
  }

  // --- Categories API ---

  getAllCategories() {
    return [...this.categories];
  }

  async addCategory(data) {
    const slug = data.slug || data.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const existing = this.categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
    if (existing) {
      throw new Error(`Category with slug "${slug}" already exists`);
    }

    const newCategory = {
      name: data.name.trim(),
      slug: slug,
      image: data.image || sareeSilk,
      presetImageId: data.presetImageId || '',
      description: data.description || `Exclusive handcrafted ${data.name} collection.`,
      isActive: data.isActive !== false,
      createdAt: new Date().toISOString(),
    };

    this.categories = [...this.categories, newCategory];
    this.saveCategories(this.categories);
    this.notify();

    return newCategory;
  }

  async updateCategory(slug, updates) {
    const idx = this.categories.findIndex((c) => c.slug === slug);
    if (idx === -1) {
      throw new Error(`Category "${slug}" not found`);
    }

    const current = this.categories[idx];
    const updated = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (updates.name && updates.name !== current.name) {
      this.products = this.products.map((p) =>
        p.category === current.name || p.category === current.slug
          ? { ...p, category: updates.name }
          : p
      );
      this.saveProducts(this.products);
    }

    this.categories[idx] = updated;
    this.saveCategories(this.categories);
    this.notify();

    return updated;
  }

  async deleteCategory(slug) {
    this.categories = this.categories.filter((c) => c.slug !== slug);
    this.saveCategories(this.categories);
    this.notify();
    return true;
  }

  resetToDefaults() {
    window.localStorage.removeItem(STORAGE_PRODUCTS_KEY);
    window.localStorage.removeItem(STORAGE_CATEGORIES_KEY);
    this.products = this.loadProducts();
    this.categories = this.loadCategories();
    this.notify();
    return true;
  }
}

export const productService = new ProductService();
