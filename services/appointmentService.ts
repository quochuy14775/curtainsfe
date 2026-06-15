import { api } from "@/lib/api";
export type { AppointmentResponse, AppointmentRequest, AppointmentUpdateRequest, AppointmentStats } from "@/types/appointment";
import type { AppointmentResponse, AppointmentRequest, AppointmentUpdateRequest, AppointmentStats, AppointmentStatus } from "@/types/appointment";

type ODataResponse<T> = {
  count: number;
  value: T[];
};

type ResponseMessage = {
  success: boolean;
  message: string;
};

export const appointmentService = {
  getAll: (query?: string) =>
    api.get<ODataResponse<AppointmentResponse>>(`/Appointment${query ? `?${query}` : ""}`),

  getById: (id: number) =>
    api.get<AppointmentResponse>(`/Appointment/${id}`),

  getStats: () =>
    api.get<AppointmentStats>("/Appointment/stats"),

  create: (body: AppointmentRequest) =>
    api.post<number>("/Appointment", body),

  update: (id: number, body: AppointmentUpdateRequest) =>
    api.put<ResponseMessage>(`/Appointment/${id}`, body),

  updateStatus: (id: number, status: AppointmentStatus) =>
    api.patch<ResponseMessage>(`/Appointment/${id}/status`, { status }),

  delete: (id: number) =>
    api.delete<ResponseMessage>(`/Appointment/${id}`),
};
