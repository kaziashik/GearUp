export interface CreatePaymentInput {
  rentalOrderId: string;
  method?: "STRIPE" | "SSLCOMMERZ";
}
