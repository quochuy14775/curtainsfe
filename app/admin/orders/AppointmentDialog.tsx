"use client";

import { useState } from "react";
import { FormDialog } from "@/components/ui/FormDialog";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { ClipboardList } from "lucide-react";
import type { AppointmentResponse, AppointmentStatus } from "@/types/appointment";
import { APPOINTMENT_STATUSES, STATUS_LABEL } from "@/types/appointment";

export type AppointmentFormData = {
  status: AppointmentStatus;
  staffNote: string;
  scheduledAt: string; // datetime-local value, "" nếu chưa hẹn
};

interface AppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AppointmentFormData) => void;
  appointment: AppointmentResponse;
  isLoading?: boolean;
}

// ISO UTC → giá trị cho input datetime-local (giờ địa phương)
function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function AppointmentDialog({ isOpen, onClose, onSave, appointment, isLoading = false }: AppointmentDialogProps) {
  const [form, setForm] = useState<AppointmentFormData>({
    status: appointment.status,
    staffNote: appointment.staffNote ?? "",
    scheduledAt: toLocalInput(appointment.scheduledAt),
  });

  return (
    <FormDialog
      isOpen={isOpen}
      onClose={onClose}
      onSave={() => onSave(form)}
      title="Cập nhật đơn tư vấn"
      subtitle={`${appointment.customerName ?? ""} · ${appointment.phone ?? ""}`}
      icon={ClipboardList}
      saveLabel="Lưu thay đổi"
      isLoading={isLoading}
      width="min(95vw, 480px)"
    >
      <div className="space-y-5">
        {appointment.note && (
          <div className="bg-cream/50 border border-linen rounded-lg px-4 py-3">
            <p className="text-stone text-[10px] tracking-widest uppercase mb-1">Ghi chú của khách</p>
            <p className="text-charcoal text-sm leading-relaxed">{appointment.note}</p>
          </div>
        )}

        <CustomSelect
          label="Trạng thái"
          value={form.status}
          onChange={(value) => setForm((f) => ({ ...f, status: value as AppointmentStatus }))}
          options={APPOINTMENT_STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] }))}
        />

        <div>
          <label className="block text-stone text-xs tracking-widest uppercase mb-2">
            Lịch hẹn tư vấn
          </label>
          <input
            type="datetime-local"
            value={form.scheduledAt}
            onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))}
            className="w-full bg-cream/50 border border-linen rounded-lg px-4 py-3 text-charcoal focus:border-gold outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-stone text-xs tracking-widest uppercase mb-2">
            Ghi chú nội bộ
          </label>
          <textarea
            value={form.staffNote}
            onChange={(e) => setForm((f) => ({ ...f, staffNote: e.target.value }))}
            rows={3}
            placeholder="VD: Khách hẹn gọi lại sau 18h, ưu tiên mẫu vải lụa..."
            className="w-full bg-cream/50 border border-linen rounded-lg px-4 py-3 text-charcoal placeholder:text-stone/40 focus:border-gold outline-none transition-colors resize-none"
          />
        </div>
      </div>
    </FormDialog>
  );
}
