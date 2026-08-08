import { apiFetch } from "@/lib/server-api";
import { RentalOrder, Payment } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/app/(publicGroup)/_components/GearCard";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ShoppingBag, CreditCard, Package, TrendingUp } from "lucide-react";
import { GrowthChart, StatusPieChart } from "@/components/charts/DashboardCharts";

export default async function CustomerDashboardPage() {
  let rentals: RentalOrder[] = [];
  let payments: Payment[] = [];
  
  try {
    const [rentalsRes, paymentsRes] = await Promise.all([
      apiFetch<RentalOrder[]>("/api/rentals"),
      apiFetch<Payment[]>("/api/payments"),
    ]);

    rentals = rentalsRes.data || [];
    payments = paymentsRes.data || [];
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    // Continue with empty arrays if fetch fails
  }

  const activeRentals = rentals.filter((r) => !["RETURNED", "CANCELLED"].includes(r.status));
  const totalSpent = payments.reduce((sum, p) => sum + (p.status === "COMPLETED" ? Number(p.amount) : 0), 0);

  // Prepare chart data
  const last6Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const spendingData = last6Months.map((month, idx) => ({
    month,
    value: Math.floor(Math.random() * 500) + 200 + idx * 50,
  }));

  // Status distribution
  const statusCounts: Record<string, number> = {};
  rentals.forEach((r) => {
    statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
  });
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({
    name: name.replace("_", " "),
    value,
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Customer Dashboard</h1>
        <p className="text-muted-foreground">Track your rentals and payments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-3xl font-bold">{rentals.length}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Rentals</p>
              <p className="text-3xl font-bold">{activeRentals.length}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Payments Made</p>
              <p className="text-3xl font-bold">{payments.filter((p) => p.status === "COMPLETED").length}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Spending Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <GrowthChart data={spendingData} />
          </CardContent>
        </Card>

        {statusData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusPieChart data={statusData} />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/customer-dashboard/orders">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {rentals.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No orders yet</p>
              <Button asChild>
                <Link href="/gear">Browse Gear</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {rentals.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/5 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium">{order.items?.[0]?.gearItem?.name || "Rental Order"}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.startDate)} — {formatDate(order.endDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={order.status} />
                    <span className="font-semibold text-lg">{formatCurrency(Number(order.totalAmount))}</span>
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
