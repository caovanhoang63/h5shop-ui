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
export interface SettingDeleteResponse {
  data: number;
}
export interface SettingCreateResponse {
  data: number;
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
export async function deleteSetting(
  name: string,
): Promise<SettingDeleteResponse> {
  try {
    const response = await axiosInstance.delete<SettingDeleteResponse>(
      `/v1/setting/${name}`,
    );
    return response.data;
  } catch (e) {
    console.log("Error deleting Setting", e);
    throw e;
  }
}

export async function createSetting(
  body: SettingUpdate,
): Promise<SettingCreateResponse> {
  try {
    const response = await axiosInstance.post<SettingCreateResponse>(
      "/v1/setting",
      body,
    );
    return response.data;
  } catch (e) {
    console.log("Error creating Setting", e);
    throw e;
  }
}
