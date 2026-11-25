import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Crown, Gem, Sparkles } from "lucide-react";
import { theme } from "@/theme";

const HIGHLIGHTS = [
  {
    icon: Sparkles,
    title: "1-Gram Micro Gold",
    desc: "Long-lasting gold-like lustre & skin-friendly finish",
  },
  {
    icon: Crown,
    title: "Bridal Temple Sets",
    desc: "Handcrafted kemp, matte & antique wedding sets",
  },
  {
    icon: Gem,
    title: "Erode Craftsmanship",
    desc: "Trusted heritage jewellery store in Erode Fort",
  },
];

export function About() {
  return (
    <section
      id="about"
      className="bg-[#FFF5F8]/60 border-b border-[#F8C4D8]/50"
    >
      <div className={theme.layout.sectionContainer}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left Column: Jewellery Showcase Image */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-[#F8C4D8] bg-white shadow-lg aspect-[4/3]">
              <img
                src="/banners/banner-4.jpg"
                alt="Madha Fancy 1-Gram Gold Covering Bridal Jewellery"
                loading="lazy"
                className="h-full w-full object-cover object-right transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Floating Heritage Badge */}
            <div className="mt-4 sm:mt-0 sm:absolute sm:-bottom-5 sm:left-6 rounded-xl border border-[#F8C4D8] bg-white/95 px-5 py-3.5 shadow-lg backdrop-blur-md">
              <p className="font-cursive text-2xl text-[#C2185B] leading-none">
                Madha Fancy
              </p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Erode Fort • Gold Covering &amp; Bridal
              </p>
            </div>
          </div>

          {/* Right Column: Brand Story & Highlights */}
          <div className="space-y-6">
            <div>
              <p className={theme.typography.cursiveBanner}>About Us</p>
              <h2 className={`mt-1 ${theme.typography.h2Section}`}>
                Timeless 1-Gram Gold &amp; Bridal Elegance
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
                At <strong className="font-semibold text-foreground">Madha Fancy &amp; Gold Covering</strong>, Erode Fort, we bring together the grandeur of traditional South Indian temple jewellery and the comfort of finely crafted 1-gram micro gold plating.
              </p>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground">
                From grand bridal kemp harams and antique matte chokers to everyday bangles, jhumkas, and oddiyanams, every piece is curated to give you the royal radiance of real gold at accessible prices.
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
              {HIGHLIGHTS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-xl border border-[#F8C4D8] bg-white p-4 shadow-xs transition-all duration-200 hover:border-[#C2185B]/60 hover:shadow-sm"
                  >
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF5F8] text-[#C2185B] border border-[#F8C4D8]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="mt-2.5 font-display text-base font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link to="/shop" className={theme.buttons.primary}>
                <span>Explore Collection</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/offers" className={theme.buttons.secondarySm}>
                View Festive Offers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
