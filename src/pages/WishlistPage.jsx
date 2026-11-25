import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/common/ProductCard";
import { theme } from "@/theme";

export function WishlistPage() {
  const { wishlist, products } = useStore();
  const items = products.filter((p) => wishlist.includes(p.id) || wishlist.includes(p._id));

  return (
    <div className={theme.layout.pageContainer}>
      <h1 className={theme.typography.h1Page}>Your Wishlist</h1>
      <div className={theme.dividers.goldLeft} />

      {items.length === 0 ? (
        <div className="py-20 text-center">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 font-display text-2xl">No saved jewellery yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Tap the heart on any jewellery piece to save it here.
          </p>
          <Link
            to="/shop"
            className={`mt-8 ${theme.buttons.primary}`}
          >
            Browse Jewellery
          </Link>
        </div>
      ) : (
        <div className={`mt-10 ${theme.layout.grid4Cols}`}>
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
