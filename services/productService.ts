import { api } from "@/lib/api";
export type { ProductResponse, ProductRequest } from "@/types/product";
import type { ProductResponse, ProductRequest } from "@/types/product";

type ODataResponse<T> = {
  count: number;
  value: T[];
};

export const productService = {
  getAll: (query?: string) =>
    api.get<ODataResponse<ProductResponse>>(`/Product${query ? `?${query}` : ""}`),

  getAllAdmin: (query?: string) =>
    api.get<ODataResponse<ProductResponse>>(`/Product/all${query ? `?${query}` : ""}`),

  getById: (id: number) =>
    api.get<{ success: boolean; data: ProductResponse }>(`/Product/${id}`),

  create: (body: ProductRequest) =>
    api.post<{ success: boolean; data: number }>("/Product", body),

  update: (id: number, body: ProductRequest) =>
    api.put<{ success: boolean; data: string }>(`/Product/${id}`, body),

  toggleActive: (id: number) =>
    api.patch<{ success: boolean; data: boolean }>(`/Product/${id}/toggle-active`),

  delete: (id: number) =>
    api.delete<{ success: boolean; data: string }>(`/Product/${id}`),
};
