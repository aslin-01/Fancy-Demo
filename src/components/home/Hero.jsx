import React from "react";
import { Link } from "react-router-dom";
import { hero } from "@/data/products";
import { theme } from "@/theme";

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden">
      <img
        src={hero}
        alt="Woman draped in a maroon Kanchipuram silk saree with gold zari"
        width={1920}
        height={1024}
        className="h-[70vh] min-h-[480px] w-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0C0A07]/80 via-[#0C0A07]/40 to-transparent" />
      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="max-w-xl animate-fade-up">
            <p className={theme.typography.cursiveBanner}>
              Handwoven Heritage
            </p>
            <h1 className={`mt-3 ${theme.typography.h1Hero}`}>
              Elegance Woven in Every Thread
            </h1>
            <p className="mt-4 text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
              Discover heirloom sarees from India's finest weaving clusters —
              silks, cottons, and bridal treasures crafted by master artisans.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/shop" className={theme.buttons.gold}>
                Shop Now
              </Link>
              <Link
                to="/shop?category=Wedding"
                className={theme.buttons.outlineLight}
              >
                Bridal Collection
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
