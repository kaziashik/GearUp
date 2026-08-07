export default function ServicesPage() {
  const services = [
    { title: "Gear Rental", desc: "Browse and rent bikes, tents, kayaks, fitness equipment and more." },
    { title: "Provider Tools", desc: "List inventory, manage availability, and fulfill orders easily." },
    { title: "Secure Payments", desc: "Stripe-powered checkout with instant confirmation." },
    { title: "Order Tracking", desc: "Real-time status updates from booking to return." },
  ];

  return (
    <div className="container mx-auto px-4 py-16 animate-fade-in">
      <h1 className="text-4xl font-bold mb-4 text-center">Our Services</h1>
      <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
        Everything you need for your next outdoor adventure
      </p>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {services.map((s) => (
          <div key={s.title} className="rounded-xl border p-6 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
            <p className="text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
