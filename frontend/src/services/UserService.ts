import { api } from "@/api/api";
import type { APIResponse, LoginResponse, Role } from "@/types/types";
import { AxiosError } from "axios";

export const loginService = async (email: string, password: string) => {
  try {
    const response = await api.post<APIResponse<LoginResponse>>("/auth/login", {
      email,
      password,
    });
    return {
      success: response.data.success,
      data: response.data.data,
      message: response.data.message,
      error: response.data.error,
    };
  } catch (error) {
    console.error(error);
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data.message,
      };
    }
  }
};

export const registerService = async (
  email: string,
  password: string,
  role: Role
) => {
  try {
    console.log(email, password, role);
    const response = await api.post<APIResponse<LoginResponse>>(
      "/auth/register",
      {
        email,
        password,
        role,
      }
    );
    return {
      success: response.data.success,
      data: response.data.data,
      message: response.data.message,
      error: response.data.error,
    };
  } catch (error) {
    console.error(error);
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data.message,
      };
    }
  }
};

export const logoutService = async () => {
  try {
    const response = await api.post<APIResponse<void>>("/auth/logout");
    return {
      success: response.data.success,
      message: response.data.message,
      error: response.data.error,
    };
  } catch (error) {
    console.error(error);
  }
};
