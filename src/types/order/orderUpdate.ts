export interface OrderUpdate {
  customerId?: number | null;
  sellerId?: number;
  orderType?: string;
  description?: string;
  status?: number;
}
