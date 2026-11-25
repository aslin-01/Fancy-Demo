import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Tag,
  Copy,
  Check,
  Sparkles,
  ShoppingBag,
  Percent,
  Clock,
  ShieldCheck,
  Gift,
  ArrowRight,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/common/ProductCard";
import { theme } from "@/theme";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const FALLBACK_OFFERS = [
  {
    _id: "fb-1",
    order: 1,
    title: "Bridal Grand Wedding Special",
    subtitle: "Flat 20% off on our exquisite Antique Matte Temple Kemp Bridal Sets collection.",
    offerType: "with_coupon",
    hasCoupon: true,
    code: "BRIDAL20",
    discountType: "percentage",
    discountValue: 20,
    minOrderValue: 3999,
    badge: "BRIDAL SPECIAL",
    image: "/banners/banner-1.jpg",
    validTill: "Valid until 31 Dec 2026",
    terms: "Valid on bridal jewellery combo sets above ₹3,999. Use code BRIDAL20 at checkout.",
    category: "Bridal Sets",
    isActive: true,
  },
  {
    _id: "fb-2",
    order: 2,
    title: "1-Gram Gold Covering Fest",
    subtitle: "Enjoy Flat ₹500 instant savings on pure Kasu Malai and Gutapusalu long harams.",
    offerType: "with_coupon",
    hasCoupon: true,
    code: "HARAM500",
    discountType: "flat",
    discountValue: 500,
    minOrderValue: 2499,
    badge: "FESTIVE EXCLUSIVE",
    image: "/banners/banner-4.jpg",
    validTill: "Valid until 15 Jan 2027",
    terms: "Applicable on Harams & Long Chains collection above ₹2,499.",
    category: "Harams & Long Chains",
    isActive: true,
  },
  {
    _id: "fb-3",
    order: 3,
    title: "First Order Welcome Courtesy",
    subtitle: "Welcome to the Madha Fancy family. Take 10% off your entire first jewellery order.",
    offerType: "with_coupon",
    hasCoupon: true,
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    minOrderValue: 999,
    badge: "NEW CUSTOMER",
    image: "/banners/banner-2.jpg",
    validTill: "Ongoing for New Customers",
    terms: "Valid on first purchase per customer. Applicable across all 1-gram gold jewellery.",
    category: "All",
    isActive: true,
  },
  {
    _id: "fb-4",
    order: 4,
    title: "Daily Wear Bangles Combo",
    subtitle: "Guaranteed 1-gram micro gold plated daily wear bangles with Flat 15% discount.",
    offerType: "with_coupon",
    hasCoupon: true,
    code: "BANGLES15",
    discountType: "percentage",
    discountValue: 15,
    minOrderValue: 1499,
    badge: "BEST VALUE",
    image: "/banners/banner-3.jpg",
    validTill: "Valid for Limited Time",
    terms: "Valid on all Bangle & Kada collection purchases above ₹1,499.",
    category: "Bangles & Kadas",
    isActive: true,
  },
];

export function OfferPage() {
  const { products: storeProducts, categories: storeCategories } = useStore();
  const [offers, setOffers] = useState(FALLBACK_OFFERS);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchOffers = async () => {
      try {
        const res = await fetch(`${API_BASE}/offers`, {
          cache: "no-store",
          signal: AbortSignal.timeout(4000),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            if (isMounted) setOffers(json.data);
          }
        }
      } catch (e) {
        // Fallback remains active
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOffers();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  // Derive unique categories from active offers and store categories
  const categories = useMemo(() => {
    const set = new Set(["All"]);
    offers.forEach((o) => {
      if (o.isActive && o.category && o.category !== "All") {
        set.add(o.category);
      }
    });
    if (Array.isArray(storeCategories)) {
      storeCategories.forEach((c) => {
        const name = typeof c === "string" ? c : c?.name;
        if (name && name !== "All") set.add(name);
      });
    }
    return Array.from(set);
  }, [offers, storeCategories]);

  // Active coupon offers
  const couponOffers = useMemo(() => {
    return offers.filter((o) => {
      if (!o.isActive) return false;
      const isCoupon = o.offerType !== "without_coupon" && o.hasCoupon !== false;
      if (!isCoupon) return false;
      if (selectedCategory === "All") return true;
      return (
        (o.category || "").toLowerCase() === selectedCategory.toLowerCase() ||
        o.category === "All"
      );
    });
  }, [offers, selectedCategory]);

  // Active direct (without coupon) offers
  const directOffers = useMemo(() => {
    return offers.filter((o) => {
      if (!o.isActive) return false;
      return o.offerType === "without_coupon" || o.hasCoupon === false;
    });
  }, [offers]);

  // Filter products on offer to render in the exact ProductCard grid
  const offerProducts = useMemo(() => {
    if (!storeProducts || storeProducts.length === 0) return [];

    // Collect product IDs / SKUs tagged in direct offers
    const taggedProductIds = new Set();
    const categoriesWithAllOffers = new Set();

    directOffers.forEach((o) => {
      if (o.applyToAllInCategory && o.category && o.category !== "All") {
        categoriesWithAllOffers.add(o.category.toLowerCase());
      }
      if (Array.isArray(o.selectedProducts)) {
        o.selectedProducts.forEach((id) => taggedProductIds.add(String(id).trim()));
      }
    });

    const hasSpecificDirectOffers = taggedProductIds.size > 0 || categoriesWithAllOffers.size > 0;

    let matched = storeProducts.filter((p) => {
      const pId = String(p.id || p._id || "").trim();
      const pSku = String(p.sku || "").trim();
      const pCategory = String(p.category || "").toLowerCase().trim();

      // If specific direct offers exist, check if product belongs to them
      if (hasSpecificDirectOffers) {
        if (taggedProductIds.has(pId) || (pSku && taggedProductIds.has(pSku))) {
          return true;
        }
        if (categoriesWithAllOffers.has(pCategory)) {
          return true;
        }
      }

      // Check if product has a promotional MRP discount
      const hasDiscount = p.mrp && Number(p.mrp) > Number(p.price);
      if (hasDiscount) return true;

      // If no specific direct offer products are tagged yet, include products from active coupon offer categories
      if (!hasSpecificDirectOffers) {
        const activeCategories = offers
          .filter((o) => o.isActive && o.category && o.category !== "All")
          .map((o) => o.category.toLowerCase());
        if (activeCategories.includes(pCategory)) return true;
      }

      return false;
    });

    // If still nothing matched, fallback to all store products so the grid is never blank
    if (matched.length === 0) {
      matched = storeProducts;
    }

    // Now filter by selected category
    if (selectedCategory !== "All") {
      matched = matched.filter(
        (p) => (p.category || "").toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    return matched;
  }, [storeProducts, directOffers, offers, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#FFF5F8] text-foreground select-none pb-20">
      {/* Editorial Luxury Hero Header */}
      <section className="relative overflow-hidden bg-[#2B0417] text-white py-14 sm:py-20 border-b border-[#F8C4D8]/30">
        <img
          src="/banners/banner-1.jpg"
          alt="Madha Fancy Festive Jewellery Offers"
          className="absolute inset-0 h-full w-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2B0417]/95 via-[#3B0722]/80 to-[#3B0722]/25 z-10" />
        <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-[#C2185B]/20 rounded-full blur-3xl pointer-events-none z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#F8C4D8]/40 bg-white/10 px-4 py-1 text-xs font-semibold tracking-widest text-[#F8C4D8] backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#FF80AB] animate-pulse" />
              <span>GOLD COVERING FESTIVE PRIVILEGES</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-semibold leading-tight text-white">
              Exclusive Offers &amp; Festive Jewellery
            </h1>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed font-light">
              Celebrate timeless South Indian elegance with direct promotional discounts and coupon codes on 1-gram gold covering, bridal temple sets, and antique kemp chokers.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-4 bg-white/10 border border-[#F8C4D8]/30 rounded-2xl p-5 backdrop-blur-md shrink-0 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-[#E91E8C]/25 border border-[#F8C4D8]/40 flex items-center justify-center text-[#F8C4D8]">
              <Gift className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[#FF80AB] font-bold">First Order Gift</p>
              <p className="text-sm font-semibold text-white">Use code WELCOME10</p>
              <p className="text-[11px] text-white/75">10% OFF on your first jewellery order</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 pt-10 space-y-12">
        {/* Category Tabs Filter */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pb-4 border-b border-[#F8C4D8]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? "bg-[#C2185B] text-white shadow-md shadow-[#C2185B]/20"
                  : "bg-white text-muted-foreground border border-[#F8C4D8] hover:border-[#C2185B] hover:text-[#C2185B]"
              }`}
            >
              {cat === "All" ? "All Offers" : cat}
            </button>
          ))}
        </div>

        {/* ── SECTION 1: PROMOTIONAL COUPON CARDS ── */}
        {couponOffers.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-1">
              <div>
                <span className="text-[11px] font-bold tracking-[0.2em] text-[#C2185B] uppercase block">
                  Promotional Codes
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mt-0.5">
                  Exclusive Discount Coupons
                </h2>
              </div>
              <span className="text-xs text-muted-foreground font-medium hidden sm:block">
                Copy code and enter at checkout
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {couponOffers.map((offer) => {
                const isCopied = copiedCode === offer.code;
                const discountText =
                  offer.discountType === "flat"
                    ? `FLAT ₹${offer.discountValue.toLocaleString()} OFF`
                    : `${offer.discountValue}% OFF`;

                return (
                  <div
                    key={offer._id || offer.code}
                    className="bg-white rounded-xl border border-[#F8C4D8] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
                  >
                    {/* Top Thumbnail with Badge & Discount Banner */}
                    <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#260416]">
                      <img
                        src={offer.image}
                        alt={offer.title}
                        className="w-full h-full object-cover object-right group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                      {/* Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#C2185B] text-white shadow-md">
                          <Sparkles className="w-3 h-3" />
                          <span>{offer.badge || "COUPON DEAL"}</span>
                        </span>
                      </div>

                      {/* Discount Stamped Ribbon */}
                      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between gap-2">
                        <div>
                          <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight block drop-shadow-md">
                            {discountText}
                          </span>
                          <p className="text-[11px] text-[#F8C4D8] font-medium">
                            {offer.minOrderValue > 0
                              ? `On orders above ₹${offer.minOrderValue.toLocaleString()}`
                              : "No minimum purchase required"}
                          </p>
                        </div>

                        {offer.validTill && (
                          <span className="text-[10px] text-white/90 flex items-center gap-1 bg-black/55 px-2.5 py-1 rounded-md border border-white/20 backdrop-blur-sm shrink-0">
                            <Clock className="w-3 h-3 text-[#FF80AB]" />
                            <span>{offer.validTill}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <h3 className="font-display text-xl sm:text-2xl font-semibold text-foreground leading-snug">
                          {offer.title}
                        </h3>
                        {offer.subtitle && (
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {offer.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Coupon Code Strip */}
                      <div className="p-3.5 rounded-lg border-2 border-dashed border-[#C2185B]/45 bg-[#FFF5F8] flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                            Coupon Code
                          </span>
                          <span className="font-mono text-base font-bold text-[#880E4F] tracking-widest">
                            {offer.code}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopyCode(offer.code)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            isCopied
                              ? "bg-emerald-600 text-white"
                              : "bg-[#C2185B] hover:bg-[#880E4F] text-white shadow-sm"
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Code</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Terms */}
                      {offer.terms && (
                        <p className="text-[11px] text-muted-foreground leading-relaxed pt-2 border-t border-[#F8C4D8]/60">
                          * {offer.terms}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── SECTION 2: PRODUCTS ON OFFER (EXACT SAME 4-COL PRODUCTCARD GRID) ── */}
        <div className="space-y-6 pt-6 border-t border-[#F8C4D8]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#C2185B] uppercase block">
                Special Offer Collection
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mt-0.5">
                {selectedCategory === "All"
                  ? "Jewellery on Exclusive Offer"
                  : `${selectedCategory} on Offer`}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Handcrafted 1-gram gold covering jewellery with direct discounts and seasonal savings ready to shop.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white text-[#C2185B] border border-[#F8C4D8]">
                {offerProducts.length} {offerProducts.length === 1 ? "Piece" : "Pieces"} Available
              </span>
              <Link
                to="/shop"
                className="text-xs font-semibold text-[#C2185B] hover:text-[#880E4F] flex items-center gap-1 hover:underline ml-2"
              >
                <span>View Full Shop</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {offerProducts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#F8C4D8] py-20 text-center bg-white space-y-3">
              <ShoppingBag className="w-12 h-12 text-[#C2185B]/40 mx-auto" />
              <p className="font-display text-2xl font-semibold text-foreground">
                No jewellery pieces found on offer for "{selectedCategory}"
              </p>
              <p className="text-xs text-muted-foreground">
                Please check another category or browse our full jewellery catalog.
              </p>
              <button
                type="button"
                onClick={() => setSelectedCategory("All")}
                className="mt-3 px-6 py-2.5 rounded-md bg-[#C2185B] hover:bg-[#880E4F] text-white text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors"
              >
                View All Offers
              </button>
            </div>
          ) : (
            <div className={theme.layout.grid4Cols}>
              {offerProducts.map((p) => (
                <ProductCard
                  key={p.id || p._id || p.sku}
                  product={p}
                  imageAspect="aspect-square"
                />
              ))}
            </div>
          )}
        </div>

        {/* ── SECTION 3: HOW TO REDEEM ── */}
        <div className="bg-white rounded-xl border border-[#F8C4D8] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center sm:text-left space-y-1">
            <span className="text-[11px] font-bold text-[#C2185B] tracking-[0.2em] uppercase">
              Privilege Guidelines
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground">
              How to Apply Your Festive Offer
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-[#FFF5F8] border border-[#F8C4D8] space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#C2185B] text-white font-bold flex items-center justify-center text-xs">
                1
              </div>
              <h4 className="font-display text-lg font-semibold text-foreground">Select Your Jewellery</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Browse our bridal sets, harams, antique chokers, or bangles and add items to your shopping cart.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#FFF5F8] border border-[#F8C4D8] space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#C2185B] text-white font-bold flex items-center justify-center text-xs">
                2
              </div>
              <h4 className="font-display text-lg font-semibold text-foreground">Claim Your Offer</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Direct offers are already discounted. For coupon deals, click "Copy Code" on the offer banner above.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#FFF5F8] border border-[#F8C4D8] space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#C2185B] text-white font-bold flex items-center justify-center text-xs">
                3
              </div>
              <h4 className="font-display text-lg font-semibold text-foreground">Instant Savings</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Enter your coupon during checkout for additional instant discount applied directly to your order total.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OfferPage;