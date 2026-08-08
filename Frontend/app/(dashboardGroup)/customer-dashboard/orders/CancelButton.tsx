"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function CancelButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const router = useRouter();

  async function handleCancel() {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/rentals/${orderId}/cancel`, {
        method: "PATCH",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Order cancelled successfully");
        router.refresh();
      } else {
        toast.error(data.message || "Failed to cancel order");
      }
    } catch (error) {
      toast.error("Failed to cancel order");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        size="sm"
        variant="destructive"
        className="w-full"
        onClick={() => setShowDialog(true)}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            Cancelling...
          </>
        ) : (
          "Cancel"
        )}
      </Button>

      <ConfirmDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onConfirm={handleCancel}
        title="Cancel Order"
        description="Are you sure you want to cancel this rental order? This action cannot be undone."
        confirmText="Yes, Cancel Order"
        cancelText="No, Keep Order"
        variant="destructive"
      />
    </>
  );
}
