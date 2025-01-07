import { OrderItem } from "@/types/orderItem/orderItem.ts";

export interface OrderGetDetail {
  id: number;
  customerId?: number;
  sellerId: number;
  status: number;
  orderType: string;
  description?: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  pointUsed: number;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
}
