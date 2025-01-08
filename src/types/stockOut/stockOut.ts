export interface StockOutDetail {
  id: number;
  providerId: number;
  providerName: string;
  warehouseMen: number;
  warehouseName: string;
  items: StockItemDetail[];
  totalAmount: number;
  status: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface StockItemDetail {
  skuId: number;
  name: string;
  amount: number;
  price: number;
}

export interface StockOutItemTable {
  id: number;
  warehouseMen: number;
  status: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  totalAmount: number;
  stockOutReasonName: string;
  stockOutReasonId: number;
  stockOutReasonDescription: string;
}
export interface StockOutCreate {
  warehouseMen: number;
  stockOutReasonId: number;
  items: StockOutDetailCreate[];
}
interface StockOutDetailCreate {
  skuId: number;
  amount: number;
  costPrice: number;
  totalPrice: number;
}

export interface StockOutItemAdd {
  id: number;
  name?: string;
  stock: number;
  amount: number;
  costPrice: number;
  totalPrice: number;
}

export interface StockOutItemSearch {
  id: number;
  name: string;
  price: number;
  stock: number;
}
export interface StockOutReason {
  id: number;
  name: string;
  description: string | null;
  status: number;
  updatedAt: Date | null;
  createdAt: Date | null;
}
