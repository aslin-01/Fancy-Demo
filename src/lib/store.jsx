import { createContext, useContext, useEffect, useState } from "react";
import { products } from "@/data/products";
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
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setCart(read("vk-cart", []));
    setWishlist(read("vk-wishlist", []));
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem("vk-cart", JSON.stringify(cart));
  }, [cart, hydrated]);
  useEffect(() => {
    if (hydrated)
      window.localStorage.setItem("vk-wishlist", JSON.stringify(wishlist));
  }, [wishlist, hydrated]);
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
  const subtotal = cart.reduce((s, l) => {
    const p = products.find((pr) => pr.id === l.productId);
    return s + (p ? p.price * l.qty : 0);
  }, 0);
  return (
    <StoreContext.Provider
      value={{
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
