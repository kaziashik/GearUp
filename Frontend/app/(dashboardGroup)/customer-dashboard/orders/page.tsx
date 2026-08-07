import Link from "next/link";
import { apiFetch } from "@/lib/server-api";
import { RentalOrder } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/app/(publicGroup)/_components/GearCard";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function CustomerOrdersPage() {
  const res = await apiFetch<RentalOrder[]>("/api/rentals");
  const orders = res.data || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">My Rental Orders</h1>
      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4">Gear</th>
              <th className="text-left p-4">Dates</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Total</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-4">{order.items?.[0]?.gearItem?.name}</td>
                <td className="p-4 text-muted-foreground">
                  {formatDate(order.startDate)} — {formatDate(order.endDate)}
                </td>
                <td className="p-4"><StatusBadge status={order.status} /></td>
                <td className="p-4 font-medium">{formatCurrency(Number(order.totalAmount))}</td>
                <td className="p-4 space-x-2">
                  {order.status === "CONFIRMED" && (
                    <Button size="sm" asChild><Link href={`/customer-dashboard/orders/${order.id}/pay`}>Pay</Link></Button>
                  )}
                  {order.status === "RETURNED" && (
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/customer-dashboard/orders/${order.id}/review`}>Review</Link>
                    </Button>
                  )}
                  {["PLACED", "CONFIRMED"].includes(order.status) && (
                    <form action={`/api/rentals/${order.id}/cancel`} method="POST">
                      <Button size="sm" variant="destructive" type="submit">Cancel</Button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="text-center py-12 text-muted-foreground">No orders found</p>}
      </div>
    </div>
  );
}
