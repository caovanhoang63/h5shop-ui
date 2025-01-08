export interface OrderItemTable {
  id: number;
  customerId?: number;
  customerName?: string;
  customerPhone?: string;
  sellerId: number;
  sellerName?: string;
  status: number;
  orderType: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  pointUsed: number;
}
