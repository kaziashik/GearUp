import Link from "next/link";
import { CancelButton } from "./CancelButton";
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
                <td className="p-4">
                  <div className="flex flex-col gap-2 min-w-[100px]">
                    {["PLACED", "CONFIRMED"].includes(order.status) && (
                      <Button size="sm" className="w-full" asChild>
                        <Link href={`/customer-dashboard/orders/${order.id}/pay`}>Pay</Link>
                      </Button>
                    )}
                    {["PLACED", "CONFIRMED"].includes(order.status) && (
                      <CancelButton orderId={order.id} />
                    )}
                    {order.status === "RETURNED" && (
                      <Button size="sm" variant="outline" className="w-full" asChild>
                        <Link href={`/customer-dashboard/orders/${order.id}/review`}>Review</Link>
                      </Button>
                    )}
                  </div>
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
