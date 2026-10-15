import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatINR, products } from "@/data/products";
import { useStore } from "@/lib/store";
import { theme } from "@/theme";

const initial = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pin: "",
  payment: "upi",
};

export function CheckoutPage() {
  const { cart, subtotal, clearCart } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  const lines = cart
    .map((l) => ({
      ...l,
      product: products.find((p) => p.id === l.productId),
    }))
    .filter((l) => l.product);

  const shipping = subtotal >= 2999 || subtotal === 0 ? 0 : 149;
  const total = subtotal + shipping;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (form.name.trim().length < 2) errs.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email address.";
    if (!/^\d{10}$/.test(form.phone))
      errs.phone = "Enter a valid 10-digit phone number.";
    if (form.address.trim().length < 8)
      errs.address = "Please enter your complete address.";
    if (!form.city.trim()) errs.city = "Required.";
    if (!form.state.trim()) errs.state = "Required.";
    if (!/^\d{6}$/.test(form.pin)) errs.pin = "Enter a valid 6-digit PIN.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const placeOrder = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const orderId = "VK" + Date.now().toString().slice(-8);
    clearCart();
    navigate(`/order-success?order=${orderId}&total=${total}`);
  };

  if (lines.length === 0) {
    return (
      <div className={theme.layout.emptyState}>
        <h1 className={theme.typography.h1Page}>
          Nothing to check out
        </h1>
        <p className="mt-3 text-muted-foreground">Your cart is empty.</p>
        <Link
          to="/shop"
          className={`mt-8 ${theme.buttons.primary}`}
        >
          Shop Sarees
        </Link>
      </div>
    );
  }

  const field = (label, key, props = {}) => (
    <div>
      <label className={theme.forms.label}>
        {label}
      </label>
      <input
        value={form[key]}
        onChange={set(key)}
        className={`mt-1.5 ${errors[key] ? theme.forms.inputError : theme.forms.input}`}
        {...props}
      />
      {errors[key] && (
        <p className={theme.forms.errorText}>{errors[key]}</p>
      )}
    </div>
  );

  return (
    <div className={theme.layout.pageContainer}>
      <h1 className={theme.typography.h1Page}>Secure Checkout</h1>
      <div className={theme.dividers.goldLeft} />

      <form
        onSubmit={placeOrder}
        className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]"
      >
        <div className="space-y-8">
          <section className={theme.cards.padded}>
            <h2 className="font-display text-2xl font-semibold">
              Contact & Shipping
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {field("Full Name", "name", { placeholder: "Meera Krishnan" })}
              {field("Email", "email", {
                type: "email",
                placeholder: "you@example.com",
              })}
              {field("Phone", "phone", {
                inputMode: "numeric",
                placeholder: "10-digit mobile",
              })}
              {field("PIN Code", "pin", {
                inputMode: "numeric",
                placeholder: "6-digit PIN",
              })}
              <div className="sm:col-span-2">
                <label className={theme.forms.label}>
                  Address
                </label>
                <textarea
                  value={form.address}
                  onChange={set("address")}
                  rows={3}
                  placeholder="House / flat, street, landmark"
                  className={`mt-1.5 ${errors.address ? theme.forms.textareaError : theme.forms.textarea}`}
                />
                {errors.address && (
                  <p className={theme.forms.errorText}>
                    {errors.address}
                  </p>
                )}
              </div>
              {field("City", "city")}
              {field("State", "state")}
            </div>
          </section>

          <section className={theme.cards.padded}>
            <h2 className="font-display text-2xl font-semibold">
              Payment Method
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Demo checkout — no real payment is processed. Razorpay integration
              (UPI, cards, net banking) can be enabled when you connect a backend.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                { value: "upi", label: "UPI", desc: "GPay, PhonePe, Paytm" },
                { value: "card", label: "Card", desc: "Credit / debit cards" },
                {
                  value: "netbanking",
                  label: "Net Banking",
                  desc: "All major banks",
                },
                {
                  value: "cod",
                  label: "Cash on Delivery",
                  desc: "Pay when it arrives",
                },
              ].map((m) => (
                <label
                  key={m.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-sm border p-4 transition-colors ${
                    form.payment === m.value
                      ? "border-[#B87802] bg-[#F5EEDB]/60 shadow-xs"
                      : "border-border hover:border-[#E8D8B5]"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m.value}
                    checked={form.payment === m.value}
                    onChange={() => setForm((f) => ({ ...f, payment: m.value }))}
                    className={`mt-1 ${theme.forms.radio}`}
                  />
                  <span>
                    <span className="block text-sm font-medium">{m.label}</span>
                    <span className="block text-xs text-muted-foreground">
                      {m.desc}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className={`h-fit ${theme.cards.padded}`}>
          <h2 className="font-display text-2xl font-semibold">Your Order</h2>
          <ul className="mt-4 space-y-3">
            {lines.map(({ product, qty }) => (
              <li key={product.id} className="flex items-center gap-3 text-sm">
                <img
                  src={product.image}
                  alt={product.name}
                  width={1024}
                  height={1280}
                  className="h-14 w-11 rounded-sm object-cover"
                />
                <span className="min-w-0 flex-1 truncate">{product.name}</span>
                <span className="shrink-0 text-muted-foreground">×{qty}</span>
                <span className="shrink-0 font-medium">
                  {formatINR(product.price * qty)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatINR(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd>{shipping === 0 ? "Free" : formatINR(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
              <dt>Total</dt>
              <dd className="text-[#B87802]">{formatINR(total)}</dd>
            </div>
          </dl>
          <button
            type="submit"
            className={`mt-6 ${theme.buttons.primaryWide}`}
          >
            Place Order
          </button>
        </aside>
      </form>
    </div>
  );
}

export default CheckoutPage;
