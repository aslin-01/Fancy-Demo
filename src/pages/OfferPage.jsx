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
    title: "Festive Grand Celebration",
    subtitle: "Flat 25% off on our exquisite Banarasi & Kanchipuram pure silk sarees collection.",
    offerType: "with_coupon",
    hasCoupon: true,
    code: "FESTIVE25",
    discountType: "percentage",
    discountValue: 25,
    minOrderValue: 4999,
    badge: "FESTIVE SALE",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
    validTill: "Valid until 31 Dec 2026",
    terms: "Valid on silk saree orders above ₹4,999. Use code FESTIVE25 at checkout.",
    category: "Silk",
    isActive: true,
  },
  {
    _id: "fb-2",
    order: 2,
    title: "Royal Bridal Heirloom Special",
    subtitle: "Enjoy Flat ₹2,000 instant savings on pure gold zari bridal drapes for your grand day.",
    offerType: "with_coupon",
    hasCoupon: true,
    code: "BRIDAL2000",
    discountType: "flat",
    discountValue: 2000,
    minOrderValue: 14999,
    badge: "BRIDAL EXCLUSIVE",
    image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1200&q=80",
    validTill: "Valid until 15 Jan 2027",
    terms: "Applicable on Wedding & Bridal collection above ₹14,999.",
    category: "Wedding",
    isActive: true,
  },
  {
    _id: "fb-3",
    order: 3,
    title: "First Order Welcome Courtesy",
    subtitle: "Welcome to the CF Handlooms family. Take 10% off your entire first artisanal purchase.",
    offerType: "with_coupon",
    hasCoupon: true,
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    minOrderValue: 1999,
    badge: "NEW ARRIVAL",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80",
    validTill: "Ongoing for New Customers",
    terms: "Valid on first purchase per customer. Applicable across all handloom weaves.",
    category: "All",
    isActive: true,
  },
  {
    _id: "fb-4",
    order: 4,
    title: "Handloom Cotton Comfort Weaves",
    subtitle: "Pure Chettinad and Mulmul handloom cottons with Flat 15% discount for everyday luxury.",
    offerType: "with_coupon",
    hasCoupon: true,
    code: "COTTON15",
    discountType: "percentage",
    discountValue: 15,
    minOrderValue: 2499,
    badge: "WEEKEND SPECIAL",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80",
    validTill: "Valid for Limited Time",
    terms: "Valid on all breathable cotton collection purchases above ₹2,499.",
    category: "Cotton",
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
    <div className="min-h-screen bg-[#FAF8F2] text-[#12100D] select-none pb-20">
      {/* Editorial Luxury Hero Header */}
      <section className="relative overflow-hidden bg-[#0C0A07] text-white py-16 sm:py-24 border-b border-gold/30">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C0A07] via-[#0C0A07]/80 to-transparent z-10" />
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#F5B815]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-[#0C0A07]/80 px-4 py-1 text-xs tracking-widest text-gold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
              <span>HANDLOOM FESTIVE PRIVILEGES</span>
            </div>
            <h1 className={`${theme.typography.h1Hero} text-3xl sm:text-5xl font-bold leading-tight`}>
              Exclusive Offers & Festive Weaves
            </h1>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
              Celebrate timeless artisanal heritage with direct promotional discounts and coupon codes on pure Kanchipuram silks, Banarasi brocades, and handcrafted cotton sarees.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gold/20 border border-gold/30 flex items-center justify-center text-gold">
              <Gift className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gold font-bold">First Order Gift</p>
              <p className="text-sm font-semibold text-white">Use code WELCOME10</p>
              <p className="text-[11px] text-gray-400">10% OFF on all weaves</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-10 space-y-12">
        {/* Category Tabs Filter */}
        <div className="flex items-center justify-center sm:justify-start gap-2.5 overflow-x-auto pb-2 border-b border-[#E8D8B5]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? "bg-[#B87802] text-white shadow-md shadow-[#B87802]/20"
                  : "bg-white text-[#6B6457] border border-[#E8D8B5] hover:border-[#B87802] hover:text-[#B87802]"
              }`}
            >
              {cat === "All" ? "All Offers" : `${cat} Offers`}
            </button>
          ))}
        </div>

        {/* ── SECTION 1: PROMOTIONAL COUPON CARDS ── */}
        {couponOffers.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-1">
              <div>
                <span className="text-[11px] font-bold tracking-widest text-[#B87802] uppercase block">
                  PROMOTIONAL CODES
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#12100D]">
                  Exclusive Discount Coupons
                </h2>
              </div>
              <span className="text-xs text-[#736858] font-medium hidden sm:block">
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
                    className="bg-white rounded-xl border border-[#E8D8B5] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
                  >
                    {/* Top Thumbnail with Badge & Discount Banner */}
                    <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-neutral-900">
                      <img
                        src={offer.image}
                        alt={offer.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A07]/90 via-[#0C0A07]/40 to-transparent" />

                      {/* Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#0C0A07]/80 text-[#F5B815] border border-[#F5B815]/50 backdrop-blur-md">
                          <Sparkles className="w-3 h-3 text-[#F5B815]" />
                          <span>{offer.badge || "COUPON DEAL"}</span>
                        </span>
                      </div>

                      {/* Discount Stamped Ribbon */}
                      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between">
                        <div>
                          <span className="text-2xl sm:text-3xl font-extrabold text-[#FEE63E] tracking-tight block drop-shadow-md">
                            {discountText}
                          </span>
                          <p className="text-[11px] text-gray-300 font-medium">
                            {offer.minOrderValue > 0
                              ? `On orders above ₹${offer.minOrderValue.toLocaleString()}`
                              : "No minimum purchase required"}
                          </p>
                        </div>

                        {offer.validTill && (
                          <span className="text-[10px] text-gray-300 flex items-center gap-1 bg-[#0C0A07]/70 px-2.5 py-1 rounded-md border border-white/20 backdrop-blur-sm">
                            <Clock className="w-3 h-3 text-[#F5B815]" />
                            <span>{offer.validTill}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                      <div className="space-y-2">
                        <h3 className="font-serif text-xl font-bold text-[#12100D] leading-snug">
                          {offer.title}
                        </h3>
                        {offer.subtitle && (
                          <p className="text-xs sm:text-sm text-[#736858] leading-relaxed">
                            {offer.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Coupon Code Strip */}
                      <div className="p-3.5 rounded-lg border-2 border-dashed border-[#B87802]/50 bg-[#FAF4E6] flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7E6A] block">
                            Coupon Code
                          </span>
                          <span className="font-mono text-base font-bold text-[#996300] tracking-widest">
                            {offer.code}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopyCode(offer.code)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            isCopied
                              ? "bg-emerald-600 text-white"
                              : "bg-[#B87802] hover:bg-[#996300] text-white shadow-sm"
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
                        <p className="text-[11px] text-[#8C7E6A] leading-relaxed pt-2 border-t border-[#E8D8B5]">
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

        {/* ── SECTION 2: PRODUCTS ON OFFER (EXACT SAME SHOP PAGE PRODUCTCARD GRID) ── */}
        <div className="space-y-6 pt-4 border-t border-[#E8D8B5]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold tracking-widest text-[#B87802] uppercase block">
                SPECIAL OFFER COLLECTION
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#12100D] mt-1">
                {selectedCategory === "All"
                  ? "Sarees on Exclusive Offer"
                  : `${selectedCategory} Sarees on Offer`}
              </h2>
              <p className="text-xs sm:text-sm text-[#736858] mt-1">
                Handcrafted pure drapes with direct discounts and seasonal savings ready to shop.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FAF4E6] text-[#B87802] border border-[#E8D8B5]">
                {offerProducts.length} {offerProducts.length === 1 ? "Saree" : "Sarees"} Available
              </span>
              <Link
                to="/shop"
                className="text-xs font-semibold text-[#B87802] hover:text-[#996300] flex items-center gap-1 hover:underline ml-2"
              >
                <span>View Full Shop</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {offerProducts.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#E8D8B5] py-20 text-center bg-white space-y-3">
              <ShoppingBag className="w-12 h-12 text-[#B87802]/40 mx-auto" />
              <p className="font-serif text-2xl font-bold text-[#12100D]">
                No sarees found on offer for "{selectedCategory}"
              </p>
              <p className="text-xs text-[#736858]">
                Please check another category or browse our full saree catalog.
              </p>
              <button
                type="button"
                onClick={() => setSelectedCategory("All")}
                className="mt-3 px-6 py-2.5 rounded-md bg-[#B87802] text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                View All Offers
              </button>
            </div>
          ) : (
            <div className={theme.layout.grid3Cols}>
              {offerProducts.map((p) => (
                <ProductCard key={p.id || p._id || p.sku} product={p} />
              ))}
            </div>
          )}
        </div>

        {/* ── SECTION 3: HOW TO REDEEM ── */}
        <div className="bg-white rounded-xl border border-[#E8D8B5] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center sm:text-left space-y-1">
            <span className="text-[11px] font-bold text-[#B87802] tracking-widest uppercase">
              Privilege Guidelines
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#12100D]">
              How to Apply Your Handloom Offer
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-[#FAF8F2] border border-[#E8D8B5] space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#B87802] text-white font-bold flex items-center justify-center text-xs">
                1
              </div>
              <h4 className="text-sm font-bold text-[#12100D]">Select Your Saree</h4>
              <p className="text-xs text-[#736858] leading-relaxed">
                Browse our pure mulberry silks, bridal zari, or handloom cotton weaves and add items to your shopping cart.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#FAF8F2] border border-[#E8D8B5] space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#B87802] text-white font-bold flex items-center justify-center text-xs">
                2
              </div>
              <h4 className="text-sm font-bold text-[#12100D]">Claim Your Offer</h4>
              <p className="text-xs text-[#736858] leading-relaxed">
                Direct offers are already discounted. For coupon deals, click "Copy Code" on the offer banner above.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#FAF8F2] border border-[#E8D8B5] space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#B87802] text-white font-bold flex items-center justify-center text-xs">
                3
              </div>
              <h4 className="text-sm font-bold text-[#12100D]">Instant Savings</h4>
              <p className="text-xs text-[#736858] leading-relaxed">
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