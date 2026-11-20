import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { hero } from "@/data/products";
import sareeBridal from "@/assets/saree-bridal.jpg";
import sareeFestive from "@/assets/saree-festive.jpg";
import sareeSilk from "@/assets/saree-silk.jpg";
import sareeCotton from "@/assets/saree-cotton.jpg";
import sareeOrganza from "@/assets/saree-organza.jpg";
import sareeChiffon from "@/assets/saree-chiffon.jpg";
import sareeDesigner from "@/assets/saree-designer.jpg";
import { theme } from "@/theme";

const API_URL = "http://localhost:5000/api";

const PRESET_MAP = {
  hero: hero,
  bridal: sareeBridal,
  festive: sareeFestive,
  silk: sareeSilk,
  cotton: sareeCotton,
  organza: sareeOrganza,
  chiffon: sareeChiffon,
  designer: sareeDesigner,
};

const DEFAULT_SLIDES = [
  {
    id: 1,
    tag: "HANDWOVEN HERITAGE",
    cursive: "Handwoven Heritage",
    title: "Elegance Woven in Every Thread",
    description:
      "Discover heirloom sarees from India's finest weaving clusters — silks, cottons, and bridal treasures crafted by master artisans.",
    image: hero,
    alt: "Woman draped in a maroon Kanchipuram silk saree with gold zari",
    primaryCta: { label: "Shop Now", to: "/shop" },
    secondaryCta: { label: "Explore Silks", to: "/shop?category=Silk" },
  },
  {
    id: 2,
    tag: "BRIDAL COUTURE",
    cursive: "Royal Wedding Collection",
    title: "Timeless Bridal Opulence & Pure Zari",
    description:
      "Opulent Kanchipuram and Banarasi drapes woven with pure gold and silver zari brocade for life's most unforgettable moments.",
    image: sareeBridal,
    alt: "Royal bridal saree draped in pure gold brocade",
    primaryCta: { label: "Bridal Collection", to: "/shop?category=Wedding" },
    secondaryCta: { label: "Heirloom Silks", to: "/shop?category=Silk" },
  },
  {
    id: 3,
    tag: "FESTIVE SPLENDOUR",
    cursive: "Celebrations & Splendour",
    title: "Festive Drapes with Golden Luster",
    description:
      "Luminous Banarasi georgettes, royal tissue silks, and diaphanous weaves designed to radiate timeless celebratory charm.",
    image: sareeFestive,
    alt: "Festive celebration saree with golden floral motifs",
    primaryCta: { label: "Shop Festive", to: "/shop?occasion=Festive" },
    secondaryCta: { label: "New Arrivals", to: "/shop?sort=newest" },
  },
  {
    id: 4,
    tag: "ARTISANAL PURITY",
    cursive: "Pure Mulberry Silks",
    title: "Six Yards of Majestic Indian Grace",
    description:
      "Centuries of weaving mastery passed down through generations of master weavers, brought directly to your cherished wardrobe.",
    image: sareeSilk,
    alt: "Authentic mulberry silk saree with temple border",
    primaryCta: { label: "Explore Collection", to: "/shop" },
    secondaryCta: { label: "Best Sellers", to: "/shop" },
  },
];

// Helper to resolve preset images or custom URLs / Base64
function resolveBannerImage(img) {
  if (!img) return hero;
  if (PRESET_MAP[img]) return PRESET_MAP[img];
  return img;
}

export function HeroBanner() {
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const sliderRef = useRef(null);

  // Fetch live banners from backend
  useEffect(() => {
    let isMounted = true;
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${API_URL}/banners?all=false`, {
          cache: "no-store",
          signal: AbortSignal.timeout(4000),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            const formatted = json.data.map((b, idx) => ({
              id: b._id || b.id || idx + 1,
              tag: b.tag || "HANDWOVEN HERITAGE",
              cursive: b.cursive || "",
              title: b.title || "Elegance Woven in Every Thread",
              description: b.description || "",
              image: resolveBannerImage(b.image),
              alt: b.alt || b.title || "CF Handlooms Saree",
              primaryCta: b.primaryCta || { label: "Shop Now", to: "/shop" },
              secondaryCta: b.secondaryCta || { label: "Explore Silks", to: "/shop?category=Silk" },
            }));
            if (isMounted) {
              setSlides(formatted);
            }
          }
        }
      } catch (err) {
        // Fallback to default slides if backend is unreachable
      }
    };

    fetchBanners();
    return () => {
      isMounted = false;
    };
  }, []);

  const slideCount = slides.length || 1;

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  // Autoplay timer
  useEffect(() => {
    if (isPaused || slideCount <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide, slideCount]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevSlide, nextSlide]);

  // Touch swipe support
  const minSwipeDistance = 45;
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
  };

  return (
    <section
      id="hero"
      ref={sliderRef}
      className="relative overflow-hidden bg-[#0C0A07] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="Featured Collections Hero Slider"
    >
      {/* Slides Container */}
      <div className="relative h-[72vh] min-h-[520px] w-full overflow-hidden">
        {slides.map((slide, index) => {
          const isActive = index === current;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={!isActive}
            >
              {/* Background Image with Slow Ambient Ken Burns Scale */}
              <img
                src={slide.image}
                alt={slide.alt}
                width={1920}
                height={1080}
                className={`h-full w-full object-cover object-top transition-transform duration-[7000ms] ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
                loading={index === 0 ? "eager" : "lazy"}
              />

              {/* Cinematic Dual Gradients for Premium Readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0C0A07]/90 via-[#0C0A07]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A07]/80 via-transparent to-[#0C0A07]/30" />

              {/* Text & CTAs Content Overlay */}
              <div className="absolute inset-0 flex items-center">
                <div className="mx-auto w-full max-w-7xl px-6 sm:px-12">
                  <div
                    className={`max-w-xl transition-all duration-700 delay-150 ${
                      isActive
                        ? "translate-y-0 opacity-100"
                        : "translate-y-4 opacity-0"
                    }`}
                  >
                    {/* Badge / Tag */}
                    {slide.tag && (
                      <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-[#0C0A07]/65 px-3.5 py-1 text-xs tracking-widest text-gold backdrop-blur-md mb-3 shadow-md">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                        <span>{slide.tag}</span>
                      </div>
                    )}

                    {/* Cursive Eyebrow */}
                    {slide.cursive && (
                      <p className={theme.typography.cursiveBanner}>
                        {slide.cursive}
                      </p>
                    )}

                    {/* Main Headline */}
                    <h1 className={`mt-2 ${theme.typography.h1Hero}`}>
                      {slide.title}
                    </h1>

                    {/* Subtitle / Description */}
                    {slide.description && (
                      <p className="mt-4 text-base leading-relaxed text-primary-foreground/90 sm:text-lg">
                        {slide.description}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-wrap gap-4">
                      {slide.primaryCta && slide.primaryCta.label && (
                        <Link
                          to={slide.primaryCta.to || "/shop"}
                          className={theme.buttons.primary}
                        >
                          {slide.primaryCta.label}
                        </Link>
                      )}
                      {slide.secondaryCta && slide.secondaryCta.label && (
                        <Link
                          to={slide.secondaryCta.to || "/shop"}
                          className={theme.buttons.outlineLight}
                        >
                          {slide.secondaryCta.label}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows (only show if multiple slides) */}
      {slideCount > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#0C0A07]/50 text-white backdrop-blur-md transition-all duration-200 hover:border-gold hover:bg-gold hover:text-[#0C0A07] hover:scale-110 active:scale-95 shadow-xl focus:outline-none focus:ring-2 focus:ring-gold"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 -ml-0.5" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#0C0A07]/50 text-white backdrop-blur-md transition-all duration-200 hover:border-gold hover:bg-gold hover:text-[#0C0A07] hover:scale-110 active:scale-95 shadow-xl focus:outline-none focus:ring-2 focus:ring-gold"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 -mr-0.5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {slides.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrent(dotIdx)}
                className={`transition-all duration-300 rounded-full ${
                  dotIdx === current
                    ? "w-8 h-2 bg-gold"
                    : "w-2 h-2 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default HeroBanner;
