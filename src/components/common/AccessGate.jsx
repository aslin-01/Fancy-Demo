import React, { useState, useEffect } from "react";
import { Mail, Lock, ShieldCheck, ArrowRight, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";
import { theme } from "@/theme";

// Default seed of allowed emails if backend is offline or storage is empty
const DEFAULT_ALLOWED_EMAILS = [];

export function AccessGate() {
  const [authorizedEmail, setAuthorizedEmail] = useState(() => {
    return localStorage.getItem("cf_authorized_email") || "";
  });
  const [inputEmail, setInputEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Listen for storage changes if updated in another tab
  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem("cf_authorized_email");
      if (saved) setAuthorizedEmail(saved);
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("cf_auth_state_changed", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
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
          localStorage.setItem("cf_authorized_email", clean);
          localStorage.setItem("cf_authorized_user", JSON.stringify(data.user || { email: clean }));
          setAuthorizedEmail(clean);
          window.dispatchEvent(new Event("cf_auth_state_changed"));
          return;
        }
      }

      // 2. Fallback check against local admin-created authorized user list
      let allowedList = DEFAULT_ALLOWED_EMAILS;
      try {
        const savedList = localStorage.getItem("cf_user_access_list");
        if (savedList) {
          const parsed = JSON.parse(savedList);
          allowedList = parsed
            .filter((u) => u.status === "Active" && u.canAccessWebsite !== false)
            .map((u) => u.email.toLowerCase().trim());
        }
      } catch {
        // use fallback
      }

      if (allowedList.includes(clean)) {
        localStorage.setItem("cf_authorized_email", clean);
        setAuthorizedEmail(clean);
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
      <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-[#F5B815]/40 bg-[#FAF8F2] p-8 shadow-2xl">
        {/* Decorative Luxury Lighting */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-[#F5B815]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-[#B87802]/20 blur-3xl" />

        <div className="relative z-10 text-center space-y-4">
          {/* Logo & Emblem */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0C0A07] border border-[#F5B815]/50 shadow-md">
            <Lock className="h-6 w-6 text-[#F5B815]" />
          </div>

          <div>
            <h2 className="font-display text-3xl font-semibold tracking-wide text-[#0C0A07]">
              CF Handlooms
            </h2>
            <div className="mx-auto mt-2 h-0.5 w-16 bg-gradient-to-r from-transparent via-[#F5B815] to-transparent" />
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#B87802]">
              Private Access Storefront
            </p>
          </div>

          <p className="text-xs text-[#6B6457] leading-relaxed">
            Welcome to CF Handlooms. This website is accessible only to authorized customer emails registered by our team.
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
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#E8D8B5] bg-white text-xs text-[#12100D] outline-none focus:border-[#B87802] shadow-sm font-body"
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
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#B87802] to-[#996300] py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-md hover:from-[#C98704] hover:to-[#A86E02] transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? "Verifying Access..." : "Enter Website"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Helper hint */}
          <div className="pt-2 border-t border-[#E8D8B5]/60 text-[10px] text-[#8C7E6A]">
            <p>
              Pre-authorized test emails: <strong className="text-[#0C0A07]">priya.sharma@example.com</strong> or{" "}
              <strong className="text-[#0C0A07]">admin@cfhandlooms.com</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccessGate;

