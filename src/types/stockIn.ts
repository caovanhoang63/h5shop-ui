export interface StockInDetails {
  stockId: number;
  amount: number;
  warehouseMan: number;
  warehouseName: string;
  status: number;
  items: StockInItem[];
  note: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}
interface StockInItem {
  skuId: number;
  name: string;
  amount: number;
}

export interface StockInItemTable {
  id: number;
  providerId: number;
  providerName: string;
  warehouseMen: number;
  totalAmount: number;
  status: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}
