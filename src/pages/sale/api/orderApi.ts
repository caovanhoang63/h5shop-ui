import { OrderGetDetail } from "@/types/order/orderGetDetail.ts";
import axiosInstance from "@/axiosSetup.ts";
import { OrderCreate } from "@/types/order/orderCreate.ts";
import { OrderItemCreate } from "@/types/orderItem/orderItemCreate.ts";
import { Order } from "@/types/order/order.ts";
import { OrderItem } from "@/types/orderItem/orderItem.ts";
import { OrderUpdate } from "@/types/order/orderUpdate.ts";
import { OrderPay } from "@/types/order/orderPay.ts";

export enum OrderStatus {
  CANCEL,
  PENDING,
  COMPLETE,
  ALL,
}

interface OrderItemResponse {
  data: OrderItem;
}

interface OrderListResponse {
  data: OrderGetDetail[];
}
export async function getListOrder(orderStatus: OrderStatus) {
  try {
    const query =
      orderStatus === OrderStatus.ALL
        ? `?status=1&status=2`
        : `?status=${orderStatus}`;
    const response = await axiosInstance.get<OrderListResponse>(
      `/v1/order${query}`,
    );
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

interface CreateOrderResponse {
  data: Order;
}
export async function createOrder(order: OrderCreate) {
  try {
    const response = await axiosInstance.post<CreateOrderResponse>(
      "/v1/order",
      order,
    );
    return response.data;
  } catch (error) {
    console.error("Create order error:", error);
    throw error;
  }
}

export async function updateOrder(id: number, order: OrderUpdate) {
  try {
    const response = await axiosInstance.patch<Order>(`/v1/order/${id}`, order);
    return response.data;
  } catch (error) {
    console.error("Update error:", error);
    throw error;
  }
}

export async function deleteOrder(id: number) {
  try {
    const response = await axiosInstance.delete<void>(`/v1/order/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
}

export async function payOrder(id: number | null, order: OrderPay) {
  try {
    const response = await axiosInstance.post<Order>(
      `/v1/order/${id}/pay`,
      order,
    );
    return response.data;
  } catch (error) {
    console.error("Pay error:", error);
    throw error;
  }
}

export async function addOrderItem(item: OrderItemCreate) {
  try {
    const response = await axiosInstance.post<OrderItemResponse>(
      "/v1/order-item",
      item,
    );
    return response.data;
  } catch (error) {
    console.error("Create order item error:", error);
    throw error;
  }
}

export async function deleteOrderItem(orderId: number, skuId: number) {
  try {
    const response = await axiosInstance.delete<void>(
      `/v1/order-item/?orderId=${orderId}&skuId=${skuId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
}
