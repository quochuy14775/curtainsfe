"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const categories = [
  {
    title: "Rèm Vải Luxury",
    subtitle: "Chất liệu nhập khẩu cao cấp",
    count: "48 sản phẩm",
    bg: "from-stone-800 to-stone-700",
    accent: "#c9a96e",
  },
  {
    title: "Rèm Lụa",
    subtitle: "Sang trọng, mềm mại",
    count: "32 sản phẩm",
    bg: "from-neutral-700 to-neutral-600",
    accent: "#d4c4a8",
  },
  {
    title: "Rèm Cuốn",
    subtitle: "Hiện đại, tiện dụng",
    count: "64 sản phẩm",
    bg: "from-zinc-800 to-zinc-700",
    accent: "#c9a96e",
  },
  {
    title: "Rèm Cầu Vồng",
    subtitle: "Màu sắc phong phú",
    count: "55 sản phẩm",
    bg: "from-stone-700 to-stone-600",
    accent: "#e8d5b0",
  },
];

export function CategorySection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
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
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.15 + i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative aspect-[3/4] overflow-hidden cursor-pointer"
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
                <div
                  className="w-8 h-px"
                  style={{ backgroundColor: cat.accent }}
                />
                <div>
                  <p
                    className="text-xs tracking-widest uppercase mb-2 transition-colors duration-300"
                    style={{ color: cat.accent }}
                  >
                    {cat.count}
                  </p>
                  <h3 className="font-heading text-2xl text-warm-white leading-tight mb-1">
                    {cat.title}
                  </h3>
                  <p className="text-warm-white/60 text-sm">{cat.subtitle}</p>

                  {/* Arrow on hover */}
                  <motion.div
                    className="mt-4 flex items-center gap-2 text-xs tracking-widest uppercase"
                    style={{ color: cat.accent }}
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                  >
                    <span className="group-hover:opacity-100 opacity-0 transition-opacity duration-300">
                      Xem thêm →
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
