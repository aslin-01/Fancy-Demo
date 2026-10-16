import React, { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollUp}
      aria-label="Scroll back to top"
      title="Back to top"
      className={`fixed bottom-8 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-[#F5B815]/40 bg-[#0C0A07] text-white shadow-lg shadow-[#B87802]/30 transition-all duration-300 hover:bg-[#B87802] hover:border-[#F5B815] hover:scale-110 hover:shadow-[#B87802]/50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#F5B815] ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  );
}

export default ScrollToTop;
