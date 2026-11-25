import React, { useMemo, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { SectionHeading } from "@/components/common/SectionHeading";
import { theme } from "@/theme";

export function Category() {
  const { products } = useStore();
  const sliderRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

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

  // Automatic smooth slider (pauses on hover/touch)
  useEffect(() => {
    if (activeCategories.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      const container = sliderRef.current;
      if (!container) return;

      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      if (maxScrollLeft <= 0) return;

      const firstCard = container.querySelector("[data-category-card]");
      const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 260;
      const gap = 24;
      const step = cardWidth + gap;

      if (container.scrollLeft >= maxScrollLeft - 10) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [activeCategories.length, isPaused]);

  if (activeCategories.length === 0) return null;

  const cardWidthClass =
    activeCategories.length <= 4
      ? "w-[65vw] xs:w-[50vw] sm:w-[35vw] md:w-[28vw] lg:flex-1"
      : "w-[65vw] xs:w-[50vw] sm:w-[35vw] md:w-[28vw] lg:w-[calc((100%-3*1.5rem)/4)]";

  return (
    <section id="categories" className="relative bg-beige/60 border-t border-b border-[#F8C4D8]/50 overflow-hidden">
      <div className={theme.layout.sectionContainer}>
        <SectionHeading eyebrow="Curated for You" title="Shop by Category" />

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Single Row Horizontal Auto Slider */}
          <div
            ref={sliderRef}
            className="flex flex-nowrap gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {activeCategories.map((cat) => (
              <Link
                key={cat.slug}
                data-category-card
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className={`group relative overflow-hidden rounded-lg aspect-[4/5] bg-card border border-border/40 shadow-xs shrink-0 snap-start select-none ${cardWidthClass}`}
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
                  <div className="h-full w-full bg-gradient-to-br from-[#FFF5F8] to-[#F8C4D8]/40 flex items-center justify-center p-6 text-center">
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
                  <p className="mt-1 flex items-center justify-center gap-1 text-[13px] font-bold tracking-[0.2em] uppercase text-gold opacity-0 transition-opacity group-hover:opacity-100">
                    Explore <ChevronRight className="h-5 w-5" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Category;
