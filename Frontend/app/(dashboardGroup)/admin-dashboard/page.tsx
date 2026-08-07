import { apiFetch } from "@/lib/server-api";
import { User, GearItem, RentalOrder } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const [usersRes, gearRes, rentalsRes] = await Promise.all([
    apiFetch<User[]>("/api/admin/users?limit=5"),
    apiFetch<GearItem[]>("/api/admin/gear?limit=5"),
    apiFetch<RentalOrder[]>("/api/admin/rentals?limit=5"),
  ]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and moderation</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Total Users</p><p className="text-3xl font-bold">{usersRes.meta?.total || 0}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Gear Listings</p><p className="text-3xl font-bold">{gearRes.meta?.total || 0}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Total Rentals</p><p className="text-3xl font-bold">{rentalsRes.meta?.total || 0}</p></CardContent></Card>
      </div>

      <div className="flex gap-3">
        <Button asChild><Link href="/admin-dashboard/users">Manage Users</Link></Button>
        <Button variant="outline" asChild><Link href="/admin-dashboard/gear">All Gear</Link></Button>
        <Button variant="outline" asChild><Link href="/admin-dashboard/rentals">All Rentals</Link></Button>
      </div>
    </div>
  );
}
