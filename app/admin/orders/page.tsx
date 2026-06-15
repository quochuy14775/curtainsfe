"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, CalendarClock } from "lucide-react";
import { buildODataQuery, contains, or } from "@/lib/odata";
import { appointmentService } from "@/services/appointmentService";
import type { AppointmentResponse, AppointmentStatus } from "@/types/appointment";
import { APPOINTMENT_STATUSES, STATUS_LABEL, STATUS_COLOR, NEXT_STATUS, formatDateTime } from "@/types/appointment";
import { AppointmentDialog, type AppointmentFormData } from "./AppointmentDialog";
import { OrderActions } from "./OrderActions";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { notify } from "@/lib/toast";

type StatusFilter = AppointmentStatus | "all";

export default function OrdersPage() {
  const [items, setItems] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<AppointmentResponse | null>(null);
  const [saving, setSaving] = useState(false);
  const [tick, setTick] = useState(0);

  const refresh = () => setTick((t) => t + 1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let alive = true;

    const s = debouncedSearch.trim();
    const query = buildODataQuery({
      filter: s ? or(contains("Customer/Name", s), contains("Customer/Phone", s)) : undefined,
      orderby: "CreatedAt desc",
    });

    appointmentService.getAll(query)
      .then((res) => { if (alive) setItems(res.value ?? []); })
      .catch(() => { if (alive) notify.error("Không thể tải đơn tư vấn."); })
      .finally(() => { if (alive) setLoading(false); });

    return () => { alive = false; };
  }, [tick, debouncedSearch]);

  const filtered = statusFilter === "all" ? items : items.filter((a) => a.status === statusFilter);

  const setStatus = async (item: AppointmentResponse, status: AppointmentStatus) => {
    try {
      await appointmentService.updateStatus(item.id, status);
      setItems((prev) => prev.map((a) => (a.id === item.id ? { ...a, status } : a)));
      notify.success(`Đã chuyển sang "${STATUS_LABEL[status]}".`);
    } catch {
      notify.error("Cập nhật trạng thái thất bại.");
    }
  };

  const handleAdvance = (item: AppointmentResponse) => {
    const next = NEXT_STATUS[item.status];
    if (next) setStatus(item, next);
  };

  const handleSave = async (data: AppointmentFormData) => {
    if (!selected) return;
    setSaving(true);
    try {
      await appointmentService.update(selected.id, {
        status: data.status,
        staffNote: data.staffNote.trim() || undefined,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt).toISOString() : null,
      });
      notify.success("Đã cập nhật đơn tư vấn.");
      refresh();
      setIsDialogOpen(false);
    } catch {
      notify.error("Lưu thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await appointmentService.delete(selected.id);
      setItems((prev) => prev.filter((a) => a.id !== selected.id));
      setIsDeleteOpen(false);
      notify.success("Đã xóa đơn tư vấn.");
    } catch {
      notify.error("Xóa thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const countByStatus = (status: StatusFilter) =>
    status === "all" ? items.length : items.filter((a) => a.status === status).length;

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-charcoal">Đơn tư vấn</h1>
          <p className="text-stone text-sm mt-1">
            {items.length} đơn tổng cộng · {countByStatus("Pending")} chờ xử lý
          </p>
        </div>
      </div>

      {/* Search + status filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên hoặc số điện thoại..."
            className="w-full pl-9 pr-4 py-2.5 bg-warm-white border border-linen rounded-full text-sm text-charcoal placeholder:text-stone/40 focus:border-gold outline-none transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["all", ...APPOINTMENT_STATUSES] as StatusFilter[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-full text-[10px] tracking-widest uppercase transition-colors ${
                statusFilter === status
                  ? "bg-charcoal text-warm-white"
                  : "bg-warm-white border border-linen text-stone hover:border-gold hover:text-charcoal"
              }`}
            >
              {status === "all" ? "Tất cả" : STATUS_LABEL[status]} · {countByStatus(status)}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="bg-warm-white rounded-2xl shadow-sm overflow-hidden"
      >
        {loading ? (
          <div className="py-16 text-center text-stone/40 text-sm">Đang tải...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-linen bg-cream/40">
                  {["Mã đơn", "Khách hàng", "Ghi chú", "Lịch hẹn", "Trạng thái", "Thời gian", ""].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-[10px] tracking-widest uppercase text-stone font-normal whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-linen">
                {filtered.map((item, idx) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03, duration: 0.3 }}
                    className="group hover:bg-cream/30 transition-colors"
                  >
                    <td className="px-5 py-4 text-stone text-xs font-mono">#{item.id}</td>
                    <td className="px-5 py-4">
                      <p className="text-charcoal font-medium whitespace-nowrap">{item.customerName}</p>
                      <a href={`tel:${item.phone}`} className="text-stone text-xs hover:text-gold transition-colors">
                        {item.phone}
                      </a>
                      {item.address && (
                        <p className="text-stone text-xs truncate max-w-[180px]">{item.address}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-stone text-xs max-w-[220px]">
                      <p className="line-clamp-2">
                        {item.note || <span className="italic text-stone/40">Không có</span>}
                      </p>
                      {item.staffNote && (
                        <p className="line-clamp-1 mt-1 italic text-gold/80">NV: {item.staffNote}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-stone text-xs whitespace-nowrap">
                      {item.scheduledAt ? (
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarClock size={12} className="text-gold" />
                          {formatDateTime(item.scheduledAt)}
                        </span>
                      ) : (
                        <span className="italic text-stone/40">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap ${STATUS_COLOR[item.status]}`}>
                        {STATUS_LABEL[item.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-stone text-xs whitespace-nowrap">
                      {formatDateTime(item.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <OrderActions
                        appointment={item}
                        onAdvance={() => handleAdvance(item)}
                        onEdit={() => { setSelected(item); setIsDialogOpen(true); }}
                        onCancel={() => setStatus(item, "Cancelled")}
                        onDelete={() => { setSelected(item); setIsDeleteOpen(true); }}
                      />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-16 text-center text-stone/40 text-sm">
                {debouncedSearch ? `Không tìm thấy "${debouncedSearch}"` : "Chưa có đơn tư vấn nào"}
              </div>
            )}
          </div>
        )}
      </motion.div>

      {selected && (
        <AppointmentDialog
          key={selected.id}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSave}
          appointment={selected}
          isLoading={saving}
        />
      )}

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Xóa đơn tư vấn?"
        description={`Bạn chắc chắn muốn xóa đơn của "${selected?.customerName ?? ""}"? Hành động này không thể hoàn tác.`}
        isLoading={saving}
      />
    </div>
  );
}
