import React, { useRef, useState, useEffect } from "react";
import { Star, CheckCircle2, Quote } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";

// ─── 5 HARDCODED TESTIMONIALS ─────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    id: 1,
    name: "Dr. Priyadharshini R.",
    city: "Erode, Tamil Nadu",
    product: "Antique Matte Kemp Bridal Combo Set",
    rating: 5,
    verified: true,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    review:
      "Ordered the complete Kemp bridal combo for my wedding reception in Erode. Every single guest assumed it was pure 916 hallmarked gold! The matte finish and ruby kemp stones are indistinguishable from real heirloom jewellery. Truly exceeded all my expectations.",
    date: "1 week ago",
  },
  {
    id: 2,
    name: "Ananya Soundararajan",
    city: "Coimbatore, Tamil Nadu",
    product: "1-Gram Micro Gold Daily Bangles (Set of 4)",
    rating: 5,
    verified: true,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    review:
      "I have been wearing these bangles daily to my college lectures for over 4 months now. No blackening, no fading at all. The 6-month color guarantee from Madha Fancy is 100% genuine. Just ordered another set for my mother!",
    date: "2 weeks ago",
  },
  {
    id: 3,
    name: "Meenakshi Sundaram",
    city: "Chennai, Tamil Nadu",
    product: "Traditional 1-Gram Kasu Malai Haram",
    rating: 5,
    verified: true,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    review:
      "The embossed Goddess Lakshmi coin detailing on the Kasu Malai is so sharp and detailed. Weight feels substantial and premium on the neck. Delivery to Chennai was super fast — arrived safely packed in a velvet pouch within 2 days.",
    date: "3 weeks ago",
  },
  {
    id: 4,
    name: "Kavitha Natarajan",
    city: "Salem, Tamil Nadu",
    product: "Peacock Carved Oddiyanam (Waist Belt)",
    rating: 5,
    verified: true,
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80",
    review:
      "Wore this Oddiyanam for my sister's Muhurtham saree drape. The flexible back chain made it so comfortable to sit throughout the 4-hour ceremony. The peacocks and ruby kemp stones sparkled gorgeously in all our stage photos!",
    date: "1 month ago",
  },
  {
    id: 5,
    name: "Divya Bharathi K.",
    city: "Bengaluru, Karnataka",
    product: "South Indian Lakshmi Bell Jimikki",
    rating: 5,
    verified: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    review:
      "The jhumkas have an authentic screw back mechanism which is very gentle on the earlobes. Not too heavy, but gives a grand, royal temple look. Madha Fancy customer service on WhatsApp helped me choose the perfect size.",
    date: "1 month ago",
  },
];

export function Testimonial() {
  const sliderRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Automatic smooth carousel (no arrow buttons, pauses on hover/touch)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const container = sliderRef.current;
      if (!container) return;

      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      if (maxScrollLeft <= 0) return;

      const firstCard = container.querySelector("[data-testimonial-card]");
      const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 340;
      const gap = 20;
      const step = cardWidth + gap;

      if (container.scrollLeft >= maxScrollLeft - 10) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 3200);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section id="testimonials" className="relative py-20 bg-[#FFF5F8]/60 border-t border-b border-[#F8C4D8]/50 overflow-hidden">
      {/* Decorative ambient background glows using brand pink */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-[#E91E8C]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 rounded-full bg-[#C2185B]/5 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Heartfelt Words"
          title="Loved by 10,000+ Brides & Families"
        />

        {/* Highlight Stats Strip */}
        <div className="mx-auto mb-12 max-w-3xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-xl bg-white/80 border border-[#F8C4D8] shadow-xs">
            <p className="text-2xl sm:text-3xl font-display font-bold text-[#C2185B]">10K+</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Happy Brides</p>
          </div>
          <div className="p-4 rounded-xl bg-white/80 border border-[#F8C4D8] shadow-xs">
            <div className="flex items-center justify-center gap-1 text-[#C2185B]">
              <span className="text-2xl sm:text-3xl font-display font-bold">4.9</span>
              <Star className="h-5 w-5 fill-[#E91E8C] text-[#E91E8C]" />
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Average Rating</p>
          </div>
          <div className="p-4 rounded-xl bg-white/80 border border-[#F8C4D8] shadow-xs">
            <p className="text-2xl sm:text-3xl font-display font-bold text-[#C2185B]">100%</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Guarantee Plating</p>
          </div>
          <div className="p-4 rounded-xl bg-white/80 border border-[#F8C4D8] shadow-xs">
            <p className="text-2xl sm:text-3xl font-display font-bold text-[#C2185B]">25+ Yrs</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Erode Fort Legacy</p>
          </div>
        </div>

        {/* 5-Card Auto Carousel (No Button Arrows, pauses on hover / touch) */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div
            ref={sliderRef}
            className="flex flex-nowrap gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory py-3 px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                data-testimonial-card
                className="group relative flex flex-col justify-between rounded-2xl border border-[#F8C4D8] bg-white p-6 sm:p-7 shadow-xs hover:shadow-xl hover:shadow-[#C2185B]/10 hover:-translate-y-1 transition-all duration-300 shrink-0 snap-start select-none w-[88vw] xs:w-[75vw] sm:w-[48vw] md:w-[38vw] lg:w-[370px]"
              >
                {/* Quote Mark Watermark */}
                <Quote className="absolute top-5 right-5 h-8 w-8 text-[#E91E8C]/15 transition-transform group-hover:scale-110" />

                <div>
                  {/* Rating stars & verified badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-[#E91E8C] text-[#E91E8C]"
                        />
                      ))}
                    </div>
                    {t.verified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#C2185B] bg-[#FFF5F8] border border-[#F8C4D8] px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="h-3 w-3 text-[#C2185B]" />
                        Verified Order
                      </span>
                    )}
                  </div>

                  {/* Review Text */}
                  <p className="text-sm leading-relaxed text-foreground/85 italic">
                    "{t.review}"
                  </p>

                  {/* Tag of purchased product */}
                  <div className="mt-4 pt-3 border-t border-[#F8C4D8]/60">
                    <p className="text-[11px] font-semibold tracking-wider uppercase text-[#C2185B] line-clamp-1">
                      Item: {t.product}
                    </p>
                  </div>
                </div>

                {/* Customer Info Card */}
                <div className="mt-5 flex items-center gap-3 pt-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-[#E91E8C]/30 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-foreground truncate">
                      {t.name}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {t.city} • <span className="text-[11px]">{t.date}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonial;
