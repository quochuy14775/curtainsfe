import { api } from "@/lib/api";

export const authService = {
  login: (username: string, password: string) =>
    api.post<{ success: boolean }>("/auth/login", { username, password }),

  logout: () =>
    api.post<{ success: boolean }>("/auth/logout"),
};
