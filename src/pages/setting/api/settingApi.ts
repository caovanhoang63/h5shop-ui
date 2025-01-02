import {
  Setting,
  SettingPaging,
  SettingUpdate,
} from "@/types/setting/setting.ts";
import axiosInstance from "@/axiosSetup.ts";

export interface SettingResponse {
  data: Setting[];
  paging: SettingPaging;
}

export interface SettingUpdateResponse {
  data: boolean;
}

export async function getSetting(): Promise<SettingResponse> {
  try {
    const response = await axiosInstance.get<SettingResponse>("/v1/setting");
    return response.data;
  } catch (e) {
    console.log("Error fetching Setting", e);
    throw e;
  }
}

export async function updateSetting(
  name: string,
  body: SettingUpdate,
): Promise<SettingUpdateResponse> {
  try {
    const response = await axiosInstance.patch<SettingUpdateResponse>(
      `/v1/setting/${name}`,
      body,
    );
    return response.data;
  } catch (e) {
    console.log("Error updating Setting", e);
    throw e;
  }
}
