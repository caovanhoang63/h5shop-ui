export interface Order {
  id: number;
  customerId: number;
  sellerId: number;
  status: number;
  orderType: OrderType;
  description?: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum OrderType {
  Retail = "retail",
  Wholesale = "wholesale",
}
