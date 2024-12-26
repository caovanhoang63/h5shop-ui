import { Image } from "@/types/image.ts";

export interface SpuListTable {
  id: number;
  name: string;
  description: string;
  metadata: object;
  brandId: number;
  categoryId: number;
  brandName: string;
  categoryName: string;
  images?: Image[];
  outOfStock: boolean;
}
