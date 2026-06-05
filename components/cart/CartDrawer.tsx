"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCartStore, cartTotal, formatPrice } from "@/lib/cart-store";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";

const tagColor: Record<string, string> = {
  Bestseller: "bg-charcoal text-warm-white",
  Mới: "bg-gold text-charcoal",
  Limited: "bg-stone-600 text-warm-white",
  Hot: "bg-red-700 text-white",
  Smart: "bg-blue-800 text-white",
};

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCartStore();
  const total = cartTotal(items);

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm"
          />

          {/* Modal — centered, same style as CollectionDialog */}
          <motion.div
            key="modal"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 m-auto bg-warm-white flex flex-col"
            style={{ width: "min(95vw, 680px)", height: "min(90vh, 780px)", borderRadius: "20px" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-8 md:px-12 pt-6 pb-6 border-b border-linen shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} className="text-gold" />
                <h2 className="font-heading text-2xl text-charcoal">Giỏ hàng</h2>
                {items.length > 0 && (
                  <span className="text-xs text-stone">({items.length} sản phẩm)</span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="w-10 h-10 border border-linen rounded-full flex items-center justify-center text-stone hover:border-charcoal hover:text-charcoal transition-colors duration-200 text-lg"
                aria-label="Đóng giỏ hàng"
              >
                <X size={15} />
              </button>
            </div>

            {/* Items — scrollable */}
            <div data-lenis-prevent className="overflow-y-auto flex-1 px-8 md:px-12 py-8 space-y-7 overscroll-contain">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
                  <ShoppingBag size={44} className="text-linen" />
                  <p className="text-stone text-sm">Giỏ hàng trống</p>
                  <button
                    onClick={closeCart}
                    className="text-xs tracking-widest uppercase text-gold hover:text-charcoal transition-colors duration-200"
                  >
                    Khám phá sản phẩm →
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    className="flex gap-5"
                  >
                    {/* Swatch */}
                    <Link
                      href={`/products/${item.product.id}`}
                      onClick={closeCart}
                      className="shrink-0 w-24 h-28 rounded-xl overflow-hidden relative"
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(160deg, ${item.product.color}44 0%, ${item.product.color}99 50%, ${item.product.color}dd 100%)`,
                        }}
                      />
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)`,
                        }}
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          {item.product.tag && (
                            <span className={`inline-block px-1.5 py-0.5 text-[9px] tracking-widest uppercase mb-1 ${tagColor[item.product.tag] ?? "bg-charcoal text-warm-white"}`}>
                              {item.product.tag}
                            </span>
                          )}
                          <Link
                            href={`/products/${item.product.id}`}
                            onClick={closeCart}
                            className="font-heading text-base text-charcoal block hover:text-gold transition-colors line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-gold text-[10px] tracking-widest uppercase mt-0.5 truncate">
                            {item.product.material}
                          </p>
                          <p className="text-stone text-[10px] mt-0.5">
                            {item.product.width} × {item.product.drop}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-linen hover:text-stone transition-colors shrink-0 mt-0.5"
                          aria-label="Xóa"
                        >
                          <X size={13} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Qty controls */}
                        <div className="flex items-center gap-3 border border-linen rounded-full px-4 py-1.5">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="text-stone hover:text-charcoal transition-colors"
                            aria-label="Giảm"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="text-charcoal text-xs w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="text-stone hover:text-charcoal transition-colors"
                            aria-label="Tăng"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                        <p className="text-charcoal text-sm font-medium">
                          {formatPrice(Number(item.product.price.replace(/\./g, "")) * item.quantity)}₫
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-8 md:px-12 py-5 border-t border-linen shrink-0 flex flex-col gap-4 bg-cream" style={{ borderRadius: "0 0 20px 20px" }}>
                <div className="flex items-center justify-between">
                  <span className="text-stone text-sm">Tổng cộng</span>
                  <span className="font-heading text-2xl text-charcoal">{formatPrice(total)}₫</span>
                </div>
                <p className="text-stone text-xs">
                  * Giá chưa bao gồm công lắp đặt. Chúng tôi sẽ liên hệ xác nhận đơn hàng.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={closeCart}
                    className="px-6 py-3 border border-linen rounded-full text-stone text-xs tracking-widest uppercase hover:border-charcoal hover:text-charcoal transition-colors duration-200"
                  >
                    Tiếp tục mua
                  </button>
                  <a
                    href="#contact"
                    onClick={closeCart}
                    className="flex-1 py-3 bg-charcoal text-warm-white text-xs tracking-widest uppercase text-center hover:bg-gold transition-colors duration-300 rounded-full"
                  >
                    Đặt tư vấn & báo giá
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
