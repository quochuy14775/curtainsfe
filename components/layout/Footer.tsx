"use client";

import Link from "next/link";
import { useContactInfo } from "@/lib/useContactInfo";
import { telHref } from "@/types/contact";

export function Footer() {
  const contact = useContactInfo();
  return (
    <footer className="bg-charcoal text-warm-white/80">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-white/10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <p className="font-heading text-2xl text-warm-white">{contact.companyName}</p>
              <p className="text-xs tracking-[0.3em] text-gold uppercase mt-1">
                Rèm Màn Ngọc Huệ
              </p>
            </div>
            <p className="text-sm leading-relaxed text-warm-white/60 max-w-xs">
              Nơi nghệ thuật dệt may và thiết kế không gian sống hòa quyện,
              mang đến vẻ đẹp tinh tế cho ngôi nhà của bạn.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs tracking-widest uppercase text-gold mb-6">
              Khám phá
            </h4>
            <ul className="space-y-3">
              {["Bộ sưu tập", "Sản phẩm mới", "Ưu đãi", "Hướng dẫn chọn rèm"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-warm-white/60 hover:text-warm-white transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-widest uppercase text-gold mb-6">
              Liên hệ
            </h4>
            <ul className="space-y-3 text-sm text-warm-white/60">
              <li>{contact.addressLine1}</li>
              <li>{contact.addressLine2}</li>
              <li className="pt-2">
                <a href={telHref(contact.phone)} className="hover:text-warm-white transition-colors">
                  {contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="hover:text-warm-white transition-colors">
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-warm-white/40">
          <p>© 2026 Ngọc Huệ. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-warm-white/80 transition-colors">
              Chính sách bảo mật
            </Link>
            <Link href="#" className="hover:text-warm-white/80 transition-colors">
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
