import Link from "next/link";
import { Dumbbell } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Dumbbell className="h-5 w-5 text-primary" />
            GearUp
          </div>
          <p className="text-sm text-muted-foreground">
            Rent premium sports & outdoor gear instantly. Adventure made accessible.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/gear" className="hover:text-primary">Browse Gear</Link></li>
            <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link href="/services" className="hover:text-primary">Services</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">For Partners</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/register?role=PROVIDER" className="hover:text-primary">Become a Provider</Link></li>
            <li><Link href="/contact" className="hover:text-primary">Contact Sales</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/contact" className="hover:text-primary">Help Center</Link></li>
            <li><Link href="/contact" className="hover:text-primary">Terms & Privacy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} GearUp. All rights reserved.
      </div>
    </footer>
  );
}
