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
  { label: "Offers", to: "/shop?occasion=Festive" },
];

const DEFAULT_CATEGORIES = [
  {
    name: "Cotton Sarees",
    slug: "Cotton",
    subcategories: [
      { name: "Chanderi Silk", desc: "Lightweight sheer drape with gold zari accents" },
      { name: "Mulmul Cotton", desc: "Featherlight breathable all-day handloom" },
      { name: "Chettinad Cotton", desc: "Vibrant temple borders & bold heritage stripes" },
      { name: "Kota Doria", desc: "Fine checkered translucent hand-woven craft" },
      { name: "Linen Cotton", desc: "Earthy natural textures for effortless elegance" },
      { name: "Jamdani Cotton", desc: "Intricate supplementary weft floral motifs" },
    ],
  },
  {
    name: "Silk Sarees",
    slug: "Silk",
    subcategories: [
      { name: "Kanchipuram Silk", desc: "Pure South Indian mulberry silk with rich gold zari" },
      { name: "Banarasi Silk", desc: "Opulent Varanasi antique brocades & floral jaal" },
      { name: "Chanderi Silk", desc: "Delicate glossy finish with gossamer touch" },
      { name: "Tussar Silk", desc: "Rich textured natural wild forest silk" },
      { name: "Raw Silk & Matka", desc: "Slubbed rustic texture with regal drape" },
      { name: "Organza Silk", desc: "Crisp, sheer modern luxury drapes" },
    ],
  },
  {
    name: "Designer Sarees",
    slug: "Designer",
    subcategories: [
      { name: "Organza & Tissue", desc: "Shimmering metallic high-sheen drape" },
      { name: "Modern Brocades", desc: "Contemporary motifs with antique zari" },
      { name: "Embroidered Sheer", desc: "Delicate cutwork & thread embroidery" },
      { name: "Sequin Drapes", desc: "Evening glamour & cocktail shimmer" },
      { name: "Floral Pastels", desc: "Chic digital & block print pastels" },
    ],
  },
  {
    name: "Wedding Sarees",
    slug: "Wedding",
    subcategories: [
      { name: "Bridal Kanchipuram", desc: "Royal heirloom wedding drapes in crimson" },
      { name: "Muhurtham Silks", desc: "Auspicious pure gold zari brocades" },
      { name: "Antique Zari Brocade", desc: "Opulent heritage weaves for receptions" },
      { name: "Royal Red & Maroon", desc: "Timeless traditional bridal palette" },
      { name: "Pastel Bridal", desc: "Modern champagne, peach & rose gold heirlooms" },
    ],
  },
  {
    name: "Party Wear",
    slug: "Party Wear",
    subcategories: [
      { name: "Chiffon & Georgette", desc: "Weightless fluid silhouettes that glide" },
      { name: "Cocktail Shimmer", desc: "Dazzling sequin border embellishments" },
      { name: "Ready-to-Wear", desc: "Pre-pleated effortless contemporary style" },
      { name: "Modern Pastels", desc: "Sophisticated monochrome evening tones" },
    ],
  },
];

export function Header() {
  const { cartCount, wishlist, products, categories } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(true);
  const [activeCategorySlug, setActiveCategorySlug] = useState("Cotton");
  const [query, setQuery] = useState("");
  const [authorizedEmail, setAuthorizedEmail] = useState(() => {
    return localStorage.getItem("cf_authorized_email") || "";
  });
  const navigate = useNavigate();
  const location = useLocation();
  const navContainerRef = useRef(null);
  const timeoutRef = useRef(null);

  // Compute dynamic categories merged with store categories and products
  const menuCategories = useMemo(() => {
    const activeStoreCats = (categories || []).filter((c) => c.isActive !== false);

    const subcatLookup = {};
    DEFAULT_CATEGORIES.forEach((dc) => {
      subcatLookup[dc.slug.toLowerCase()] = dc.subcategories;
      subcatLookup[dc.name.toLowerCase()] = dc.subcategories;
    });

    const productSubcatsByCat = {};
    (products || []).forEach((p) => {
      if (!p.category || !p.subcategory) return;
      const key = p.category.toLowerCase().trim();
      if (!productSubcatsByCat[key]) productSubcatsByCat[key] = new Set();
      productSubcatsByCat[key].add(p.subcategory.trim());
    });

    if (activeStoreCats.length > 0) {
      return activeStoreCats.map((sc) => {
        const slugKey = (sc.slug || sc.name).toLowerCase();
        const nameKey = sc.name.toLowerCase();
        const defaultSubs = subcatLookup[slugKey] || subcatLookup[nameKey] || [];
        const adminProductSubs = Array.from(productSubcatsByCat[slugKey] || productSubcatsByCat[nameKey] || []);

        const combined = [...defaultSubs];
        adminProductSubs.forEach((adminSub) => {
          if (!combined.some((item) => item.name.toLowerCase() === adminSub.toLowerCase())) {
            combined.unshift({ name: adminSub, desc: `Exclusive ${sc.name} weave` });
          }
        });

        return {
          name: sc.name,
          slug: sc.slug || sc.name,
          subcategories: combined.length > 0 ? combined : [
            { name: `All ${sc.name}`, desc: `Explore all ${sc.name} weaves` }
          ],
        };
      });
    }

    return DEFAULT_CATEGORIES.map((dc) => {
      const key = dc.slug.toLowerCase();
      const adminProductSubs = Array.from(productSubcatsByCat[key] || []);
      const combined = [...dc.subcategories];
      adminProductSubs.forEach((adminSub) => {
        if (!combined.some((item) => item.name.toLowerCase() === adminSub.toLowerCase())) {
          combined.unshift({ name: adminSub, desc: `Handcrafted ${dc.name} weave` });
        }
      });
      return {
        ...dc,
        subcategories: combined,
      };
    });
  }, [categories, products]);

  // Currently active/hovered category
  const currentCategory = useMemo(() => {
    if (!menuCategories || menuCategories.length === 0) return null;
    const found = menuCategories.find(
      (c) => c.slug.toLowerCase() === (activeCategorySlug || "").toLowerCase()
    );
    return found || menuCategories[0];
  }, [menuCategories, activeCategorySlug]);

  useEffect(() => {
    const handleAuthChange = () => {
      setAuthorizedEmail(localStorage.getItem("cf_authorized_email") || "");
    };
    window.addEventListener("cf_auth_state_changed", handleAuthChange);
    return () => window.removeEventListener("cf_auth_state_changed", handleAuthChange);
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
    }, 180);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Automatically close menus upon navigation
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShopMenuOpen(false);
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
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShopMenuOpen(false);
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
  };

  const isShopActive =
    location.pathname === "/shop" ||
    categorySubmenu.some((c) => c.to === `${location.pathname}${location.search}`);

  return (
    <header ref={navContainerRef} className="sticky top-0 z-50">
      {/* Announcement bar - Onyx Black with Royal Gold Text from Logo */}
      <div className="bg-[#0C0A07] text-[#F5B815] border-b border-[#F5B815]/20">
        <p className="mx-auto max-w-7xl px-4 py-2 text-center text-xs tracking-[0.18em] uppercase font-medium">
          Festive Offer — Free shipping across India on orders above ₹5,000
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
              src="/favicon.png"
              alt="CF Handlooms logo"
              className="h-10 w-10 shrink-0 object-contain sm:h-12 sm:w-12"
            />
            <div className="flex min-w-0 flex-col items-start">
              <span className={theme.typography.cursiveBrand}>
                CF Handlooms
              </span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                Handwoven Heritage
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
              placeholder="Search sarees, fabrics, occasions…"
              className="ml-2 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground focus:ring-0"
            />
          </form>

          <div className="ml-auto flex shrink-0 items-center gap-4 sm:gap-6">
            {authorizedEmail && (
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF8F2] border border-[#E8D8B5] text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="font-semibold text-[#12100D] max-w-[120px] truncate">
                  {authorizedEmail}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("cf_authorized_email");
                    localStorage.removeItem("cf_authorized_user");
                    window.dispatchEvent(new Event("cf_auth_state_changed"));
                  }}
                  className="ml-1 text-[10px] text-[#B87802] hover:text-rose-600 font-semibold cursor-pointer underline"
                  title="Exit / Switch user email"
                >
                  Exit
                </button>
              </div>
            )}
            <Link
              to="/admin/dashboard"
              className="group flex flex-col items-center justify-center gap-1 text-foreground/85 hover:text-[#B87802] transition-colors"
              aria-label="Admin Portal"
              title="Admin Portal"
            >
              <div className="relative">
                <User className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#B87802] ring-1 ring-white" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium tracking-tight text-[#B87802]">
                Admin
              </span>
            </Link>
            <Link
              to="/wishlist"
              className="group relative flex flex-col items-center justify-center gap-1 text-foreground/85 hover:text-[#B87802] transition-colors"
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
              className="group relative flex flex-col items-center justify-center gap-1 text-foreground/85 hover:text-[#B87802] transition-colors"
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
                  `block py-3 font-display text-[16px] tracking-[0.14em] uppercase transition-colors hover:text-[#B87802] ${
                    isActive
                      ? "text-[#B87802] font-semibold border-b-2 border-[#F5B815]"
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
                className={`inline-flex items-center gap-1.5 py-3 font-display text-[16px] tracking-[0.14em] uppercase transition-colors hover:text-[#B87802] ${
                  shopMenuOpen || isShopActive
                    ? "text-[#B87802] font-semibold border-b-2 border-[#F5B815]"
                    : "text-foreground/85 font-medium"
                }`}
                aria-expanded={shopMenuOpen}
                aria-haspopup="true"
              >
                <span>Shop All</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    shopMenuOpen ? "rotate-180 text-[#B87802]" : "text-muted-foreground"
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
                    `block py-3 font-display text-[16px] tracking-[0.14em] uppercase transition-colors hover:text-[#B87802] ${
                      isActive
                        ? "text-[#B87802] font-semibold border-b-2 border-[#F5B815]"
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
        {shopMenuOpen && currentCategory && (
          <div
            id="shop-all-submenu"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="absolute left-0 right-0 top-full z-50 border-b border-[#E8D8B5] bg-[#FAF8F2]/98 shadow-2xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-2"
          >
            {/* Gold highlight accent strip */}
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#F5B815] to-transparent" />

            <div className="mx-auto max-w-5xl px-6 py-6 sm:px-8">
              <div className="flex gap-8 items-start min-h-[300px]">
                
                {/* Left Panel: Categories List */}
                <div className="w-64 shrink-0 border-r border-[#E8D8B5]/80 pr-6">
                  <p className="text-[10px] font-bold tracking-[0.24em] uppercase text-[#B87802] mb-3 px-3">
                    Categories
                  </p>
                  <div className="space-y-1">
                    {menuCategories.map((cat) => {
                      const isHovered = currentCategory.slug.toLowerCase() === cat.slug.toLowerCase();
                      return (
                        <Link
                          key={cat.slug}
                          to={`/shop?category=${encodeURIComponent(cat.slug)}`}
                          onMouseEnter={() => setActiveCategorySlug(cat.slug)}
                          onClick={() => setShopMenuOpen(false)}
                          className={`group flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                            isHovered
                              ? "bg-[#F5B815]/15 text-[#B87802] font-semibold shadow-xs"
                              : "text-foreground/80 hover:bg-[#F5B815]/10 hover:text-[#B87802]"
                          }`}
                        >
                          <span className="group-hover:translate-x-0.5 transition-transform">
                            {cat.name}
                          </span>
                          <ChevronRight
                            className={`h-4 w-4 transition-all ${
                              isHovered
                                ? "text-[#B87802] translate-x-1"
                                : "text-muted-foreground/35 group-hover:text-[#B87802] group-hover:translate-x-0.5"
                            }`}
                          />
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Right Panel: Sub-Categories of Hovered Category */}
                <div className="flex-1 pl-2">
                  <div className="flex items-center justify-between border-b border-[#E8D8B5]/80 pb-3 mb-4">
                    <div>
                      <span className="text-[10px] font-bold tracking-[0.24em] uppercase text-[#B87802]">
                        Sub-Categories
                      </span>
                      <h3 className="font-display text-lg font-semibold text-foreground mt-0.5">
                        {currentCategory.name}
                      </h3>
                    </div>
                    <Link
                      to={`/shop?category=${encodeURIComponent(currentCategory.slug)}`}
                      onClick={() => setShopMenuOpen(false)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#B87802] hover:text-[#0C0A07] transition-colors"
                    >
                      <span>View All {currentCategory.name}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  {/* Sub-Category Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {currentCategory.subcategories.map((sub) => (
                      <Link
                        key={sub.name}
                        to={`/shop?category=${encodeURIComponent(currentCategory.slug)}&subcategory=${encodeURIComponent(sub.name)}`}
                        onClick={() => setShopMenuOpen(false)}
                        className="group rounded-xl border border-[#E8D8B5]/60 bg-white/70 p-3.5 hover:bg-white hover:border-[#B87802] hover:shadow-xs transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-foreground/90 group-hover:text-[#B87802] transition-colors">
                            {sub.name}
                          </p>
                          <ArrowRight className="h-3 w-3 text-[#B87802] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </div>
                        {sub.desc && (
                          <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1 leading-normal">
                            {sub.desc}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>

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
                placeholder="Search sarees…"
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
                    className="text-sm font-semibold tracking-wide uppercase text-[#B87802]"
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
                      className={`h-4 w-4 transition-transform duration-200 ${mobileShopOpen ? "rotate-180 text-[#B87802]" : ""
                        }`}
                    />
                  </button>
                </div>

                {mobileShopOpen && (
                  <ul className="mt-2 space-y-2.5 pl-3 border-l-2 border-[#F5B815]/40 mb-2">
                    {menuCategories.map((cat) => (
                      <li key={cat.slug} className="space-y-1">
                        <Link
                          to={`/shop?category=${encodeURIComponent(cat.slug)}`}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-between text-xs font-semibold uppercase text-foreground/90 hover:text-[#B87802]"
                        >
                          <span>{cat.name}</span>
                          <ChevronRight className="h-3 w-3 text-muted-foreground" />
                        </Link>
                        <div className="flex flex-wrap gap-1.5 pl-1">
                          {cat.subcategories.slice(0, 4).map((sub) => (
                            <Link
                              key={sub.name}
                              to={`/shop?category=${encodeURIComponent(cat.slug)}&subcategory=${encodeURIComponent(sub.name)}`}
                              onClick={() => setMobileOpen(false)}
                              className="text-[11px] text-muted-foreground hover:text-[#B87802] bg-[#FAF8F2] px-2 py-0.5 rounded border border-[#E8D8B5]/50"
                            >
                              {sub.name}
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
