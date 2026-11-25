import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { theme } from "@/theme";

// ─── HARDCODED MADHA FANCY BANNER SLIDES ──────────────────────────────────────
// Using the 4 uploaded high-resolution luxury jewellery banners
const SLIDES = [
  {
    id: 1,
    tag: "PREMIUM 1-GRAM GOLD COVERING",
    cursive: "Madha Fancy & Gold Covering",
    title: "Royal Bridal Jewellery from Erode Fort",
    description:
      "Explore our exclusive range of 1-gram micro gold plated harams, kemp bridal sets, and antique temple ornaments. Crafted for every South Indian bride.",
    image: "/banners/banner-1.jpg",
    alt: "Ruby and diamond bridal choker necklace set on red velvet",
    primaryCta: { label: "Shop Bridal Sets", to: "/shop?category=Bridal%20Sets" },
    secondaryCta: { label: "View All Jewellery", to: "/shop" },
  },
  {
    id: 2,
    tag: "DAILY WEAR & FESTIVE ELEGANCE",
    cursive: "Guaranteed Long-Life Plating",
    title: "Micro Gold Bangles & Kadas for Every Day",
    description:
      "Lightweight diamond-cut bangles, screw-lock bridal kadas, and floral bracelets — all with color guarantee and enduring micro-gold shine.",
    image: "/banners/banner-2.jpg",
    alt: "Sparkling diamond and micro gold bridal bangles kada on gold pedestal",
    primaryCta: { label: "Shop Bangles & Kadas", to: "/shop?category=Bangles%20%26%20Kadas" },
    secondaryCta: { label: "Earrings & Jhumkas", to: "/shop?category=Earrings%20%26%20Jhumkas" },
  },
  {
    id: 3,
    tag: "HERITAGE TEMPLE JEWELLERY",
    cursive: "Royal Sapphire & Gold Collection",
    title: "Timeless South Indian Harams & Bangles",
    description:
      "Authentic Kasu Malai, Gutapusalu rice pearl clusters, and CZ antique bangles in guaranteed 1-gram micro gold polish.",
    image: "/banners/banner-3.jpg",
    alt: "Antique gold and CZ crystal bangles on royal blue velvet",
    primaryCta: { label: "Explore Harams", to: "/shop?category=Harams%20%26%20Long%20Chains" },
    secondaryCta: { label: "Necklaces & Chokers", to: "/shop?category=Necklaces%20%26%20Chokers" },
  },
  {
    id: 4,
    tag: "COMPLETE BRIDAL ORNAMENTS",
    cursive: "Grand Muhurtham Treasures",
    title: "Antique Kemp Sets, Jhumkas & Oddiyanam",
    description:
      "Complete your traditional wedding look with grand kemp chokers, bell jhumkas, carved peacock waist belts, and bridal accessories.",
    image: "/banners/banner-4.jpg",
    alt: "Complete South Indian grand bridal jewellery set with jhumkas and kada",
    primaryCta: { label: "View Accessories", to: "/shop?category=Hip%20Belts%20%26%20Hair%20Ornaments" },
    secondaryCta: { label: "Bridal Sets", to: "/shop?category=Bridal%20Sets" },
  },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const sliderRef = useRef(null);

  const slideCount = SLIDES.length;

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
        {SLIDES.map((slide, index) => {
          const isActive = index === current;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              aria-hidden={!isActive}
            >
              {/* Background Image — Right aligned to highlight the jewellery pedestal */}
              <img
                src={slide.image}
                alt={slide.alt}
                width={1920}
                height={1080}
                className={`h-full w-full object-cover object-right sm:object-center md:object-right transition-transform duration-[7000ms] ease-out ${isActive ? "scale-105" : "scale-100"
                  }`}
                loading={index === 0 ? "eager" : "lazy"}
              />

              {/* Soft Gradient for text legibility on the left while preserving vivid background colors */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              {/* Text & CTAs Content Overlay */}
              <div className="absolute inset-0 flex items-center">
                <div className="mx-auto w-full max-w-7xl px-6 sm:px-12">
                  <div
                    className={`max-w-xl transition-all duration-700 delay-150 ${isActive
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                      }`}
                  >
                    {/* Badge / Tag */}
                    {slide.tag && (
                      <div className="inline-flex items-center gap-2 rounded-full border border-[#E91E8C]/50 bg-[#880E4F]/70 px-3.5 py-1 text-xs tracking-widest text-white backdrop-blur-md mb-3 shadow-md">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#E91E8C] animate-pulse" />
                        <span>{slide.tag}</span>
                      </div>
                    )}

                    {/* Cursive Eyebrow */}
                    {slide.cursive && (
                      <p className="font-cursive text-3xl sm:text-4xl text-[#FF4081]">
                        {slide.cursive}
                      </p>
                    )}

                    {/* Main Headline */}
                    <h1 className={`mt-2 ${theme.typography.h1Hero}`}>
                      {slide.title}
                    </h1>

                    {/* Subtitle / Description */}
                    {slide.description && (
                      <p className="mt-4 text-base leading-relaxed text-white/90 sm:text-lg">
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
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition-all duration-200 hover:border-[#E91E8C] hover:bg-[#C2185B] hover:text-white hover:scale-110 active:scale-95 shadow-xl focus:outline-none focus:ring-2 focus:ring-[#E91E8C]"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 -ml-0.5" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition-all duration-200 hover:border-[#E91E8C] hover:bg-[#C2185B] hover:text-white hover:scale-110 active:scale-95 shadow-xl focus:outline-none focus:ring-2 focus:ring-[#E91E8C]"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 -mr-0.5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {SLIDES.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrent(dotIdx)}
                className={`transition-all duration-300 rounded-full ${dotIdx === current
                  ? "w-8 h-2 bg-[#E91E8C]"
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
