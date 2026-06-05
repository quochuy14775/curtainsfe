"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { getAllProducts, categories } from "@/lib/data";
import { useCartStore } from "@/lib/cart-store";

const tagColor: Record<string, string> = {
  Bestseller: "bg-charcoal text-warm-white",
  Mới: "bg-gold text-charcoal",
  Limited: "bg-stone-600 text-warm-white",
  Hot: "bg-red-700 text-white",
  Smart: "bg-blue-800 text-white",
};

const allProducts = getAllProducts();

type Props = {
  open: boolean;
  onClose: () => void;
};

export function SearchDialog({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const { addItem } = useCartStore();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setActiveCategory("all");
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    return allProducts.filter((p) => {
      const matchCat = activeCategory === "all" || p.categoryId === activeCategory;
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.categoryTitle.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [query, activeCategory]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm"
          />

          <motion.div
            key="dialog"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-0 z-50 bg-warm-white"
            style={{ maxHeight: "85vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="px-6 lg:px-12 py-6 border-b border-linen flex items-center gap-4 max-w-7xl mx-auto">
              <Search size={18} className="text-gold shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm kiếm rèm cửa, chất liệu..."
                className="flex-1 bg-transparent text-charcoal text-lg placeholder:text-stone/50 outline-none font-heading"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-stone hover:text-charcoal transition-colors">
                  <X size={16} />
                </button>
              )}
              <button
                onClick={onClose}
                className="shrink-0 w-9 h-9 border border-linen rounded-full flex items-center justify-center text-stone hover:border-charcoal hover:text-charcoal transition-colors"
                aria-label="Đóng tìm kiếm"
              >
                <X size={14} />
              </button>
            </div>

            {/* Category filters */}
            <div className="px-6 lg:px-12 py-3 border-b border-linen flex gap-2 overflow-x-auto max-w-7xl mx-auto">
              <button
                onClick={() => setActiveCategory("all")}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs tracking-widest uppercase transition-colors duration-200 ${
                  activeCategory === "all"
                    ? "bg-charcoal text-warm-white"
                    : "border border-linen text-stone hover:border-charcoal hover:text-charcoal"
                }`}
              >
                Tất cả
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-xs tracking-widest uppercase transition-colors duration-200 ${
                    activeCategory === cat.id
                      ? "bg-charcoal text-warm-white"
                      : "border border-linen text-stone hover:border-charcoal hover:text-charcoal"
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>

            {/* Results */}
            <div data-lenis-prevent className="overflow-y-auto px-6 lg:px-12 py-6 max-w-7xl mx-auto" style={{ maxHeight: "calc(85vh - 140px)" }}>
              {results.length === 0 ? (
                <p className="text-stone text-sm text-center py-12">
                  Không tìm thấy sản phẩm phù hợp.
                </p>
              ) : (
                <>
                  <p className="text-stone text-xs tracking-widest uppercase mb-4">
                    {results.length} sản phẩm
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {results.map((product, i) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                        className="group cursor-pointer"
                      >
                        <Link href={`/products/${product.id}`} onClick={onClose}>
                          <div className="relative aspect-[3/4] mb-2.5 overflow-hidden bg-linen rounded-xl">
                            <div
                              className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                              style={{
                                background: `linear-gradient(160deg, ${product.color}44 0%, ${product.color}99 50%, ${product.color}dd 100%)`,
                              }}
                            />
                            <div
                              className="absolute inset-0 opacity-25"
                              style={{
                                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)`,
                              }}
                            />
                            {product.tag && (
                              <span className={`absolute top-2 left-2 px-2 py-0.5 text-[9px] tracking-widest uppercase ${tagColor[product.tag] ?? "bg-charcoal text-warm-white"}`}>
                                {product.tag}
                              </span>
                            )}
                            <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-charcoal/90 py-2.5 text-center">
                              <button
                                onClick={(e) => { e.preventDefault(); addItem(product); onClose(); }}
                                className="text-warm-white text-[9px] tracking-widest uppercase w-full"
                              >
                                Thêm vào giỏ
                              </button>
                            </div>
                          </div>
                        </Link>
                        <p className="text-gold text-[9px] tracking-widest uppercase mb-0.5 truncate">
                          {product.material}
                        </p>
                        <Link href={`/products/${product.id}`} onClick={onClose}>
                          <h4 className="font-heading text-sm text-charcoal leading-snug group-hover:text-gold transition-colors duration-300 line-clamp-2">
                            {product.name}
                          </h4>
                        </Link>
                        <p className="text-charcoal text-xs font-medium mt-1">{product.price}₫</p>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
