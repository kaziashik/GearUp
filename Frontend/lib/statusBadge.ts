import { RentalStatus } from "./types";

export const statusBadgeConfig: Record<
  RentalStatus,
  { label: string; className: string }
> = {
  PLACED: {
    label: "Placed",
    className: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300",
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300",
  },
  PAID: {
    label: "Paid",
    className: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300",
  },
  PICKED_UP: {
    label: "Picked Up",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300",
  },
  RETURNED: {
    label: "Returned",
    className: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300",
  },
};

export function getStatusBadge(status: RentalStatus) {
  return statusBadgeConfig[status] ?? statusBadgeConfig.PLACED;
}
