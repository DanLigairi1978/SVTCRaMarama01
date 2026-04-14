import Link from "next/link";
import { Logo } from "./logo";
import { Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-gray-400 max-w-xs">
              Soqosoqo Vakamarama iTaukei Cakaudrove. Empowering indigenous women to stand up and shine.
            </p>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="font-headline font-semibold mb-3 text-white">Navigate</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link href="/work" className="text-gray-400 hover:text-white">Our Work</Link>_</li>
                <li><Link href="/involved" className="text-gray-400 hover:text-white">Get Involved</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-headline font-semibold mb-3 text-white">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-headline font-semibold mb-3 text-white">Connect</h4>
              <div className="flex space-x-4">
                <Link href="https://www.facebook.com/soqosoqo.vakamarama.cakaudrove" className="text-gray-400 hover:text-white" target="_blank" rel="noopener noreferrer"><Facebook /></Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Meridian Solutions (Fiji) Ltd. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
