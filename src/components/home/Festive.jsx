import React from "react";
import { Link } from "react-router-dom";
import sareeFestive from "@/assets/saree-festive.jpg";
import { theme } from "@/theme";

export function Festive() {
  return (
    <section id="festive" className="relative overflow-hidden bg-[#0C0A07] text-[#FAF8F2]">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 lg:grid-cols-2">
        <img
          src={sareeFestive}
          alt="Mustard festive saree with temple border and marigold flowers"
          loading="lazy"
          width={1024}
          height={1280}
          className="max-h-105 w-full rounded-lg object-cover"
        />
        <div className="text-center lg:text-left">
          <p className={theme.typography.cursiveBanner}>Festive Season</p>
          <h2 className={`mt-2 ${theme.typography.h2Banner}`}>
            The Celebration Collection
          </h2>
          <p className="mt-4 leading-relaxed text-primary-foreground/75">
            Radiant silks and auspicious weaves for pujas, weddings, and every
            celebration in between. Up to 30% off this festive season.
          </p>
          <Link
            to="/shop?category=Silk"
            className={`mt-8 ${theme.buttons.gold}`}
          >
            Shop the Collection
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Festive;
