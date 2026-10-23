import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Check,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  ZoomIn,
} from "lucide-react";
import { formatINR } from "@/data/products";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/common/ProductCard";
import { theme } from "@/theme";

const sampleReviews = [
  {
    name: "Priya R.",
    rating: 5,
    text: "Absolutely stunning — the weave and finish are even more beautiful in person.",
  },
  {
    name: "Kavitha M.",
    rating: 4,
    text: "Lovely drape and rich colour. Delivery was quick and packaging was beautiful.",
  },
];

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProduct, products, addToCart, toggleWishlist, wishlist } = useStore();

  const product = getProduct(id) || products.find((p) => String(p.id) === String(id) || String(p._id) === String(id));

  const [qty, setQty] = useState(1);
  const [pin, setPin] = useState("");
  const [pinResult, setPinResult] = useState(null);
  const [zoomed, setZoomed] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className={theme.layout.emptyState}>
        <h1 className={theme.typography.h1Page}>Saree not found</h1>
        <p className="mt-3 text-muted-foreground">
          This piece may have sold out or been moved.
        </p>
        <Link
          to="/shop"
          className={`mt-6 ${theme.buttons.primary}`}
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const wished = wishlist.includes(product.id);
  const discount = product.mrp && product.mrp > product.price
    ? Math.round((1 - product.price / product.mrp) * 100)
    : 0;

  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .concat(
      products.filter(
        (p) => p.id !== product.id && p.category !== product.category
      )
    )
    .slice(0, 4);

  const checkPin = (e) => {
    e.preventDefault();
    if (/^\d{6}$/.test(pin)) {
      setPinResult(
        `Delivery available to ${pin} — estimated 3–5 business days.`
      );
    } else {
      setPinResult("Please enter a valid 6-digit PIN code.");
    }
  };

  const handleAdd = () => {
    addToCart(product.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className={theme.layout.pageContainer}>
      <nav className={`mb-8 ${theme.typography.metaMuted}`}>
        <Link to="/" className="hover:text-[#B87802] transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-[#B87802] transition-colors">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Gallery */}
        <div className="relative">
          <div
            className="group relative aspect-3/4 overflow-hidden rounded-lg border border-border bg-card cursor-zoom-in"
            onClick={() => setZoomed(!zoomed)}
          >
            <img
              src={product.image}
              alt={product.name}
              className={`h-full w-full object-cover transition-transform duration-500 ${
                zoomed ? "scale-150" : "group-hover:scale-105"
              }`}
            />
            <div className="pointer-events-none absolute right-4 bottom-4 flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1.5 text-xs text-muted-foreground shadow backdrop-blur-sm">
              <ZoomIn className="h-3.5 w-3.5" />
              <span>{zoomed ? "Click to reset" : "Click to zoom"}</span>
            </div>
            {discount > 0 && (
              <span className={`absolute top-4 left-4 ${theme.badges.discount}`}>
                {discount}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div>
          <span className={theme.typography.eyebrowGold}>
            {product.category} Collection
          </span>
          <h1 className={`mt-2 ${theme.typography.h1Page}`}>
            {product.name}
          </h1>

          <p className={`mt-2 font-mono text-xs ${theme.typography.metaMuted}`}>
            SKU: {product.sku}
          </p>

          <div className="mt-4 flex items-baseline gap-4">
            <span className={theme.typography.priceDisplay}>
              {formatINR(product.price)}
            </span>
            {product.mrp && product.mrp > product.price && (
              <span className={theme.typography.priceStrikethrough}>
                {formatINR(product.mrp)}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              (Inclusive of all taxes)
            </span>
          </div>

          <p className="mt-6 text-base leading-relaxed text-foreground/80">
            {product.description}
          </p>

          {/* Details list */}
          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 rounded-lg border border-border bg-card p-5 text-sm">
            <div>
              <dt className={theme.typography.metaMuted}>Fabric</dt>
              <dd className="mt-0.5 font-medium">{product.fabric || 'Pure Mulberry Silk'}</dd>
            </div>
            <div>
              <dt className={theme.typography.metaMuted}>Color</dt>
              <dd className="mt-0.5 font-medium">{product.color || 'Multicolor'}</dd>
            </div>
            <div>
              <dt className={theme.typography.metaMuted}>Occasion</dt>
              <dd className="mt-0.5 font-medium">{product.occasion || 'Festive'}</dd>
            </div>
            <div>
              <dt className={theme.typography.metaMuted}>Length</dt>
              <dd className="mt-0.5 font-medium">{product.length || '6.3 metres'}</dd>
            </div>
            <div>
              <dt className={theme.typography.metaMuted}>Blouse Piece</dt>
              <dd className="mt-0.5 font-medium">{product.blousePiece || 'Included'}</dd>
            </div>
            <div>
              <dt className={theme.typography.metaMuted}>Wash Care</dt>
              <dd className="mt-0.5 font-medium">{product.washCare || 'Dry clean only'}</dd>
            </div>
            <div>
              <dt className={theme.typography.metaMuted}>Availability</dt>
              <dd
                className={`mt-0.5 font-medium ${
                  product.inStock ? "text-green-700" : "text-destructive"
                }`}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </dd>
            </div>
          </dl>

          {/* Quantity + actions */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-md border border-input">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-2.5 cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-medium">
                {qty}
              </span>
              <button
                onClick={() => setQty(qty + 1)}
                className="px-3 py-2.5 cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className={`flex-1 sm:flex-none ${theme.buttons.actionCard} py-3.5 sm:px-8 text-sm`}
            >
              {added ? (
                <Check className="h-4 w-4" />
              ) : (
                <ShoppingCart className="h-4 w-4 stroke-[2.25]" />
              )}
              {added ? "Added!" : "Add to Cart"}
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              aria-label="Toggle wishlist"
              className="grid h-11 w-11 place-items-center rounded-md border border-border transition-all duration-200 hover:border-[#B87802] hover:shadow-sm active:scale-95 cursor-pointer"
            >
              <Heart
                className={`h-5 w-5 ${wished ? "fill-[#B87802] text-[#B87802]" : ""}`}
              />
            </button>
          </div>

          <button
            onClick={() => {
              addToCart(product.id, qty);
              navigate("/checkout");
            }}
            disabled={!product.inStock}
            className={`mt-3 ${theme.buttons.primaryWide} sm:w-auto sm:px-16 disabled:opacity-40`}
          >
            Buy Now
          </button>

          {/* PIN checker */}
          <form onSubmit={checkPin} className="mt-6">
            <label className={theme.forms.label}>Check Delivery</label>
            <div className="mt-2 flex max-w-xs overflow-hidden rounded-sm border border-input">
              <input
                value={pin}
                onChange={(e) =>
                  setPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="Enter PIN code"
                inputMode="numeric"
                className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
              />
              <button
                type="submit"
                className="shrink-0 bg-gradient-to-r from-[#B87802] to-[#996300] text-white border border-[#F5B815]/30 px-5 text-sm font-medium tracking-[0.08em] uppercase transition-all duration-200 hover:from-[#C98704] hover:to-[#A86E02] cursor-pointer shadow-sm"
              >
                Check
              </button>
            </div>
            {pinResult && (
              <p className="mt-2 text-sm text-muted-foreground">{pinResult}</p>
            )}
          </form>

          <div className="mt-6 flex flex-wrap gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-[#B87802]" /> Free shipping over ₹2,999
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#B87802]" /> Secure payments
            </span>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-20">
        <h2 className={theme.typography.h2Section}>Customer Reviews</h2>
        <div className={theme.dividers.goldLeft} />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {sampleReviews.map((r) => (
            <div key={r.name} className={theme.cards.padded}>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < r.rating ? "fill-gold text-gold" : "text-border"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                "{r.text}"
              </p>
              <p className="mt-3 text-sm font-medium">{r.name}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Sample reviews shown for demonstration.
        </p>
      </section>

      {/* Related */}
      <section className="mt-20">
        <h2 className={theme.typography.h2Section}>You May Also Love</h2>
        <div className={theme.dividers.goldLeft} />
        <div className={`mt-8 ${theme.layout.grid4Cols}`}>
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProductDetailPage;
