import { Image } from "@/types/image.ts";
import { MetadataSpu } from "@/types/spu/spuUpsert.ts";

export interface SpuDetail {
  id: number;
  name: string;
  brandId: number;
  brandName: string;
  categoryId: number;
  categoryName: string;
  description: string;
  metadata: MetadataSpu;
  images?: Image[];
  outOfStock: boolean;
  status: number;
  attrs: Attr[];
  skus: Sku[];
  timeReturn?: number;
  timeWarranty?: number;
  typeWarranty?: string;
  typeReturn?: string;
  providers: SkuProvider[];
}

export interface SkuProvider {
  id: number;
  name: string;
  phone: string;
  email: string;
}

interface Attr {
  id: number;
  spuId: number;
  name: string;
  dataType: string;
  value: string[];
}

interface Sku {
  id: number;
  spuId: number;
  skuTierIdx?: number[];
  images?: Image[];
  costPrice: number;
  price: number;
  stock: number;
  wholesalePrices: SkuWholesalePrice[];
}

interface SkuWholesalePrice {
  id: number;
  skuId: number;
  minQuantity: number;
  price: number;
}
