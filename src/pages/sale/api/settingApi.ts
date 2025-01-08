import axiosInstance from "@/axiosSetup.ts";
import { Setting } from "@/types/setting/setting.ts";

const token = localStorage.getItem("token");

interface Response {
  data: Setting;
}
export async function getSetting(name: string) {
  try {
    const response = await axiosInstance.get<Response>(`/v1/setting/${name}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Setting", response.data);
    return response.data;
  } catch (e) {
    console.log("Error fetching Setting", e);
    throw e;
  }
}
