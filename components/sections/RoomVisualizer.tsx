"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sofa, BedDouble, Briefcase } from "lucide-react";
import { getAllProducts } from "@/lib/data";

// ─── ROOM PRESETS ─────────────────────────────────────────────────────────────

const ROOMS = [
  {
    id: "living",
    label: "Phòng khách",
    icon: Sofa,
    wall: "#ece5da",
    wallDark: "#ddd2c2",
    floor: "#b59a78",
    skyA: "#ffe9c4",
    skyB: "#bcd7e8",
  },
  {
    id: "bedroom",
    label: "Phòng ngủ",
    icon: BedDouble,
    wall: "#e4dcd3",
    wallDark: "#d2c6b8",
    floor: "#9d8466",
    skyA: "#f7d9b8",
    skyB: "#9fb8d6",
  },
  {
    id: "office",
    label: "Văn phòng",
    icon: Briefcase,
    wall: "#e7e4de",
    wallDark: "#d6d1c8",
    floor: "#8d8276",
    skyA: "#fdf3dd",
    skyB: "#c6d8e4",
  },
] as const;

type RoomId = (typeof ROOMS)[number]["id"];

// Pick a representative, color-diverse fabric set for the picker
const SWATCH_IDS = [101, 102, 103, 104, 201, 202, 204, 205, 105, 106, 108, 206];

// ─── COLOR HELPERS ────────────────────────────────────────────────────────────

function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amt));
  const b = Math.max(0, Math.min(255, (n & 0xff) + amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

// ─── CURTAIN PANEL ────────────────────────────────────────────────────────────

function CurtainPanel({ color, side }: { color: string; side: "left" | "right" }) {
  const dark = shade(color, -36);
  const light = shade(color, 26);

  return (
    <div
      className={`absolute top-[6%] bottom-[10%] w-[19%] transition-[background] duration-700 ${
        side === "left" ? "left-[8%] rounded-br-[14px]" : "right-[8%] rounded-bl-[14px]"
      }`}
      style={{
        background: `repeating-linear-gradient(90deg, ${dark} 0px, ${color} 7px, ${light} 13px, ${color} 19px, ${dark} 26px)`,
        boxShadow: "inset 0 -18px 28px rgba(0,0,0,0.18), 4px 8px 18px rgba(0,0,0,0.22)",
      }}
    >
      {/* Fabric fold shadows */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: "linear-gradient(to bottom, rgba(255,255,255,0.25) 0%, transparent 18%, transparent 70%, rgba(0,0,0,0.2) 100%)",
        }}
      />
    </div>
  );
}

// ─── ROOM SCENE (pure CSS illustration) ──────────────────────────────────────

function RoomScene({ room, curtainColor }: { room: (typeof ROOMS)[number]; curtainColor: string }) {
  return (
    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl select-none">
      {/* Wall */}
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{ background: `linear-gradient(170deg, ${room.wall} 0%, ${room.wallDark} 100%)` }}
      />

      {/* Floor */}
      <div
        className="absolute bottom-0 inset-x-0 h-[22%] transition-colors duration-700"
        style={{
          background: `linear-gradient(to bottom, ${shade(room.floor, 16)}, ${room.floor})`,
        }}
      >
        {/* Floor boards */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, transparent 0px, transparent 56px, ${shade(room.floor, -40)} 56px, ${shade(room.floor, -40)} 58px)`,
          }}
        />
      </div>

      {/* Skirting */}
      <div className="absolute bottom-[22%] inset-x-0 h-[1.5%] bg-white/50" />

      {/* Window frame */}
      <div className="absolute left-[22%] right-[22%] top-[9%] bottom-[26%]">
        {/* Sky / view */}
        <div
          className="absolute inset-0 rounded-sm transition-colors duration-700"
          style={{ background: `linear-gradient(to bottom, ${room.skyB} 0%, ${room.skyA} 100%)` }}
        >
          {/* Sun glow */}
          <div
            className="absolute w-[34%] aspect-square rounded-full top-[12%] right-[14%] opacity-70"
            style={{ background: "radial-gradient(circle, rgba(255,243,214,0.95) 0%, transparent 70%)" }}
          />
          {/* Distant skyline */}
          <div className="absolute bottom-0 inset-x-0 h-[30%] opacity-25"
            style={{
              background:
                "linear-gradient(to top, rgba(70,85,105,0.8), transparent), repeating-linear-gradient(90deg, rgba(60,75,95,0.9) 0px, rgba(60,75,95,0.9) 14px, transparent 14px, transparent 22px, rgba(60,75,95,0.7) 22px, rgba(60,75,95,0.7) 34px, transparent 34px, transparent 40px)",
            }}
          />
        </div>
        {/* Frame bars */}
        <div className="absolute inset-0 border-[6px] border-white/90 rounded-sm pointer-events-none" />
        <div className="absolute inset-y-0 left-1/2 w-[4px] -translate-x-1/2 bg-white/90" />
        <div className="absolute inset-x-0 top-1/2 h-[4px] -translate-y-1/2 bg-white/90" />
      </div>

      {/* Curtain rod */}
      <div className="absolute left-[6%] right-[6%] top-[5.5%] h-[1.2%] rounded-full bg-gradient-to-r from-[#8a6f3c] via-[#c9a96e] to-[#8a6f3c] shadow-sm" />
      <div className="absolute left-[5.2%] top-[4.4%] w-[2%] aspect-square rounded-full bg-[#c9a96e]" />
      <div className="absolute right-[5.2%] top-[4.4%] w-[2%] aspect-square rounded-full bg-[#c9a96e]" />

      {/* Curtains */}
      <CurtainPanel color={curtainColor} side="left" />
      <CurtainPanel color={curtainColor} side="right" />

      {/* Furniture silhouettes per room */}
      {room.id === "living" && (
        <>
          {/* Sofa */}
          <div className="absolute bottom-[10%] left-[30%] w-[40%] h-[16%]">
            <div className="absolute bottom-0 inset-x-0 h-[62%] rounded-xl bg-[#7d6b55]" />
            <div className="absolute bottom-[40%] inset-x-[4%] h-[55%] rounded-t-xl bg-[#8a7660]" />
            <div className="absolute bottom-[45%] left-[8%] w-[26%] h-[40%] rounded-lg bg-[#9c8870]" />
            <div className="absolute bottom-[45%] right-[8%] w-[26%] h-[40%] rounded-lg bg-[#9c8870]" />
          </div>
          {/* Rug */}
          <div className="absolute bottom-[5%] left-[26%] w-[48%] h-[5%] rounded-[50%] bg-black/10" />
          {/* Plant */}
          <div className="absolute bottom-[12%] right-[7%] w-[7%] h-[18%]">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[55%] h-[34%] rounded-b-lg bg-[#a8896a]" />
            <div className="absolute bottom-[30%] left-[8%] w-[34%] h-[60%] rounded-full bg-[#5d7a52] rotate-[-18deg]" />
            <div className="absolute bottom-[30%] right-[8%] w-[34%] h-[60%] rounded-full bg-[#6b8a5e] rotate-[18deg]" />
            <div className="absolute bottom-[34%] left-1/2 -translate-x-1/2 w-[34%] h-[66%] rounded-full bg-[#52704a]" />
          </div>
        </>
      )}

      {room.id === "bedroom" && (
        <>
          {/* Bed */}
          <div className="absolute bottom-[9%] left-[28%] w-[44%] h-[18%]">
            <div className="absolute bottom-0 inset-x-0 h-[58%] rounded-lg bg-[#cbb9a4]" />
            <div className="absolute bottom-[35%] inset-x-0 h-[34%] rounded-t-lg bg-[#efe7da]" />
            <div className="absolute bottom-[52%] left-[6%] w-[20%] h-[34%] rounded-md bg-white/85" />
            <div className="absolute bottom-[52%] left-[29%] w-[20%] h-[34%] rounded-md bg-white/70" />
            <div className="absolute bottom-0 left-[-4%] w-[4%] h-[88%] rounded-t-md bg-[#8a7155]" />
          </div>
          {/* Nightstand + lamp */}
          <div className="absolute bottom-[10%] right-[10%] w-[8%] h-[10%] rounded-md bg-[#9c8064]" />
          <div className="absolute bottom-[20%] right-[11.5%] w-[5%] h-[7%]">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[18%] h-[55%] bg-[#6b5a45]" />
            <div className="absolute top-0 inset-x-0 h-[55%] rounded-t-full bg-[#e8d5b0]" />
          </div>
        </>
      )}

      {room.id === "office" && (
        <>
          {/* Desk */}
          <div className="absolute bottom-[10%] left-[29%] w-[42%] h-[15%]">
            <div className="absolute top-0 inset-x-0 h-[14%] rounded-sm bg-[#6e5d49]" />
            <div className="absolute top-[14%] left-[6%] w-[5%] h-[86%] bg-[#5d4e3d]" />
            <div className="absolute top-[14%] right-[6%] w-[5%] h-[86%] bg-[#5d4e3d]" />
            {/* Monitor */}
            <div className="absolute bottom-[86%] left-[32%] w-[36%] h-[80%]">
              <div className="absolute top-0 inset-x-0 h-[72%] rounded-sm bg-[#2f3540] border-2 border-[#1f242c]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[16%] h-[28%] bg-[#3a4150]" />
            </div>
          </div>
          {/* Chair */}
          <div className="absolute bottom-[9%] left-[14%] w-[10%] h-[16%]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[72%] h-[55%] rounded-md bg-[#454d59]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[14%] h-[45%] bg-[#363d48]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[68%] h-[6%] rounded-full bg-[#363d48]" />
          </div>
          {/* Shelf */}
          <div className="absolute top-[16%] right-[8%] w-[10%] h-[3%] bg-[#7a6850] rounded-sm" />
          <div className="absolute top-[10%] right-[9%] w-[3%] h-[6%] bg-[#8c5a4a] rounded-sm" />
          <div className="absolute top-[10.5%] right-[12.5%] w-[3%] h-[5.5%] bg-[#4a6b5d] rounded-sm" />
        </>
      )}

      {/* Soft ambient shadow at floor line */}
      <div className="absolute bottom-[20%] inset-x-0 h-[4%] bg-gradient-to-b from-black/8 to-transparent" />
    </div>
  );
}

// ─── MAIN SECTION ─────────────────────────────────────────────────────────────

export function RoomVisualizer() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const swatches = useMemo(() => {
    const all = getAllProducts();
    return SWATCH_IDS.map((id) => all.find((p) => p.id === id)).filter(
      (p): p is NonNullable<typeof p> => Boolean(p)
    );
  }, []);

  const [roomId, setRoomId] = useState<RoomId>("living");
  const [selected, setSelected] = useState(swatches[0]);

  const room = ROOMS.find((r) => r.id === roomId)!;

  return (
    <section id="visualizer" className="py-28 bg-[#fdfbf8] overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-gold text-[10px] tracking-[0.5em] uppercase mb-5"
          >
            Trải nghiệm trực quan
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-4xl md:text-5xl text-[#2c2c2c] leading-tight"
          >
            Xem Rèm Trong
            <br />
            <em className="text-gold not-italic">Không Gian Của Bạn</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-[#8c8480] text-sm leading-relaxed max-w-md mx-auto mt-5"
          >
            Chọn loại phòng và chạm vào từng mẫu vải — màu rèm thay đổi ngay trước mắt bạn.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-start">
          {/* Scene */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3"
          >
            <div className="rounded-2xl border border-[#e8e0d5] p-3 bg-[#f8f5f0] shadow-sm">
              <RoomScene room={room} curtainColor={selected.color} />
            </div>

            {/* Room tabs */}
            <div className="flex justify-center gap-3 mt-6">
              {ROOMS.map((r) => {
                const Icon = r.icon;
                const active = r.id === roomId;
                return (
                  <button
                    key={r.id}
                    onClick={() => setRoomId(r.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs tracking-widest uppercase transition-all duration-300 ${
                      active
                        ? "bg-[#2c2c2c] text-[#fdfbf8] shadow-md"
                        : "border border-[#e8e0d5] text-[#8c8480] hover:border-[#2c2c2c] hover:text-[#2c2c2c]"
                    }`}
                  >
                    <Icon size={13} />
                    {r.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2"
          >
            <p className="text-[#8c8480] text-[10px] tracking-widest uppercase mb-4">
              Chọn chất liệu — {swatches.length} mẫu
            </p>

            {/* Swatch grid */}
            <div className="grid grid-cols-6 gap-3 mb-8">
              {swatches.map((p) => {
                const active = p.id === selected.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelected(p)}
                    title={p.name}
                    className="relative aspect-square rounded-full transition-transform duration-200 hover:scale-110"
                    style={{
                      background: `linear-gradient(145deg, ${shade(p.color, 24)}, ${p.color} 55%, ${shade(p.color, -24)})`,
                      boxShadow: active
                        ? "0 0 0 2px #fdfbf8, 0 0 0 4px #c9a96e"
                        : "inset 0 1px 2px rgba(255,255,255,0.4), 0 1px 3px rgba(0,0,0,0.15)",
                    }}
                    aria-label={p.name}
                  />
                );
              })}
            </div>

            {/* Selected info */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="border border-[#e8e0d5] rounded-2xl p-6 bg-[#f8f5f0]"
              >
                <p className="text-gold text-[10px] tracking-widest uppercase mb-1">
                  {selected.material} · {selected.categoryTitle}
                </p>
                <h3 className="font-heading text-2xl text-[#2c2c2c] mb-3">{selected.name}</h3>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="font-heading text-xl text-[#2c2c2c]">{selected.price}₫</span>
                  <span className="text-[#8c8480] text-xs">/m²</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/products/${selected.id}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#2c2c2c] text-[#fdfbf8] text-xs tracking-widest uppercase hover:bg-gold transition-colors duration-300 rounded-full"
                  >
                    Xem chi tiết <ArrowRight size={12} />
                  </Link>
                  <a
                    href="#contact"
                    className="inline-flex items-center px-6 py-3 border border-[#e8e0d5] text-[#8c8480] text-xs tracking-widest uppercase hover:border-gold hover:text-gold transition-colors duration-300 rounded-full"
                  >
                    Tư vấn mẫu này
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>

            <p className="text-[#8c8480]/70 text-xs leading-relaxed mt-5">
              * Hình ảnh mô phỏng màu sắc tương đối. Chuyên gia sẽ mang mẫu vải thật
              đến tận nhà để bạn cảm nhận chính xác chất liệu.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
