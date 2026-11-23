import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { SectionHeading } from "@/components/common/SectionHeading";
import { theme } from "@/theme";

export function Category() {
  const { products } = useStore();

  // Dynamically derive categories strictly from actual products added by the admin (no hardcoded/dummy data)
  const activeCategories = useMemo(() => {
    const map = new Map();
    (products || []).forEach((p) => {
      if (p.isActive === false || p.inStock === false) return;
      const catName = String(p.category || "").trim();
      if (!catName) return;
      const key = catName.toLowerCase();
      const pImage =
        p.image ||
        (Array.isArray(p.images) && p.images[0]) ||
        (Array.isArray(p.gallery) && p.gallery[0]);

      if (!map.has(key)) {
        map.set(key, {
          name: catName,
          slug: catName,
          image: pImage,
          productCount: 1,
        });
      } else {
        const existing = map.get(key);
        existing.productCount += 1;
        if (!existing.image && pImage) {
          existing.image = pImage;
        }
      }
    });
    return Array.from(map.values());
  }, [products]);

  if (activeCategories.length === 0) return null;

  const gridClass =
    activeCategories.length === 1
      ? "grid grid-cols-1 max-w-sm mx-auto gap-4"
      : activeCategories.length === 2
        ? "grid grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto gap-6"
        : activeCategories.length === 3
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto gap-6"
          : activeCategories.length === 4
            ? "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
            : "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5";

  return (
    <section id="categories" className={theme.layout.sectionContainer}>
      <SectionHeading eyebrow="Curated for You" title="Shop by Category" />
      <div className={gridClass}>
        {activeCategories.map((cat) => (
          <Link
            key={cat.slug}
            to={`/shop?category=${encodeURIComponent(cat.name)}`}
            className="group relative overflow-hidden rounded-lg aspect-[4/5] bg-card border border-border/40 shadow-xs"
          >
            {cat.image ? (
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                width={1024}
                height={1280}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[#FAF8F2] to-[#E8D8B5]/40 flex items-center justify-center p-6 text-center">
                <span className="font-display text-lg font-medium text-foreground">
                  {cat.name}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A07]/85 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-center">
              <p className="font-display text-lg font-medium text-white">
                {cat.name}
              </p>
              <p className="mt-0.5 flex items-center justify-center gap-1 text-[11px] tracking-[0.2em] uppercase text-gold opacity-0 transition-opacity group-hover:opacity-100">
                Explore <ChevronRight className="h-3 w-3" />
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Category;
