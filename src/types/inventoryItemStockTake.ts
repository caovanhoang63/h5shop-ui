export interface InventoryItemStockTake {
  id: number;
  code: string;
  name: string;
  stockQuantity: number;
  actualQuantity?: number;
  variance?: number;
  varianceValue?: number;
}
