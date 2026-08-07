export interface CreateRentalInput {
  startDate: string;
  endDate: string;
  items: { gearItemId: string; quantity: number }[];
  notes?: string;
}

export interface UpdateRentalStatusInput {
  status: "CONFIRMED" | "CANCELLED" | "PICKED_UP" | "RETURNED";
}
