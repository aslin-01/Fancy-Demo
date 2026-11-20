import React, { useState, useMemo, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  X,
} from "lucide-react";
import { formatINR } from "@/data/products";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/common/ProductCard";
import { theme } from "@/theme";
import sareeSilk from "@/assets/saree-silk.jpg";
import sareeCotton from "@/assets/saree-cotton.jpg";
import sareeBridal from "@/assets/saree-bridal.jpg";
import sareeOrganza from "@/assets/saree-organza.jpg";
import sareeChiffon from "@/assets/saree-chiffon.jpg";
import sareeFestive from "@/assets/saree-festive.jpg";

const sampleReviews = [];

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProduct, products, addToCart, toggleWishlist, wishlist } = useStore();

  // Live product state directly fetched from backend to ensure all latest colors & gallery images are loaded
  const [liveProduct, setLiveProduct] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (!id) return;

    const loadLive = async () => {
      try {
        // 1. Try direct ID/SKU lookup from backend
        let res = await fetch(`http://localhost:5000/api/products/${id}`);
        let data = null;
        if (res.ok) {
          const json = await res.json();
          data = json.data || json;
        }

        // 2. If direct lookup failed, try by stored product's SKU or Mongo _id
        if (!data || !data.name) {
          const storeP = getProduct(id) || products.find((p) => String(p.id) === String(id) || String(p._id) === String(id));
          const altId = storeP?._id || storeP?.sku;
          if (altId && altId !== id) {
            const altRes = await fetch(`http://localhost:5000/api/products/${altId}`);
            if (altRes.ok) {
              const altJson = await altRes.json();
              data = altJson.data || altJson;
            }
          }
        }

        // 3. If still not loaded, fetch products list and match by id, sku, or name
        if (!data || !data.name) {
          const listRes = await fetch(`http://localhost:5000/api/products`);
          if (listRes.ok) {
            const listJson = await listRes.json();
            const all = Array.isArray(listJson.data) ? listJson.data : (Array.isArray(listJson) ? listJson : []);
            data = all.find((p) =>
              String(p._id) === String(id) ||
              String(p.id) === String(id) ||
              String(p.sku).toUpperCase() === String(id).toUpperCase() ||
              p.name?.toLowerCase() === decodeURIComponent(id).toLowerCase() ||
              p.name?.toLowerCase() === decodeURIComponent(id).replace(/-/g, ' ').toLowerCase()
            );
          }
        }

        if (data && isMounted) {
          setLiveProduct(data);
        }
      } catch (err) {
        console.warn('Failed to fetch live product:', err);
      }
    };

    loadLive();
    return () => {
      isMounted = false;
    };
  }, [id, products]);

  const product = liveProduct || getProduct(id) || products.find((p) => String(p.id) === String(id) || String(p._id) === String(id));

  const [qty, setQty] = useState(1);
  const [pin, setPin] = useState("");
  const [pinResult, setPinResult] = useState(null);
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Consolidated all available images for the product (from gallery, images, color variants, primary image)
  const allGallery = useMemo(() => {
    if (!product) return [];
    const list = [];
    if (Array.isArray(product.gallery)) {
      product.gallery.forEach((img) => img && !list.includes(img) && list.push(img));
    }
    if (Array.isArray(product.images)) {
      product.images.forEach((img) => img && !list.includes(img) && list.push(img));
    }
    if (Array.isArray(product.colors)) {
      product.colors.forEach((c) => {
        if (Array.isArray(c?.images)) {
          c.images.forEach((img) => img && !list.includes(img) && list.push(img));
        }
      });
    }
    if (product.image && !list.includes(product.image)) {
      list.unshift(product.image);
    }
    return list;
  }, [product]);

  const colorsList = useMemo(() => {
    if (!product) return [];

    // 1. If product.colors is an array with color variants
    if (Array.isArray(product.colors) && product.colors.length > 0) {
      return product.colors.map((c, i) => {
        let imgs = Array.isArray(c.images) ? c.images.filter(Boolean) : [];
        if (imgs.length === 0) {
          if (product.colors.length === 1) {
            imgs = allGallery;
          } else if (allGallery[i]) {
            imgs = [allGallery[i]];
          } else if (allGallery.length > 0) {
            imgs = allGallery;
          }
        }
        return {
          id: c.id || `col_${i}`,
          name: c.name || c.code || `Color ${i + 1}`,
          code: c.code || (c.name?.startsWith('#') ? c.name : null),
          images: imgs,
        };
      });
    }

    // 2. Fallback: product.color is a string like "#5B4F39, #2279A5"
    if (product.color && typeof product.color === 'string') {
      const parts = product.color
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      return parts.map((col, idx) => ({
        id: `col_${idx}`,
        name: col,
        code: col.startsWith('#') ? col : null,
        images: allGallery[idx] ? [allGallery[idx]] : (idx === 0 && product.image ? [product.image] : []),
      }));
    }

    return [];
  }, [product, allGallery]);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // When product or colors change, preserve currently selected color or select the first
  useEffect(() => {
    if (colorsList.length > 0) {
      setSelectedColor((current) => {
        if (current && colorsList.some((c) => (c.name && c.name === current.name) || (c.id && c.id === current.id))) {
          return colorsList.find((c) => (c.name && c.name === current.name) || (c.id && c.id === current.id)) || current;
        }
        return colorsList[0];
      });
    } else {
      setSelectedColor(null);
    }
  }, [product?.id, product?._id, colorsList]);

  // Determine available images for the active color or general product gallery.
  // First image is the primary main image, followed by all balance added images.
  const activeImages = useMemo(() => {
    if (!product) return [];

    // 1. If the selected color has multiple photos attached directly:
    if (selectedColor && Array.isArray(selectedColor.images) && selectedColor.images.length > 1) {
      return selectedColor.images.filter(Boolean);
    }

    // 2. If the selected color has 1 photo:
    if (selectedColor && Array.isArray(selectedColor.images) && selectedColor.images.length === 1) {
      const primary = selectedColor.images[0];
      if (allGallery.length > 1) {
        const list = [primary];
        allGallery.forEach((img) => {
          if (img && !list.includes(img)) list.push(img);
        });
        return list;
      }
      return [primary];
    }

    // 3. Fallback: all gallery photos
    if (allGallery.length > 0) {
      return allGallery;
    }

    return product.image ? [product.image] : [];
  }, [product, selectedColor, allGallery]);

  // When selectedColor changes, immediately switch to that color's first photo
  useEffect(() => {
    if (selectedColor && Array.isArray(selectedColor.images) && selectedColor.images.length > 0) {
      setSelectedImage(selectedColor.images[0]);
    } else {
      setSelectedImage(activeImages[0] || product?.image || null);
    }
  }, [selectedColor]);

  // Keyboard navigation & body scroll lock for the image modal
  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      } else if (e.key === "ArrowLeft" && activeImages.length > 1) {
        setModalImageIndex((prev) =>
          prev === 0 ? activeImages.length - 1 : prev - 1
        );
      } else if (e.key === "ArrowRight" && activeImages.length > 1) {
        setModalImageIndex((prev) =>
          prev === activeImages.length - 1 ? 0 : prev + 1
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isModalOpen, activeImages]);

  const currentDisplayImage =
    selectedImage || activeImages[0] || product?.image || sareeSilk;

  const currentId = String(product?.id || product?._id || '');
  const currentCategory = String(product?.category || '').trim().toLowerCase();

  const related = useMemo(() => {
    if (!product) return [];
    // 1. Other products from active store list
    const otherProducts = products.filter(
      (p) => String(p.id || p._id || '') !== currentId
    );

    // Matching category first
    const sameCat = otherProducts.filter(
      (p) => String(p.category || '').trim().toLowerCase() === currentCategory
    );
    const diffCat = otherProducts.filter(
      (p) => String(p.category || '').trim().toLowerCase() !== currentCategory
    );

    const combined = [...sameCat, ...diffCat];
    if (combined.length >= 4) {
      return combined.slice(0, 4);
    }

    // Curated catalog fallback items so Related Products is always populated
    const fallbackCurated = [
      {
        id: "cf-silk-heritage-maroon",
        name: "Kanchipuram Pure Silk — Heritage Maroon",
        category: "Silk",
        fabric: "Pure Mulberry Silk",
        price: 18499,
        mrp: 24999,
        rating: 4.9,
        reviews: 42,
        image: sareeSilk,
        inStock: true,
      },
      {
        id: "cf-wedding-bridal-red",
        name: "Bridal Wedding Saree — Royal Red Zari",
        category: "Wedding",
        fabric: "Pure Silk with Gold Zari",
        price: 28999,
        mrp: 35999,
        rating: 5.0,
        reviews: 68,
        image: sareeBridal,
        inStock: true,
        isBestSeller: true,
      },
      {
        id: "cf-organza-mint-green",
        name: "Organza Silk Saree — Mint Green",
        category: "Designer",
        fabric: "Shimmer Organza",
        price: 8999,
        mrp: 11999,
        rating: 4.7,
        reviews: 31,
        image: sareeOrganza,
        inStock: true,
        isNew: true,
      },
      {
        id: "cf-cotton-chettinad-gold",
        name: "Handloom Cotton Saree — Mustard & Temple Border",
        category: "Cotton",
        fabric: "Chettinad Cotton",
        price: 3499,
        mrp: 4499,
        rating: 4.8,
        reviews: 85,
        image: sareeCotton,
        inStock: true,
      },
      {
        id: "cf-chiffon-rose-pink",
        name: "Chiffon Georgette — Rose Pink Elegance",
        category: "Designer",
        fabric: "Chiffon Georgette",
        price: 6499,
        mrp: 8499,
        rating: 4.6,
        reviews: 24,
        image: sareeChiffon,
        inStock: true,
      },
      {
        id: "cf-festive-banarasi-gold",
        name: "Festive Banarasi Saree — Sunset Gold Brocade",
        category: "Silk",
        fabric: "Banarasi Brocade",
        price: 13999,
        mrp: 17999,
        rating: 4.9,
        reviews: 57,
        image: sareeFestive,
        inStock: true,
        isBestSeller: true,
      },
    ];

    const curatedMatching = fallbackCurated.filter(
      (c) => c.category.toLowerCase() === currentCategory && c.id !== currentId
    );
    const curatedOthers = fallbackCurated.filter(
      (c) => c.category.toLowerCase() !== currentCategory && c.id !== currentId
    );

    const needed = 4 - combined.length;
    const additional = [...curatedMatching, ...curatedOthers]
      .filter((c) => !combined.some((p) => String(p.id || p._id) === c.id))
      .slice(0, needed);

    return [...combined, ...additional];
  }, [products, currentId, currentCategory, product]);

  if (!product) {
    return (
      <div className={theme.layout.emptyState}>
        <h1 className={theme.typography.h1Page}>Saree not found</h1>
        <p className="mt-3 text-muted-foreground">
          This piece may have sold out or been moved.
        </p>
        <Link
          to="/shop"
          className={`mt-6 ${theme.buttons.primary}`}
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const productId = product.id || product._id;
  const wished = wishlist.includes(productId);
  const discount = product.mrp && product.mrp > product.price
    ? Math.round((1 - product.price / product.mrp) * 100)
    : 0;

  const checkPin = (e) => {
    e.preventDefault();
    if (/^\d{6}$/.test(pin)) {
      setPinResult(
        `Delivery available to ${pin} — estimated 3–5 business days.`
      );
    } else {
      setPinResult("Please enter a valid 6-digit PIN code.");
    }
  };

  const handleAdd = () => {
    addToCart(productId, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url: window.location.href });
      } catch (err) {
        // User dismissed share dialog
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.warn('Share copy failed:', err);
      }
    }
  };

  return (
    <div className={theme.layout.pageContainer}>
      <nav className={`mb-8 ${theme.typography.metaMuted}`}>
        <Link to="/" className="hover:text-[#B87802] transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-[#B87802] transition-colors">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2 items-start">
        {/* Gallery */}
        <div className="lg:sticky lg:top-[180px] lg:self-start relative w-full flex gap-3 sm:gap-4 items-start will-change-transform [transform:translateZ(0)]">

          {/* Gallery Thumbnails Strip on the left side of the main image */}
          {activeImages.length > 1 && (
            <div className="flex flex-col gap-2.5 shrink-0 w-14 sm:w-18">
              {activeImages.map((imgUrl, idx) => {
                const isSelected = currentDisplayImage === imgUrl;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(imgUrl)}
                    onMouseEnter={() => setSelectedImage(imgUrl)}
                    className={`relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-lg border-2 bg-card transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#B87802] ring-2 ring-[#B87802]/40 shadow-sm opacity-100 scale-102"
                        : "border-border hover:border-[#B87802]/60 opacity-70 hover:opacity-100"
                    }`}
                    title={`Image ${idx + 1}`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* Main Image */}
          <div
            className="group relative flex-1 min-w-0 aspect-[4/5] max-h-[640px] overflow-hidden rounded-lg border border-border/80 flex items-center justify-center cursor-zoom-in"
            onClick={() => {
              const currentIdx = activeImages.indexOf(currentDisplayImage);
              setModalImageIndex(currentIdx >= 0 ? currentIdx : 0);
              setIsModalOpen(true);
            }}
          >
            <img
              src={currentDisplayImage}
              alt={product.name}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 will-change-transform [transform:translateZ(0)]"
            />

            {/* Wishlist & Share buttons overlaid on top of the main image */}
            <div
              className="absolute top-4 right-4 z-10 flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(productId);
                }}
                aria-label="Toggle wishlist"
                className={`h-9 w-9 grid place-items-center rounded-full border shadow-sm transition-all duration-200 active:scale-95 cursor-pointer ${
                  wished
                    ? "border-[#B87802] bg-white text-[#B87802]"
                    : "border-border/80 bg-white/95 hover:border-[#B87802] text-foreground/70 hover:text-[#B87802]"
                }`}
              >
                <Heart className={`h-4 w-4 ${wished ? "fill-[#B87802] text-[#B87802]" : ""}`} />
              </button>
              <button
                type="button"
                aria-label="Share product"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare();
                }}
                title={copied ? "Link copied!" : "Share product"}
                className="relative h-9 w-9 grid place-items-center rounded-full border border-border/80 bg-white/95 hover:border-[#B87802] text-foreground/70 hover:text-[#B87802] shadow-sm transition-all duration-200 active:scale-95 cursor-pointer"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
                {copied && (
                  <span className="absolute top-11 right-0 text-[10px] font-medium bg-[#0C0A07] text-[#FAF8F2] px-2 py-0.5 rounded shadow-md whitespace-nowrap">
                    Link copied!
                  </span>
                )}
              </button>
            </div>

            {discount > 0 && (
              <span className={`absolute top-4 left-4 ${theme.badges.discount}`}>
                {discount}% OFF
              </span>
            )}
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="flex flex-col divide-y divide-border/60">

          {/* 1. Identity */}
          <div className="pb-5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B87802]">
                {product.category || "Handloom"} Collection
              </span>
              {product.inStock ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  Out of Stock
                </span>
              )}
            </div>
            <div className="mt-2 flex items-start justify-between gap-4">
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-foreground leading-snug tracking-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-1 shrink-0 mt-1">
                <Star className="h-3.5 w-3.5 fill-[#F5B815] text-[#F5B815]" />
                <span className="text-xs font-semibold text-foreground">{product.rating || 4.9}</span>
                <span className="text-xs text-muted-foreground">({product.reviews || 42})</span>
              </div>
            </div>
          </div>

          {/* 2. Product Details */}
          <div className="py-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">Product Details</p>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">Fabric</dt>
                <dd className="mt-0.5 font-medium text-foreground text-xs">{product.fabric || "—"}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">Color</dt>
                <dd className="mt-1 flex items-center gap-1 flex-wrap">
                  {colorsList.length > 0 ? (
                    colorsList.map((c, i) => (
                      <span
                        key={i}
                        className="h-3.5 w-3.5 rounded-full border border-black/20 shadow-xs inline-block"
                        style={{ backgroundColor: c.code || (c.name?.startsWith('#') ? c.name : null) || c.name || "#B87802" }}
                      />
                    ))
                  ) : product.color && product.color.startsWith('#') ? (
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-black/20 shadow-xs inline-block"
                      style={{ backgroundColor: product.color }}
                    />
                  ) : (
                    <span className="font-medium text-foreground text-xs">{product.color || "—"}</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">Occasion</dt>
                <dd className="mt-0.5 font-medium text-foreground text-xs">{product.occasion || "—"}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">Length</dt>
                <dd className="mt-0.5 font-medium text-foreground text-xs">{product.length || "—"}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">Blouse Piece</dt>
                <dd className="mt-0.5 font-medium text-foreground text-xs">{product.blousePiece || "—"}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">Wash Care</dt>
                <dd className="mt-0.5 font-medium text-foreground text-xs">{product.washCare || "—"}</dd>
              </div>
            </dl>
          </div>

          {/* 3. Description */}
          {product.description && (
            <div className="py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-1.5">Description</p>
              <p className="text-sm leading-relaxed text-foreground/80">
                {product.description}
              </p>
            </div>
          )}

          {/* 4. Colors */}
          {colorsList.length > 0 && (
            <div className="py-5">
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Available Color{colorsList.length > 1 ? "s" : ""}
                </p>
                <span className="text-[10px] text-muted-foreground">
                  {colorsList.length} shade{colorsList.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {colorsList.map((col, idx) => {
                  const isSelected =
                    (selectedColor?.id && col?.id && selectedColor.id === col.id) ||
                    (selectedColor?.name && col?.name && selectedColor.name === col.name) ||
                    (!selectedColor && idx === 0);
                  const colorHex = col.code || (col.name?.startsWith('#') ? col.name : null) || col.name || "#B87802";
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedColor(col);
                        if (col.images && col.images.length > 0) {
                          setSelectedImage(col.images[0]);
                        } else if (allGallery[idx]) {
                          setSelectedImage(allGallery[idx]);
                        } else if (allGallery[0]) {
                          setSelectedImage(allGallery[0]);
                        }
                      }}
                      aria-label={`Color option ${idx + 1}`}
                      className={`h-8 w-8 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center p-0.5 ${
                        isSelected
                          ? "border-[#B87802] ring-2 ring-[#B87802]/40 scale-110 shadow-sm"
                          : "border-border hover:border-[#B87802]/60 hover:scale-105"
                      }`}
                    >
                      <span
                        className="h-full w-full rounded-full border border-black/15 shadow-inner"
                        style={{ backgroundColor: colorHex }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. Price */}
          <div className="py-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-1.5">Price</p>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="font-body text-2xl sm:text-3xl font-bold text-black tracking-tight">
                {formatINR(product.price)}
              </span>
              {product.mrp && Number(product.mrp) > Number(product.price) && (
                <>
                  <span className="text-sm text-muted-foreground line-through decoration-1">
                    {formatINR(product.mrp)}
                  </span>
                  {discount > 0 && (
                    <span className="rounded bg-[#0C0A07] text-[#F5B815] border border-[#F5B815]/30 px-2 py-0.5 text-[11px] font-bold tracking-wide">
                      {discount}% OFF
                    </span>
                  )}
                </>
              )}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Inclusive of all taxes · Free delivery on prepaid orders
            </p>
          </div>

          {/* 6. Quantity + Actions */}
          <div className="py-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Select Quantity
              </p>
              {/* Pill Stepper */}
              <div className="inline-flex items-center rounded-full border border-border bg-card h-9 px-1.5 gap-1">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="h-6 w-6 rounded-full flex items-center justify-center text-foreground/75 hover:bg-[#F3EBDD] hover:text-[#B87802] transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-7 text-center text-xs font-semibold text-foreground">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty(qty + 1)}
                  className="h-6 w-6 rounded-full flex items-center justify-center text-foreground/75 hover:bg-[#F3EBDD] hover:text-[#B87802] transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Add to Cart */}
              <button
                type="button"
                onClick={handleAdd}
                disabled={!product.inStock}
                className="h-10.5 inline-flex items-center justify-center gap-2 rounded-full border border-[#B87802] bg-card text-[#996300] text-xs font-semibold tracking-[0.1em] uppercase transition-all duration-200 hover:bg-[#F3EBDD]/70 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              >
                {added ? (
                  <><Check className="h-3.5 w-3.5" /><span>Added!</span></>
                ) : (
                  <><ShoppingCart className="h-3.5 w-3.5 stroke-[2]" /><span>Add to Cart</span></>
                )}
              </button>

              {/* Buy Now */}
              <button
                type="button"
                onClick={() => { addToCart(productId, qty); navigate("/checkout"); }}
                disabled={!product.inStock}
                className="h-10.5 inline-flex items-center justify-center rounded-full bg-[#B87802] text-white text-xs font-semibold tracking-[0.1em] uppercase transition-all duration-200 hover:bg-[#996300] hover:shadow-md active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
              >
                Buy It Now
              </button>
            </div>
          </div>

          {/* 8. Trust Badges */}
          <div className="pt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
            <div className="flex items-center gap-2">
              <Truck className="h-3.5 w-3.5 text-[#B87802] shrink-0" />
              <div>
                <span className="font-semibold text-foreground block text-[11px]">Free Shipping</span>
                <span className="text-[10px] text-muted-foreground">Orders above ₹5,000</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-3.5 w-3.5 text-[#B87802] shrink-0" />
              <div>
                <span className="font-semibold text-foreground block text-[11px]">100% Authentic</span>
                <span className="text-[10px] text-muted-foreground">Handcrafted quality</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-[#B87802] shrink-0" />
              <div>
                <span className="font-semibold text-foreground block text-[11px]">Secure Checkout</span>
                <span className="text-[10px] text-muted-foreground">UPI, Cards, NetBanking</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-3.5 w-3.5 text-[#B87802] shrink-0" />
              <div>
                <span className="font-semibold text-foreground block text-[11px]">Exchange Available</span>
                <span className="text-[10px] text-muted-foreground">No return available</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Reviews */}
      <section className="mt-20">
        <h2 className={theme.typography.h2Section}>Customer Reviews</h2>
        <div className={theme.dividers.goldLeft} />
        {sampleReviews.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {sampleReviews.map((r) => (
              <div key={r.name} className={theme.cards.padded}>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < r.rating ? "fill-gold text-gold" : "text-border"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                  "{r.text}"
                </p>
                <p className="mt-3 text-sm font-medium">{r.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-muted-foreground">
            No customer reviews yet. Be the first to review this piece!
          </p>
        )}
      </section>

      {/* Related */}
      <section className="mt-20">
        <h2 className={theme.typography.h2Section}>You May Also Love</h2>
        <div className={theme.dividers.goldLeft} />
        <div className={`mt-8 ${theme.layout.grid4Cols}`}>
          {related.map((p) => (
            <ProductCard key={p.id || p._id} product={p} />
          ))}
        </div>
      </section>

      {/* Flipkart-style Image Viewer Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/90 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Top Bar: Title, Counter & Close Button */}
          <div
            className="w-full flex items-center justify-between text-white pb-2 max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="font-display font-medium text-sm sm:text-base text-white/90 truncate max-w-xs sm:max-w-md">
                {product.name}
              </span>
              {activeImages.length > 1 && (
                <span className="text-xs bg-white/15 px-2.5 py-0.5 rounded-full text-[#F5B815] font-mono">
                  {modalImageIndex + 1} / {activeImages.length}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Center Area: Prev, Main Image, Next */}
          <div
            className="relative flex-1 w-full max-w-6xl flex items-center justify-center my-auto min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            {activeImages.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setModalImageIndex((prev) =>
                    prev === 0 ? activeImages.length - 1 : prev - 1
                  )
                }
                className="absolute left-2 sm:left-4 z-10 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-[#B87802] text-white border border-white/20 hover:border-transparent transition-all shadow-lg cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            )}

            <div className="h-full w-full flex items-center justify-center p-2 sm:p-4">
              <img
                src={activeImages[modalImageIndex] || currentDisplayImage}
                alt={`${product.name} full view`}
                className="max-h-[72vh] max-w-full object-contain rounded-md shadow-2xl transition-all duration-300"
              />
            </div>

            {activeImages.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setModalImageIndex((prev) =>
                    prev === activeImages.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-2 sm:right-4 z-10 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-[#B87802] text-white border border-white/20 hover:border-transparent transition-all shadow-lg cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            )}
          </div>

          {/* Bottom: Thumbnails Carousel inside Modal */}
          {activeImages.length > 1 && (
            <div
              className="w-full max-w-3xl flex items-center justify-center gap-2 overflow-x-auto py-2 px-4"
              onClick={(e) => e.stopPropagation()}
            >
              {activeImages.map((imgUrl, idx) => {
                const isSelected = modalImageIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setModalImageIndex(idx)}
                    className={`relative h-14 w-12 sm:h-16 sm:w-14 shrink-0 overflow-hidden rounded-md border-2 bg-black/40 transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#F5B815] ring-2 ring-[#F5B815]/50 scale-105 opacity-100"
                        : "border-white/30 hover:border-white/70 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="h-full w-full object-contain p-0.5"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductDetailPage;
