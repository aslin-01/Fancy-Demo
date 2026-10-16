import React from "react";
import { Link } from "react-router-dom";
import sareeFestive from "@/assets/saree-festive.jpg";
import { theme } from "@/theme";

export function Festive() {
  return (
    <section id="festive" className="relative overflow-hidden bg-[#ffffff] text-foreground">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 sm:py-20 lg:grid-cols-2">
        <img
          src={sareeFestive}
          alt="Mustard festive saree with temple border and marigold flowers"
          loading="lazy"
          width={1024}
          height={1280}
          className="max-h-110 w-full rounded-lg object-cover shadow-xl"
        />
        <div className="text-center lg:text-left">
          <p className={theme.typography.cursiveBanner}>Festive Season</p>
          <h2 className="mt-2 font-display text-4xl font-semibold text-foreground sm:text-5xl">
            The Celebration Collection
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-muted-foreground mx-auto lg:mx-0">
            Radiant silks and auspicious weaves for pujas, weddings, and every
            celebration in between. Up to 30% off this festive season.
          </p>
          <Link
            to="/shop?category=Silk"
            className={`mt-8 ${theme.buttons.primary}`}
          >
            Shop the Collection
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Festive;
