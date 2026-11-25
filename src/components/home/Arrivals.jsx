import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useStore } from "@/lib/store";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ProductCard } from "@/components/common/ProductCard";
import { theme } from "@/theme";

export function Arrivals() {
  const { products } = useStore();
  const newArrivals = useMemo(() => {
    const flagged = products.filter((p) => p.isNew);
    if (flagged.length > 0) return flagged.slice(0, 4);
    return [...products]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 4);
  }, [products]);

  if (newArrivals.length === 0) return null;

  return (
    <section id="arrivals" className="bg-beige/60 border-b border-[#F8C4D8]/50">
      <div className={theme.layout.sectionContainer}>
        <SectionHeading eyebrow="Just In" title="New Arrivals" />
        <div className={theme.layout.grid4Cols}>
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} imageAspect="aspect-square" />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/shop?sort=newest"
            className={theme.buttons.primary}
          >
            View All New Arrivals
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Arrivals;
