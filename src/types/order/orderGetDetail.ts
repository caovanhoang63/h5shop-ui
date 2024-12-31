export interface OrderGetDetail {
  id: number;
  customerId: number;
  sellerId: number;
  status: number;
  orderType: string;
  description: string;
  createAt: Date;
  updateAt: Date;
  items: OrderItem[];
}

export interface OrderItem {
  orderId: number;
  skuId: number;
  amount: number;
  unitPrice: number;
  discount: number;
  description?: string;
  createAt: Date;
}
