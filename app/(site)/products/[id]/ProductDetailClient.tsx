"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import type { ProductWithCategory } from "@/lib/data";
import { useCartStore } from "@/lib/cart-store";

const tagColor: Record<string, string> = {
  Bestseller: "bg-charcoal text-warm-white",
  Mới: "bg-gold text-charcoal",
  Limited: "bg-stone-600 text-warm-white",
  Hot: "bg-red-700 text-white",
  Smart: "bg-blue-800 text-white",
};

type Props = {
  product: ProductWithCategory;
  related: ProductWithCategory[];
};

export function ProductDetailClient({ product, related }: Props) {
  const { addItem } = useCartStore();
  const relatedRef = useRef<HTMLDivElement>(null);
  const inView = useInView(relatedRef, { once: true, margin: "-80px" });

  return (
    <div className="min-h-screen bg-warm-white pt-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-stone text-xs tracking-widest uppercase hover:text-charcoal transition-colors duration-200"
        >
          <ArrowLeft size={13} />
          Trang chủ
        </Link>
      </div>

      {/* Main product */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Swatch / visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-linen"
          >
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(160deg, ${product.color}33 0%, ${product.color}88 40%, ${product.color}cc 100%)`,
              }}
            />
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(0,0,0,0.08) 4px, rgba(0,0,0,0.08) 5px)`,
              }}
            />
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,0.08) 4px, rgba(0,0,0,0.08) 5px)`,
              }}
            />
            <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2">
              <div
                className="w-12 h-12 rounded-full border-4 border-white/60 shadow-xl"
                style={{ backgroundColor: product.color }}
              />
              <span className="text-white/70 text-[10px] tracking-widest uppercase font-medium">
                {product.color}
              </span>
            </div>
            {product.tag && (
              <div className={`absolute top-6 left-6 px-3 py-1 text-xs tracking-widest uppercase ${tagColor[product.tag] ?? "bg-charcoal text-warm-white"}`}>
                {product.tag}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="flex flex-col justify-center gap-6"
          >
            <div>
              <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">
                {product.categoryTitle}
              </p>
              <h1 className="font-heading text-4xl md:text-5xl text-charcoal leading-tight mb-4">
                {product.name}
              </h1>
              <p className="text-stone text-sm leading-relaxed">
                Chất liệu {product.material} — được tuyển chọn kỹ càng để mang lại vẻ đẹp bền vững và sang trọng cho không gian sống của bạn.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 py-6 border-y border-linen">
              <div>
                <p className="text-stone text-[10px] tracking-widest uppercase mb-1">Chất liệu</p>
                <p className="font-heading text-charcoal text-sm">{product.material}</p>
              </div>
              <div>
                <p className="text-stone text-[10px] tracking-widest uppercase mb-1">Rộng</p>
                <p className="font-heading text-charcoal text-sm">{product.width}</p>
              </div>
              <div>
                <p className="text-stone text-[10px] tracking-widest uppercase mb-1">Dài</p>
                <p className="font-heading text-charcoal text-sm">{product.drop}</p>
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-heading text-3xl text-charcoal">{product.price}₫</span>
              <span className="text-stone text-sm">/m²</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => addItem(product)}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-charcoal text-warm-white text-xs tracking-widest uppercase hover:bg-gold transition-colors duration-300 rounded-full"
              >
                <ShoppingBag size={14} />
                Thêm vào giỏ
              </button>
              <a
                href="/#contact"
                className="flex-1 py-4 border border-charcoal text-charcoal text-xs tracking-widest uppercase hover:border-gold hover:text-gold transition-colors duration-300 rounded-full text-center"
              >
                Tư vấn miễn phí
              </a>
            </div>

            <p className="text-stone text-xs">
              Đo đạc và lắp đặt miễn phí trong nội thành TP.HCM · Bảo hành 100%
            </p>
          </motion.div>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="bg-cream py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <motion.div
              ref={relatedRef}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="mb-10"
            >
              <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">Cùng bộ sưu tập</p>
              <h2 className="font-heading text-3xl text-charcoal">Sản Phẩm Liên Quan</h2>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {related.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="group cursor-pointer"
                >
                  <Link href={`/products/${p.id}`}>
                    <div className="relative aspect-[3/4] mb-3 overflow-hidden bg-linen rounded-xl">
                      <div
                        className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                        style={{
                          background: `linear-gradient(160deg, ${p.color}44 0%, ${p.color}99 50%, ${p.color}dd 100%)`,
                        }}
                      />
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)`,
                        }}
                      />
                      {p.tag && (
                        <span className={`absolute top-2 left-2 px-2 py-0.5 text-[9px] tracking-widest uppercase ${tagColor[p.tag] ?? "bg-charcoal text-warm-white"}`}>
                          {p.tag}
                        </span>
                      )}
                      <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-charcoal/90 py-2.5 text-center">
                        <button
                          onClick={(e) => { e.preventDefault(); addItem(p); }}
                          className="text-warm-white text-[9px] tracking-widest uppercase w-full"
                        >
                          Thêm vào giỏ
                        </button>
                      </div>
                    </div>
                    <p className="text-gold text-[9px] tracking-widest uppercase mb-0.5 truncate">{p.material}</p>
                    <h3 className="font-heading text-sm text-charcoal group-hover:text-gold transition-colors duration-300 line-clamp-2">
                      {p.name}
                    </h3>
                    <p className="text-charcoal text-xs font-medium mt-1">{p.price}₫</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
