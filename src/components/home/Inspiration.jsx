import React from "react";
import { Award, Leaf, ShieldCheck, Star, Truck } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { theme } from "@/theme";
import sareeBridal from "@/assets/saree-bridal.jpg";
import sareeFestive from "@/assets/saree-festive.jpg";
import sareeOrganza from "@/assets/saree-organza.jpg";
import sareeChiffon from "@/assets/saree-chiffon.jpg";
import sareeDesigner from "@/assets/saree-designer.jpg";
import sareeSilk from "@/assets/saree-silk.jpg";

const features = [
  {
    icon: Award,
    title: "Authentic Craftsmanship",
    text: "Every saree is sourced directly from master weavers and certified handloom clusters.",
  },
  {
    icon: Leaf,
    title: "Premium Quality",
    text: "Pure silks, fine cottons and honest fabrics — quality-checked thread by thread.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    text: "Shop confidently with encrypted payments via UPI, cards, and net banking.",
  },
  {
    icon: Truck,
    title: "Reliable Delivery",
    text: "Free insured shipping across India with careful, gift-ready packaging.",
  },
];

const testimonials = [
  {
    name: "Meera Krishnan",
    place: "Chennai",
    text: "The Kanchipuram silk I ordered exceeded every expectation — the zari work is exquisite and the drape is pure luxury.",
    rating: 5,
  },
  {
    name: "Ananya Sharma",
    place: "Delhi",
    text: "Ordered a bridal saree for my sister's wedding. The packaging, the quality, the service — everything felt truly premium.",
    rating: 5,
  },
  {
    name: "Lakshmi Iyer",
    place: "Bengaluru",
    text: "Their handloom cottons are my everyday favourites now. Breathable, elegant, and beautifully finished.",
    rating: 4,
  },
];

const galleryImages = [
  sareeOrganza,
  sareeChiffon,
  sareeDesigner,
  sareeFestive,
  sareeSilk,
  sareeBridal,
];

export function Inspiration() {
  return (
    <div id="inspiration">
      {/* Why shop with us */}
      <section className={theme.layout.sectionContainer}>
        <SectionHeading eyebrow="Our Promise" title="Why Shop With Us" />
        <div className={theme.layout.gridFeatures}>
          {features.map((f) => (
            <div
              key={f.title}
              className={theme.cards.feature}
            >
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#F5EEDB] border border-[#E8D8B5]">
                <f.icon className="h-6 w-6 text-[#B87802]" />
              </div>
              <h3 className={`mt-4 ${theme.typography.h3Card}`}>
                {f.title}
              </h3>
              <p className={`mt-2 ${theme.typography.bodyMuted} leading-relaxed`}>
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary/50">
        <div className={theme.layout.sectionContainer}>
          <SectionHeading eyebrow="Kind Words" title="What Our Customers Say" />
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className={theme.cards.padded}
              >
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < t.rating ? "fill-gold text-gold" : "text-border"}`}
                    />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-foreground/80">
                  "{t.text}"
                </blockquote>
                <figcaption className="mt-4">
                  <p className="font-display text-lg font-semibold">{t.name}</p>
                  <p className={theme.typography.metaMuted}>
                    {t.place}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Sample testimonials shown for demonstration.
          </p>
        </div>
      </section>

      {/* Style Inspiration Gallery */}
      <section className={theme.layout.sectionContainer}>
        <SectionHeading eyebrow="Style Inspiration" title="Draped in Grace" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {galleryImages.map((img, i) => (
            <div key={i} className="group overflow-hidden rounded-lg">
              <img
                src={img}
                alt={`Saree styling inspiration ${i + 1}`}
                loading="lazy"
                width={1024}
                height={1280}
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-108"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Inspiration;
