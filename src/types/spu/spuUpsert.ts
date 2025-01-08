import { Image } from "@/types/image.ts";

export interface SpuUpsert {
  id?: number;
  name: string;
  description: string;
  categoryId: number;
  brandId: number;
  metadata: MetadataSpu;
  images?: Image[];
  skus: SkuCreate[];
  attrs: SkuAttrCreate[];
  timeReturn?: number;
  timeWarranty?: number;
  typeWarranty?: string;
  typeReturn?: string;
}

export interface SkuAttrCreate {
  id?: number;
  spuId: number;
  name: string;
  value: string[];
  dataType: string;
}

export interface SkuCreate {
  id?: number;
  spuId: number;
  skuTierIdx?: number[];
  images?: Image[];
  costPrice: number;
  price: number;
  stock: number;
  wholesalePrices?: SkuWholesalePriceCreate[];
}

export interface SkuWholesalePriceCreate {
  id?: number;
  skuId: number;
  minQuantity: number;
  price: number;
}

export interface MetadataSpu {
  position: string;
}
