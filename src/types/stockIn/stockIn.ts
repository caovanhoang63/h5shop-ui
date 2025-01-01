export interface StockInDetails {
  id: number;
  amount: number;
  warehouseMan: number;
  warehouseName: string;
  providerId: number;
  providerName: string;
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
  price: number;
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
export interface StockInCreate {
  warehouseMen: number;
  providerId: number;
  items: StockInDetailCreate[];
}
interface StockInDetailCreate {
  skuId: number;
  amount: number;
  costPrice: number;
  totalPrice: number;
}

export interface StockInItemAdd {
  id: number;
  code?: string;
  name?: string;
  amount: number;
  costPrice: number;
  totalPrice: number;
}

export interface StockInItemSearch {
  id: number;
  name: string;
  price: number;
}
