"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Calculator, Info } from "lucide-react";
import { categories } from "@/lib/data";

// Mock pricing rules per category — replace with BE data later
const CATEGORY_PRICING: Record<string, { avg: number; min: number; max: number }> = {
  "luxury-fabric": { avg: 3200000, min: 2400000, max: 4500000 },
  silk: { avg: 4100000, min: 3600000, max: 5200000 },
  roller: { avg: 1200000, min: 850000, max: 1800000 },
  rainbow: { avg: 1600000, min: 1200000, max: 2200000 },
};

// Fullness multiplier — fabric curtains need ~2x width of fabric for pleats
const FULLNESS = 2;
const INSTALL_FEE = 0; // free trong nội thành — selling point

function formatVND(n: number) {
  return n.toLocaleString("vi-VN");
}

export function PriceEstimator() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [width, setWidth] = useState(3);
  const [height, setHeight] = useState(2.7);
  const [categoryId, setCategoryId] = useState(categories[0].id);

  const estimate = useMemo(() => {
    const pricing = CATEGORY_PRICING[categoryId] ?? CATEGORY_PRICING["luxury-fabric"];
    // Area dùng vải = rộng × fullness × cao (rèm vải); rèm cuốn/cầu vồng thì 1:1
    const fullness = categoryId === "roller" || categoryId === "rainbow" ? 1 : FULLNESS;
    const area = width * fullness * height;
    return {
      mid: Math.round((area * pricing.avg) / 100000) * 100000,
      low: Math.round((area * pricing.min) / 100000) * 100000,
      high: Math.round((area * pricing.max) / 100000) * 100000,
      area: Math.round(area * 10) / 10,
    };
  }, [width, height, categoryId]);

  const sliderCls =
    "w-full h-1 rounded-full appearance-none cursor-pointer bg-[#e8e0d5] accent-[#c9a96e]";

  return (
    <section id="estimator" className="py-28 bg-[#f8f5f0]">
      <div ref={ref} className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — intro */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-gold text-[10px] tracking-[0.5em] uppercase mb-5"
            >
              Công cụ ước tính
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-4xl md:text-5xl text-[#2c2c2c] leading-tight mb-6"
            >
              Biết Ngay Chi Phí
              <br />
              <em className="text-gold not-italic">Trong 10 Giây</em>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-[#8c8480] text-sm leading-relaxed mb-8 max-w-md"
            >
              Kéo thanh trượt theo kích thước cửa sổ của bạn, chọn dòng sản phẩm —
              chúng tôi tính toán ngay khoảng giá dự kiến. Hoàn toàn miễn phí đo đạc
              chính xác khi đặt lịch.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex items-start gap-3 text-[#8c8480] text-xs leading-relaxed max-w-md border-l-2 border-gold/40 pl-4"
            >
              <Info size={14} className="text-gold shrink-0 mt-0.5" />
              <p>
                Giá đã bao gồm vải may đo (hệ số xếp ly ×2), phụ kiện và công lắp đặt
                trong nội thành TP.HCM.
              </p>
            </motion.div>
          </div>

          {/* Right — calculator card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[#fdfbf8] border border-[#e8e0d5] rounded-2xl p-8 md:p-10 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center">
                <Calculator size={16} className="text-gold" />
              </div>
              <p className="font-heading text-lg text-[#2c2c2c]">Ước tính nhanh</p>
            </div>

            {/* Width slider */}
            <div className="mb-7">
              <div className="flex justify-between items-baseline mb-3">
                <label className="text-[#8c8480] text-[10px] tracking-widest uppercase">
                  Chiều rộng cửa
                </label>
                <span className="font-heading text-xl text-[#2c2c2c]">{width.toFixed(1)}m</span>
              </div>
              <input
                type="range"
                min={1}
                max={8}
                step={0.1}
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className={sliderCls}
              />
            </div>

            {/* Height slider */}
            <div className="mb-7">
              <div className="flex justify-between items-baseline mb-3">
                <label className="text-[#8c8480] text-[10px] tracking-widest uppercase">
                  Chiều cao
                </label>
                <span className="font-heading text-xl text-[#2c2c2c]">{height.toFixed(1)}m</span>
              </div>
              <input
                type="range"
                min={1}
                max={4}
                step={0.1}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className={sliderCls}
              />
            </div>

            {/* Category pills */}
            <div className="mb-8">
              <label className="block text-[#8c8480] text-[10px] tracking-widest uppercase mb-3">
                Dòng sản phẩm
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryId(cat.id)}
                    className={`px-4 py-1.5 rounded-full text-xs transition-all duration-200 ${
                      categoryId === cat.id
                        ? "bg-[#2c2c2c] text-[#fdfbf8]"
                        : "border border-[#e8e0d5] text-[#8c8480] hover:border-[#2c2c2c] hover:text-[#2c2c2c]"
                    }`}
                  >
                    {cat.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Result */}
            <div className="border-t border-[#e8e0d5] pt-6">
              <p className="text-[#8c8480] text-[10px] tracking-widest uppercase mb-2">
                Chi phí dự kiến · {estimate.area}m² vải
              </p>
              <AnimatePresence mode="popLayout">
                <motion.p
                  key={estimate.mid}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="font-heading text-4xl text-gold mb-1"
                >
                  {formatVND(estimate.mid)}₫
                </motion.p>
              </AnimatePresence>
              <p className="text-[#8c8480] text-xs mb-6">
                Khoảng {formatVND(estimate.low)}₫ – {formatVND(estimate.high)}₫ tùy mẫu vải
              </p>
              <a
                href="#contact"
                className="block w-full py-4 bg-[#2c2c2c] text-[#fdfbf8] text-xs tracking-widest uppercase hover:bg-gold transition-colors duration-300 rounded-full text-center"
              >
                Đặt lịch đo chính xác — miễn phí
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
