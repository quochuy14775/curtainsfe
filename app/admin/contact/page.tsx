"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, Phone, Mail, MapPin, MessageCircle, Share2, Building2 } from "lucide-react";
import { contactService } from "@/services/contactService";
import type { ContactInfoRequest } from "@/types/contact";
import { notify } from "@/lib/toast";

type Field = {
  key: keyof ContactInfoRequest;
  label: string;
  placeholder: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  hint?: string;
};

const FIELDS: Field[] = [
  { key: "companyName", label: "Tên thương hiệu", placeholder: "Ngọc Huệ", icon: Building2 },
  { key: "phone", label: "Số điện thoại", placeholder: "0901 234 567", icon: Phone, hint: "Hiển thị ở footer và mục liên hệ trang chủ." },
  { key: "email", label: "Email", placeholder: "hello@maisondrage.vn", icon: Mail },
  { key: "addressLine1", label: "Địa chỉ (dòng 1)", placeholder: "123 Đường Nội Thất, Q.1", icon: MapPin },
  { key: "addressLine2", label: "Địa chỉ (dòng 2)", placeholder: "TP. Hồ Chí Minh", icon: MapPin },
  { key: "zaloUrl", label: "Link Zalo", placeholder: "https://zalo.me/0901234567", icon: MessageCircle, hint: "Nút Zalo nổi góc phải. Để trống sẽ ẩn nút." },
  { key: "whatsappUrl", label: "Link WhatsApp", placeholder: "https://wa.me/84901234567", icon: MessageCircle, hint: "Nút WhatsApp nổi góc phải. Để trống sẽ ẩn nút." },
  { key: "facebookUrl", label: "Link Facebook", placeholder: "https://facebook.com/...", icon: Share2 },
];

const EMPTY: ContactInfoRequest = {
  companyName: "", phone: "", email: "", addressLine1: "",
  addressLine2: "", zaloUrl: "", whatsappUrl: "", facebookUrl: "",
};

export default function ContactPage() {
  const [form, setForm] = useState<ContactInfoRequest>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    contactService.get()
      .then((data) => { if (alive) setForm({ ...EMPTY, ...data }); })
      .catch(() => { if (alive) notify.error("Không thể tải thông tin liên hệ."); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await contactService.update(form);
      notify.success("Đã lưu thông tin liên hệ. Trang chủ sẽ tự cập nhật.");
    } catch {
      notify.error("Lưu thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-stone/40 text-sm">Đang tải...</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl text-charcoal">Thông tin liên hệ</h1>
        <p className="text-stone text-sm mt-1">
          Sửa và lưu — thông tin sẽ tự cập nhật trên trang chủ (footer, mục liên hệ, nút Zalo/WhatsApp).
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-warm-white rounded-2xl border border-linen p-6 md:p-8 space-y-6">
        {FIELDS.map(({ key, label, placeholder, icon: Icon, hint }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <label className="block text-stone text-[10px] tracking-widest uppercase mb-2">{label}</label>
            <div className="relative">
              <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone/40" />
              <input
                value={form[key] ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-3 bg-cream/40 border border-linen rounded-xl text-sm text-charcoal placeholder:text-stone/40 focus:border-gold outline-none transition-colors"
              />
            </div>
            {hint && <p className="text-stone/50 text-xs mt-1.5">{hint}</p>}
          </motion.div>
        ))}

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-charcoal text-warm-white text-xs tracking-widest uppercase rounded-full hover:bg-gold transition-colors duration-200 disabled:opacity-60"
          >
            <Save size={14} />
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}
