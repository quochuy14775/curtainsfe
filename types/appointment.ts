// ─── Entity ──────────────────────────────────────────────────────────────────

export type AppointmentStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export type Appointment = {
  id: number;
  customerId: number;
  note: string | null;
  staffNote: string | null;
  status: AppointmentStatus;
  scheduledAt: string | null;
  isActived: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
};

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export type AppointmentResponse = {
  id: number;
  customerId: number;
  customerName: string | null;
  phone: string | null;
  address: string | null;
  note: string | null;
  staffNote: string | null;
  status: AppointmentStatus;
  scheduledAt: string | null;
  createdAt: string;
};

export type AppointmentRequest = {
  name: string;
  phone: string;
  address?: string;
  note?: string;
};

export type AppointmentUpdateRequest = {
  status: AppointmentStatus;
  staffNote?: string;
  scheduledAt?: string | null;
};

export type AppointmentStats = {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  completedThisMonth: number;
  completionRate: number;
  totalCustomers: number;
  upcoming: AppointmentResponse[];
  recent: AppointmentResponse[];
};

// ─── Constants ────────────────────────────────────────────────────────────────

export const APPOINTMENT_STATUSES: AppointmentStatus[] = [
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
];

export const STATUS_LABEL: Record<AppointmentStatus, string> = {
  Pending: "Chờ xử lý",
  Confirmed: "Đã xác nhận",
  Completed: "Hoàn thành",
  Cancelled: "Huỷ",
};

export const STATUS_COLOR: Record<AppointmentStatus, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Confirmed: "bg-purple-100 text-purple-800",
  Completed: "bg-emerald-100 text-emerald-800",
  Cancelled: "bg-stone-100 text-stone-500",
};

// Bước tiếp theo trong luồng xử lý đơn
export const NEXT_STATUS: Partial<Record<AppointmentStatus, AppointmentStatus>> = {
  Pending: "Confirmed",
  Confirmed: "Completed",
};

// ─── Formatters ───────────────────────────────────────────────────────────────

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
