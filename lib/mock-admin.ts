// ---------------------------------------------------------------------------
// Mock data layer — replace each function body with a fetch() to .NET API later
// ---------------------------------------------------------------------------

export type OrderStatus = "pending" | "contacted" | "confirmed" | "done" | "cancelled";

export type Order = {
  id: string;
  createdAt: string; // ISO date string
  name: string;
  phone: string;
  email: string;
  category: string;
  note: string;
  status: OrderStatus;
  assignedTo?: string;
};

export type DashboardStats = {
  totalOrders: number;
  pending: number;
  contacted: number;
  confirmed: number;
  doneThisMonth: number;
  cancelled: number;
  completionRate: number; // %
  categoryBreakdown: { label: string; count: number }[];
  topStaff: { name: string; count: number }[];
};

// ---------------------------------------------------------------------------
// Mock dataset
// ---------------------------------------------------------------------------

const MOCK_ORDERS: Order[] = [
  { id: "ORD-001", createdAt: "2026-06-04T08:12:00Z", name: "Nguyễn Thị Lan", phone: "0901 234 567", email: "lan@gmail.com", category: "luxury-fabric", note: "Cần rèm cho phòng khách 5m, phong cách tân cổ điển", status: "pending" },
  { id: "ORD-002", createdAt: "2026-06-04T10:45:00Z", name: "Trần Văn Minh", phone: "0912 345 678", email: "minh@gmail.com", category: "roller", note: "Blackout cho phòng ngủ, 2 cửa sổ 1.4m", status: "contacted", assignedTo: "Hương" },
  { id: "ORD-003", createdAt: "2026-06-03T14:20:00Z", name: "Lê Thu Hà", phone: "0938 456 789", email: "", category: "silk", note: "Rèm lụa cho biệt thự, cần đo thực tế", status: "confirmed", assignedTo: "Tuấn" },
  { id: "ORD-004", createdAt: "2026-06-03T09:00:00Z", name: "Phạm Đức Anh", phone: "0976 567 890", email: "duc@company.vn", category: "rainbow", note: "Văn phòng 200m2, cần báo giá tổng thể", status: "done", assignedTo: "Hương" },
  { id: "ORD-005", createdAt: "2026-06-02T16:30:00Z", name: "Hoàng Mỹ Linh", phone: "0965 678 901", email: "linh@gmail.com", category: "luxury-fabric", note: "Velvet Bordeaux — đã thấy trên web, muốn xem mẫu thực", status: "done", assignedTo: "Tuấn" },
  { id: "ORD-006", createdAt: "2026-06-02T11:10:00Z", name: "Vũ Quốc Hùng", phone: "0987 789 012", email: "hung@gmail.com", category: "roller", note: "Motorized Smart cho căn hộ penthouse", status: "contacted", assignedTo: "Hương" },
  { id: "ORD-007", createdAt: "2026-06-01T13:55:00Z", name: "Đỗ Thanh Trang", phone: "0908 890 123", email: "trang@gmail.com", category: "silk", note: "", status: "cancelled" },
  { id: "ORD-008", createdAt: "2026-06-01T08:30:00Z", name: "Bùi Hải Nam", phone: "0921 901 234", email: "nam@gmail.com", category: "luxury-fabric", note: "Jacquard Cream Pearl — phòng ngủ master", status: "done", assignedTo: "Tuấn" },
  { id: "ORD-009", createdAt: "2026-05-31T15:20:00Z", name: "Ngô Thị Xuân", phone: "0945 012 345", email: "xuan@gmail.com", category: "rainbow", note: "Zebra cho nhà phố 3 tầng", status: "done", assignedTo: "Hương" },
  { id: "ORD-010", createdAt: "2026-05-30T10:00:00Z", name: "Trịnh Công Sơn", phone: "0933 123 456", email: "son@gmail.com", category: "roller", note: "Sunscreen cho văn phòng hướng Tây", status: "done", assignedTo: "Tuấn" },
  { id: "ORD-011", createdAt: "2026-06-05T07:30:00Z", name: "Lý Thị Kim Ngân", phone: "0902 234 567", email: "ngan@gmail.com", category: "luxury-fabric", note: "Velvet Sage Green, phòng khách căn hộ 80m2", status: "pending" },
  { id: "ORD-012", createdAt: "2026-06-05T09:15:00Z", name: "Phan Văn Đức", phone: "0919 345 678", email: "duc2@gmail.com", category: "silk", note: "Champagne Silk cho phòng cưới", status: "pending" },
];

// ---------------------------------------------------------------------------
// Service functions — swap body with fetch('.net/api/...') later
// ---------------------------------------------------------------------------

export async function getOrders(): Promise<Order[]> {
  return MOCK_ORDERS;
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  return MOCK_ORDERS.find((o) => o.id === id);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date("2026-06-05");
  const thisMonth = MOCK_ORDERS.filter((o) => {
    const d = new Date(o.createdAt);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });

  const done = MOCK_ORDERS.filter((o) => o.status === "done").length;
  const cancelled = MOCK_ORDERS.filter((o) => o.status === "cancelled").length;

  const categoryBreakdown = Object.entries(CATEGORY_LABEL).map(([key, label]) => ({
    label,
    count: MOCK_ORDERS.filter((o) => o.category === key).length,
  })).filter((c) => c.count > 0).sort((a, b) => b.count - a.count);

  const staffMap = new Map<string, number>();
  MOCK_ORDERS.forEach((o) => {
    if (o.assignedTo) staffMap.set(o.assignedTo, (staffMap.get(o.assignedTo) ?? 0) + 1);
  });
  const topStaff = [...staffMap.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalOrders: MOCK_ORDERS.length,
    pending: MOCK_ORDERS.filter((o) => o.status === "pending").length,
    contacted: MOCK_ORDERS.filter((o) => o.status === "contacted").length,
    confirmed: MOCK_ORDERS.filter((o) => o.status === "confirmed").length,
    doneThisMonth: thisMonth.filter((o) => o.status === "done").length,
    cancelled,
    completionRate: Math.round((done / MOCK_ORDERS.length) * 100),
    categoryBreakdown,
    topStaff,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Chờ xử lý",
  contacted: "Đã liên hệ",
  confirmed: "Đã xác nhận",
  done: "Hoàn thành",
  cancelled: "Huỷ",
};

export const STATUS_COLOR: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  contacted: "bg-blue-100 text-blue-800",
  confirmed: "bg-purple-100 text-purple-800",
  done: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-stone-100 text-stone-500",
};

export const CATEGORY_LABEL: Record<string, string> = {
  "luxury-fabric": "Rèm Vải Luxury",
  silk: "Rèm Lụa",
  roller: "Rèm Cuốn",
  rainbow: "Rèm Cầu Vồng",
  other: "Khác",
};

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
