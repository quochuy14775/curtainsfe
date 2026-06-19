import { api } from "@/lib/api";
import type { ContactInfo, ContactInfoRequest } from "@/types/contact";

export const contactService = {
  // Công khai — trang chủ đọc.
  get: () => api.get<ContactInfo>("/contact"),

  // Admin — cập nhật.
  update: (body: ContactInfoRequest) =>
    api.put<{ success: boolean; message: string }>("/contact", body),
};
