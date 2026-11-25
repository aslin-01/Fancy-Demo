import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatINR } from "@/data/products";
import { ProductCard } from "@/components/common/ProductCard";
import { Slider } from "@/components/ui/slider";
import { theme } from "@/theme";

const sortOptions = [
  { value: "popularity", label: "Popularity" },
  { value: "newest", label: "Newest Arrivals" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];
const PAGE_SIZE = 8;

const collectUniqueValues = (products, extractFn) => {
  const map = new Map();
  (products || []).forEach((p) => {
    extractFn(p).forEach((raw) => {
      const val = String(raw || "").trim();
      if (!val) return;
      const key = val.toLowerCase();
      if (!map.has(key)) map.set(key, val);
    });
  });
  return Array.from(map.values());
};

export function ShopPage() {
  const { products } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "";
  const subcategoryParam = searchParams.get("subcategory") || "";
  const queryParam = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "popularity";

  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [priceRange, setPriceRange] = useState(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categoryNames = useMemo(
    () => collectUniqueValues(products, (p) => (p.category ? [p.category] : [])),
    [products]
  );

  const availableColors = useMemo(
    () =>
      collectUniqueValues(products, (p) => {
        const list = [];
        if (Array.isArray(p.colors)) {
          p.colors.forEach((c) => {
            if (c?.name) list.push(c.name);
            else if (c?.code) list.push(c.code);
          });
        }
        if (p.color && typeof p.color === "string") {
          p.color.split(",").forEach((s) => list.push(s));
        }
        return list;
      }),
    [products]
  );

  const availableOccasions = useMemo(
    () =>
      collectUniqueValues(products, (p) =>
        p.occasion && typeof p.occasion === "string"
          ? p.occasion.split(",")
          : []
      ),
    [products]
  );

  const priceBounds = useMemo(() => {
    const prices = (products || [])
      .map((p) => Number(p.price))
      .filter((n) => Number.isFinite(n) && n >= 0);
    if (prices.length === 0) return { min: 0, max: 0, hasPrices: false };
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      hasPrices: true,
    };
  }, [products]);

  const activePriceRange = useMemo(() => {
    if (!priceBounds.hasPrices) return [0, 0];
    if (!priceRange) return [priceBounds.min, priceBounds.max];
    const clampedMin = Math.max(priceBounds.min, Math.min(priceRange[0], priceBounds.max));
    const clampedMax = Math.min(priceBounds.max, Math.max(priceRange[1], clampedMin));
    return [clampedMin, clampedMax];
  }, [priceRange, priceBounds]);

  const updateSearchParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const filtered = useMemo(() => {
    let list = [...products];
    if (categoryParam) {
      const catLower = categoryParam.toLowerCase().replace(/-/g, " ").trim();
      list = list.filter((p) => {
        const pCat = String(p.category || "").toLowerCase().replace(/-/g, " ").trim();
        return pCat && (pCat === catLower || pCat.includes(catLower) || catLower.includes(pCat));
      });
    }
    if (subcategoryParam) {
      const subLower = subcategoryParam.toLowerCase().trim();
      list = list.filter((p) => {
        const pSub = String(p.subcategory || "").toLowerCase();
        const pName = String(p.name || "").toLowerCase();
        const pFabric = String(p.fabric || "").toLowerCase();
        const pDesc = String(p.description || "").toLowerCase();
        return (
          (pSub && pSub.includes(subLower)) ||
          (pName && pName.includes(subLower)) ||
          (pFabric && pFabric.includes(subLower)) ||
          (pDesc && pDesc.includes(subLower))
        );
      });
    }
    if (queryParam) {
      const q = queryParam.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.fabric?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.color?.toLowerCase().includes(q)
      );
    }
    if (selectedColors.length) {
      list = list.filter((p) => {
        if (!p.color && !p.colors) return false;
        const pColors = Array.isArray(p.colors)
          ? p.colors.flatMap((c) =>
              [c?.name, c?.code].filter(Boolean).map((v) => String(v).toLowerCase())
            )
          : [];
        const pColorStr = String(p.color || "").toLowerCase();
        return selectedColors.some((sc) => {
          const scLower = sc.toLowerCase();
          return pColorStr.includes(scLower) || pColors.includes(scLower);
        });
      });
    }
    if (selectedOccasions.length) {
      list = list.filter((p) => {
        if (!p.occasion) return false;
        const pOccasions = String(p.occasion)
          .split(",")
          .map((s) => s.trim().toLowerCase());
        return selectedOccasions.some((so) =>
          pOccasions.includes(so.toLowerCase())
        );
      });
    }
    if (priceRange && priceBounds.hasPrices) {
      list = list.filter(
        (p) =>
          Number(p.price) >= activePriceRange[0] &&
          Number(p.price) <= activePriceRange[1]
      );
    }
    if (inStockOnly) {
      list = list.filter((p) => p.inStock);
    }
    switch (sort) {
      case "newest":
        list.sort(
          (a, b) =>
            Number(b.isNew ?? false) - Number(a.isNew ?? false) ||
            new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        break;
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      default:
        list.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    }
    return list;
  }, [
    products,
    categoryParam,
    subcategoryParam,
    queryParam,
    selectedColors,
    selectedOccasions,
    priceRange,
    priceBounds,
    activePriceRange,
    inStockOnly,
    sort,
  ]);

  const toggle = (arr, v, set) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const filterPanel = (
    <div className="space-y-7">
      {categoryNames.length > 0 && (
        <div>
          <h3 className={theme.typography.h3Sidebar}>Category</h3>
          <ul className="mt-3 space-y-2">
            {categoryNames.map((c) => {
              const isSelected = categoryParam.toLowerCase() === c.toLowerCase();
              return (
                <li key={c}>
                  <button
                    onClick={() =>
                      updateSearchParam("category", isSelected ? null : c)
                    }
                    className={`text-sm transition-colors hover:text-[#C2185B] cursor-pointer ${
                      isSelected
                        ? "font-semibold text-[#C2185B]"
                        : "text-muted-foreground"
                    }`}
                  >
                    {c}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {availableColors.length > 0 && (
        <div>
          <h3 className={theme.typography.h3Sidebar}>Color</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {availableColors.map((c) => (
              <button
                key={c}
                onClick={() => toggle(selectedColors, c, setSelectedColors)}
                className={`flex items-center gap-1.5 ${
                  selectedColors.includes(c)
                    ? theme.badges.filterChipActive
                    : theme.badges.filterChipInactive
                }`}
              >
                {c.startsWith("#") && (
                  <span
                    className="h-2.5 w-2.5 rounded-full border border-black/20 shrink-0"
                    style={{ backgroundColor: c }}
                  />
                )}
                <span>{c}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {priceBounds.hasPrices && (
        <div>
          <h3 className={theme.typography.h3Sidebar}>Price</h3>
          {priceBounds.max > priceBounds.min ? (
            <div className="mt-4 space-y-3">
              <Slider
                min={priceBounds.min}
                max={priceBounds.max}
                step={Math.max(1, Math.round((priceBounds.max - priceBounds.min) / 100))}
                value={activePriceRange}
                onValueChange={(val) => setPriceRange(val)}
              />
              <div className="flex items-center justify-between text-xs font-medium text-foreground">
                <span>{formatINR(activePriceRange[0])}</span>
                <span>{formatINR(activePriceRange[1])}</span>
              </div>
              {priceRange && (
                <button
                  type="button"
                  onClick={() => setPriceRange(null)}
                  className="text-xs text-[#C2185B] underline cursor-pointer hover:text-[#0C0A07]"
                >
                  Clear price filter
                </button>
              )}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              {formatINR(priceBounds.min)}
            </p>
          )}
        </div>
      )}

      {availableOccasions.length > 0 && (
        <div>
          <h3 className={theme.typography.h3Sidebar}>Occasion</h3>
          <ul className="mt-3 space-y-2">
            {availableOccasions.map((o) => (
              <li key={o}>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={selectedOccasions.includes(o)}
                    onChange={() =>
                      toggle(selectedOccasions, o, setSelectedOccasions)
                    }
                    className={theme.forms.checkbox}
                  />
                  {o}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className={theme.forms.checkbox}
          />
          In stock only
        </label>
      </div>
    </div>
  );

  return (
    <div className={theme.layout.pageContainer}>
      <div className="mb-8">
        <p className={theme.typography.cursiveEyebrow}>Our Collection</p>
        <h1 className={`mt-1 ${theme.typography.h1Page}`}>
          {categoryParam || "Shop All Jewellery"}
        </h1>
        {subcategoryParam && (
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E91E8C]/20 px-3 py-1 text-xs font-medium text-[#C2185B]">
              Subcategory: <strong>{subcategoryParam}</strong>
              <button
                type="button"
                onClick={() => updateSearchParam("subcategory", null)}
                className="ml-1 text-foreground/60 hover:text-foreground font-bold"
                aria-label="Remove subcategory filter"
              >
                ✕
              </button>
            </span>
          </div>
        )}
        {queryParam && (
          <p className="mt-2 text-sm text-muted-foreground">
            Results for "{queryParam}" — {filtered.length} found
          </p>
        )}
      </div>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        {/* Desktop filters */}
        <aside className="hidden lg:block">{filterPanel}</aside>

        <div>
          {/* Toolbar */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`flex items-center gap-2 lg:hidden ${theme.buttons.secondarySm}`}
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
            <p className="hidden text-sm text-muted-foreground sm:block">
              Showing {Math.min(visible, filtered.length)} of {filtered.length}{" "}
              items
            </p>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => updateSearchParam("sort", e.target.value)}
                className={theme.forms.select}
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {filtersOpen && (
            <div className={`mb-8 lg:hidden ${theme.cards.padded}`}>
              {filterPanel}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border py-20 text-center">
              <p className="font-display text-2xl">No jewellery items found</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your filters or search.
              </p>
            </div>
          ) : (
            <>
              <div className={theme.layout.grid3Cols}>
                {filtered.slice(0, visible).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              {visible < filtered.length && (
                <div className="mt-10 text-center">
                  <button
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className={theme.buttons.primary}
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShopPage;
