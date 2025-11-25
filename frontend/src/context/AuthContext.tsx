import { api } from "@/api/api";
import { AuthContext } from "@/hooks/useAuth";
import {
  loginService,
  logoutService,
  registerService,
} from "@/services/UserService";
import type { AuthContextType, User } from "@/types/types";
import type { InternalAxiosRequestConfig } from "axios";
import { useEffect, useLayoutEffect, useState } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/auth/user");
        setUser(response.data.user);
        setToken(response.data.accessToken);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        config.headers.Authorization =
          !config._retry && token
            ? `Bearer ${token}`
            : config.headers.Authorization;
        return config;
      }
    );
    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  useLayoutEffect(() => {
    const refreshInterceptor = api.interceptors.response.use(
      async (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response.status === 403 &&
          error.response.data.message === "Unauthorized"
        ) {
          try {
            const response = await api.post("/auth/refresh");
            setToken(response.data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            originalRequest._retry = true;
            return api(originalRequest);
          } catch {
            setToken(null);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      api.interceptors.response.eject(refreshInterceptor);
    };
  }, []);

  const login = async (email: string, password: string) => {
    const response = await loginService(email, password);
    if (!response?.success) {
      setMessage(response?.message ?? "An unknown error occurred");
      return false;
    }
    setToken(response?.data?.accessToken ?? null);
    setUser(response?.data?.user ?? null);
    return response?.success ?? false;
  };

  const register = async (email: string, password: string) => {
    const response = await registerService(email, password);
    if (!response?.success) {
      setMessage(response?.message ?? "An unknown error occurred");
      return false;
    }
    setToken(response?.data?.accessToken ?? null);
    setUser(response?.data?.user ?? null);
    return response?.success ?? false;
  };

  const logout = async () => {
    const response = await logoutService();
    if (!response?.success) {
      setMessage(response?.message ?? "An unknown error occurred");
      return false;
    }
    setToken(null);
    setUser(null);
    return response?.success ?? false;
  };

  const value: AuthContextType = {
    isAdmin: user?.role === "admin",
    isAuthenticated: !!token,
    user,
    isLoading,
    message,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
