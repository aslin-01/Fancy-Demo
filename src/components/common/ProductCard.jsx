import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { formatINR } from "@/data/products";
import { useStore } from "@/lib/store";
import { theme } from "@/theme";

export function ProductCard({ product, imageAspect = "aspect-[4/5]" }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const pId = product?.id || product?._id;
  const wished = wishlist.includes(pId);
  const discount =
    product?.mrp && Number(product.mrp) > Number(product.price)
      ? Math.round((1 - product.price / product.mrp) * 100)
      : 0;

  const displayImage =
    product?.image ||
    (Array.isArray(product?.gallery) && product.gallery[0]) ||
    (Array.isArray(product?.images) && product.images[0]) ||
    (Array.isArray(product?.colors) && product.colors[0]?.images && product.colors[0].images[0]) ||
    '';

  const colorsList = React.useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.colors) && product.colors.length > 0) {
      return product.colors.map((c) => ({
        name: c.name || c.code || '',
        code: c.code || (c.name?.startsWith('#') ? c.name : null),
      }));
    }
    if (product.color && typeof product.color === 'string') {
      return product.color
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((col) => ({
          name: col,
          code: col.startsWith('#') ? col : null,
        }));
    }
    return [];
  }, [product]);

  return (
    <div className={theme.cards.interactive}>
      <Link
        to={`/product/${pId}`}
        className={`relative block ${imageAspect} overflow-hidden bg-[#FFF5F8]/40`}
      >
        <img
          src={displayImage}
          alt={product.name}
          loading="lazy"
          width={1024}
          height={1280}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {discount > 0 && (
          <span className={`absolute top-3 left-3 ${theme.badges.discount}`}>
            {discount}% OFF
          </span>
        )}
        {product.isNew && (
          <span className={`absolute top-3 right-3 ${theme.badges.newArrival}`}>
            NEW
          </span>
        )}
        {!product.inStock && (
          <span className={theme.badges.outOfStock}>Out of Stock</span>
        )}
      </Link>

      <button
        onClick={() => toggleWishlist(pId)}
        aria-label="Add to wishlist"
        className={`group/wish absolute top-12 right-3 h-8 w-8 ${theme.buttons.iconRound}`}
      >
        <Heart
          className={`h-4 w-4 transition-colors ${
            wished
              ? "fill-[#C2185B] text-[#C2185B] group-hover/wish:fill-white group-hover/wish:text-white"
              : "text-foreground group-hover/wish:text-white"
          }`}
        />
      </button>

      <div className="flex flex-1 flex-col gap-2 p-4 bg-white">
        {/* Top Meta Row: Finish/Material & Rating Badge */}
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[10px] font-semibold tracking-[0.14em] uppercase text-[#C2185B]">
            {product.fabric || product.category}
          </span>
          <div className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#F8C4D8]/80 bg-[#FFF5F8] px-2 py-0.5 text-[11px]">
            <Star className="h-3 w-3 fill-[#E91E8C] text-[#E91E8C]" />
            <span className="font-semibold text-foreground">{product.rating}</span>
            <span className="text-muted-foreground">({product.reviews})</span>
          </div>
        </div>

        {/* Product Title (aligned 2-line max) */}
        <Link
          to={`/product/${pId}`}
          className="font-display text-[17px] leading-snug font-semibold text-foreground line-clamp-2 min-h-[2.85rem] transition-colors hover:text-[#C2185B]"
        >
          {product.name}
        </Link>

        {/* Color Swatches */}
        {colorsList.length > 0 && (
          <div className="flex items-center gap-2 py-0.5">
            <div className="flex items-center -space-x-1 shrink-0">
              {colorsList.slice(0, 4).map((c, i) => (
                <span
                  key={i}
                  title={c.name}
                  className="h-3.5 w-3.5 rounded-full border-2 border-white ring-1 ring-[#F8C4D8]/70 shadow-xs shrink-0"
                  style={{ backgroundColor: c.code || '#C2185B' }}
                />
              ))}
            </div>
            <span className="text-[11px] text-muted-foreground truncate font-medium">
              {colorsList.map((c) => c.name).join(', ')}
            </span>
          </div>
        )}

        {/* Price & Action Footer */}
        <div className="mt-auto pt-1.5">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold tracking-tight text-[#C2185B]">
              {formatINR(product.price)}
            </span>
            {product.mrp && Number(product.mrp) > Number(product.price) && (
              <span className="text-xs text-muted-foreground line-through decoration-1">
                {formatINR(product.mrp)}
              </span>
            )}
          </div>
          <button
            onClick={() => addToCart(pId)}
            disabled={!product.inStock}
            className={`mt-2.5 w-full ${theme.buttons.actionCard}`}
          >
            <ShoppingCart className="h-3.5 w-3.5 stroke-[2.25]" />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
