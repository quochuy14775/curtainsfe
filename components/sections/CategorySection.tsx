"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { categories } from "@/lib/data";
import { CollectionDialog } from "./CollectionDialog";
import type { Category } from "@/lib/data";

export function CategorySection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [selected, setSelected] = useState<Category | null>(null);

  return (
    <>
      <section id="collections" className="py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Header */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
          >
            <div>
              <p className="text-gold text-xs tracking-[0.4em] uppercase mb-4">
                Danh mục
              </p>
              <h2 className="font-heading text-4xl md:text-5xl text-charcoal leading-tight">
                Bộ Sưu Tập
                <br />
                <em className="text-stone not-italic">Đặc Trưng</em>
              </h2>
            </div>
            <p className="text-stone text-sm leading-relaxed max-w-xs">
              Từ vải lụa mềm mại đến rèm cuốn tiện dụng — mỗi dòng sản phẩm
              là một câu chuyện về vẻ đẹp riêng.
            </p>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.7,
                  delay: 0.15 + i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onClick={() => setSelected(cat)}
                className="group relative aspect-[3/4] overflow-hidden cursor-pointer text-left w-full rounded-2xl"
              >
                {/* Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-b ${cat.bg} transition-transform duration-700 group-hover:scale-105`}
                />

                {/* Pattern overlay */}
                <div
                  className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      90deg, transparent, transparent 8px,
                      rgba(255,255,255,0.3) 8px, rgba(255,255,255,0.3) 9px
                    )`,
                  }}
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  <div className="w-8 h-px" style={{ backgroundColor: cat.accent }} />
                  <div>
                    <p
                      className="text-xs tracking-widest uppercase mb-2"
                      style={{ color: cat.accent }}
                    >
                      {cat.count}
                    </p>
                    <h3 className="font-heading text-2xl text-warm-white leading-tight mb-1">
                      {cat.title}
                    </h3>
                    <p className="text-warm-white/60 text-sm">{cat.subtitle}</p>

                    {/* "Xem tất cả" hint on hover */}
                    <p
                      className="mt-4 text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                      style={{ color: cat.accent }}
                    >
                      Xem tất cả →
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <CollectionDialog
        category={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
