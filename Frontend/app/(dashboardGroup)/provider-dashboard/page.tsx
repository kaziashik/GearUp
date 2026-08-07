import { apiFetch } from "@/lib/server-api";
import { GearItem, RentalOrder } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ProviderDashboardPage() {
  const [gearRes, ordersRes] = await Promise.all([
    apiFetch<GearItem[]>("/api/provider/gear"),
    apiFetch<RentalOrder[]>("/api/provider/orders"),
  ]);

  const gear = gearRes.data || [];
  const orders = ordersRes.data || [];
  const pending = orders.filter((o) => o.status === "PLACED");

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Provider Dashboard</h1>
        <p className="text-muted-foreground">Manage your gear inventory and orders</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Gear Listed", value: gear.length },
          { label: "Pending Orders", value: pending.length },
          { label: "Total Orders", value: orders.length },
        ].map((s) => (
          <Card key={s.label}><CardContent className="p-6"><p className="text-sm text-muted-foreground">{s.label}</p><p className="text-3xl font-bold">{s.value}</p></CardContent></Card>
        ))}
      </div>

      <div className="flex gap-3">
        <Button asChild><Link href="/provider-dashboard/gear/new">Add New Gear</Link></Button>
        <Button variant="outline" asChild><Link href="/provider-dashboard/orders">View Orders</Link></Button>
      </div>
    </div>
  );
}
