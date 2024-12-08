export interface InventoryReport {
  id: number;
  amount: number;
  warehouseMan: number;
  status: number;
  dif: number;
  totalPrice: number;
  note: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}
