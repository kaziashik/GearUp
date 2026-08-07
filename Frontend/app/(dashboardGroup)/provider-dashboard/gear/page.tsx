import { apiFetch } from "@/lib/server-api";
import { GearItem } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export default async function ProviderGearPage() {
  const res = await apiFetch<GearItem[]>("/api/provider/gear");
  const gear = res.data || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Gear Inventory</h1>
        <Button asChild><Link href="/provider-dashboard/gear/new">Add Gear</Link></Button>
      </div>
      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Brand</th>
              <th className="text-left p-4">Price/Day</th>
              <th className="text-left p-4">Available</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {gear.map((g) => (
              <tr key={g.id} className="border-t">
                <td className="p-4 font-medium">{g.name}</td>
                <td className="p-4">{g.brand}</td>
                <td className="p-4">{formatCurrency(Number(g.pricePerDay))}</td>
                <td className="p-4">{g.availableQuantity}/{g.quantity}</td>
                <td className="p-4">{g.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {gear.length === 0 && <p className="text-center py-12 text-muted-foreground">No gear listed yet</p>}
      </div>
    </div>
  );
}
