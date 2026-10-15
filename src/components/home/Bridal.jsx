import React from "react";
import { Link } from "react-router-dom";
import sareeBridal from "@/assets/saree-bridal.jpg";
import { theme } from "@/theme";

export function Bridal() {
  return (
    <section id="bridal" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-20 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <p className={theme.typography.cursiveBanner}>The Bridal Edit</p>
          <h2 className="mt-2 font-display text-4xl font-semibold text-foreground sm:text-5xl">
            For Your Most Cherished Day
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
            Heirloom Kanchipuram silks and opulent zari work, hand-selected for
            brides who carry tradition with grace. Each piece is woven over weeks
            by master artisans.
          </p>
          <Link
            to="/shop?category=Wedding"
            className={`mt-8 ${theme.buttons.primary}`}
          >
            Explore Bridal Sarees
          </Link>
        </div>
        <div className="order-1 lg:order-2">
          <img
            src={sareeBridal}
            alt="Royal red bridal saree with heavy gold zari on a mannequin"
            loading="lazy"
            width={1024}
            height={1280}
            className="w-full rounded-lg object-cover shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}

export default Bridal;
