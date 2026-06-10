import { api } from "@/lib/api";
import type { CategoryRequest, CategoryResponse } from "@/types/category";

type ODataResponse<T> = {
  count: number;
  value: T[];
};

export type { CategoryRequest, CategoryResponse };

export const categoryService = {
  getAll: (query?: string) =>
    api.get<ODataResponse<CategoryResponse>>(`/Category${query ? `?${query}` : ""}`),

  getById: (id: number) =>
    api.get<{ success: boolean; data: CategoryResponse }>(`/Category/${id}`),

  create: (body: CategoryRequest) =>
    api.post<{ success: boolean; data: number }>("/Category", body),

  update: (id: number, body: CategoryRequest) =>
    api.put<{ success: boolean; data: string }>(`/Category/${id}`, body),

  delete: (id: number) =>
    api.delete<{ success: boolean; data: string }>(`/Category/${id}`),
};
