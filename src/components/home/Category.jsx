import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { SectionHeading } from "@/components/common/SectionHeading";
import { theme } from "@/theme";

export function Category() {
  const { categories } = useStore();
  const activeCategories = categories.filter((c) => c.isActive !== false);

  if (activeCategories.length === 0) return null;

  const gridClass =
    activeCategories.length === 1
      ? "grid grid-cols-1 max-w-xs mx-auto gap-4"
      : activeCategories.length === 2
        ? "grid grid-cols-2 max-w-2xl mx-auto gap-4"
        : activeCategories.length === 3
          ? "grid grid-cols-2 sm:grid-cols-3 max-w-4xl mx-auto gap-4"
          : activeCategories.length === 4
            ? "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
            : "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5";

  return (
    <section id="categories" className={theme.layout.sectionContainer}>
      <SectionHeading eyebrow="Curated for You" title="Shop by Category" />
      <div className={gridClass}>
        {activeCategories.map((cat) => (
          <Link
            key={cat._id || cat.slug || cat.name}
            to={`/shop?category=${encodeURIComponent(cat.name || cat.slug)}`}
            className="group relative overflow-hidden rounded-lg"
          >
            <img
              src={cat.image}
              alt={cat.name}
              loading="lazy"
              width={1024}
              height={1280}
              className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-108"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A07]/85 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-center">
              <p className="font-display text-lg font-medium text-primary-foreground">
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
