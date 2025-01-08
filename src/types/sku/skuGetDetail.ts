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
  timeWarranty: number;
  timeReturn: number;
  typeTimeWarranty: string;
  typeTimeReturn: string;
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

export interface SkuWholesalePrice {
  minQuantity: number;
  price: number;
}
