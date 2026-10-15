import React from "react";
import { theme } from "@/theme";

export function SectionHeading({ eyebrow, title, className = "" }) {
  return (
    <div className={`mb-10 text-center ${className}`}>
      {eyebrow && <p className={theme.typography.cursiveEyebrow}>{eyebrow}</p>}
      <h2 className={`mt-1 ${theme.typography.h2Section}`}>{title}</h2>
      <div className={theme.dividers.goldCentered} />
    </div>
  );
}

export default SectionHeading;
