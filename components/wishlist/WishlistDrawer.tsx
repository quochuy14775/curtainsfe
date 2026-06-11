"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-store";
import { useCartStore } from "@/lib/cart-store";
import { getAllProducts } from "@/lib/data";

export function WishlistDrawer() {
  const { ids, isOpen, closePanel, toggle, clear } = useWishlist();
  const { addItem } = useCartStore();

  useEffect(() => {
    useWishlist.persist.rehydrate();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closePanel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closePanel]);

  const all = getAllProducts();
  const items = ids
    .map((id) => all.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="wl-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closePanel}
            className="fixed inset-0 z-50 bg-[#2c2c2c]/50 backdrop-blur-sm"
          />
          <motion.aside
            key="wl-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[420px] bg-warm-white flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="px-7 py-6 border-b border-linen flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Heart size={18} className="text-gold fill-gold" />
                <div>
                  <p className="font-heading text-lg text-charcoal leading-none">Yêu thích</p>
                  <p className="text-stone text-xs mt-1">{items.length} sản phẩm</p>
                </div>
              </div>
              <button
                onClick={closePanel}
                className="w-9 h-9 border border-linen rounded-full flex items-center justify-center text-stone hover:border-charcoal hover:text-charcoal transition-colors"
                aria-label="Đóng"
              >
                <X size={15} />
              </button>
            </div>

            {/* List */}
            <div data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-7 py-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
                  <Heart size={40} className="text-linen" />
                  <p className="font-heading text-xl text-charcoal">Chưa có sản phẩm nào</p>
                  <p className="text-stone text-sm max-w-[240px]">
                    Chạm vào biểu tượng ♥ trên sản phẩm để lưu lại đây.
                  </p>
                  <Link
                    href="/products"
                    onClick={closePanel}
                    className="mt-2 px-6 py-2.5 bg-charcoal text-warm-white text-xs tracking-widest uppercase hover:bg-gold transition-colors duration-300 rounded-full"
                  >
                    Khám phá ngay
                  </Link>
                </div>
              ) : (
                <ul className="space-y-5">
                  {items.map((p) => (
                    <motion.li
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 24 }}
                      className="flex gap-4 group"
                    >
                      {/* Swatch */}
                      <Link
                        href={`/products/${p.id}`}
                        onClick={closePanel}
                        className="relative w-20 h-24 rounded-xl overflow-hidden shrink-0"
                      >
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(160deg, ${p.color}44 0%, ${p.color}99 50%, ${p.color}dd 100%)`,
                          }}
                        />
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0 py-1">
                        <p className="text-gold text-[9px] tracking-widest uppercase truncate">
                          {p.material}
                        </p>
                        <Link href={`/products/${p.id}`} onClick={closePanel}>
                          <h4 className="font-heading text-base text-charcoal leading-snug hover:text-gold transition-colors line-clamp-2">
                            {p.name}
                          </h4>
                        </Link>
                        <p className="text-charcoal text-sm mt-1">{p.price}₫/m²</p>

                        <div className="flex gap-3 mt-2">
                          <button
                            onClick={() => addItem(p)}
                            className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-stone hover:text-gold transition-colors"
                          >
                            <ShoppingBag size={11} /> Thêm vào giỏ
                          </button>
                          <button
                            onClick={() => toggle(p.id)}
                            className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-stone/60 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={11} /> Bỏ
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-7 py-5 border-t border-linen shrink-0 flex items-center justify-between gap-4">
                <button
                  onClick={clear}
                  className="text-xs tracking-widest uppercase text-stone/60 hover:text-red-400 transition-colors"
                >
                  Xoá tất cả
                </button>
                <Link
                  href="/products"
                  onClick={closePanel}
                  className="px-6 py-2.5 bg-charcoal text-warm-white text-xs tracking-widest uppercase hover:bg-gold transition-colors duration-300 rounded-full"
                >
                  Tiếp tục xem
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
