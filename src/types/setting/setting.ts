export interface Setting {
  id: number;
  name: string;
  value: string;
  description: string;
  status: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}
export interface SettingPaging {
  page: number;
  limit: number;
}
export interface SettingUpdate {
  value: string;
}
export interface SettingCreate {
  name: string;
  value: string;
  description: string;
}
