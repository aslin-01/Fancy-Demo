import React, { useState, useEffect } from "react";
import { Mail, Lock, ShieldCheck, ArrowRight, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";
import { theme } from "@/theme";

// Default seed of allowed emails if backend is offline or storage is empty
const DEFAULT_ALLOWED_EMAILS = ["admin@madhafancy.com", "priya.sharma@example.com"];

export function AccessGate() {
  const [authorizedEmail, setAuthorizedEmail] = useState(() => {
    let email = localStorage.getItem("mf_authorized_email") || "";
    const oldEmail = localStorage.getItem("cf_authorized_email") || "";
    if (!email && oldEmail) {
      email = oldEmail;
    }
    // Cleanse any reference to cfhandlooms
    if (email && email.toLowerCase().includes("cfhandlooms")) {
      email = "admin@madhafancy.com";
    }
    // Always persist clean email and purge old keys
    if (email) {
      localStorage.setItem("mf_authorized_email", email);
    }
    localStorage.removeItem("cf_authorized_email");
    localStorage.removeItem("cf_authorized_user");
    return email;
  });
  const [inputEmail, setInputEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Listen for storage changes if updated in another tab
  useEffect(() => {
    const handleStorage = () => {
      let email = localStorage.getItem("mf_authorized_email") || "";
      const oldEmail = localStorage.getItem("cf_authorized_email") || "";
      if (!email && oldEmail) email = oldEmail;
      if (email && email.toLowerCase().includes("cfhandlooms")) {
        email = "admin@madhafancy.com";
        localStorage.setItem("mf_authorized_email", email);
      }
      localStorage.removeItem("cf_authorized_email");
      localStorage.removeItem("cf_authorized_user");
      setAuthorizedEmail(email);
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("mf_auth_state_changed", handleStorage);
    window.addEventListener("cf_auth_state_changed", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("mf_auth_state_changed", handleStorage);
      window.removeEventListener("cf_auth_state_changed", handleStorage);
    };
  }, []);

  // If already authorized, don't show the gate
  if (authorizedEmail) {
    return null;
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    const clean = inputEmail.trim().toLowerCase();
    if (!clean) return;

    setLoading(true);
    setErrorMsg("");

    try {
      // 1. First attempt verification against backend API
      const res = await fetch(`http://localhost:5000/api/auth/verify-access?email=${encodeURIComponent(clean)}`, {
        signal: AbortSignal.timeout(3000),
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        if (data.allowed) {
          localStorage.setItem("mf_authorized_email", clean);
          localStorage.setItem("mf_authorized_user", JSON.stringify(data.user || { email: clean }));
          localStorage.removeItem("cf_authorized_email");
          localStorage.removeItem("cf_authorized_user");
          setAuthorizedEmail(clean);
          window.dispatchEvent(new Event("mf_auth_state_changed"));
          window.dispatchEvent(new Event("cf_auth_state_changed"));
          return;
        }
      }

      // 2. Fallback check against default pre-authorized & local admin-created authorized user list
      const allowedSet = new Set(DEFAULT_ALLOWED_EMAILS);
      try {
        const savedList = localStorage.getItem("mf_user_access_list") || localStorage.getItem("cf_user_access_list");
        if (savedList) {
          const parsed = JSON.parse(savedList);
          parsed
            .filter((u) => u.status === "Active" && u.canAccessWebsite !== false)
            .forEach((u) => allowedSet.add(u.email.toLowerCase().trim()));
        }
      } catch {
        // use fallback
      }

      if (allowedSet.has(clean)) {
        localStorage.setItem("mf_authorized_email", clean);
        localStorage.removeItem("cf_authorized_email");
        setAuthorizedEmail(clean);
        window.dispatchEvent(new Event("mf_auth_state_changed"));
        window.dispatchEvent(new Event("cf_auth_state_changed"));
      } else {
        setErrorMsg(
          `Access Denied: The email "${clean}" is not authorized to enter the website. Please contact the administrator.`
        );
      }
    } catch {
      setErrorMsg("An unexpected verification error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-[#E91E8C]/40 bg-[#FFF5F8] p-8 shadow-2xl">
        {/* Decorative Luxury Lighting */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-[#E91E8C]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-[#C2185B]/20 blur-3xl" />

        <div className="relative z-10 text-center space-y-4">
          {/* Logo & Emblem */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0C0A07] border border-[#E91E8C]/50 shadow-md">
            <Lock className="h-6 w-6 text-[#E91E8C]" />
          </div>

          <div>
            <h2 className="font-display text-3xl font-semibold tracking-wide text-[#0C0A07]">
              Madha Fancy
            </h2>
            <div className="mx-auto mt-2 h-0.5 w-16 bg-gradient-to-r from-transparent via-[#E91E8C] to-transparent" />
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C2185B]">
              Gold Covering &amp; Bridal Store
            </p>
          </div>

          <p className="text-xs text-[#6B6457] leading-relaxed">
            Welcome to Madha Fancy &amp; Gold Covering, Erode. This storefront is accessible only to authorized customer emails registered by our team.
          </p>

          {/* Form */}
          <form onSubmit={handleVerify} className="space-y-3 pt-2 text-left">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0C0A07] mb-1">
                Enter Your Authorized Email ID
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C7E6A]" />
                <input
                  type="email"
                  value={inputEmail}
                  onChange={(e) => {
                    setInputEmail(e.target.value);
                    setErrorMsg("");
                  }}
                  placeholder="e.g. priya.sharma@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#F8C4D8] bg-white text-xs text-[#12100D] outline-none focus:border-[#C2185B] shadow-sm font-body"
                  required
                  autoFocus
                />
              </div>
            </div>

            {errorMsg && (
              <div className="rounded-md border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700 flex items-start gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="leading-tight">{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#C2185B] to-[#880E4F] py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-md hover:from-[#D81B60] hover:to-[#AD1457] transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? "Verifying Access..." : "Enter Website"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Helper hint */}
          <div className="pt-2 border-t border-[#F8C4D8]/60 text-[10px] text-[#8C7E6A]">
            <p>
              Pre-authorized test emails: <strong className="text-[#0C0A07]">priya.sharma@example.com</strong> or{" "}
              <strong className="text-[#0C0A07]">admin@madhafancy.com</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccessGate;

