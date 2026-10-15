import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { products } from "@/data/products";
import { ProductCard } from "@/components/common/ProductCard";
import { theme } from "@/theme";

const categories = ["Silk", "Cotton", "Designer", "Wedding", "Party Wear"];
const colors = [
  "Maroon",
  "Red",
  "Pink",
  "Green",
  "Navy",
  "Mustard",
  "Ivory",
  "Beige",
  "Gold",
];
const occasions = ["Wedding", "Bridal", "Festive", "Party", "Daily Wear"];
const priceRanges = [
  { label: "Under ₹5,000", min: 0, max: 5000 },
  { label: "₹5,000 – ₹10,000", min: 5000, max: 10000 },
  { label: "₹10,000 – ₹20,000", min: 10000, max: 20000 },
  { label: "Above ₹20,000", min: 20000, max: Infinity },
];
const sortOptions = [
  { value: "popularity", label: "Popularity" },
  { value: "newest", label: "Newest Arrivals" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];
const PAGE_SIZE = 8;

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "";
  const queryParam = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "popularity";

  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [priceIdx, setPriceIdx] = useState(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);

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
      list = list.filter((p) => p.category === categoryParam);
    }
    if (queryParam) {
      const q = queryParam.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.color.toLowerCase().includes(q)
      );
    }
    if (selectedColors.length) {
      list = list.filter((p) => selectedColors.includes(p.color));
    }
    if (selectedOccasions.length) {
      list = list.filter((p) => selectedOccasions.includes(p.occasion));
    }
    if (priceIdx !== null) {
      const r = priceRanges[priceIdx];
      if (r) list = list.filter((p) => p.price >= r.min && p.price < r.max);
    }
    if (inStockOnly) {
      list = list.filter((p) => p.inStock);
    }
    switch (sort) {
      case "newest":
        list.sort((a, b) => Number(b.isNew ?? false) - Number(a.isNew ?? false));
        break;
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      default:
        list.sort((a, b) => b.reviews - a.reviews);
    }
    return list;
  }, [
    categoryParam,
    queryParam,
    selectedColors,
    selectedOccasions,
    priceIdx,
    inStockOnly,
    sort,
  ]);

  const toggle = (arr, v, set) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const filterPanel = (
    <div className="space-y-7">
      <div>
        <h3 className={theme.typography.h3Sidebar}>
          Category
        </h3>
        <ul className="mt-3 space-y-2">
          {categories.map((c) => (
            <li key={c}>
              <button
                onClick={() =>
                  updateSearchParam("category", categoryParam === c ? null : c)
                }
                className={`text-sm transition-colors hover:text-[#B87802] cursor-pointer ${
                  categoryParam === c
                    ? "font-semibold text-[#B87802]"
                    : "text-muted-foreground"
                }`}
              >
                {c} Sarees
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className={theme.typography.h3Sidebar}>
          Color
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => toggle(selectedColors, c, setSelectedColors)}
              className={
                selectedColors.includes(c)
                  ? theme.badges.filterChipActive
                  : theme.badges.filterChipInactive
              }
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className={theme.typography.h3Sidebar}>
          Price
        </h3>
        <ul className="mt-3 space-y-2">
          {priceRanges.map((r, i) => (
            <li key={r.label}>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="radio"
                  name="price"
                  checked={priceIdx === i}
                  onChange={() => setPriceIdx(i)}
                  className={theme.forms.radio}
                />
                {r.label}
              </label>
            </li>
          ))}
          <li>
            <button
              onClick={() => setPriceIdx(null)}
              className="text-xs text-[#B87802] underline cursor-pointer hover:text-[#0C0A07]"
            >
              Clear price filter
            </button>
          </li>
        </ul>
      </div>

      <div>
        <h3 className={theme.typography.h3Sidebar}>
          Occasion
        </h3>
        <ul className="mt-3 space-y-2">
          {occasions.map((o) => (
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
          {categoryParam ? `${categoryParam} Sarees` : "Shop All Sarees"}
        </h1>
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
              sarees
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
              <p className="font-display text-2xl">No sarees found</p>
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
                    className={theme.buttons.outline}
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
