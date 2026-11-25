import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Heart,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
  Sparkles,
  Crown,
  Gem,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { theme } from "@/theme";

const mainNavLinks = [
  { label: "Home", to: "/" },
  // "Shop All" with sub-menu is inserted between Home and Offers
  { label: "Offers", to: "/offers" },
];

const MEGA_MENU_SECTIONS = [
  {
    title: "Bridal & Grand Sets",
    tagline: "Temple Kemp & Antique Combos",
    items: [
      { name: "Bridal Sets", desc: "Grand temple kemp combos & chokers", badge: "Trending" },
      { name: "Harams & Long Chains", desc: "Kasu Malai, Mango Mala & Mop chains" },
      { name: "Necklaces & Chokers", desc: "Antique matte chokers & AD stones" },
      { name: "Pendant Sets & Lockets", desc: "Temple lockets with ruby drops" },
    ],
  },
  {
    title: "Bangles, Earrings & Hair",
    tagline: "Daily & Occasion Gold Covering",
    items: [
      { name: "Bangles & Kadas", desc: "Daily wear micro gold & screw kadas", badge: "Hot" },
      { name: "Earrings & Jhumkas", desc: "South Indian Jimikki Kammal & studs" },
      { name: "Maang Tikka & Nethichutti", desc: "Traditional matha patti & bridal tikkas" },
      { name: "Nose Rings & Mukkuvalai", desc: "Traditional clip-on bridal naths" },
    ],
  },
  {
    title: "Traditional Ornaments",
    tagline: "Heritage South Indian Jewellery",
    items: [
      { name: "Hip Belts & Hair Ornaments", desc: "Antique peacock Oddiyanam & Jadabillai", badge: "Bridal" },
      { name: "Armlets & Vanki", desc: "Lakshmi & peacock carved vankis" },
      { name: "Anklets & Kolusu", desc: "Micro gold daily wear kolusu & payals" },
      { name: "Mangalsutra & Thali Chains", desc: "South Indian Kodi thali & mugappu chains" },
    ],
  },
];

export function Header() {
  const { cartCount, wishlist, products, categories } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(true);
  const [hoveredCategorySlug, setHoveredCategorySlug] = useState(null);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const navContainerRef = useRef(null);
  const timeoutRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // Derive categories and their actual products directly from store categories and products
  const menuCategories = useMemo(() => {
    const catMap = new Map();

    // 1. Seed categories from store/backend or standard Madha Fancy catalog
    const sourceCategories =
      Array.isArray(categories) && categories.length > 0
        ? categories
        : [
            { name: "Bridal Sets", slug: "Bridal Sets" },
            { name: "Harams & Long Chains", slug: "Harams & Long Chains" },
            { name: "Necklaces & Chokers", slug: "Necklaces & Chokers" },
            { name: "Bangles & Kadas", slug: "Bangles & Kadas" },
            { name: "Earrings & Jhumkas", slug: "Earrings & Jhumkas" },
            { name: "Hip Belts & Hair Ornaments", slug: "Hip Belts & Hair Ornaments" },
          ];

    sourceCategories.forEach((c) => {
      const catName = String(c.name || "").trim();
      if (!catName) return;
      const key = catName.toLowerCase();
      if (!catMap.has(key)) {
        catMap.set(key, {
          name: catName,
          slug: c.slug || catName,
          products: [],
        });
      }
    });

    // 2. Associate active in-stock products with their categories
    (products || []).forEach((p) => {
      if (p.isActive === false || p.inStock === false) return;
      const catName = String(p.category || "").trim();
      if (!catName) return;
      const key = catName.toLowerCase();

      if (!catMap.has(key)) {
        catMap.set(key, {
          name: catName,
          slug: catName,
          products: [p],
        });
      } else {
        catMap.get(key).products.push(p);
      }
    });

    // Return categories arranged order-wise (alphabetical A-Z)
    return Array.from(catMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [categories, products]);

  // Product card(s) shown strictly on hover (no default tab selection)
  const hoveredCategory = useMemo(() => {
    if (!hoveredCategorySlug || !menuCategories || menuCategories.length === 0) {
      return null;
    }
    return (
      menuCategories.find(
        (c) =>
          c.slug.toLowerCase() === hoveredCategorySlug.toLowerCase() ||
          c.name.toLowerCase() === hoveredCategorySlug.toLowerCase()
      ) || null
    );
  }, [menuCategories, hoveredCategorySlug]);

  const handleCategoryMouseEnter = (slug) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredCategorySlug(slug);
  };

  const handleCategoryMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCategorySlug(null);
    }, 200);
  };

  const handleCardsMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleCardsMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCategorySlug(null);
    }, 200);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setShopMenuOpen(true);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setShopMenuOpen(false);
      setHoveredCategorySlug(null);
    }, 180);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Automatically close menus upon navigation
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShopMenuOpen(false);
    setHoveredCategorySlug(null);
    setMobileOpen(false);
  }, [location.pathname, location.search]);

  // Handle click outside to close the sub-menu & Esc key to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(event.target)
      ) {
        setShopMenuOpen(false);
        setHoveredCategorySlug(null);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShopMenuOpen(false);
        setHoveredCategorySlug(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate("/shop");
    }
    setMobileOpen(false);
    setShopMenuOpen(false);
    setHoveredCategorySlug(null);
  };

  const isShopActive = location.pathname.startsWith("/shop");

  return (
    <header ref={navContainerRef} className="sticky top-0 z-50">
      {/* Announcement bar - Madha Fancy Logo Palette */}
      <div className="bg-[#880E4F] text-white border-b border-[#C2185B]/30">
        <p className="mx-auto max-w-7xl px-4 py-2 text-center text-xs tracking-[0.18em] uppercase font-medium">
          Festive Offer — 1-Gram Gold Covering &amp; Bridal Jewellery | Free Shipping on orders above ₹1,999
        </p>
      </div>

      {/* Main header */}
      <div className="relative border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:gap-8">
          <button
            className="shrink-0 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          <Link to="/" className="flex items-center gap-2.5 sm:gap-3">
            <img
              src="/favicon.jpg"
              alt="Madha Fancy logo"
              className="h-10 w-10 shrink-0 object-contain rounded-full sm:h-12 sm:w-12"
            />
            <div className="flex min-w-0 flex-col items-start">
              <span className={theme.typography.cursiveBrand}>
                Madha Fancy
              </span>
              <span className="text-[10px] tracking-[0.24em] uppercase text-muted-foreground">
                Gold Covering &amp; Bridal
              </span>
            </div>
          </Link>

          <form
            onSubmit={submitSearch}
            className="mx-auto hidden w-full max-w-md items-center rounded-full border border-input bg-card px-4 py-2 md:flex"
          >
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search harams, chokers, bangles, jhumkas, bridal sets…"
              className="ml-2 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground focus:ring-0"
            />
          </form>

          <div className="ml-auto flex shrink-0 items-center gap-4 sm:gap-6">
            <Link
              to="/admin/dashboard"
              className="group flex flex-col items-center justify-center gap-1 text-foreground/85 hover:text-[#C2185B] transition-colors"
              aria-label="Admin Portal"
              title="Admin Portal"
            >
              <div className="relative">
                <User className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#C2185B] ring-1 ring-white" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium tracking-tight text-[#C2185B]">
                Admin
              </span>
            </Link>
            <Link
              to="/wishlist"
              className="group relative flex flex-col items-center justify-center gap-1 text-foreground/85 hover:text-[#C2185B] transition-colors"
              aria-label="Wishlist"
            >
              <div className="relative">
                <Heart className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                {wishlist.length > 0 && (
                  <span className={theme.badges.counterGold}>
                    {wishlist.length}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium tracking-tight">
                Wishlist
              </span>
            </Link>
            <Link
              to="/cart"
              className="group relative flex flex-col items-center justify-center gap-1 text-foreground/85 hover:text-[#C2185B] transition-colors"
              aria-label="Shopping cart"
            >
              <div className="relative">
                <ShoppingCart className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                {cartCount > 0 && (
                  <span className={theme.badges.counterMaroon}>
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium tracking-tight">
                Cart
              </span>
            </Link>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden border-t border-border lg:block">
          <ul className="mx-auto flex max-w-7xl items-center justify-center gap-10 px-4">
            {/* Home link */}
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `block py-3 font-display text-[16px] tracking-[0.14em] uppercase transition-colors hover:text-[#C2185B] ${isActive
                    ? "text-[#C2185B] font-semibold border-b-2 border-[#E91E8C]"
                    : "text-foreground/85 font-medium"
                  }`
                }
              >
                Home
              </NavLink>
            </li>

            {/* Shop All with interactive Hover Mega Menu */}
            <li
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to="/shop"
                onClick={() => setShopMenuOpen(false)}
                className={`inline-flex items-center gap-1.5 py-3 font-display text-[16px] tracking-[0.14em] uppercase transition-colors hover:text-[#C2185B] ${shopMenuOpen || isShopActive
                    ? "text-[#C2185B] font-semibold border-b-2 border-[#E91E8C]"
                    : "text-foreground/85 font-medium"
                  }`}
                aria-expanded={shopMenuOpen}
                aria-haspopup="true"
              >
                <span>Shop All</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${shopMenuOpen ? "rotate-180 text-[#C2185B]" : "text-muted-foreground"
                    }`}
                />
              </Link>
            </li>

            {/* Remaining main nav links */}
            {mainNavLinks.slice(1).map((link) => (
              <li key={link.label}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `block py-3 font-display text-[16px] tracking-[0.14em] uppercase transition-colors hover:text-[#C2185B] ${isActive
                      ? "text-[#C2185B] font-semibold border-b-2 border-[#E91E8C]"
                      : "text-foreground/85 font-medium"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop Category Sub-Menu / Hover Mega Menu (Attached directly below the nav bar) */}
        {shopMenuOpen && (
          <div
            id="shop-all-submenu"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="absolute left-0 right-0 top-full z-50 border-b border-[#F8C4D8] bg-[#FFF5F8]/98 shadow-2xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-2"
          >
            {/* Top gold / pink highlight accent strip */}
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#E91E8C] to-transparent" />

            <div className="mx-auto max-w-7xl px-6 py-7 sm:px-8">
              {/* 4-Column Luxury Department Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8">
                {MEGA_MENU_SECTIONS.map((section) => (
                  <div key={section.title} className="space-y-3">
                    <div className="pb-1 border-b border-[#F8C4D8]/60">
                      <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#C2185B]">
                        {section.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {section.tagline}
                      </p>
                    </div>

                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <Link
                          key={item.name}
                          to={`/shop?category=${encodeURIComponent(item.name)}`}
                          onClick={() => setShopMenuOpen(false)}
                          className="group block rounded-lg px-2.5 py-2 transition-all duration-150 hover:bg-[#E91E8C]/10"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-foreground/90 group-hover:text-[#C2185B] transition-colors leading-tight">
                              {item.name}
                            </span>
                            {item.badge ? (
                              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#E91E8C]/15 text-[#C2185B]">
                                {item.badge}
                              </span>
                            ) : (
                              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 opacity-0 group-hover:opacity-100 group-hover:text-[#C2185B] group-hover:translate-x-0.5 transition-all" />
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground/80 line-clamp-1 mt-0.5">
                            {item.desc}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Column 4: Curated Visual Showcases */}
                <div className="space-y-3">
                  <div className="pb-1 border-b border-[#F8C4D8]/60">
                    <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#C2185B]">
                      Featured Highlights
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Handcrafted Masterpieces
                    </p>
                  </div>

                  {/* Showcase Card 1 */}
                  <Link
                    to="/shop?category=Bridal%20Sets"
                    onClick={() => setShopMenuOpen(false)}
                    className="group relative block h-[105px] overflow-hidden rounded-xl border border-[#F8C4D8] shadow-xs hover:shadow-md transition-all duration-300"
                  >
                    <img
                      src="/banners/banner-1.jpg"
                      alt="Royal Bridal Collection"
                      className="h-full w-full object-cover object-right group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 flex flex-col justify-end">
                      <span className="text-[9px] font-bold tracking-widest uppercase text-[#F8C4D8]">
                        Royal Bridal 2026
                      </span>
                      <h4 className="text-xs font-semibold text-white group-hover:text-[#F8C4D8] transition-colors leading-tight">
                        Grand Kemp Temple Sets
                      </h4>
                      <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-medium text-white/90">
                        <span>Explore Bridal</span>
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>

                  {/* Showcase Card 2 */}
                  <Link
                    to="/shop"
                    onClick={() => setShopMenuOpen(false)}
                    className="group relative block h-[105px] overflow-hidden rounded-xl border border-[#F8C4D8] shadow-xs hover:shadow-md transition-all duration-300"
                  >
                    <img
                      src="/banners/banner-3.jpg"
                      alt="1-Gram Gold Bestsellers"
                      className="h-full w-full object-cover object-right group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 flex flex-col justify-end">
                      <span className="text-[9px] font-bold tracking-widest uppercase text-[#F8C4D8]">
                        1-Gram Gold Covering
                      </span>
                      <h4 className="text-xs font-semibold text-white group-hover:text-[#F8C4D8] transition-colors leading-tight">
                        Festive Harams & Bangles
                      </h4>
                      <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-medium text-white/90">
                        <span>Shop All Designs</span>
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Mega Menu Trust Strip & Full Catalog Button */}
              <div className="mt-6 pt-4 border-t border-[#F8C4D8]/80 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-medium text-[#12100D]">
                    <Sparkles className="h-3.5 w-3.5 text-[#C2185B]" />
                    1-Gram Micro Gold Plating Guarantee
                  </span>
                  <span className="hidden sm:inline-block text-[#F8C4D8]">|</span>
                  <span className="hidden sm:flex items-center gap-1.5">
                    <Crown className="h-3.5 w-3.5 text-[#C2185B]" />
                    Erode Fort Traditional Craftsmanship
                  </span>
                  <span className="hidden md:inline-block text-[#F8C4D8]">|</span>
                  <span className="hidden md:flex items-center gap-1.5">
                    <Gem className="h-3.5 w-3.5 text-[#C2185B]" />
                    Free Delivery on Orders Above ₹1,999
                  </span>
                </div>
                <Link
                  to="/shop"
                  onClick={() => setShopMenuOpen(false)}
                  className="inline-flex items-center gap-1.5 font-semibold text-[#C2185B] hover:text-[#880E4F] transition-colors uppercase tracking-wider text-[11px]"
                >
                  <span>View All 24+ Jewellery Designs</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <nav className="border-t border-border bg-background lg:hidden">
            <form
              onSubmit={submitSearch}
              className="flex items-center gap-2 border-b border-border px-4 py-3 md:hidden"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search jewellery, harams, bangles…"
                className="w-full bg-transparent text-sm outline-none"
              />
            </form>
            <ul className="px-4 py-2">
              {/* Home */}
              <li>
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="block border-b border-border/50 py-3 text-sm tracking-wide uppercase font-medium"
                >
                  Home
                </Link>
              </li>

              {/* Shop All Accordion in Mobile */}
              <li className="border-b border-border/50 py-2">
                <div className="flex items-center justify-between">
                  <Link
                    to="/shop"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-semibold tracking-wide uppercase text-[#C2185B]"
                  >
                    Shop All
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMobileShopOpen(!mobileShopOpen)}
                    className="p-1.5 text-muted-foreground hover:text-foreground"
                    aria-label="Toggle categories"
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${mobileShopOpen ? "rotate-180 text-[#C2185B]" : ""
                        }`}
                    />
                  </button>
                </div>

                {mobileShopOpen && (
                  <div className="mt-2 space-y-3.5 pl-3 border-l-2 border-[#E91E8C]/40 mb-3">
                    {MEGA_MENU_SECTIONS.map((sec) => (
                      <div key={sec.title} className="space-y-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#C2185B]">
                          {sec.title}
                        </p>
                        <div className="space-y-1 pl-1">
                          {sec.items.map((item) => (
                            <Link
                              key={item.name}
                              to={`/shop?category=${encodeURIComponent(item.name)}`}
                              onClick={() => setMobileOpen(false)}
                              className="flex items-center justify-between py-1 text-xs text-foreground/85 hover:text-[#C2185B]"
                            >
                              <span>{item.name}</span>
                              {item.badge && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#E91E8C]/15 text-[#C2185B]">
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Link
                      to="/shop"
                      onClick={() => setMobileOpen(false)}
                      className="block pt-1 text-xs font-semibold text-[#C2185B] uppercase tracking-wider underline"
                    >
                      View All 24+ Jewellery Designs →
                    </Link>
                  </div>
                )}
              </li>

              {/* Other Navigation Links */}
              {mainNavLinks.slice(1).map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="block border-b border-border/50 py-3 text-sm tracking-wide uppercase"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
