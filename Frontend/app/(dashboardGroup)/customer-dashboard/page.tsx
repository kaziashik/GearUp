import { apiFetch } from "@/lib/server-api";
import { RentalOrder, Payment } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/app/(publicGroup)/_components/GearCard";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function CustomerDashboardPage() {
  const [rentalsRes, paymentsRes] = await Promise.all([
    apiFetch<RentalOrder[]>("/api/rentals"),
    apiFetch<Payment[]>("/api/payments"),
  ]);

  const rentals = rentalsRes.data || [];
  const payments = paymentsRes.data || [];
  const activeRentals = rentals.filter((r) => !["RETURNED", "CANCELLED"].includes(r.status));

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Customer Dashboard</h1>
        <p className="text-muted-foreground">Track your rentals and payments</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Total Orders", value: rentals.length },
          { label: "Active Rentals", value: activeRentals.length },
          { label: "Payments Made", value: payments.filter((p) => p.status === "COMPLETED").length },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/customer-dashboard/orders">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {rentals.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No orders yet. <Link href="/gear" className="text-primary">Browse gear</Link></p>
          ) : (
            <div className="space-y-3">
              {rentals.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">{order.items?.[0]?.gearItem?.name || "Rental Order"}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.startDate)} — {formatDate(order.endDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={order.status} />
                    <span className="font-semibold">{formatCurrency(Number(order.totalAmount))}</span>
                    {order.status === "CONFIRMED" && (
                      <Button size="sm" asChild>
                        <Link href={`/customer-dashboard/orders/${order.id}/pay`}>Pay Now</Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
