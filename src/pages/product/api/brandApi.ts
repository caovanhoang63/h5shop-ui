import { Brand, brandConverter, BrandCreate } from "@/types/brand/brand.ts";
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

export async function updateBrand(brand: Brand): Promise<void> {
  try {
    await axiosInstance.patch(
      `/v1/brand/${brand.id}`,
      brandConverter.convertBrandToBrandUpdate(brand),
    );
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function deleteBrand(brandId: number): Promise<void> {
  try {
    await axiosInstance.delete(`/v1/brand/${brandId}`);
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
