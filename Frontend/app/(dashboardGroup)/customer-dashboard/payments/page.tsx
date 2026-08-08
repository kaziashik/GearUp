import { apiFetch } from "@/lib/server-api";
import { Payment } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/app/(publicGroup)/_components/GearCard";

export default async function CustomerPaymentsPage() {
  const res = await apiFetch<Payment[]>("/api/payments");
  const payments = res.data || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Payment History</h1>
      <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Method</th>
              <th className="text-left p-4">Amount</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-4">{formatDate(p.createdAt)}</td>
                <td className="p-4">{p.method}</td>
                <td className="p-4 font-medium">{formatCurrency(Number(p.amount))}</td>
                <td className="p-4"><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {payments.length === 0 && <p className="text-center py-12 text-muted-foreground">No payments yet</p>}
      </div>
    </div>
  );
}
