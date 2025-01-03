export interface Warranty {
  id: number;
  warrantyType: string;
  customerId: number;
  customerPhoneNumber: string;
  stockInId: number;
  skuId: number;
  orderId: number;
  amount: number;
  returnDate: Date;
  note: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}
