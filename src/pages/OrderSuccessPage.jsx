import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { formatINR } from "@/data/products";
import { theme } from "@/theme";

export function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const order = searchParams.get("order") || "";
  const total = Number(searchParams.get("total")) || 0;

  return (
    <div className={theme.layout.narrowContainer}>
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#F5EEDB] text-[#B87802] border border-[#E8D8B5]">
        <CheckCircle2 className="h-9 w-9 text-[#B87802]" />
      </div>
      <p className={`mt-6 ${theme.typography.cursiveBanner}`}>Thank You</p>
      <h1 className={`mt-1 ${theme.typography.h1Page}`}>
        Your Order is Confirmed
      </h1>
      <p className="mt-3 text-muted-foreground">
        Order <span className="font-mono font-medium text-foreground">{order}</span>{" "}
        has been placed successfully. A confirmation email has been sent.
      </p>

      {total > 0 && (
        <div className={`mx-auto mt-8 max-w-sm ${theme.cards.padded}`}>
          <p className={theme.typography.metaMuted}>
            Total Amount
          </p>
          <p className={`mt-1 ${theme.typography.priceBig}`}>
            {formatINR(total)}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Payment mode: Cash / UPI on Delivery
          </p>
        </div>
      )}

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          to="/shop"
          className={theme.buttons.primary}
        >
          Continue Shopping
        </Link>
        <Link
          to="/"
          className="rounded-sm border border-border px-8 py-3.5 text-sm font-semibold tracking-[0.15em] uppercase transition-colors hover:bg-secondary"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

export default OrderSuccessPage;
