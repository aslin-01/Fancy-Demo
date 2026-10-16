import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { formatINR, products } from "@/data/products";
import { useStore } from "@/lib/store";
import { theme } from "@/theme";

const COUPONS = { FESTIVE10: 0.1, WELCOME5: 0.05 };

export function CartPage() {
  const { cart, setQty, removeFromCart, subtotal } = useStore();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(null);
  const [couponMsg, setCouponMsg] = useState(null);

  const lines = cart
    .map((l) => ({
      ...l,
      product: products.find((p) => p.id === l.productId),
    }))
    .filter((l) => l.product);

  const discountRate = applied ? COUPONS[applied] ?? 0 : 0;
  const discount = Math.round(subtotal * discountRate);
  const shipping = subtotal - discount >= 2999 || subtotal === 0 ? 0 : 149;
  const total = subtotal - discount + shipping;

  const applyCoupon = (e) => {
    e.preventDefault();
    const code = coupon.trim().toUpperCase();
    if (COUPONS[code]) {
      setApplied(code);
      setCouponMsg(`Coupon ${code} applied — ${COUPONS[code] * 100}% off!`);
    } else {
      setApplied(null);
      setCouponMsg("Invalid coupon code. Try FESTIVE10.");
    }
  };

  if (lines.length === 0) {
    return (
      <div className={theme.layout.emptyState}>
        <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground stroke-[1.5]" />
        <h1 className={`mt-4 ${theme.typography.h1Page}`}>
          Your cart is empty
        </h1>
        <p className="mt-3 text-muted-foreground">
          Discover our handwoven sarees and find something you love.
        </p>
        <Link
          to="/shop"
          className={`mt-8 ${theme.buttons.primary}`}
        >
          Shop Sarees
        </Link>
      </div>
    );
  }

  return (
    <div className={theme.layout.pageContainer}>
      <h1 className={theme.typography.h1Page}>Shopping Cart</h1>
      <div className={theme.dividers.goldLeft} />

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {lines.map(({ product, qty }) => (
            <div
              key={product.id}
              className="flex gap-4 rounded-lg border border-border bg-card p-4"
            >
              <Link to={`/product/${product.id}`} className="shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  width={1024}
                  height={1280}
                  className="h-32 w-24 rounded-sm object-cover"
                />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <Link
                  to={`/product/${product.id}`}
                  className="font-display text-lg font-medium hover:text-[#B87802] transition-colors"
                >
                  {product.name}
                </Link>
                <p className={`mt-0.5 ${theme.typography.metaMuted}`}>
                  {product.fabric}
                </p>
                <p className="mt-1 font-semibold text-[#B87802]">
                  {formatINR(product.price)}
                </p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center rounded-sm border border-input">
                    <button
                      onClick={() => setQty(product.id, qty - 1)}
                      className="px-2.5 py-1.5 cursor-pointer"
                      aria-label="Decrease"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm">{qty}</span>
                    <button
                      onClick={() => setQty(product.id, qty + 1)}
                      className="px-2.5 py-1.5 cursor-pointer"
                      aria-label="Increase"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-destructive cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className={`h-fit ${theme.cards.padded}`}>
          <h2 className="font-display text-2xl font-semibold">Order Summary</h2>

          <form
            onSubmit={applyCoupon}
            className="mt-5 flex overflow-hidden rounded-sm border border-input"
          >
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Coupon code (try FESTIVE10)"
              className="w-full bg-transparent px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#F5B815]"
            />
            <button
              type="submit"
              className="shrink-0 bg-gradient-to-r from-[#B87802] to-[#996300] text-white border border-[#F5B815]/30 px-5 text-sm font-medium tracking-[0.08em] uppercase transition-all duration-200 hover:from-[#C98704] hover:to-[#A86E02] active:scale-[0.98] cursor-pointer shadow-sm"
            >
              Apply
            </button>
          </form>
          {couponMsg && (
            <p className="mt-2 text-xs text-muted-foreground">{couponMsg}</p>
          )}

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatINR(subtotal)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-700">
                <dt>Discount ({applied})</dt>
                <dd>−{formatINR(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd>{shipping === 0 ? "Free" : formatINR(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
              <dt>Total</dt>
              <dd className="text-[#B87802]">{formatINR(total)}</dd>
            </div>
          </dl>

          <Link
            to="/checkout"
            className={`mt-6 block ${theme.buttons.primaryWide}`}
          >
            Proceed to Checkout
          </Link>
          <Link
            to="/shop"
            className="mt-3 block text-center text-sm text-muted-foreground underline hover:text-[#B87802] transition-colors"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default CartPage;
