"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Category } from "@/lib/data";

type Props = {
  category: Category | null;
  open: boolean;
  onClose: () => void;
};

const tagColor: Record<string, string> = {
  Bestseller: "bg-charcoal text-warm-white",
  Mới: "bg-gold text-charcoal",
  Limited: "bg-stone-600 text-warm-white",
  Hot: "bg-red-700 text-white",
  Smart: "bg-blue-800 text-white",
};

export function CollectionDialog({ category, open, onClose }: Props) {
  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && category && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm"
          />

          {/* Modal panel — centered */}
          <motion.div
            key="modal"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 m-auto bg-warm-white flex flex-col"
            style={{ width: "min(95vw, 1200px)", height: "min(90vh, 860px)", borderRadius: "20px" }}
            onClick={(e) => e.stopPropagation()}
          >


            {/* Header */}
            <div className="px-8 md:px-16 pt-6 pb-6 border-b border-linen shrink-0 flex items-end justify-between gap-6">
              <div>
                <p className="text-gold text-xs tracking-[0.4em] uppercase mb-2">
                  Bộ sưu tập
                </p>
                <h2 className="font-heading text-3xl md:text-4xl text-charcoal">
                  {category.title}
                </h2>
                <p className="text-stone text-sm mt-1">{category.subtitle}</p>
              </div>

              <div className="flex items-center gap-6 shrink-0">
                <p className="text-stone text-sm hidden md:block">
                  {category.products.length} sản phẩm
                </p>
                <button
                  onClick={onClose}
                  className="w-10 h-10 border border-linen rounded-full flex items-center justify-center text-stone hover:border-charcoal hover:text-charcoal transition-colors duration-200 text-lg"
                  aria-label="Đóng"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Product grid — scrollable */}
            <div data-lenis-prevent className="overflow-y-auto flex-1 px-8 md:px-16 py-8 overscroll-contain">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {category.products.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group cursor-pointer"
                  >
                    {/* Swatch */}
                    <div className="relative aspect-[3/4] mb-3 overflow-hidden bg-linen rounded-xl">
                      <div
                        className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                        style={{
                          background: `linear-gradient(160deg, ${product.color}44 0%, ${product.color}99 50%, ${product.color}dd 100%)`,
                        }}
                      />
                      {/* Fabric texture */}
                      <div
                        className="absolute inset-0 opacity-25"
                        style={{
                          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)`,
                        }}
                      />
                      {product.tag && (
                        <span
                          className={`absolute top-2 left-2 px-2 py-0.5 text-[9px] tracking-widest uppercase ${tagColor[product.tag] ?? "bg-charcoal text-warm-white"}`}
                        >
                          {product.tag}
                        </span>
                      )}
                      {/* Quick add on hover */}
                      <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-charcoal/90 py-2.5 text-center">
                        <span className="text-warm-white text-[9px] tracking-widest uppercase">
                          Thêm vào giỏ
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <p className="text-gold text-[9px] tracking-widest uppercase mb-0.5 truncate">
                      {product.material}
                    </p>
                    <h4 className="font-heading text-sm text-charcoal leading-snug group-hover:text-gold transition-colors duration-300 line-clamp-2">
                      {product.name}
                    </h4>
                    <div className="flex items-center justify-between mt-1.5">
                      <p className="text-charcoal text-xs font-medium">
                        {product.price}₫
                      </p>
                      <div
                        className="w-3 h-3 rounded-full border border-black/10 shadow-sm shrink-0"
                        style={{ backgroundColor: product.color }}
                      />
                    </div>
                    <p className="text-stone text-[9px] mt-0.5">
                      {product.width} × {product.drop}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 md:px-16 py-5 border-t border-linen shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4 bg-cream">
              <p className="text-stone text-sm text-center sm:text-left">
                Cần tư vấn? Đội ngũ chúng tôi đến tận nhà đo và lắp đặt miễn phí.
              </p>
              <div className="flex gap-3 shrink-0">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 border border-linen rounded-full text-stone text-xs tracking-widest uppercase hover:border-charcoal hover:text-charcoal transition-colors duration-200"
                >
                  Đóng
                </button>
                <a
                  href="#contact"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-charcoal text-warm-white text-xs tracking-widest uppercase hover:bg-gold transition-colors duration-300 rounded-full"
                >
                  Tư vấn ngay
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
