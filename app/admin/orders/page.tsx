import { getOrders, STATUS_LABEL, STATUS_COLOR, CATEGORY_LABEL, formatDate } from "@/lib/mock-admin";
import { OrderActions } from "./OrderActions";

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-charcoal">Đơn tư vấn</h1>
          <p className="text-stone text-sm mt-1">{orders.length} đơn tổng cộng</p>
        </div>
      </div>

      <div className="bg-warm-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-linen">
                {["Mã đơn", "Khách hàng", "Loại rèm", "Ghi chú", "Phụ trách", "Trạng thái", "Thời gian", ""].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-[10px] tracking-widest uppercase text-stone font-normal whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-linen">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-cream/50 transition-colors group">
                  <td className="px-5 py-4 text-stone text-xs font-mono">{order.id}</td>
                  <td className="px-5 py-4">
                    <p className="text-charcoal font-medium whitespace-nowrap">{order.name}</p>
                    <a href={`tel:${order.phone}`} className="text-stone text-xs hover:text-gold transition-colors">
                      {order.phone}
                    </a>
                    {order.email && (
                      <p className="text-stone text-xs truncate max-w-[140px]">{order.email}</p>
                    )}
                  </td>
                  <td className="px-5 py-4 text-stone text-xs whitespace-nowrap">
                    {CATEGORY_LABEL[order.category] ?? order.category}
                  </td>
                  <td className="px-5 py-4 text-stone text-xs max-w-[200px]">
                    <p className="line-clamp-2">{order.note || <span className="italic text-stone/40">Không có</span>}</p>
                  </td>
                  <td className="px-5 py-4 text-stone text-xs whitespace-nowrap">
                    {order.assignedTo ?? <span className="italic text-stone/40">—</span>}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap ${STATUS_COLOR[order.status]}`}>
                      {STATUS_LABEL[order.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-stone text-xs whitespace-nowrap">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <OrderActions order={order} />
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
