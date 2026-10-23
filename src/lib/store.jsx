import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { productService } from "@/services/productService";

const StoreContext = createContext(null);

function read(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }) {
  const [allProducts, setAllProducts] = useState(() => productService.getAllProducts());
  const [categories, setCategories] = useState(() => productService.getAllCategories());
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  // Subscribe to productService updates
  useEffect(() => {
    const unsubscribe = productService.subscribe(({ products: updatedProducts, categories: updatedCategories }) => {
      setAllProducts(updatedProducts);
      setCategories(updatedCategories);
    });
    return unsubscribe;
  }, []);

  // Hydrate cart and wishlist (with fallback from vk- keys)
  useEffect(() => {
    const savedCart = read("cf-cart", null) || read("vk-cart", []);
    const savedWishlist = read("cf-wishlist", null) || read("vk-wishlist", []);
    setCart(savedCart);
    setWishlist(savedWishlist);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem("cf-cart", JSON.stringify(cart));
    }
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem("cf-wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, hydrated]);

  // Active products for the public storefront
  const products = useMemo(() => {
    return allProducts.filter((p) => p.isActive !== false && p.inStock !== false);
  }, [allProducts]);

  // Product actions
  const addProduct = async (data) => {
    return await productService.addProduct(data);
  };

  const updateProduct = async (id, updates) => {
    return await productService.updateProduct(id, updates);
  };

  const deleteProduct = async (id) => {
    return await productService.deleteProduct(id);
  };

  const toggleProductStatus = async (id) => {
    return await productService.toggleProductStatus(id);
  };

  const getProduct = (id) => {
    return productService.getProductById(id);
  };

  // Category actions
  const addCategory = async (data) => {
    return await productService.addCategory(data);
  };

  const updateCategory = async (slug, updates) => {
    return await productService.updateCategory(slug, updates);
  };

  const deleteCategory = async (slug) => {
    return await productService.deleteCategory(slug);
  };

  // Cart and Wishlist actions
  const addToCart = (productId, qty = 1) =>
    setCart((prev) => {
      const line = prev.find((l) => l.productId === productId);
      if (line)
        return prev.map((l) =>
          l.productId === productId ? { ...l, qty: l.qty + qty } : l,
        );
      return [...prev, { productId, qty }];
    });

  const removeFromCart = (productId) =>
    setCart((prev) => prev.filter((l) => l.productId !== productId));

  const setQty = (productId, qty) =>
    setCart((prev) =>
      qty <= 0
        ? prev.filter((l) => l.productId !== productId)
        : prev.map((l) => (l.productId === productId ? { ...l, qty } : l)),
    );

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId) =>
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );

  const cartCount = cart.reduce((s, l) => s + l.qty, 0);

  const subtotal = useMemo(() => {
    return cart.reduce((s, l) => {
      const p = allProducts.find((pr) => pr.id === l.productId || pr._id === l.productId);
      return s + (p ? p.price * l.qty : 0);
    }, 0);
  }, [cart, allProducts]);

  return (
    <StoreContext.Provider
      value={{
        // Public reactive products (active only)
        products,
        // All products (for admin management)
        allProducts,
        // Dynamic categories
        categories,
        // Product CRUD operations
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStatus,
        getProduct,
        // Category CRUD operations
        addCategory,
        updateCategory,
        deleteCategory,
        // Cart & Wishlist
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        setQty,
        clearCart,
        toggleWishlist,
        cartCount,
        subtotal,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
