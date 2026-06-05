import { getDashboardStats, getOrders, STATUS_LABEL, STATUS_COLOR, CATEGORY_LABEL, formatDate } from "@/lib/mock-admin";
import { TrendingUp, Clock, PhoneCall, CheckCircle } from "lucide-react";

export default async function DashboardPage() {
  const [stats, orders] = await Promise.all([getDashboardStats(), getOrders()]);
  const recent = orders.slice(0, 5);

  const cards = [
    {
      label: "Tổng đơn",
      value: stats.totalOrders,
      icon: TrendingUp,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Chờ xử lý",
      value: stats.pending,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Đang liên hệ",
      value: stats.contacted,
      icon: PhoneCall,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Hoàn thành tháng này",
      value: stats.doneThisMonth,
      icon: CheckCircle,
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl text-charcoal">Tổng quan</h1>
        <p className="text-stone text-sm mt-1">Hôm nay, 05/06/2026</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Revenue estimate */}
      <div className="bg-charcoal rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-white/50 text-xs tracking-widest uppercase mb-1">Doanh thu ước tính — Tháng 6</p>
          <p className="font-heading text-3xl text-warm-white">
            {stats.estimatedRevenue.toLocaleString("vi-VN")}₫
          </p>
        </div>
        <p className="text-white/30 text-xs max-w-xs">
          * Dựa trên đơn hoàn thành. Sẽ kết nối với .NET API sau.
        </p>
      </div>

      {/* Recent orders */}
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
                <th className="px-6 py-3 text-left text-[10px] tracking-widest uppercase text-stone font-normal hidden sm:table-cell">Loại rèm</th>
                <th className="px-6 py-3 text-left text-[10px] tracking-widest uppercase text-stone font-normal">Trạng thái</th>
                <th className="px-6 py-3 text-left text-[10px] tracking-widest uppercase text-stone font-normal hidden md:table-cell">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-linen">
              {recent.map((order) => (
                <tr key={order.id} className="hover:bg-cream/60 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-charcoal font-medium">{order.name}</p>
                    <p className="text-stone text-xs">{order.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-stone text-xs hidden sm:table-cell">
                    {CATEGORY_LABEL[order.category] ?? order.category}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${STATUS_COLOR[order.status]}`}>
                      {STATUS_LABEL[order.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-stone text-xs hidden md:table-cell">
                    {formatDate(order.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
