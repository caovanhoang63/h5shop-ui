import { SkuGetDetail } from "@/types/sku/skuGetDetail.ts";

export interface OrderItem {
  orderId: number;
  skuId: number;
  amount: number;
  description?: string;
  unitPrice: number;
  createdAt: Date;
  skuDetail?: SkuGetDetail;
}
