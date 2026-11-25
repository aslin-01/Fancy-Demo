import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { formatINR } from "@/data/products";
import { useStore } from "@/lib/store";
import { theme } from "@/theme";

export function ProductCard({ product }) {
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
        className="relative block aspect-[4/5] overflow-hidden bg-[#FFF5F8]/40"
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
        className={`absolute top-12 right-3 h-8 w-8 opacity-0 group-hover:opacity-100 ${theme.buttons.iconRound}`}
      >
        <Heart
          className={`h-4 w-4 ${wished ? "fill-[#C2185B] text-[#C2185B]" : "text-foreground"}`}
        />
      </button>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className={theme.typography.metaFabric}>{product.fabric}</p>
        <Link
          to={`/product/${pId}`}
          className="font-display text-lg leading-snug font-medium text-foreground transition-colors hover:text-[#C2185B]"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-1 text-sm">
          <Star className="h-3.5 w-3.5 fill-[#E91E8C] text-[#E91E8C]" />
          <span className="font-medium">{product.rating}</span>
          <span className="text-muted-foreground">({product.reviews})</span>
        </div>
        {colorsList.length > 0 && (
          <div className="flex items-center gap-1.5 py-0.5 flex-wrap">
            <div className="flex items-center -space-x-1 shrink-0">
              {colorsList.slice(0, 4).map((c, i) => (
                <span
                  key={i}
                  title={c.name}
                  className="h-3.5 w-3.5 rounded-full border-2 border-white shadow-xs shrink-0"
                  style={{ backgroundColor: c.code || '#C2185B' }}
                />
              ))}
            </div>
            <span className="text-[11px] text-muted-foreground truncate font-medium">
              {colorsList.map((c) => c.name).join(', ')}
            </span>
          </div>
        )}
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-lg font-semibold text-[#C2185B]">
            {formatINR(product.price)}
          </span>
          {product.mrp && Number(product.mrp) > Number(product.price) && (
            <span className="text-sm text-muted-foreground line-through decoration-1">
              {formatINR(product.mrp)}
            </span>
          )}
        </div>
        <button
          onClick={() => addToCart(pId)}
          disabled={!product.inStock}
          className={`mt-2 w-full ${theme.buttons.actionCard}`}
        >
          <ShoppingCart className="h-3.5 w-3.5 stroke-[2.25]" /> Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
