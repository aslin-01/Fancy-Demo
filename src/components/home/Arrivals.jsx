import React from "react";
import { Link } from "react-router-dom";
import { products } from "@/data/products";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ProductCard } from "@/components/common/ProductCard";
import { theme } from "@/theme";

export function Arrivals() {
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);

  return (
    <section id="arrivals" className={theme.layout.sectionContainer}>
      <SectionHeading eyebrow="Just In" title="New Arrivals" />
      <div className={theme.layout.grid4Cols}>
        {newArrivals.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link
          to="/shop?sort=newest"
          className={theme.buttons.outline}
        >
          View All New Arrivals
        </Link>
      </div>
    </section>
  );
}

export default Arrivals;
