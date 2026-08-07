import Link from "next/link";
import { ArrowRight, Shield, Truck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/server-api";
import { GearItem } from "@/lib/types";
import { GearCard } from "./_components/GearCard";

export default async function HomePage() {
  const res = await apiFetch<GearItem[]>("/api/gear?limit=6&available=true");
  const featured = res.data || [];

  return (
    <div>
      <section className="gradient-hero border-b">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-3xl animate-fade-in">
            <p className="text-primary font-semibold mb-3">🏋️ Sports & Outdoor Rentals</p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Rent Premium Gear.{" "}
              <span className="text-primary">Adventure Instantly.</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              From mountain bikes to camping tents — find verified gear from trusted providers,
              book your dates, and hit the trail in minutes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/gear">
                  Browse Gear <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/register">Join as Provider</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Zap, title: "Instant Booking", desc: "Select dates and reserve gear in seconds." },
            { icon: Shield, title: "Secure Payments", desc: "Stripe-powered checkout you can trust." },
            { icon: Truck, title: "Verified Providers", desc: "Quality gear from vetted rental shops." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border p-6 hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Featured Gear</h2>
            <p className="text-muted-foreground">Popular rentals ready for your next adventure</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/gear">View All</Link>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((gear) => (
            <GearCard key={gear.id} gear={gear} />
          ))}
        </div>
      </section>
    </div>
  );
}
