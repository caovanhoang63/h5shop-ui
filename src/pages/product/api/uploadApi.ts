import { Image } from "@/types/image.ts";
import axiosInstance from "@/axiosSetup.ts";

export interface ResponseImage {
  data: Image;
}

export async function uploadImage(file: File): Promise<ResponseImage> {
  if (!file) {
    throw new Error("File is required");
  }
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post<ResponseImage>(
      "/v1/upload/image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
