import { products as SEED_PRODUCTS, categories as SEED_CATEGORIES } from "@/data/products";

export const PRESET_IMAGES = [
  { label: 'Bridal Set — Antique Kemp Combo', src: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80', id: 'bridal' },
  { label: 'Harams & Chains — Kasu Malai', src: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80', id: 'harams' },
  { label: 'Chokers & Necklaces — Peacock Kemp', src: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80', id: 'chokers' },
  { label: 'Bangles & Kadas — Micro Gold Plated', src: 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&w=800&q=80', id: 'bangles' },
  { label: 'Earrings & Jhumkas — Temple Bell', src: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80', id: 'jhumkas' },
  { label: 'Hip Belts & Hair — Antique Oddiyanam', src: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80', id: 'oddiyanam' },
  { label: 'Maang Tikka — Nethichutti', src: '/products/maang-tikka.jpg', id: 'nethichutti' },
  { label: 'Anklets & Kolusu — 1-Gram Plated', src: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=800&q=80', id: 'kolusu' },
  { label: 'Armlets & Vanki — Lakshmi Carving', src: '/products/lakshmi-vanki.jpg', id: 'vanki' },
  { label: 'Mangalsutra & Thali — Kodi Chain', src: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80', id: 'thali' },
  { label: 'Pendant Sets — Temple Locket', src: '/products/temple-locket.jpg', id: 'pendant' },
  { label: 'Nose Rings — Traditional Mukkuvalai', src: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80', id: 'mukkuvalai' },
  { label: 'Luxury Brand Showcase Hero', src: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1600&q=80', id: 'hero' },
];

const sanitizeImageUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('photo-1544441893-675973e31985') || url === '/banners/banner-4.jpg') return '/products/maang-tikka.jpg';
  if (url.includes('photo-1539185441755-769473a23570') || url === '/banners/banner-1.jpg') return '/products/temple-locket.jpg';
  if (url.includes('photo-1512496015851-a90fb38ba796') || url === '/banners/banner-3.jpg') return '/products/temple-payal.jpg';
  if (url.includes('photo-1600003014755-ba31aa59c4b6') || url === '/banners/banner-2.jpg') return '/products/lakshmi-vanki.jpg';
  return url;
};

const sanitizeProductImages = (p) => ({
  ...p,
  image: sanitizeImageUrl(p.image),
  gallery: Array.isArray(p.gallery) ? p.gallery.map(sanitizeImageUrl) : [],
  images: Array.isArray(p.images) ? p.images.map(sanitizeImageUrl) : [],
});

const STORAGE_PRODUCTS_KEY = 'mf_products_list_v4';
const STORAGE_CATEGORIES_KEY = 'mf_categories_list_v4';
const API_URL = 'http://localhost:5000/api';

class ProductService {
  constructor() {
    this.subscribers = new Set();
    this.products = this.loadProducts();
    this.categories = this.loadCategories();
    this.syncWithBackend();
  }

  // Load products (defaults to Madha Fancy jewelry seed catalog)
  loadProducts() {
    if (typeof window === 'undefined') return SEED_PRODUCTS;
    try {
      const stored = window.localStorage.getItem(STORAGE_PRODUCTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasJewelry = parsed.some((p) => p.id && String(p.id).startsWith('mf-prod'));
          if (hasJewelry) {
            return parsed.map(sanitizeProductImages);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored products:', e);
    }
    this.saveProducts(SEED_PRODUCTS);
    return SEED_PRODUCTS;
  }

  // Load categories (defaults to Madha Fancy jewelry categories)
  deriveCategoriesFromProducts(productsList) {
    const map = new Map();
    (productsList || []).forEach((p) => {
      if (p.isActive === false) return;
      const catName = String(p.category || '').trim();
      if (!catName) return;
      const key = catName.toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          name: catName,
          slug: catName,
          image: p.image || PRESET_IMAGES[0].src,
          isActive: true,
        });
      }
    });
    return Array.from(map.values());
  }

  loadCategories() {
    if (typeof window === 'undefined') return SEED_CATEGORIES;
    try {
      const stored = window.localStorage.getItem(STORAGE_CATEGORIES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasJewelryCat = parsed.some((c) =>
            ['Bridal Sets', 'Harams & Long Chains', 'Necklaces & Chokers', 'Bangles & Kadas', 'Earrings & Jhumkas'].includes(c.name)
          );
          if (hasJewelryCat) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored categories:', e);
    }
    this.saveCategories(SEED_CATEGORIES);
    return SEED_CATEGORIES;
  }

  saveProducts(list) {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Full products list exceeded localStorage quota, saving lightweight catalog:', e);
      try {
        const lightList = list.map((p) => ({
          ...p,
          image: p.image && p.image.length > 50000 ? p.image.slice(0, 50000) : p.image,
          gallery: Array.isArray(p.gallery) ? p.gallery.slice(0, 6).map((img) => img && img.length > 50000 ? img.slice(0, 50000) : img) : [],
        }));
        window.localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(lightList));
      } catch (inner) {}
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
      const [prodRes, catRes] = await Promise.allSettled([
        fetch(`${API_URL}/products`, { cache: 'no-store' }),
        fetch(`${API_URL}/attributes/categories`, { cache: 'no-store' }),
      ]);

      let updated = false;

      if (prodRes.status === 'fulfilled' && prodRes.value.ok) {
        const json = await prodRes.value.json();
        const serverProducts = json.data || json;
        if (Array.isArray(serverProducts) && serverProducts.length > 0) {
          const hasOnlyLegacy = serverProducts.every(
            (p) =>
              String(p.name).toLowerCase().includes('shirt') ||
              String(p.category).toLowerCase().includes('saree')
          );
          if (!hasOnlyLegacy) {
            this.products = serverProducts.map((p) => {
              const resolvedImg = sanitizeImageUrl(
                p.image ||
                (Array.isArray(p.gallery) && p.gallery[0]) ||
                (Array.isArray(p.images) && p.images[0]) ||
                (Array.isArray(p.colors) && p.colors[0]?.images && p.colors[0].images[0]) ||
                PRESET_IMAGES[0].src
              );
              return sanitizeProductImages({
                ...p,
                id: p._id || p.id,
                image: resolvedImg,
                gallery: Array.isArray(p.gallery) ? p.gallery : Array.isArray(p.images) ? p.images : [],
                images: Array.isArray(p.images) ? p.images : Array.isArray(p.gallery) ? p.gallery : [],
                colors: Array.isArray(p.colors) ? p.colors : [],
                isActive: p.isActive !== false,
                inStock: p.inStock !== false,
              });
            });
            this.saveProducts(this.products);
            updated = true;
          }
        }
      }

      let loadedServerCategories = false;
      if (catRes.status === 'fulfilled' && catRes.value.ok) {
        const catJson = await catRes.value.json();
        const serverCats = catJson.data || catJson;
        if (Array.isArray(serverCats) && serverCats.length > 0) {
          const hasLegacyOnly = serverCats.every(
            (c) =>
              String(c.name).toLowerCase().includes('saree') ||
              c.name === 'Party Wear'
          );
          if (!hasLegacyOnly) {
            this.categories = serverCats.map((c) => {
              const foundPreset = PRESET_IMAGES.find((img) => img.id === c.presetImageId || img.src === c.image);
              const matchingProd = this.products.find(
                (p) => p.category && c.name && p.category.toLowerCase() === c.name.toLowerCase()
              );
              return {
                ...c,
                image: c.image || (foundPreset ? foundPreset.src : matchingProd?.image || PRESET_IMAGES[0].src),
                isActive: c.isActive !== false,
              };
            });
            this.saveCategories(this.categories);
            loadedServerCategories = true;
            updated = true;
          }
        }
      }

      if (!loadedServerCategories) {
        this.categories = this.deriveCategoriesFromProducts(this.products);
        this.saveCategories(this.categories);
        updated = true;
      }

      if (updated) {
        this.notify();
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
    const uniqueSku = data.sku || `MF-${(data.category || 'JWL').slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newProduct = {
      id: uniqueId,
      _id: uniqueId,
      sku: uniqueSku,
      name: data.name.trim(),
      category: data.category || 'Bridal Sets',
      subcategory: data.subcategory || '',
      fabric: data.fabric || '1-Gram Micro Gold Plated',
      color: data.color || 'Ruby Red & Gold',
      occasion: data.occasion || 'Bridal & Wedding',
      price: Number(data.price) || 0,
      mrp: Number(data.mrp) || Math.round(Number(data.price) * 1.25),
      rating: Number(data.rating) || 5.0,
      reviews: Number(data.reviews) || 1,
      image: data.image || PRESET_IMAGES[0].src,
      images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [data.image || PRESET_IMAGES[0].src],
      presetImageId: data.presetImageId || '',
      description: data.description || 'Exclusive 1-Gram gold covering jewellery with rich craftsmanship and timeless elegance.',
      length: data.length || 'Adjustable back rope dori',
      blousePiece: data.blousePiece || 'Adjustable golden thread / screw lock',
      washCare: data.washCare || 'Store in airtight zip pouch away from perfume and moisture.',
      inStock: data.inStock !== false,
      isActive: data.isActive !== false,
      isBestSeller: Boolean(data.isBestSeller),
      isNew: Boolean(data.isNew),
      brand: data.brand || 'Madha Fancy',
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
      image: data.image || PRESET_IMAGES[0].src,
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
