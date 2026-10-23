import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0C0A07] text-[#FAF8F2] border-t border-[#F5B815]/20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <img
              src="/favicon.png"
              alt="CF Handlooms logo"
              className="h-10 w-10 shrink-0 object-contain"
            />
            <p className="font-cursive text-4xl text-gold">CF Handlooms</p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-primary-foreground/70">
            Handwoven sarees from India's finest weaving clusters — Kanchipuram,
            Banaras, and beyond. Elegance woven in every thread.
          </p>
          <div className="mt-5 flex gap-4">
            <a
              href="#"
              aria-label="Instagram"
              className="text-primary-foreground/70 transition-colors hover:text-gold"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="text-primary-foreground/70 transition-colors hover:text-gold"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="text-primary-foreground/70 transition-colors hover:text-gold"
            >
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-gold">
            Shop
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-primary-foreground/70">
            <li>
              <Link to="/shop" className="hover:text-gold">
                Shop All
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Silk" className="hover:text-gold">
                Silk Sarees
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Cotton" className="hover:text-gold">
                Cotton Sarees
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Wedding" className="hover:text-gold">
                Wedding Sarees
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Party%20Wear" className="hover:text-gold">
                Party Wear
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-gold">
            Policies
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-primary-foreground/70">
            <li>
              <a href="#" className="hover:text-gold">
                Shipping & Delivery
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gold">
                Returns & Exchanges
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gold">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gold">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gold">
                Authenticity Certificate
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-gold">
            Contact Us
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/70">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>124 Heritage Lane, T. Nagar, Chennai, Tamil Nadu — 600017</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-gold" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-gold" />
              <span>care@cfhandlooms.com</span>
            </li>
          </ul>
          <p className="mt-4 text-xs text-primary-foreground/50">
            Mon – Sat: 10:00 AM – 7:00 PM IST
          </p>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 py-6 text-center text-xs text-primary-foreground/50">
        <p>
          © {new Date().getFullYear()} CF Handlooms. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
