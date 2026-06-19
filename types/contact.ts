// ─── Entity / DTO ──────────────────────────────────────────────────────────

export type ContactInfo = {
  companyName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  zaloUrl: string;
  whatsappUrl: string;
  facebookUrl: string;
};

export type ContactInfoRequest = {
  companyName?: string;
  phone?: string;
  email?: string;
  addressLine1?: string;
  addressLine2?: string;
  zaloUrl?: string;
  whatsappUrl?: string;
  facebookUrl?: string;
};

// Giá trị mặc định — dùng khi API lỗi hoặc trường để trống, để trang chủ không bao giờ trắng.
export const DEFAULT_CONTACT: ContactInfo = {
  companyName: "Ngọc Huệ",
  phone: "0901 234 567",
  email: "hello@maisondrage.vn",
  addressLine1: "123 Đường Nội Thất, Q.1",
  addressLine2: "TP. Hồ Chí Minh",
  zaloUrl: "https://zalo.me/0901234567",
  whatsappUrl: "https://wa.me/84901234567",
  facebookUrl: "",
};

// Chuyển số điện thoại thành dạng dùng cho href="tel:" (bỏ khoảng trắng, thêm +84 nếu bắt đầu bằng 0).
export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("0")) return `tel:+84${digits.slice(1)}`;
  return `tel:${digits}`;
}
