import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Heart,
  Menu,
  Search,
  ShoppingCart,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { products } from "@/data/products";
import { theme } from "@/theme";
import hero from "@/assets/hero.jpg";
import sareeSilk from "@/assets/saree-silk.jpg";
import sareeCotton from "@/assets/saree-cotton.jpg";
import sareeDesigner from "@/assets/saree-designer.jpg";
import sareeBridal from "@/assets/saree-bridal.jpg";
import sareeOrganza from "@/assets/saree-organza.jpg";

const mainNavLinks = [
  { label: "Home", to: "/" },
  // "Shop All" with sub-menu is inserted between Home and Offers
  { label: "Offers", to: "/festive" },
];

const categorySubmenu = [
  {
    name: "All Sarees",
    desc: "Complete catalog of authentic handloom weaves",
    to: "/shop",
    badge: "All",
    image: hero,
  },
  {
    name: "Silk Sarees",
    desc: "Kanchipuram & Banarasi pure silk brocades",
    to: "/shop?category=Silk",
    badge: "Pure Silk",
    image: sareeSilk,
  },
  {
    name: "Cotton Sarees",
    desc: "Breathable all-day handloom comfort",
    to: "/shop?category=Cotton",
    badge: "Handloom",
    image: sareeCotton,
  },
  {
    name: "Designer Sarees",
    desc: "Modern aesthetics with opulent zari accents",
    to: "/shop?category=Designer",
    badge: "Designer",
    image: sareeOrganza,
  },
  {
    name: "Wedding Sarees",
    desc: "Regal bridal heirlooms with antique gold zari",
    to: "/shop?category=Wedding",
    badge: "Bridal",
    image: sareeBridal,
  },
  {
    name: "Party Wear",
    desc: "Effortless shimmer, sequins & fluid drapes",
    to: "/shop?category=Party Wear",
    badge: "Party",
    image: sareeDesigner,
  },
];

export function Header() {
  const { cartCount, wishlist } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(true);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const navContainerRef = useRef(null);
  const timeoutRef = useRef(null);

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
          Festive Offer — Free shipping across India on orders above ₹2,999
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
        {shopMenuOpen && (
          <div
            id="shop-all-submenu"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="absolute left-0 right-0 top-full z-50 border-b border-[#F5B815]/30 bg-background/98 shadow-2xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-2"
          >
            {/* Gold highlight accent strip */}
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#F5B815] to-transparent" />

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
              {/* Sub-menu Top Bar */}
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F5B815]/20 text-[#B87802]">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#B87802]">
                      Shop by Category
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Explore authentic handlooms or browse our complete collection
                    </p>
                  </div>
                </div>

                <Link
                  to="/shop"
                  onClick={() => setShopMenuOpen(false)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#B87802] to-[#996300] px-4 py-1.5 text-xs font-medium tracking-wider text-white shadow-sm shadow-[#B87802]/30 transition-all hover:from-[#C98704] hover:to-[#A86E02] hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  View All Products ({products.length})
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Sub-menu Category Cards Grid */}
              <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
                {categorySubmenu.map((cat) => (
                  <Link
                    key={cat.name}
                    to={cat.to}
                    onClick={() => setShopMenuOpen(false)}
                    className="group relative flex flex-col overflow-hidden rounded-lg border border-border/60 bg-card p-2 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#F5B815]/50 hover:shadow-lg hover:shadow-[#F5B815]/10"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-muted">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
                      />
                      <span className="absolute top-1.5 right-1.5 rounded bg-[#0C0A07]/80 px-1.5 py-0.5 text-[9px] font-medium tracking-wider text-[#F5B815] uppercase backdrop-blur-sm">
                        {cat.badge}
                      </span>
                    </div>
                    <div className="mt-2.5 flex-1">
                      <p className="text-xs font-semibold text-foreground group-hover:text-[#B87802] transition-colors">
                        {cat.name}
                      </p>
                      <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground line-clamp-2">
                        {cat.desc}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Quick filters footer strip */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-muted/40 px-4 py-2.5 text-xs border border-border/40">
                <span className="text-muted-foreground text-[11px] font-medium uppercase tracking-wider">
                  Quick Filters:
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to="/shop?sort=newest"
                    onClick={() => setShopMenuOpen(false)}
                    className="text-[11px] text-foreground/80 hover:text-[#B87802] transition-colors font-medium"
                  >
                    ✦ New Arrivals
                  </Link>
                  <span className="text-border">•</span>
                  <Link
                    to="/shop?sort=popularity"
                    onClick={() => setShopMenuOpen(false)}
                    className="text-[11px] text-foreground/80 hover:text-[#B87802] transition-colors font-medium"
                  >
                    ✦ Best Sellers
                  </Link>
                  <span className="text-border">•</span>
                  <Link
                    to="/shop?occasion=Festive"
                    onClick={() => setShopMenuOpen(false)}
                    className="text-[11px] text-foreground/80 hover:text-[#B87802] transition-colors font-medium"
                  >
                    ✦ Festive Specials
                  </Link>
                  <span className="text-border">•</span>
                  <Link
                    to="/shop?category=Wedding"
                    onClick={() => setShopMenuOpen(false)}
                    className="text-[11px] text-foreground/80 hover:text-[#B87802] transition-colors font-medium"
                  >
                    ✦ Bridal Collection
                  </Link>
                  <span className="text-border">•</span>
                  <Link
                    to="/shop"
                    onClick={() => setShopMenuOpen(false)}
                    className="text-[11px] font-semibold text-[#B87802] hover:text-[#F5B815] transition-colors"
                  >
                    ✦ Browse All Sarees →
                  </Link>
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
                  <ul className="mt-2 space-y-1.5 pl-3 border-l-2 border-[#F5B815]/40 mb-2">
                    {categorySubmenu.map((cat) => (
                      <li key={cat.name}>
                        <Link
                          to={cat.to}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-between py-1.5 text-xs text-foreground/80 hover:text-[#B87802]"
                        >
                          <span>{cat.name}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {cat.badge}
                          </span>
                        </Link>
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
