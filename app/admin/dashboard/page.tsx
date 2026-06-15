"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Clock, BadgeCheck, CheckCircle, XCircle, Users, CalendarClock } from "lucide-react";
import { appointmentService } from "@/services/appointmentService";
import type { AppointmentStats } from "@/types/appointment";
import { STATUS_LABEL, STATUS_COLOR, formatDateTime } from "@/types/appointment";
import { notify } from "@/lib/toast";

export default function DashboardPage() {
  const [stats, setStats] = useState<AppointmentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    appointmentService.getStats()
      .then((res) => { if (alive) setStats(res); })
      .catch(() => { if (alive) notify.error("Không thể tải thống kê."); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const today = new Date().toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  if (loading) {
    return <div className="py-16 text-center text-stone/40 text-sm">Đang tải...</div>;
  }

  if (!stats) {
    return <div className="py-16 text-center text-stone/40 text-sm">Không có dữ liệu.</div>;
  }

  const cards = [
    { label: "Tổng đơn", value: stats.total, icon: TrendingUp, color: "bg-blue-50 text-blue-600" },
    { label: "Chờ xử lý", value: stats.pending, icon: Clock, color: "bg-amber-50 text-amber-600" },
    { label: "Đã xác nhận", value: stats.confirmed, icon: BadgeCheck, color: "bg-purple-50 text-purple-600" },
    { label: "Hoàn thành tháng này", value: stats.completedThisMonth, icon: CheckCircle, color: "bg-emerald-50 text-emerald-600" },
    { label: "Đã huỷ", value: stats.cancelled, icon: XCircle, color: "bg-red-50 text-red-500" },
    { label: "Khách hàng", value: stats.totalCustomers, icon: Users, color: "bg-gold/15 text-gold" },
  ];

  const breakdown = [
    { label: STATUS_LABEL.Pending, count: stats.pending },
    { label: STATUS_LABEL.Confirmed, count: stats.confirmed },
    { label: STATUS_LABEL.Completed, count: stats.completed },
    { label: STATUS_LABEL.Cancelled, count: stats.cancelled },
  ];
  const maxCount = Math.max(1, ...breakdown.map((b) => b.count));

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl text-charcoal">Tổng quan</h1>
        <p className="text-stone text-sm mt-1">Hôm nay, {today}</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-warm-white rounded-2xl p-5 shadow-sm">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 ${color}`}>
              <Icon size={16} />
            </div>
            <p className="text-2xl font-heading text-charcoal">{value}</p>
            <p className="text-stone text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Status breakdown + Upcoming */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Status breakdown */}
        <div className="bg-warm-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-heading text-base text-charcoal mb-5">Phân bổ trạng thái</h2>
          <div className="space-y-3.5">
            {breakdown.map(({ label, count }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-stone">{label}</span>
                  <span className="text-xs font-medium text-charcoal">{count} đơn</span>
                </div>
                <div className="h-1.5 bg-linen rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold rounded-full transition-all duration-500"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming appointments + completion rate */}
        <div className="space-y-4">
          <div className="bg-warm-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-heading text-base text-charcoal mb-5">Lịch hẹn sắp tới</h2>
            {stats.upcoming.length === 0 ? (
              <p className="text-stone/40 text-xs italic">Chưa có lịch hẹn nào</p>
            ) : (
              <div className="space-y-3">
                {stats.upcoming.map((a) => (
                  <div key={a.id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                        <CalendarClock size={13} className="text-gold" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-charcoal truncate">{a.customerName}</p>
                        <p className="text-stone text-xs">{a.phone}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-stone whitespace-nowrap">
                      {a.scheduledAt ? formatDateTime(a.scheduledAt) : "—"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-charcoal rounded-2xl p-6 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-white/50 text-xs tracking-widest uppercase mb-1">Tỉ lệ hoàn thành</p>
              <p className="font-heading text-3xl text-warm-white">{stats.completionRate}%</p>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-gold/30 flex items-center justify-center">
              <CheckCircle size={24} className="text-gold" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent appointments */}
      <div className="bg-warm-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-linen flex items-center justify-between">
          <h2 className="font-heading text-base text-charcoal">Đơn mới nhất</h2>
          <a href="/admin/orders" className="text-xs tracking-widest uppercase text-gold hover:text-charcoal transition-colors">
            Xem tất cả →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-linen">
                <th className="px-6 py-3 text-left text-[10px] tracking-widest uppercase text-stone font-normal">Khách</th>
                <th className="px-6 py-3 text-left text-[10px] tracking-widest uppercase text-stone font-normal hidden sm:table-cell">Ghi chú</th>
                <th className="px-6 py-3 text-left text-[10px] tracking-widest uppercase text-stone font-normal">Trạng thái</th>
                <th className="px-6 py-3 text-left text-[10px] tracking-widest uppercase text-stone font-normal hidden md:table-cell">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-linen">
              {stats.recent.map((a) => (
                <tr key={a.id} className="hover:bg-cream/60 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-charcoal font-medium">{a.customerName}</p>
                    <p className="text-stone text-xs">{a.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-stone text-xs hidden sm:table-cell max-w-[260px]">
                    <p className="line-clamp-1">{a.note || <span className="italic text-stone/40">Không có</span>}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${STATUS_COLOR[a.status]}`}>
                      {STATUS_LABEL[a.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-stone text-xs hidden md:table-cell">
                    {formatDateTime(a.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {stats.recent.length === 0 && (
            <div className="py-12 text-center text-stone/40 text-sm">Chưa có đơn tư vấn nào</div>
          )}
        </div>
      </div>
    </div>
  );
}
