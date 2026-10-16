import React, { useState } from "react";
import { toast } from "sonner";
import { theme } from "@/theme";

export function Touch() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      toast.success("Thank you for subscribing to CF Handlooms!");
      setEmail("");
    }
  };

  return (
    <section id="touch" className="bg-beige/60">
      <div className={theme.layout.narrowContainer}>
        <p className={theme.typography.cursiveBanner}>Stay in Touch</p>
        <h2 className={`mt-2 ${theme.typography.h2Section}`}>
          Join the CF Handlooms Family
        </h2>
        <p className="mt-3 text-muted-foreground">
          Be first to know about new weaves, festive offers, and styling stories.
        </p>
        <form
          className="mx-auto mt-8 flex max-w-md overflow-hidden rounded-sm border border-input bg-card"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full bg-transparent px-4 py-3.5 text-sm outline-none"
          />
          <button
            type="submit"
            className="shrink-0 bg-gradient-to-r from-[#B87802] to-[#996300] text-white border border-[#F5B815]/30 px-6 text-sm font-medium tracking-[0.08em] uppercase transition-all duration-200 hover:from-[#C98704] hover:to-[#A86E02] hover:shadow-lg hover:shadow-[#B87802]/30 active:scale-[0.98] cursor-pointer shadow-md"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

export default Touch;
