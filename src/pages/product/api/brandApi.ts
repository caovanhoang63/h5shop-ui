import { Brand, BrandCreate, BrandUpdate } from "@/types/brand/brand.ts";
import axiosInstance from "@/axiosSetup.ts";

export interface ResponseBrand {
  data: Brand[];
  extra?: never;
  paging?: never;
}

export async function getBrands(): Promise<ResponseBrand> {
  try {
    const response = await axiosInstance.get<ResponseBrand>("/v1/brand");
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function createBrand(brand: BrandCreate): Promise<void> {
  try {
    await axiosInstance.post("/v1/brand", brand);
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function updateBrand(brand: BrandUpdate): Promise<void> {
  try {
    await axiosInstance.put(`/brand/${brand.id}`, brand);
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
