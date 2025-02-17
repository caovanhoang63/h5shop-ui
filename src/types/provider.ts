export interface Provider {
  id: number;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
  debt: number;
  status: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}
export interface ProviderCreate {
  name: string;
  address: string;
  email: string;
  phone_number: string;
  debt?: number;
}

export interface ProviderUpdate {
  name?: string;
  address?: string;
  email?: string;
  phone_number?: string;
  debt?: number;
  status?: number;
}
export interface ProviderFilter {
  lk_name?: string;
  lk_email?: string;
  lk_phone_number?: string;
  lt_debt?: number;
  gt_debt?: number;
  lk_status?: number;
}
