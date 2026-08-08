import Link from "next/link";
import { Dumbbell, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-6 md:py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 md:gap-6">
        {/* Brand Section */}
        <div className="space-y-2.5 lg:col-span-2">
          <div className="flex items-center gap-1.5 font-bold text-sm">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Dumbbell className="h-3 w-3" />
            </div>
            GearUp
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Rent premium sports & outdoor gear instantly.
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail className="h-3 w-3 text-primary" />
              <a href="mailto:support@gearup.com" className="hover:text-primary transition-colors">
                support@gearup.com
              </a>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Phone className="h-3 w-3 text-primary" />
              <a href="tel:+1234567890" className="hover:text-primary transition-colors">
                +1 (234) 567-890
              </a>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 text-primary" />
              <span>San Francisco, CA</span>
            </div>
          </div>
        </div>

        {/* Explore Links */}
        <div>
          <h4 className="font-semibold text-xs mb-2.5">Explore</h4>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><Link href="/gear" className="hover:text-primary transition-colors">Browse Gear</Link></li>
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* For Partners */}
        <div>
          <h4 className="font-semibold text-xs mb-2.5">For Partners</h4>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li><Link href="/register?role=PROVIDER" className="hover:text-primary transition-colors">Become a Provider</Link></li>
            <li><Link href="/provider-dashboard" className="hover:text-primary transition-colors">Provider Dashboard</Link></li>
            <li><Link href="/help" className="hover:text-primary transition-colors">How It Works</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Partner Support</Link></li>
          </ul>
        </div>

        {/* Support & Legal */}
        <div>
          <h4 className="font-semibold text-xs mb-2.5">Support</h4>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Support</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t">
        <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} GearUp. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://github.com/kaziashik/GearUp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
