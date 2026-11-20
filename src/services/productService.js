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

  // Load products (starts empty - no hardcoded/demo products)
  loadProducts() {
    if (typeof window === 'undefined') return [];
    try {
      const stored = window.localStorage.getItem(STORAGE_PRODUCTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const demoIds = new Set([
            'kanchipuram-silk-maroon',
            'banarasi-silk-heritage',
            'cotton-handloom-ivory',
            'bridal-red-zari',
            'organza-blush-pink',
            'chiffon-emerald',
            'designer-navy-sequin',
            'festive-mustard-temple',
            'soft-silk-rose',
            'linen-sage-everyday',
            'georgette-emerald-evening',
            'bridal-gold-kanchipuram',
          ]);
          const demoNames = new Set([
            'kanchipuram pure silk saree — maroon & gold',
            'banarasi silk saree — heritage brocade',
            'handloom cotton saree — ivory & beige',
            'bridal wedding saree — royal red zari',
            'shimmer organza saree — blush pink',
            'chiffon saree — emerald with gold buttis',
            'traditional festive saree — mustard temple border',
            'soft silk saree — rose gold sheen',
            'linen saree — natural sand',
            'bridal kanchipuram saree — antique gold',
          ]);
          const filtered = parsed.filter(
            (p) =>
              !demoIds.has(p.id) &&
              !demoIds.has(p._id) &&
              !demoNames.has(String(p.name || '').toLowerCase().trim())
          );
          return filtered.map((p) => {
            const resolvedImg = p.image || (Array.isArray(p.gallery) && p.gallery[0]) || (Array.isArray(p.images) && p.images[0]) || (Array.isArray(p.colors) && p.colors[0]?.images && p.colors[0].images[0]) || sareeSilk;
            return {
              ...p,
              id: p._id || p.id,
              image: resolvedImg,
              gallery: Array.isArray(p.gallery) ? p.gallery : (Array.isArray(p.images) ? p.images : []),
              images: Array.isArray(p.images) ? p.images : (Array.isArray(p.gallery) ? p.gallery : []),
              colors: Array.isArray(p.colors) ? p.colors : [],
              isActive: p.isActive !== false,
              inStock: p.inStock !== false,
            };
          });
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored products:', e);
    }
    return [];
  }

  // Load categories (starts empty or derives from stored products - no hardcoded categories)
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
          slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          image: p.image || sareeSilk,
          isActive: true,
        });
      }
    });
    return Array.from(map.values());
  }

  loadCategories() {
    if (typeof window === 'undefined') return [];
    try {
      const stored = window.localStorage.getItem(STORAGE_CATEGORIES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ignore legacy hardcoded fallback categories that were previously cached without backend _id
          const legacyNames = new Set(['Silk Sarees', 'Cotton Sarees', 'Designer Sarees', 'Wedding Sarees', 'Party Wear']);
          const isLegacyDefault = parsed.every((c) => !c._id && legacyNames.has(c.name));
          if (!isLegacyDefault) {
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
      }
    } catch (e) {
      console.warn('Failed to parse stored categories:', e);
    }
    return this.deriveCategoriesFromProducts(this.products);
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
        fetch(`${API_URL}/categories`, { cache: 'no-store' }),
      ]);

      let updated = false;

      if (prodRes.status === 'fulfilled' && prodRes.value.ok) {
        const json = await prodRes.value.json();
        const serverProducts = json.data || json;
        if (Array.isArray(serverProducts)) {
          this.products = serverProducts.map((p) => {
            const resolvedImg = p.image || (Array.isArray(p.gallery) && p.gallery[0]) || (Array.isArray(p.images) && p.images[0]) || (Array.isArray(p.colors) && p.colors[0]?.images && p.colors[0].images[0]) || sareeSilk;
            return {
              ...p,
              id: p._id || p.id,
              image: resolvedImg,
              gallery: Array.isArray(p.gallery) ? p.gallery : (Array.isArray(p.images) ? p.images : []),
              images: Array.isArray(p.images) ? p.images : (Array.isArray(p.gallery) ? p.gallery : []),
              colors: Array.isArray(p.colors) ? p.colors : [],
              isActive: p.isActive !== false,
              inStock: p.inStock !== false,
            };
          });
          this.saveProducts(this.products);
          updated = true;
        }
      }

      let loadedServerCategories = false;
      if (catRes.status === 'fulfilled' && catRes.value.ok) {
        const catJson = await catRes.value.json();
        const serverCats = catJson.data || catJson;
        if (Array.isArray(serverCats) && serverCats.length > 0) {
          this.categories = serverCats.map((c) => {
            const foundPreset = PRESET_IMAGES.find((img) => img.id === c.presetImageId || img.src === c.image);
            const matchingProd = this.products.find(
              (p) => p.category && c.name && p.category.toLowerCase() === c.name.toLowerCase()
            );
            return {
              ...c,
              image: c.image || (foundPreset ? foundPreset.src : matchingProd?.image || sareeSilk),
              isActive: c.isActive !== false,
            };
          });
          this.saveCategories(this.categories);
          loadedServerCategories = true;
          updated = true;
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
