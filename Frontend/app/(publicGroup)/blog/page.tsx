import Link from "next/link";
import { ArrowRight, Calendar, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const blogPosts = [
  {
    id: "1",
    title: "10 Essential Camping Gear Items for Beginners",
    excerpt: "Starting your camping journey? Here's everything you need to know about essential gear that will make your first outdoor experience comfortable and safe.",
    category: "Camping",
    author: "Sarah Johnson",
    date: "Aug 5, 2026",
    readTime: "5 min read",
    image: "https://placehold.co/800x500/14b8a6/fff?text=Camping+Gear",
  },
  {
    id: "2",
    title: "How to Choose the Right Mountain Bike for Your Trail",
    excerpt: "Different trails require different bikes. Learn how to match your riding style and terrain with the perfect mountain bike rental.",
    category: "Cycling",
    author: "Mike Chen",
    date: "Aug 3, 2026",
    readTime: "7 min read",
    image: "https://placehold.co/800x500/0ea5e9/fff?text=Mountain+Bike",
  },
  {
    id: "3",
    title: "Winter Sports Safety: A Complete Guide",
    excerpt: "Stay safe on the slopes this winter with our comprehensive guide to winter sports safety equipment and best practices.",
    category: "Winter Sports",
    author: "Emma Davis",
    date: "Aug 1, 2026",
    readTime: "6 min read",
    image: "https://placehold.co/800x500/f97316/fff?text=Winter+Sports",
  },
  {
    id: "4",
    title: "Top 5 Hiking Trails for Summer Adventures",
    excerpt: "Explore breathtaking hiking trails perfect for summer adventures. We've compiled a list of must-visit destinations.",
    category: "Hiking",
    author: "Alex Thompson",
    date: "Jul 28, 2026",
    readTime: "8 min read",
    image: "https://placehold.co/800x500/14b8a6/fff?text=Hiking+Trails",
  },
  {
    id: "5",
    title: "Kayaking for Beginners: Getting Started",
    excerpt: "New to kayaking? Learn the basics of equipment, techniques, and safety to start your water adventures with confidence.",
    category: "Water Sports",
    author: "Jordan Lee",
    date: "Jul 25, 2026",
    readTime: "5 min read",
    image: "https://placehold.co/800x500/0ea5e9/fff?text=Kayaking",
  },
  {
    id: "6",
    title: "Sustainable Outdoor Recreation: Rent Don't Buy",
    excerpt: "Discover how renting gear instead of buying contributes to a more sustainable approach to outdoor recreation.",
    category: "Sustainability",
    author: "Rachel Green",
    date: "Jul 22, 2026",
    readTime: "4 min read",
    image: "https://placehold.co/800x500/f97316/fff?text=Sustainability",
  },
];

const categories = ["All", "Camping", "Cycling", "Hiking", "Water Sports", "Winter Sports"];

export default function BlogPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="gradient-hero border-b">
        <div className="container mx-auto px-4 py-8 md:py-10">
          <div className="max-w-3xl">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">GearUp Blog</h1>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Tips, guides, and stories from the outdoor adventure community. Stay informed and inspired.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-b bg-background sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={cat === "All" ? "default" : "outline"}
                size="sm"
                className="rounded-full"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="group rounded-xl border bg-card overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                <img
                  src={post.image}
                  alt={post.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h2 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  <Link href={`/blog/${post.id}`}>{post.title}</Link>
                </h2>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild className="w-full group/btn">
                  <Link href={`/blog/${post.id}`}>
                    Read More <ArrowRight className="ml-2 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Subscribe to our newsletter for the latest gear tips, adventure stories, and exclusive rental deals.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
