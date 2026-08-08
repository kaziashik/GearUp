import Link from "next/link";
import { Search, MessageCircle, BookOpen, Mail, Phone, ChevronRight, Clock, Users, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "How do I create an account?",
        a: "Click 'Get Started' in the navigation bar, fill in your details, and verify your email. You can also sign up using Google for faster registration.",
      },
      {
        q: "How do I rent gear?",
        a: "Browse our catalog, select your item, choose your rental dates, and complete checkout. You'll receive instant confirmation with pickup/delivery details.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards (Visa, Mastercard, Amex, Discover) through our secure Stripe payment gateway.",
      },
    ],
  },
  {
    category: "Rentals & Bookings",
    questions: [
      {
        q: "Can I cancel or modify my booking?",
        a: "Yes! Free cancellation up to 24 hours before your rental start date. For modifications, contact the provider directly through your dashboard.",
      },
      {
        q: "What happens if gear gets damaged?",
        a: "All rentals include basic damage protection. Minor wear and tear is covered. For significant damage, a fee may apply based on the provider's policy.",
      },
      {
        q: "How does pickup/delivery work?",
        a: "Each listing specifies pickup location or delivery options. Coordinates with the provider after booking confirmation for exact arrangements.",
      },
    ],
  },
  {
    category: "For Providers",
    questions: [
      {
        q: "How do I become a provider?",
        a: "Register as a provider, submit verification documents (ID, proof of gear ownership), and list your items. Approval typically takes 2-3 business days.",
      },
      {
        q: "What commission does GearUp take?",
        a: "We charge a 15% service fee on completed bookings. Payments are processed within 2 business days after rental completion.",
      },
      {
        q: "How do I manage my inventory?",
        a: "Access your Provider Dashboard to add/edit listings, manage availability, view bookings, and track earnings in real-time.",
      },
    ],
  },
  {
    category: "Account & Security",
    questions: [
      {
        q: "Is my payment information secure?",
        a: "Yes! We use Stripe, a PCI-compliant payment processor. Your card details are never stored on our servers.",
      },
      {
        q: "How do I reset my password?",
        a: "Click 'Forgot Password' on the login page, enter your email, and follow the reset link sent to your inbox.",
      },
      {
        q: "Can I delete my account?",
        a: "Yes, go to Settings > Account > Delete Account. Note that active bookings must be completed or cancelled first.",
      },
    ],
  },
];

const contactOptions = [
  {
    icon: MessageCircle,
    title: "Live Chat",
    desc: "Chat with our support team",
    action: "Start Chat",
    color: "text-primary",
    available: "Available 24/7",
  },
  {
    icon: Mail,
    title: "Email Support",
    desc: "support@gearup.com",
    action: "Send Email",
    color: "text-secondary",
    available: "Response within 2 hours",
  },
  {
    icon: Phone,
    title: "Phone Support",
    desc: "+1 (234) 567-890",
    action: "Call Now",
    color: "text-accent",
    available: "Mon-Fri, 9AM-6PM PST",
  },
];

export default function HelpPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="gradient-hero border-b">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">How Can We Help?</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Search our knowledge base or contact support for assistance
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for help..."
                className="w-full pl-12 pr-4 py-4 rounded-lg border-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Clock, label: "Avg Response Time", value: "< 2 hours" },
            { icon: Users, label: "Support Agents", value: "24/7" },
            { icon: Shield, label: "Resolution Rate", value: "98%" },
            { icon: Zap, label: "Articles", value: "200+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <p className="font-bold text-lg mb-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Options */}
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Contact Our Support Team</h2>
            <p className="text-muted-foreground">Choose your preferred way to reach us</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {contactOptions.map((option) => (
              <div key={option.title} className="rounded-xl border bg-card p-6 text-center hover:shadow-lg transition-shadow">
                <div className={`h-14 w-14 rounded-full bg-${option.color.split("-")[1]}/10 flex items-center justify-center mx-auto mb-4`}>
                  <option.icon className={`h-7 w-7 ${option.color}`} />
                </div>
                <h3 className="font-semibold text-lg mb-1">{option.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{option.desc}</p>
                <p className="text-xs text-muted-foreground mb-4">{option.available}</p>
                <Button variant="outline" className="w-full">
                  {option.action}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Find answers to common questions</p>
          </div>

          <div className="space-y-8">
            {faqs.map((section) => (
              <div key={section.category}>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  {section.category}
                </h3>
                <div className="space-y-3">
                  {section.questions.map((faq, idx) => (
                    <details key={idx} className="group rounded-lg border bg-card">
                      <summary className="cursor-pointer p-4 font-medium hover:text-primary transition-colors flex items-center justify-between">
                        {faq.q}
                        <ChevronRight className="h-5 w-5 transition-transform group-open:rotate-90" />
                      </summary>
                      <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">More Resources</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                href="/blog"
                className="rounded-lg border bg-card p-4 hover:shadow-lg transition-shadow group"
              >
                <BookOpen className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">Blog & Guides</h3>
                <p className="text-sm text-muted-foreground">Tips and tutorials</p>
              </Link>
              <Link
                href="/about"
                className="rounded-lg border bg-card p-4 hover:shadow-lg transition-shadow group"
              >
                <Users className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">About GearUp</h3>
                <p className="text-sm text-muted-foreground">Learn about our mission</p>
              </Link>
              <Link
                href="/contact"
                className="rounded-lg border bg-card p-4 hover:shadow-lg transition-shadow group"
              >
                <Mail className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">Contact Us</h3>
                <p className="text-sm text-muted-foreground">Get in touch</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
        <p className="text-muted-foreground mb-6">Our support team is here to assist you</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button size="lg">Contact Support</Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/contact">Send Feedback</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
