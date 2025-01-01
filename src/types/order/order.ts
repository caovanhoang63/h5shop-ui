export interface Order {
  id: number;
  customerId: number;
  sellerId: number;
  status: number;
  orderType: OrderType;
  createdAt: Date;
  updatedAt: Date;
}

export enum OrderType {
  Retail = "retail",
  Wholesale = "wholesale",
}
