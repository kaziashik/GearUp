"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/app/(publicGroup)/_components/GearCard";
import { RentalOrder } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState<RentalOrder[]>([]);

  useEffect(() => {
    fetch("/api/provider/orders")
      .then((r) => r.json())
      .then((j) => setOrders(j.data || []));
  }, []);

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/provider/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (json.success) {
      toast.success("Order updated!");
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: status as RentalOrder["status"] } : o)));
    } else {
      toast.error(json.message);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Incoming Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-xl border p-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-medium">{order.customer?.name} — {order.items?.[0]?.gearItem?.name}</p>
              <p className="text-sm text-muted-foreground">{formatDate(order.startDate)} — {formatDate(order.endDate)}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={order.status} />
              {order.status === "PLACED" && <Button size="sm" onClick={() => updateStatus(order.id, "CONFIRMED")}>Confirm</Button>}
              {order.status === "PAID" && <Button size="sm" onClick={() => updateStatus(order.id, "PICKED_UP")}>Mark Picked Up</Button>}
              {order.status === "PICKED_UP" && <Button size="sm" onClick={() => updateStatus(order.id, "RETURNED")}>Mark Returned</Button>}
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="text-muted-foreground text-center py-12">No orders yet</p>}
      </div>
    </div>
  );
}
