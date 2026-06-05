"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const items = [
  "Rèm Vải Luxury",
  "✦",
  "Miễn phí đo & lắp đặt",
  "✦",
  "Chất liệu nhập khẩu",
  "✦",
  "Bảo hành 5 năm",
  "✦",
  "Hơn 80 chất liệu độc quyền",
  "✦",
  "Tư vấn tận nhà",
  "✦",
  "Rèm Lụa Cao Cấp",
  "✦",
  "Giao hàng toàn quốc",
  "✦",
];

// Duplicate for seamless loop
const track = [...items, ...items];

export function MarqueeBanner() {
  return (
    <div className="bg-charcoal border-y border-white/10 py-4 overflow-hidden select-none">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
        style={{ willChange: "transform" }}
      >
        {track.map((item, i) => (
          <span
            key={i}
            className={
              item === "✦"
                ? "text-gold mx-6 text-xs"
                : "text-warm-white/70 text-xs tracking-widest uppercase mx-2 hover:text-gold transition-colors duration-300 cursor-default"
            }
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
