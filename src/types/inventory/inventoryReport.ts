export interface InventoryReport {
  id: number;
  amount: number;
  warehouseMan: number;
  status: number;
  inventoryDif: number;
  note: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface InventoryReportDetails {
  inventoryReportId: number;
  amount: number;
  warehouseMan: number;
  warehouseName: string;
  status: number;
  items: InventoryItem[];
  note: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}
interface InventoryItem {
  skuId: number;
  name: string;
  amount: number;
  oldStock: number;
  price: number | null;
  inventoryDif: number;
  actualQuantity?: number;
  varianceValue?: number;
}
export interface InventoryReportCreate {
  warehouseMan1: number;
  warehouseMan2?: number;
  warehouseMan3?: number;
  note?: string;
  items: InventoryReportDetailCreate[];
}
interface InventoryReportDetailCreate {
  skuId: number;
  amount: number;
  oldStock: number;
  inventoryDif: number;
}
