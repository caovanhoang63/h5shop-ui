export interface InventoryItemStockTake {
  id: number;
  name: string;
  stock: number;
  actualQuantity?: number;
  variance?: number;
  varianceValue?: number;
  image?: string;
  price?: number;
}
