export type Role = "admin" | "user";

export type User = {
  id: string;
  email: string;
  role: Role;
};
export type AuthContextType = {
  user: User | null;
  message: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

export type ThemeContextType = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};

export type APIResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};

export type LoginResponse = {
  accessToken: string;
  user: User;
};
