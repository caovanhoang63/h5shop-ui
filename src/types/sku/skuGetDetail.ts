import { Image } from "@/types/image.ts";

export interface SkuGetDetail {
  id: number;
  spuId: number;
  skuTierIdx?: number[];
  costPrice: number;
  price: number;
  stock: number;
  images?: Image[];
  spuName: string;
  categoryName: string;
  brandName: string;
  attributes?: SkuAttr[];
  wholesalePrices?: SkuWholesalePrice[];
  name: string;
}

interface SkuAttr {
  id: number;
  name: string;
  dataType: string;
  value: string[];
  image?: Image;
}

interface SkuWholesalePrice {
  id: number;
  skuId: number;
  minQuantity: number;
  price: number;
}
