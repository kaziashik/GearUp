import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Truck,
  Zap,
  Mountain,
  Bike,
  Tent,
  Backpack,
  Users,
  Package,
  Star,
  CheckCircle2,
  Quote,
  ChevronDown,
} from "lucide-react";
import { Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/api";
import { GearItem, ApiResponse } from "@/lib/types";
import { GearCard } from "./_components/GearCard";
import { AnimatedHeroBackground } from "./_components/AnimatedHeroBackground";

export default async function HomePage() {
  let featured: GearItem[] = [];
  try {
    const res = await fetch(`${API_URL}/api/gear?limit=6&available=true`, {
      cache: "no-store",
    });
    const json = (await res.json()) as ApiResponse<GearItem[]>;
    featured = json.data || [];
  } catch {
    featured = [];
  }

  return (
    <div>
      {/* Hero Section with Animated Background */}
      <section className="gradient-hero border-b relative overflow-hidden min-h-[600px] md:min-h-[700px] flex items-center">
        {/* Animated Background */}
        <AnimatedHeroBackground />
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl animate-fade-in">
            <p className="text-primary font-semibold mb-3 flex items-center gap-2 animate-slide-down">
              <Dumbbell className="h-5 w-5" />
              Sports & Outdoor Rentals
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight animate-slide-up">
              Rent Premium Gear.{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient-x">
                Adventure Instantly.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed animate-fade-in-delay">
              From mountain bikes to camping tents — find verified gear from trusted providers,
              book your dates, and hit the trail in minutes.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-delay-2">
              <Button size="lg" asChild className="group shadow-lg hover:shadow-xl transition-all">
                <Link href="/gear">
                  Browse Gear <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="shadow-md hover:shadow-lg transition-all">
                <Link href="/register">Join as Provider</Link>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
          <ChevronDown className="h-6 w-6 text-muted-foreground" />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose GearUp?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience seamless rentals with industry-leading features designed for adventurers.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: "Instant Booking",
              desc: "Select dates and reserve gear in seconds with real-time availability.",
              color: "text-secondary",
            },
            {
              icon: Shield,
              title: "Secure Payments",
              desc: "Stripe-powered checkout with bank-level security you can trust.",
              color: "text-primary",
            },
            {
              icon: Truck,
              title: "Verified Providers",
              desc: "Quality gear from vetted rental shops with 5-star ratings.",
              color: "text-accent",
            },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="group rounded-xl border bg-card p-6 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className={`h-12 w-12 rounded-lg bg-${color.split("-")[1]}/10 flex items-center justify-center mb-4`}>
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore by Category</h2>
            <p className="text-muted-foreground">Find the perfect gear for your next adventure</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Mountain, name: "Climbing", count: "45+ items", color: "bg-primary" },
              { icon: Bike, name: "Cycling", count: "60+ items", color: "bg-secondary" },
              { icon: Tent, name: "Camping", count: "38+ items", color: "bg-accent" },
              { icon: Backpack, name: "Hiking", count: "52+ items", color: "bg-primary" },
            ].map(({ icon: Icon, name, count, color }) => (
              <Link
                key={name}
                href={`/gear?category=${name.toLowerCase()}`}
                className="group rounded-xl border bg-card p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className={`h-14 w-14 rounded-lg ${color}/10 flex items-center justify-center mx-auto mb-3`}>
                  <Icon className={`h-7 w-7 ${color.replace("bg-", "text-")}`} />
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{name}</h3>
                <p className="text-xs text-muted-foreground">{count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Users, value: "10K+", label: "Happy Customers" },
            { icon: Package, value: "500+", label: "Gear Items" },
            { icon: Star, value: "4.9", label: "Average Rating" },
            { icon: CheckCircle2, value: "25K+", label: "Bookings Completed" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <p className="text-3xl md:text-4xl font-bold mb-1">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Gear Section */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Gear</h2>
              <p className="text-muted-foreground">Popular rentals ready for your next adventure</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/gear">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((gear) => (
              <GearCard key={gear.id} gear={gear} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get started with GearUp in three simple steps
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          {[
            {
              step: "01",
              title: "Browse & Select",
              desc: "Search our catalog of premium gear and choose what fits your adventure.",
            },
            {
              step: "02",
              title: "Pick Your Dates",
              desc: "Select rental dates with our easy calendar and see instant pricing.",
            },
            {
              step: "03",
              title: "Rent & Enjoy",
              desc: "Complete secure checkout and receive confirmation instantly.",
            },
          ].map(({ step, title, desc }, idx) => (
            <div key={step} className="relative">
              <div className="text-6xl font-bold text-primary/10 mb-4">{step}</div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground">{desc}</p>
              {idx < 2 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-border -translate-x-1/2" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-muted-foreground">Real experiences from real adventurers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Johnson",
                role: "Mountain Climber",
                text: "GearUp made my climbing trip seamless. The gear was top quality and the booking process was incredibly smooth!",
                rating: 5,
              },
              {
                name: "Mike Chen",
                role: "Cycling Enthusiast",
                text: "I rent bikes every weekend through GearUp. Reliable service, great prices, and amazing customer support.",
                rating: 5,
              },
              {
                name: "Emma Davis",
                role: "Camping Expert",
                text: "As a provider, GearUp has transformed my rental business. The platform is intuitive and my bookings have doubled!",
                rating: 5,
              },
            ].map((testimonial) => (
              <div key={testimonial.name} className="rounded-xl border bg-card p-6 relative">
                <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-sm mb-4 leading-relaxed text-muted-foreground">{testimonial.text}</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about GearUp</p>
          </div>
          <div className="space-y-4">
            {[
              {
                q: "How do I rent gear?",
                a: "Browse our catalog, select your dates, and complete secure checkout. You'll receive instant confirmation with pickup details.",
              },
              {
                q: "What if the gear gets damaged?",
                a: "All rentals include basic damage protection. For valuable items, optional premium insurance is available at checkout.",
              },
              {
                q: "Can I cancel my booking?",
                a: "Yes! Free cancellation up to 24 hours before your rental start date. Full refund issued within 5-7 business days.",
              },
              {
                q: "How do I become a provider?",
                a: "Sign up as a provider, submit verification documents, and list your gear. Start earning passive income within days!",
              },
            ].map((faq, idx) => (
              <details key={idx} className="group rounded-lg border bg-card">
                <summary className="cursor-pointer p-4 font-semibold hover:text-primary transition-colors flex items-center justify-between">
                  {faq.q}
                  <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Adventure?</h2>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto mb-8 text-lg">
            Join thousands of adventurers renting premium gear on GearUp
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/gear">
                Browse Gear <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary" asChild>
              <Link href="/register">Sign Up Free</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
