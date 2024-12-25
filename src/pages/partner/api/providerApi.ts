import {
  Provider,
  ProviderCreate,
  ProviderFilter,
  ProviderUpdate,
} from "@/types/provider.ts";
import axiosInstance from "@/axiosSetup.ts";

export interface ProviderListResponse {
  data: Provider[];
  extra?: never;
  paging?: never;
}

export interface ProviderCreateResponse {
  data: boolean;
}

export interface ProviderUpdateResponse {
  data: boolean;
}

export async function listProvider(
  filter: ProviderFilter,
): Promise<ProviderListResponse> {
  try {
    const queryObject = Object.entries(filter).reduce(
      (acc, [key, value]) => {
        acc[key] = value != null ? String(value) : "";
        return acc;
      },
      {} as Record<string, string>,
    );

    const query = new URLSearchParams(queryObject).toString();
    const response = await axiosInstance.get<ProviderListResponse>(
      `v1/provider?${query}`,
      {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZjMmFiNTAxLTg0NmMtNGM3NS04NWQ4LWMyYjE4MWM3NTlhZSIsInN1YiI6IjQiLCJub3RCZWZvcmUiOjE3MzM2NzA4ODMwNDEsImlzc3VlZEF0IjoxNzMzNjcwODgzMDQxLCJleHBpcmVzQXQiOjE3MzM2NzQ0ODMwNDEsImlhdCI6MTczMzY3MDg4M30.Dh04IhTLolfuL0OyRx7e5826_xPHzIjnOkQ-bNKss1M`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function deleteProvider(id: number): Promise<void> {
  try {
    await axiosInstance.delete(`v1/provider/${id}`, {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZjMmFiNTAxLTg0NmMtNGM3NS04NWQ4LWMyYjE4MWM3NTlhZSIsInN1YiI6IjQiLCJub3RCZWZvcmUiOjE3MzM2NzA4ODMwNDEsImlzc3VlZEF0IjoxNzMzNjcwODgzMDQxLCJleHBpcmVzQXQiOjE3MzM2NzQ0ODMwNDEsImlhdCI6MTczMzY3MDg4M30.Dh04IhTLolfuL0OyRx7e5826_xPHzIjnOkQ-bNKss1M`,
      },
    });
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function createProvider(
  body: ProviderCreate,
): Promise<ProviderCreateResponse> {
  try {
    const response = await axiosInstance.post<ProviderCreateResponse>(
      "v1/provider",
      body,
      {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZjMmFiNTAxLTg0NmMtNGM3NS04NWQ4LWMyYjE4MWM3NTlhZSIsInN1YiI6IjQiLCJub3RCZWZvcmUiOjE3MzM2NzA4ODMwNDEsImlzc3VlZEF0IjoxNzMzNjcwODgzMDQxLCJleHBpcmVzQXQiOjE3MzM2NzQ0ODMwNDEsImlhdCI6MTczMzY3MDg4M30.Dh04IhTLolfuL0OyRx7e5826_xPHzIjnOkQ-bNKss1M`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function updateProvider(
  id: number,
  body: ProviderUpdate,
): Promise<ProviderUpdateResponse> {
  try {
    const response = await axiosInstance.patch<ProviderUpdateResponse>(
      `v1/provider/${id}`,
      body,
      {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZjMmFiNTAxLTg0NmMtNGM3NS04NWQ4LWMyYjE4MWM3NTlhZSIsInN1YiI6IjQiLCJub3RCZWZvcmUiOjE3MzM2NzA4ODMwNDEsImlzc3VlZEF0IjoxNzMzNjcwODgzMDQxLCJleHBpcmVzQXQiOjE3MzM2NzQ0ODMwNDEsImlhdCI6MTczMzY3MDg4M30.Dh04IhTLolfuL0OyRx7e5826_xPHzIjnOkQ-bNKss1M`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
