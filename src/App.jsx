import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "@/lib/store";
import { Toaster } from "sonner";

// Layout & Pages
import Layout from "@/pages/Layout";
import HomePage from "@/pages/HomePage";
import ShopPage from "@/pages/ShopPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import WishlistPage from "@/pages/WishlistPage";
import OrderSuccessPage from "@/pages/OrderSuccessPage";
import NotFoundPage from "@/pages/NotFoundPage";

// Direct section components for individual routes
import Category from "@/components/home/Category";
import Sellers from "@/components/home/Sellers";
import Bridal from "@/components/home/Bridal";
import Arrivals from "@/components/home/Arrivals";
import Festive from "@/components/home/Festive";
import Inspiration from "@/components/home/Inspiration";
import Touch from "@/components/home/Touch";

export function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />

            {/* Individual section paths */}
            <Route path="categories" element={<Category />} />
            <Route path="sellers" element={<Sellers />} />
            <Route path="bridal" element={<Bridal />} />
            <Route path="arrivals" element={<Arrivals />} />
            <Route path="festive" element={<Festive />} />
            <Route path="inspiration" element={<Inspiration />} />
            <Route path="touch" element={<Touch />} />

            {/* Main store pages */}
            <Route path="shop" element={<ShopPage />} />
            <Route path="product/:id" element={<ProductDetailPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="order-success" element={<OrderSuccessPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </StoreProvider>
  );
}

export default App;
