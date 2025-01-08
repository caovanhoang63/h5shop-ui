import { Authenticate } from "@/types/authenticate.ts";
import axiosInstance from "@/axiosSetup.ts";

interface AuthenticationResponse {
  data: AuthenticationResponseData;
}

interface AuthenticationResponseData {
  accessToken: {
    token: string;
    expiredIn: number;
  };
  refreshToken: {
    token: string;
    expiredIn: number;
  };
}

export async function login(
  body: Authenticate,
): Promise<AuthenticationResponse> {
  try {
    const response = await axiosInstance.post<AuthenticationResponse>(
      "v1/auth/login",
      body,
    );
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export const getProfile = () =>
  axiosInstance.get<{ data: never }>("v1/users/profile");
