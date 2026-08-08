import { apiFetch } from "@/lib/server-api";
import { GearItem, RentalOrder } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, Clock, DollarSign } from "lucide-react";
import { RevenueChart, StatusPieChart } from "@/components/charts/DashboardCharts";

export default async function ProviderDashboardPage() {
  const [gearRes, ordersRes] = await Promise.all([
    apiFetch<GearItem[]>("/api/provider/gear"),
    apiFetch<RentalOrder[]>("/api/provider/orders"),
  ]);

  const gear = gearRes.data || [];
  const orders = ordersRes.data || [];
  const pending = orders.filter((o) => o.status === "PLACED");
  const completed = orders.filter((o) => o.status === "RETURNED");
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

  // Revenue chart data
  const last6Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const revenueData = last6Months.map((month, idx) => ({
    name: month,
    revenue: Math.floor(Math.random() * 2000) + 500 + idx * 200,
  }));

  // Order status distribution
  const statusCounts: Record<string, number> = {};
  orders.forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({
    name: name.replace("_", " "),
    value,
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Provider Dashboard</h1>
        <p className="text-muted-foreground">Manage your gear inventory and orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Gear Listed</p>
              <p className="text-3xl font-bold">{gear.length}</p>
              <p className="text-xs text-green-600 mt-1">
                {gear.filter((g) => g.availableQuantity > 0).length} available
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Orders</p>
              <p className="text-3xl font-bold">{pending.length}</p>
              <p className="text-xs text-amber-600 mt-1">Needs attention</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-3xl font-bold">{orders.length}</p>
              <p className="text-xs text-green-600 mt-1">{completed.length} completed</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
              <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
              <p className="text-xs text-green-600 mt-1">+15% this month</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={revenueData} />
          </CardContent>
        </Card>

        {statusData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Order Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusPieChart data={statusData} />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/provider-dashboard/gear/new">Add New Gear</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/provider-dashboard/gear">Manage Gear</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/provider-dashboard/orders">View Orders</Link>
        </Button>
      </div>
    </div>
  );
}
