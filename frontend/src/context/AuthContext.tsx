import { useState, useEffect, useLayoutEffect } from "react";
import { api } from "@/api/api";
import {
  loginService,
  logoutService,
  registerService,
} from "@/services/UserService";
import type { AuthContextType, Role, User } from "@/types/types";
import { AuthContext } from "@/hooks/useAuth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    const reqInterceptor = api.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => api.interceptors.request.eject(reqInterceptor);
  }, [token]);

  useLayoutEffect(() => {
    const resInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (originalRequest._retry) {
          return Promise.reject(error);
        }

        if (originalRequest.url?.includes("/auth/refresh")) {
          setToken(null);
          setUser(null);
          return Promise.reject(error);
        }

        if (error.response?.status === 403) {
          originalRequest._retry = true;

          try {
            const refreshRes = await api.post("/auth/refresh");
            const newAccessToken = refreshRes.data.data?.accessToken;

            if (newAccessToken) {
              setToken(newAccessToken);
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return api(originalRequest);
            } else {
              throw new Error("No access token in refresh response");
            }
          } catch (err) {
            console.log("Refresh failed");
            setToken(null);
            setUser(null);
            return Promise.reject(err);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(resInterceptor);
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const refresh = await api.post("/auth/refresh");

        const newAccessToken = refresh.data.data?.accessToken;
        const restoredUser = refresh.data.data?.user;

        setToken(newAccessToken);
        setUser(restoredUser);
      } catch {
        console.log("No valid session on reload, user not logged in.");
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await loginService(email, password);

    if (!response?.success) {
      setMessage(response?.message ?? "Login failed");
      return false;
    }

    setToken(response.data?.accessToken ?? null);
    setUser(response.data?.user ?? null);
    return true;
  };

  const register = async (email: string, password: string, role: Role) => {
    const response = await registerService(email, password, role);

    if (!response?.success) {
      setMessage(response?.message ?? "Register failed");
      return false;
    }

    setToken(response.data?.accessToken ?? null);
    setUser(response.data?.user ?? null);
    return true;
  };

  const logout = async () => {
    const response = await logoutService();
    if (!response?.success) {
      setMessage(response?.message ?? "Logout failed");
      return false;
    }

    setToken(null);
    setUser(null);
    return true;
  };

  const value: AuthContextType = {
    isAuthenticated: !!token,
    isAdmin: user?.role === "admin",
    user,
    token,
    isLoading,
    message,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
