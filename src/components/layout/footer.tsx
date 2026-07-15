import Link from "next/link";
import { Logo } from "./logo";
import { Facebook, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-charcoal-900 text-ivory-300">
      <div className="container mx-auto px-4 py-14 md:py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="space-y-4 max-w-xs">
            <Logo />
            <p className="font-body text-sm leading-relaxed text-ivory-300">
              Soqosoqo Vakamarama iTaukei Cakaudrove — empowering indigenous women of Cakaudrove Province through culture, education, and economic opportunity.
            </p>
          </div>
          <div>
            <h4 className="font-label text-xs font-semibold uppercase tracking-[0.14em] mb-4 text-ivory-100">Site</h4>
            <ul className="space-y-2.5 font-body text-sm">
              <li><Link href="/about" className="hover:text-ochre-200 transition-colors">About Us</Link></li>
              <li><Link href="/work" className="hover:text-ochre-200 transition-colors">Our Work</Link></li>
              <li><Link href="/calendar" className="hover:text-ochre-200 transition-colors">Calendar</Link></li>
              <li><Link href="/involved" className="hover:text-ochre-200 transition-colors">Get Involved</Link></li>
              <li><Link href="/contact" className="hover:text-ochre-200 transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-label text-xs font-semibold uppercase tracking-[0.14em] mb-4 text-ivory-100">Contact</h4>
            <ul className="space-y-2.5 font-body text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-rust-300" />
                <span>Ra Marama Great Hall, Savusavu, Fiji</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 shrink-0 text-rust-300" />
                <span>(679) 8962012</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 shrink-0 text-rust-300" />
                <span>svtc2005@gmail.com</span>
              </li>
              <li className="flex items-center gap-2.5 pt-1">
                <Link
                  href="https://www.facebook.com/soqosoqo.vakamarama.cakaudrove"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-ochre-200 transition-colors"
                >
                  <Facebook className="w-4 h-4 shrink-0" /> Facebook
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-charcoal-700 pt-6 text-center font-body text-xs text-ivory-300/70">
          <p>&copy; {new Date().getFullYear()} Soqosoqo Vakamarama iTaukei Cakaudrove. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
