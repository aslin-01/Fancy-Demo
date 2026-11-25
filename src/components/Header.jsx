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
} from "lucide-react";
import { useStore } from "@/lib/store";
import { theme } from "@/theme";

const mainNavLinks = [
  { label: "Home", to: "/" },
  // "Shop All" with sub-menu is inserted between Home and Offers
  { label: "Offers", to: "/offers" },
];

export function Header() {
  const { cartCount, wishlist, products, categories } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(true);
  const [hoveredCategorySlug, setHoveredCategorySlug] = useState(null);
  const [query, setQuery] = useState("");
  const [authorizedEmail, setAuthorizedEmail] = useState(() => {
    let email = localStorage.getItem("mf_authorized_email") || "";
    const oldEmail = localStorage.getItem("cf_authorized_email") || "";
    if (!email && oldEmail) {
      email = oldEmail;
    }
    // Cleanse any reference to cfhandlooms
    if (email && email.toLowerCase().includes("cfhandlooms")) {
      email = "admin@madhafancy.com";
    }
    // Always persist clean email and purge old keys
    if (email) {
      localStorage.setItem("mf_authorized_email", email);
    }
    localStorage.removeItem("cf_authorized_email");
    localStorage.removeItem("cf_authorized_user");
    return email;
  });
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

  useEffect(() => {
    const handleAuthChange = () => {
      let email = localStorage.getItem("mf_authorized_email") || "";
      const oldEmail = localStorage.getItem("cf_authorized_email") || "";
      if (!email && oldEmail) email = oldEmail;
      if (email && email.toLowerCase().includes("cfhandlooms")) {
        email = "admin@madhafancy.com";
        localStorage.setItem("mf_authorized_email", email);
      }
      localStorage.removeItem("cf_authorized_email");
      localStorage.removeItem("cf_authorized_user");
      setAuthorizedEmail(email);
    };
    window.addEventListener("mf_auth_state_changed", handleAuthChange);
    window.addEventListener("cf_auth_state_changed", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    return () => {
      window.removeEventListener("mf_auth_state_changed", handleAuthChange);
      window.removeEventListener("cf_auth_state_changed", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

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
            {authorizedEmail && (
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF5F8] border border-[#F8C4D8] text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="font-semibold text-[#12100D] max-w-[120px] truncate">
                  {authorizedEmail}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("mf_authorized_email");
                    localStorage.removeItem("mf_authorized_user");
                    localStorage.removeItem("cf_authorized_email");
                    localStorage.removeItem("cf_authorized_user");
                    setAuthorizedEmail("");
                    window.dispatchEvent(new Event("mf_auth_state_changed"));
                    window.dispatchEvent(new Event("cf_auth_state_changed"));
                  }}
                  className="ml-1 text-[10px] text-[#C2185B] hover:text-rose-600 font-semibold cursor-pointer underline"
                  title="Exit / Switch user email"
                >
                  Exit
                </button>
              </div>
            )}
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
            {/* Gold highlight accent strip */}
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#E91E8C] to-transparent" />

            <div className="mx-auto max-w-6xl px-6 py-6 sm:px-8">
              {menuCategories.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Explore our complete handcrafted 1-gram gold jewellery collection.
                  </p>
                  <Link
                    to="/shop"
                    onClick={() => setShopMenuOpen(false)}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C2185B] hover:text-[#0C0A07]"
                  >
                    <span>Browse All Jewellery</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="flex gap-8 items-start min-h-[160px]">

                  {/* Left Column: Categories arranged order-wise */}
                  <div className="w-60 shrink-0">
                    <p className="text-[10px] font-bold tracking-[0.24em] uppercase text-[#C2185B] mb-3 px-3">
                      Categories
                    </p>
                    <div className="space-y-1">
                      {menuCategories.map((cat) => {
                        const isHovered =
                          hoveredCategorySlug &&
                          (hoveredCategorySlug.toLowerCase() === cat.slug.toLowerCase() ||
                            hoveredCategorySlug.toLowerCase() === cat.name.toLowerCase());
                        return (
                          <div
                            key={cat.slug}
                            onMouseEnter={() => handleCategoryMouseEnter(cat.slug)}
                            onMouseLeave={handleCategoryMouseLeave}
                          >
                            <Link
                              to={`/shop?category=${encodeURIComponent(cat.name)}`}
                              onClick={() => {
                                setShopMenuOpen(false);
                                setHoveredCategorySlug(null);
                              }}
                              className={`group flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                                isHovered
                                  ? "bg-[#E91E8C]/20 text-[#C2185B] font-semibold"
                                  : "text-foreground/80 hover:bg-[#E91E8C]/10 hover:text-[#C2185B]"
                              }`}
                            >
                              <span className="group-hover:translate-x-0.5 transition-transform">
                                {cat.name}
                              </span>
                              <ChevronRight
                                className={`h-4 w-4 transition-all ${
                                  isHovered
                                    ? "text-[#C2185B] translate-x-1"
                                    : "text-muted-foreground/35 group-hover:text-[#C2185B]"
                                }`}
                              />
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ONLY ON HOVER: Show the related product card(s) */}
                  {hoveredCategory && hoveredCategory.products.length > 0 && (
                    <div
                      onMouseEnter={handleCardsMouseEnter}
                      onMouseLeave={handleCardsMouseLeave}
                      className="flex-1 pl-4 animate-in fade-in duration-150"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                        {hoveredCategory.products.map((p) => {
                          const primaryTitle = p.fabric || p.name;
                          const secondaryTitle =
                            p.fabric && p.name && p.fabric.toLowerCase() !== p.name.toLowerCase()
                              ? p.name
                              : p.occasion || "";
                          return (
                            <Link
                              key={p.id || p._id}
                              to={`/product/${p.id || p._id}`}
                              onClick={() => {
                                setShopMenuOpen(false);
                                setHoveredCategorySlug(null);
                              }}
                              className="group rounded-xl border border-[#F8C4D8]/80 bg-white/95 p-3.5 hover:bg-white hover:border-[#C2185B] hover:shadow-xs transition-all duration-200"
                            >
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-foreground/90 group-hover:text-[#C2185B] transition-colors leading-tight">
                                  {primaryTitle}
                                </p>
                                <ArrowRight className="h-3.5 w-3.5 text-[#C2185B] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 ml-1.5" />
                              </div>
                              <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
                                <span className="line-clamp-1">{secondaryTitle}</span>
                                {Number(p.price) > 0 && (
                                  <span className="font-semibold text-[#C2185B] ml-2 shrink-0">
                                    ₹{Number(p.price).toLocaleString("en-IN")}
                                  </span>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              )}
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
                  <ul className="mt-2 space-y-2.5 pl-3 border-l-2 border-[#E91E8C]/40 mb-2">
                    {menuCategories.map((cat) => (
                      <li key={cat.slug} className="space-y-1">
                        <Link
                          to={`/shop?category=${encodeURIComponent(cat.name)}`}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-between text-xs font-semibold uppercase text-foreground/90 hover:text-[#C2185B]"
                        >
                          <span>{cat.name}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {cat.products.length} {cat.products.length === 1 ? "Design" : "Designs"}
                          </span>
                        </Link>
                        <div className="flex flex-wrap gap-1.5 pl-1">
                          {cat.products.map((p) => (
                            <Link
                              key={p.id || p._id}
                              to={`/product/${p.id || p._id}`}
                              onClick={() => setMobileOpen(false)}
                              className="text-[11px] text-muted-foreground hover:text-[#C2185B] bg-[#FFF5F8] px-2 py-0.5 rounded border border-[#F8C4D8]/50"
                            >
                              {p.fabric || p.name}
                            </Link>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
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
