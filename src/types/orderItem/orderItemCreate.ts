﻿export interface OrderItemCreate {
  orderId: number;
  skuId: number;
  amount: number;
  description?: string;
  discount?: number;
}
