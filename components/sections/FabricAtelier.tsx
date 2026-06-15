"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { getAllProducts, type ProductWithCategory } from "@/lib/data";

/**
 * Fabric Atelier — "bức tường vải" tương tác.
 *
 * Mỗi sản phẩm trong catalog được render thành một tấm vải rủ bằng CSS thuần
 * (suy từ mã màu `color`), lọc theo họ màu tự phân loại từ hệ HSL. Di chuột
 * hoặc chạm vào một mẫu để xem nó phóng lớn kèm thông tin chất liệu, giá, khổ.
 *
 * Hoàn toàn dựa trên dữ liệu chữ + màu — không phụ thuộc ảnh thật.
 */

// ─── COLOR HELPERS ────────────────────────────────────────────────────────────

function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amt));
  const b = Math.max(0, Math.min(255, (n & 0xff) + amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s, l };
}

// Phân một màu vào đúng một "họ màu" để phục vụ bộ lọc.
function familyOf(hex: string): string {
  const { h, s, l } = hexToHsl(hex);
  if (l < 0.22) return "dark";
  if (s < 0.2) return l < 0.32 ? "dark" : "neutral";
  const warm = h >= 20 && h < 70;
  if (l > 0.72 && s < 0.45 && warm) return "neutral"; // kem / ngà ấm
  if (h >= 338 || h < 28) return "red";
  if (h < 70) return "gold";
  if (h < 165) return "green";
  if (h < 262) return "blue";
  return "pink";
}

// ─── FAMILY DEFINITIONS ───────────────────────────────────────────────────────

type FamilyDef = { id: string; label: string; dot: string };

const FAMILIES: FamilyDef[] = [
  { id: "neutral", label: "Trung tính & Kem", dot: "#d8cdb8" },
  { id: "red", label: "Đỏ & Rượu vang", dot: "#8a3347" },
  { id: "gold", label: "Vàng đồng & Gấm", dot: "#b08d4a" },
  { id: "green", label: "Xanh lục & Sage", dot: "#5d7a52" },
  { id: "blue", label: "Xanh dương & Ngọc", dot: "#34597f" },
  { id: "pink", label: "Hồng & Pastel", dot: "#d4a0a0" },
  { id: "dark", label: "Trầm & Tối", dot: "#3d3d3d" },
];

// ─── DRAPED FABRIC (pure CSS) ─────────────────────────────────────────────────

function Drape({ color, variant }: { color: string; variant: "panel" | "swatch" }) {
  const dark = shade(color, -42);
  const light = shade(color, 30);
  const p = variant === "panel" ? 32 : 11; // bước xếp ly

  return (
    <div
      className="absolute inset-0"
      style={{
        background: `repeating-linear-gradient(90deg, ${dark} 0px, ${color} ${p * 0.34}px, ${light} ${p * 0.5}px, ${color} ${p * 0.68}px, ${dark} ${p}px)`,
      }}
    >
      {/* Ánh sáng đổ từ trên + bóng tụ dưới chân rèm */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.16) 0%, transparent 16%, transparent 60%, rgba(0,0,0,0.3) 100%)",
        }}
      />
      {/* Bóng mép tạo độ cong của nếp vải hai bên */}
      <div
        className="absolute inset-y-0 left-0 w-[12%]"
        style={{ background: "linear-gradient(to right, rgba(0,0,0,0.25), transparent)" }}
      />
      <div
        className="absolute inset-y-0 right-0 w-[12%]"
        style={{ background: "linear-gradient(to left, rgba(0,0,0,0.25), transparent)" }}
      />
    </div>
  );
}

// Tấm vải lớn — có thanh treo đồng + hắt sáng, đổi mẫu thì cross-fade.
function FeaturedDrape({ product }: { product: ProductWithCategory }) {
  return (
    <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden border border-white/10 shadow-2xl bg-[#1f1c19]">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={product.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Drape color={product.color} variant="panel" />
        </motion.div>
      </AnimatePresence>

      {/* Thanh treo đồng + đầu bi */}
      <div className="absolute left-[6%] right-[6%] top-[4%] h-[1.6%] rounded-full bg-gradient-to-r from-[#8a6f3c] via-[#e8d5b0] to-[#8a6f3c]" />
      <div className="absolute left-[4%] top-[2.6%] w-[3.6%] aspect-square rounded-full bg-[#c9a96e]" />
      <div className="absolute right-[4%] top-[2.6%] w-[3.6%] aspect-square rounded-full bg-[#c9a96e]" />

      {/* Vignette chiều sâu */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: "inset 0 -70px 90px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.04)" }}
      />
    </div>
  );
}

// ─── MAIN SECTION ─────────────────────────────────────────────────────────────

export function FabricAtelier() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const all = useMemo(() => getAllProducts(), []);

  // Chỉ hiện những họ màu thực sự có sản phẩm.
  const families = useMemo(() => {
    const present = new Set(all.map((p) => familyOf(p.color)));
    return FAMILIES.filter((f) => present.has(f.id));
  }, [all]);

  const [family, setFamily] = useState<string>("all");
  const [selected, setSelected] = useState<ProductWithCategory>(all[0]);
  const [hovered, setHovered] = useState<ProductWithCategory | null>(null);

  const filtered = useMemo(
    () => (family === "all" ? all : all.filter((p) => familyOf(p.color) === family)),
    [all, family]
  );

  // Đổi họ màu → chọn mẫu đầu tiên của họ đó để tấm lớn cập nhật theo.
  const pickFamily = (id: string) => {
    setFamily(id);
    const next = id === "all" ? all : all.filter((p) => familyOf(p.color) === id);
    if (next.length) setSelected(next[0]);
  };

  const view = hovered ?? selected;

  return (
    <section id="atelier" className="relative py-28 bg-[#2c2c2c] overflow-hidden grain">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-gold text-[10px] tracking-[0.5em] uppercase mb-5"
          >
            Bảng màu chất liệu
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-4xl md:text-5xl text-[#fdfbf8] leading-tight"
          >
            Chạm Vào Từng
            <br />
            <em className="text-gold not-italic">Sắc Thái Chất Liệu</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-[#fdfbf8]/50 text-sm leading-relaxed max-w-md mx-auto mt-5"
          >
            Lọc theo gam màu yêu thích, di chuột hoặc chạm vào mẫu vải để xem nếp rủ
            và thông tin chi tiết.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* ── Featured drape + label ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 lg:sticky lg:top-28"
          >
            <FeaturedDrape product={view} />

            <AnimatePresence mode="wait">
              <motion.div
                key={view.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <p className="text-gold text-[10px] tracking-widest uppercase">
                    {view.material} · {view.categoryTitle}
                  </p>
                  {view.tag && (
                    <span className="px-2.5 py-0.5 rounded-full bg-gold/15 text-gold text-[9px] tracking-widest uppercase">
                      {view.tag}
                    </span>
                  )}
                </div>
                <h3 className="font-heading text-3xl text-[#fdfbf8] mb-3">{view.name}</h3>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="font-heading text-2xl text-gold">{view.price}₫</span>
                  <span className="text-[#fdfbf8]/40 text-xs">/m²</span>
                </div>

                {/* Khổ vải */}
                <div className="flex flex-wrap gap-2 mb-7">
                  <span className="px-3 py-1.5 rounded-full border border-white/15 text-[#fdfbf8]/70 text-[11px] tracking-wide">
                    Khổ rộng · {view.width}
                  </span>
                  <span className="px-3 py-1.5 rounded-full border border-white/15 text-[#fdfbf8]/70 text-[11px] tracking-wide">
                    Chiều cao · {view.drop}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/products/${view.id}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-[#2c2c2c] text-xs tracking-widest uppercase hover:bg-[#e8d5b0] transition-colors duration-300 rounded-full"
                  >
                    Xem chi tiết <ArrowRight size={12} />
                  </Link>
                  <a
                    href="#contact"
                    className="inline-flex items-center px-6 py-3 border border-white/20 text-[#fdfbf8]/70 text-xs tracking-widest uppercase hover:border-gold hover:text-gold transition-colors duration-300 rounded-full"
                  >
                    Tư vấn mẫu này
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* ── Filters + swatch wall ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            {/* Filter chips */}
            <div className="flex flex-wrap gap-2 mb-8">
              <FamilyChip
                label="Tất cả"
                dot="#c9a96e"
                active={family === "all"}
                onClick={() => pickFamily("all")}
              />
              {families.map((f) => (
                <FamilyChip
                  key={f.id}
                  label={f.label}
                  dot={f.dot}
                  active={family === f.id}
                  onClick={() => pickFamily(f.id)}
                />
              ))}
            </div>

            <p className="flex items-center gap-2 text-[#fdfbf8]/40 text-[11px] tracking-widest uppercase mb-5">
              <Sparkles size={12} className="text-gold" />
              {filtered.length} / {all.length} chất liệu
            </p>

            {/* Swatch grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {filtered.map((p) => {
                const active = p.id === selected.id;
                return (
                  <button
                    key={p.id}
                    onMouseEnter={() => setHovered(p)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(p)}
                    onBlur={() => setHovered(null)}
                    onClick={() => setSelected(p)}
                    title={`${p.name} — ${p.material}`}
                    aria-label={p.name}
                    aria-pressed={active}
                    className="group relative aspect-square rounded-xl overflow-hidden transition-transform duration-200 hover:scale-[1.06] focus:outline-none"
                    style={{
                      boxShadow: active
                        ? "0 0 0 2px #2c2c2c, 0 0 0 4px #c9a96e"
                        : "inset 0 0 0 1px rgba(255,255,255,0.08)",
                    }}
                  >
                    <Drape color={p.color} variant="swatch" />
                    {p.tag && (
                      <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-gold shadow" />
                    )}
                    <span className="absolute inset-0 bg-black/0 group-hover:bg-white/5 transition-colors duration-200" />
                  </button>
                );
              })}
            </div>

            <p className="text-[#fdfbf8]/40 text-xs leading-relaxed mt-7">
              * Màu hiển thị mang tính mô phỏng. Chuyên gia sẽ mang mẫu vải thật đến tận
              nhà để bạn cảm nhận chính xác chất liệu và sắc độ.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── FILTER CHIP ──────────────────────────────────────────────────────────────

function FamilyChip({
  label,
  dot,
  active,
  onClick,
}: {
  label: string;
  dot: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-wide transition-all duration-300 ${
        active
          ? "bg-gold text-[#2c2c2c] shadow-md"
          : "border border-white/15 text-[#fdfbf8]/60 hover:border-gold/60 hover:text-[#fdfbf8]"
      }`}
    >
      <span
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ background: dot, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.15)" }}
      />
      {label}
    </button>
  );
}
