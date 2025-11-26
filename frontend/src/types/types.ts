export type Role = "admin" | "user";

export type User = {
  id: string;
  email: string;
  role: Role;
};
export type AuthContextType = {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  message: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, role: Role) => Promise<boolean>;
  logout: () => Promise<boolean>;
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

export type Task = {
  _id: string;
  title: string;
  description: string;
  status: "Pending" | "Completed";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string | { _id: string; email: string };
  userEmail?: string;
};

export type TaskFormData = {
  title: string;
  description: string;
  status: "Pending" | "Completed";
  createdAt?: Date;
};
