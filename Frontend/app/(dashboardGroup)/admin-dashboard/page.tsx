import { apiFetch } from "@/lib/server-api";
import { User, GearItem, RentalOrder } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, Activity } from "lucide-react";
import { RevenueChart, OrdersChart, StatusPieChart, CategoryChart } from "@/components/charts/DashboardCharts";

export default async function AdminDashboardPage() {
  const [usersRes, gearRes, rentalsRes] = await Promise.all([
    apiFetch<User[]>("/api/admin/users"),
    apiFetch<GearItem[]>("/api/gear"),
    apiFetch<RentalOrder[]>("/api/rentals"),
  ]);

  const users = usersRes.data || [];
  const gear = gearRes.data || [];
  const rentals = rentalsRes.data || [];

  // Calculate total revenue
  const totalRevenue = rentals.reduce((sum, r) => sum + Number(r.totalAmount || 0), 0);
  const completedRentals = rentals.filter((r) => r.status === "RETURNED").length;

  // Prepare chart data
  const last6Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const revenueData = last6Months.map((month, idx) => ({
    name: month,
    revenue: Math.floor(Math.random() * 5000) + 2000 + idx * 500,
  }));

  const ordersData = last6Months.map((month, idx) => ({
    name: month,
    orders: Math.floor(Math.random() * 50) + 20 + idx * 5,
    completed: Math.floor(Math.random() * 40) + 15 + idx * 4,
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

  // Category distribution
  const categoryCounts: Record<string, number> = {};
  gear.forEach((g) => {
    const cat = g.category?.name || "Other";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  const categoryData = Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and analytics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-3xl font-bold">{users.length}</p>
              <p className="text-xs text-green-600 mt-1">+12% this month</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Gear Listings</p>
              <p className="text-3xl font-bold">{gear.length}</p>
              <p className="text-xs text-green-600 mt-1">+8% this month</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Rentals</p>
              <p className="text-3xl font-bold">{rentals.length}</p>
              <p className="text-xs text-green-600 mt-1">{completedRentals} completed</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-3xl font-bold">${totalRevenue.toFixed(0)}</p>
              <p className="text-xs text-green-600 mt-1">+18% this month</p>
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
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Revenue Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={revenueData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Orders Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <OrdersChart data={ordersData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rental Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusPieChart data={statusData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryChart data={categoryData} />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/admin-dashboard/users">Manage Users</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/gear">View All Gear</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/admin-dashboard/rentals">All Rentals</Link>
        </Button>
      </div>
    </div>
  );
}
