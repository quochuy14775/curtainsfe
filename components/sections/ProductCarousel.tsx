"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { categories } from "@/lib/data";
import type { Product } from "@/lib/data";

// Flatten all products across categories
const allProducts = categories.flatMap((cat) =>
  cat.products.map((p) => ({ ...p, category: cat.title }))
);

const SLIDE_DURATION = 4000;

const tagColor: Record<string, string> = {
  Bestseller: "bg-charcoal text-warm-white",
  Mới: "bg-gold text-charcoal",
  Limited: "bg-stone-600 text-warm-white",
  Hot: "bg-red-700 text-white",
  Smart: "bg-blue-800 text-white",
};

export function ProductCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const total = allProducts.length;

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((p) => (p + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((p) => (p - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(t);
  }, [next, paused]);

  const product = allProducts[current];

  return (
    <section
      className="relative bg-charcoal overflow-hidden"
      style={{ height: "70vh", minHeight: "560px" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.section
          key={product.id}
          custom={direction}
          variants={{
            enter: (d: number) => ({
              x: d > 0 ? 120 : -120,
              opacity: 0,
              scale: 0.98,
            }),
            center: { x: 0, opacity: 1, scale: 1 },
            exit: (d: number) => ({
              x: d > 0 ? -120 : 120,
              opacity: 0,
              scale: 0.98,
            }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex"
        >
          {/* Left — fabric swatch */}
          <div className="relative w-1/2 h-full overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(160deg, ${product.color}33 0%, ${product.color}88 50%, ${product.color}cc 100%)`,
              }}
            />
            {/* Fabric texture */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)`,
              }}
            />
            {/* Color dot */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="absolute bottom-10 left-10 flex items-center gap-3"
            >
              <div
                className="w-8 h-8 rounded-full border-2 border-white/30 shadow-lg"
                style={{ backgroundColor: product.color }}
              />
              <span className="text-warm-white/60 text-xs tracking-widest uppercase">
                Màu sắc
              </span>
            </motion.div>
          </div>

          {/* Right — product info */}
          <div className="w-1/2 h-full flex flex-col justify-center px-12 md:px-16 xl:px-20">
            {/* Category */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-gold text-xs tracking-[0.4em] uppercase mb-4"
            >
              {product.category}
            </motion.p>

            {/* Name */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-3xl md:text-4xl xl:text-5xl text-warm-white leading-tight mb-3"
            >
              {product.name}
            </motion.h2>

            {/* Material */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26, duration: 0.4 }}
              className="text-warm-white/50 text-sm mb-6"
            >
              {product.material}
            </motion.p>

            {/* Tag */}
            {product.tag && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.35 }}
                className={`inline-block self-start px-3 py-1 text-[10px] tracking-widest uppercase mb-6 ${tagColor[product.tag] ?? "bg-charcoal text-warm-white"}`}
              >
                {product.tag}
              </motion.span>
            )}

            {/* Specs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34, duration: 0.4 }}
              className="flex gap-6 mb-8 border-t border-white/10 pt-6"
            >
              <div>
                <p className="text-warm-white/30 text-[10px] tracking-widest uppercase mb-1">Chiều rộng</p>
                <p className="text-warm-white text-sm">{product.width}</p>
              </div>
              <div>
                <p className="text-warm-white/30 text-[10px] tracking-widest uppercase mb-1">Chiều cao</p>
                <p className="text-warm-white text-sm">{product.drop}</p>
              </div>
              <div>
                <p className="text-warm-white/30 text-[10px] tracking-widest uppercase mb-1">Đơn giá</p>
                <p className="text-warm-white text-sm font-medium">{product.price}₫/m²</p>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.4 }}
              className="flex gap-3"
            >
              <button className="px-8 py-3 bg-gold text-charcoal text-xs tracking-widest uppercase hover:bg-gold-light transition-colors duration-300 rounded-full">
                Thêm vào giỏ
              </button>
              <button className="px-8 py-3 border border-white/20 text-warm-white/70 text-xs tracking-widest uppercase hover:border-gold hover:text-gold transition-colors duration-300 rounded-full">
                Xem chi tiết
              </button>
            </motion.div>
          </div>
        </motion.section>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-0.5 bg-white/10">
        <motion.div
          key={`progress-${current}`}
          className="h-full bg-gold"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
        />
      </div>

      {/* Arrow buttons */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 border border-white/15 rounded-full flex items-center justify-center text-warm-white/50 hover:border-gold hover:text-gold transition-all duration-300"
        aria-label="Previous"
      >
        ←
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 border border-white/15 rounded-full flex items-center justify-center text-warm-white/50 hover:border-gold hover:text-gold transition-all duration-300"
        aria-label="Next"
      >
        →
      </button>

      {/* Counter */}
      <div className="absolute top-6 right-8 z-10 text-warm-white/30 text-xs tracking-widest font-mono">
        {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>

      {/* Dot nav */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {allProducts.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Sản phẩm ${i + 1}`}
          >
            <span
              className="block rounded-full transition-all duration-300"
              style={{
                width: i === current ? "20px" : "5px",
                height: "5px",
                backgroundColor:
                  i === current ? "#c9a96e" : "rgba(255,255,255,0.25)",
              }}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
