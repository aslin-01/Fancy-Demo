import React from "react";
import { useStore } from "@/lib/store";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ProductCard } from "@/components/common/ProductCard";
import { theme } from "@/theme";

export function Sellers() {
  const { products } = useStore();
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <section id="sellers" className="bg-[#FFF5F8]/60 border-b border-[#F8C4D8]/50">
      <div className={theme.layout.sectionContainer}>
        <SectionHeading eyebrow="Most Loved" title="Best Sellers" />
        <div className={theme.layout.grid4Cols}>
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Sellers;
