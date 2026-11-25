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
    <footer className="bg-[#1F0411] text-[#FFF5F8] border-t border-[#C2185B]/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <img
              src="/favicon.jpg"
              alt="Madha Fancy logo"
              className="h-12 w-12 shrink-0 object-contain rounded-full"
            />
            <p className="font-cursive text-4xl text-gold">Madha Fancy</p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-primary-foreground/70">
            Premium 1-Gram Gold Covering, Micro Gold Plated Jewellery, Antique Temple Collections &amp; Bridal Sets. Erode's trusted destination for grand traditional elegance.
          </p>
          <div className="mt-5 flex gap-4">
            <a
              href="https://www.instagram.com/madha_fancy"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-primary-foreground/70 transition-colors hover:text-gold"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://www.youtube.com/@MadhaFancyErode"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-primary-foreground/70 transition-colors hover:text-gold"
            >
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-gold">
            Shop Collections
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-primary-foreground/70">
            <li>
              <Link to="/shop" className="hover:text-gold">
                Shop All Jewellery
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Bridal%20Sets" className="hover:text-gold">
                Bridal Sets
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Harams%20%26%20Long%20Chains" className="hover:text-gold">
                Harams &amp; Long Chains
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Necklaces%20%26%20Chokers" className="hover:text-gold">
                Necklaces &amp; Chokers
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Bangles%20%26%20Kadas" className="hover:text-gold">
                Bangles &amp; Kadas
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Earrings%20%26%20Jhumkas" className="hover:text-gold">
                Earrings &amp; Jhumkas
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
            Visit Our Store
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/70">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>No. 1023, Brough Road, Near P.S. Park, Erode Fort, Erode, Tamil Nadu — 638001</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-gold" />
              <a href="https://wa.me/918098291067" target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                +91 80982 91067 (WhatsApp Orders)
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-gold" />
              <span>care@madhafancy.com</span>
            </li>
          </ul>
          <p className="mt-4 text-xs text-primary-foreground/50">
            Mon – Sat: 10:00 AM – 9:00 PM IST
          </p>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 py-6 text-center text-xs text-primary-foreground/50">
        <p>
          © {new Date().getFullYear()} Madha Fancy &amp; Gold Covering, Erode. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
