import React, { useState } from "react";
import { toast } from "sonner";
import { theme } from "@/theme";

export function Touch() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      toast.success("Thank you for subscribing to Madha Fancy!");
      setEmail("");
    }
  };

  return (
    <section id="touch" className="bg-beige/60">
      <div className={theme.layout.narrowContainer}>
        <p className={theme.typography.cursiveBanner}>Stay in Touch</p>
        <h2 className={`mt-2 ${theme.typography.h2Section}`}>
          Join the Madha Fancy Family
        </h2>
        <p className="mt-3 text-muted-foreground">
          Be the first to explore new 1-gram gold arrivals, temple jewellery collections, and festive discounts.
        </p>
        <form
          className="mx-auto mt-8 flex max-w-md overflow-hidden rounded-md border border-[#F8C4D8] bg-card shadow-xs transition-colors focus-within:border-[#C2185B]"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full bg-transparent px-4 py-3.5 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="shrink-0 bg-gradient-to-r from-[#C2185B] to-[#880E4F] text-white px-6 text-sm font-medium tracking-[0.08em] uppercase transition-all duration-200 hover:from-[#D81B60] hover:to-[#9C0F5F] hover:shadow-lg hover:shadow-[#C2185B]/30 active:scale-[0.98] cursor-pointer"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

export default Touch;
