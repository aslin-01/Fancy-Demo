import React from "react";
import { Award, Sparkles, ShieldCheck, Star, Truck } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { theme } from "@/theme";

const features = [
  {
    icon: Award,
    title: "Authentic Craftsmanship",
    text: "Every jewellery set is crafted with 1-gram micro gold covering, antique matte polish, and genuine temple kemp stones.",
  },
  {
    icon: Sparkles,
    title: "Guaranteed 1-Gram Polish",
    text: "Long-lasting micro gold plating with rich South Indian gold luster and skin-friendly finish.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    text: "Shop confidently with encrypted payments via UPI, Google Pay, cards, and net banking.",
  },
  {
    icon: Truck,
    title: "Safe Express Delivery",
    text: "All-India courier dispatch from Erode Fort with careful, protective velvet pouch packaging.",
  },
];

const testimonials = [
  {
    name: "Kavitha Suresh",
    place: "Coimbatore",
    text: "The bridal kemp combo set looked identical to 22k pure gold jewellery at my wedding muhurtham. Everyone gave compliments!",
    rating: 5,
  },
  {
    name: "Divya Ramesh",
    place: "Salem",
    text: "Ordered daily wear bangles and jimikki earrings from Madha Fancy Erode. The micro gold shine has lasted brilliantly!",
    rating: 5,
  },
  {
    name: "Priya Sundaram",
    place: "Chennai",
    text: "Super fast dispatch and incredible temple peacock craftsmanship on the choker and Kasu Malai. Outstanding quality!",
    rating: 5,
  },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
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
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#F5EEDB] border border-[#F8C4D8]">
                <f.icon className="h-6 w-6 text-[#C2185B]" />
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
        <SectionHeading eyebrow="Style Inspiration" title="Adorned in Royal Grace" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {galleryImages.map((img, i) => (
            <div key={i} className="group overflow-hidden rounded-lg">
              <img
                src={img}
                alt={`Madha Fancy jewellery styling inspiration ${i + 1}`}
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
