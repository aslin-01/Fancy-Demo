import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { formatINR } from "@/data/products";
import { useStore } from "@/lib/store";
import { theme } from "@/theme";

export function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const wished = wishlist.includes(product.id);
  const discount = Math.round((1 - product.price / product.mrp) * 100);

  return (
    <div className={theme.cards.interactive}>
      <Link
        to={`/product/${product.id}`}
        className="relative block aspect-[4/5] overflow-hidden"
      >
        <img
          src={product.image}
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
        onClick={() => toggleWishlist(product.id)}
        aria-label="Add to wishlist"
        className={`absolute top-12 right-3 h-8 w-8 opacity-0 group-hover:opacity-100 ${theme.buttons.iconRound}`}
      >
        <Heart
          className={`h-4 w-4 ${wished ? "fill-[#B87802] text-[#B87802]" : "text-foreground"}`}
        />
      </button>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className={theme.typography.metaFabric}>{product.fabric}</p>
        <Link
          to={`/product/${product.id}`}
          className="font-display text-lg leading-snug font-medium text-foreground transition-colors hover:text-[#B87802]"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-1 text-sm">
          <Star className="h-3.5 w-3.5 fill-[#F5B815] text-[#F5B815]" />
          <span className="font-medium">{product.rating}</span>
          <span className="text-muted-foreground">({product.reviews})</span>
        </div>
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-lg font-semibold text-[#B87802]">
            {formatINR(product.price)}
          </span>
          <span className={theme.typography.priceStrike}>
            {formatINR(product.mrp)}
          </span>
        </div>
        <button
          onClick={() => addToCart(product.id)}
          disabled={!product.inStock}
          className={`mt-2 ${theme.buttons.actionCard}`}
        >
          <ShoppingBag className="h-3.5 w-3.5" /> Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
