"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronsLeftRight } from "lucide-react";

/**
 * Before/After — kéo thanh trượt so sánh không gian trước & sau khi lắp rèm.
 * Hai scene vẽ bằng CSS thuần, clip bằng clip-path (GPU-friendly).
 */

function Scene({ withCurtains }: { withCurtains: boolean }) {
  return (
    <div className="absolute inset-0">
      {/* Wall */}
      <div
        className="absolute inset-0"
        style={{
          background: withCurtains
            ? "linear-gradient(170deg, #ece3d6 0%, #ded2c0 100%)"
            : "linear-gradient(170deg, #e3e1de 0%, #d4d1cc 100%)",
        }}
      />
      {/* Floor */}
      <div
        className="absolute bottom-0 inset-x-0 h-[24%]"
        style={{
          background: withCurtains
            ? "linear-gradient(to bottom, #c2a37e, #ab8a64)"
            : "linear-gradient(to bottom, #b5b0a8, #9d978d)",
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0px, transparent 56px, rgba(0,0,0,0.35) 56px, rgba(0,0,0,0.35) 58px)",
          }}
        />
      </div>
      <div className="absolute bottom-[24%] inset-x-0 h-[1.4%] bg-white/50" />

      {/* Window */}
      <div className="absolute left-[24%] right-[24%] top-[10%] bottom-[30%]">
        <div
          className="absolute inset-0 rounded-sm"
          style={{
            background: withCurtains
              ? "linear-gradient(to bottom, #b8d0e4 0%, #f5e3c2 100%)"
              : "linear-gradient(to bottom, #cfd8de 0%, #eee4d2 100%)",
          }}
        >
          {/* Harsh glare khi chưa có rèm */}
          {!withCurtains && (
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 90% 70% at 60% 30%, rgba(255,255,255,0.85) 0%, transparent 65%)",
              }}
            />
          )}
          {/* Skyline */}
          <div
            className="absolute bottom-0 inset-x-0 h-[28%] opacity-25"
            style={{
              background:
                "repeating-linear-gradient(90deg, rgba(60,75,95,0.9) 0px, rgba(60,75,95,0.9) 14px, transparent 14px, transparent 22px, rgba(60,75,95,0.7) 22px, rgba(60,75,95,0.7) 34px, transparent 34px, transparent 40px)",
            }}
          />
        </div>
        <div className="absolute inset-0 border-[6px] border-white/90 rounded-sm pointer-events-none" />
        <div className="absolute inset-y-0 left-1/2 w-[4px] -translate-x-1/2 bg-white/90" />
        <div className="absolute inset-x-0 top-1/2 h-[4px] -translate-y-1/2 bg-white/90" />
      </div>

      {withCurtains && (
        <>
          {/* Rod */}
          <div className="absolute left-[8%] right-[8%] top-[6.5%] h-[1.1%] rounded-full bg-gradient-to-r from-[#8a6f3c] via-[#c9a96e] to-[#8a6f3c]" />
          {/* Curtain panels — velvet bordeaux */}
          {(["left", "right"] as const).map((side) => (
            <div
              key={side}
              className={`absolute top-[7%] bottom-[12%] w-[17%] ${
                side === "left" ? "left-[10%]" : "right-[10%]"
              }`}
              style={{
                background:
                  "repeating-linear-gradient(90deg, #4a1f2b 0px, #6b2d3e 7px, #8a4254 13px, #6b2d3e 19px, #4a1f2b 26px)",
                boxShadow:
                  "inset 0 -18px 28px rgba(0,0,0,0.2), 4px 8px 18px rgba(0,0,0,0.25)",
                borderRadius: side === "left" ? "0 0 14px 0" : "0 0 0 14px",
              }}
            >
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,0.25) 0%, transparent 18%, transparent 70%, rgba(0,0,0,0.2) 100%)",
                }}
              />
            </div>
          ))}
          {/* Sheer voile giữa */}
          <div
            className="absolute left-[27%] right-[27%] top-[7%] bottom-[14%] opacity-45"
            style={{
              background:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.65) 0px, rgba(245,240,230,0.35) 9px, rgba(255,255,255,0.65) 18px)",
            }}
          />
          {/* Ánh sáng ấm lan trên sàn */}
          <div
            className="absolute bottom-0 left-[24%] right-[24%] h-[24%] opacity-30"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,220,160,0.55), transparent 80%)",
            }}
          />
        </>
      )}

      {/* Sofa silhouette */}
      <div className="absolute bottom-[11%] left-[31%] w-[38%] h-[15%]">
        <div
          className="absolute bottom-0 inset-x-0 h-[62%] rounded-xl"
          style={{ background: withCurtains ? "#7d6b55" : "#83807a" }}
        />
        <div
          className="absolute bottom-[40%] inset-x-[4%] h-[55%] rounded-t-xl"
          style={{ background: withCurtains ? "#8a7660" : "#908d86" }}
        />
        <div
          className="absolute bottom-[45%] left-[8%] w-[26%] h-[40%] rounded-lg"
          style={{ background: withCurtains ? "#9c8870" : "#9e9b94" }}
        />
        <div
          className="absolute bottom-[45%] right-[8%] w-[26%] h-[40%] rounded-lg"
          style={{ background: withCurtains ? "#9c8870" : "#9e9b94" }}
        />
      </div>
    </div>
  );
}

export function BeforeAfter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(4, Math.min(96, pct)));
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragging.current = true;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      updateFromClientX(e.clientX);
    },
    [updateFromClientX]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      updateFromClientX(e.clientX);
    },
    [updateFromClientX]
  );

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <section className="relative py-28 bg-[#2c2c2c] overflow-hidden grain">
      <div ref={sectionRef} className="max-w-6xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-gold text-[10px] tracking-[0.5em] uppercase mb-5"
          >
            Sự khác biệt
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-4xl md:text-5xl text-[#fdfbf8] leading-tight"
          >
            Một Tấm Rèm
            <br />
            <em className="text-gold not-italic">Thay Đổi Cả Căn Phòng</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-[#fdfbf8]/50 text-sm mt-5"
          >
            Kéo thanh trượt để so sánh
          </motion.p>
        </div>

        {/* Comparison frame */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            ref={frameRef}
            className="relative aspect-[16/9] max-w-4xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl cursor-ew-resize touch-none select-none"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {/* AFTER (đầy đủ, nằm dưới) */}
            <Scene withCurtains />

            {/* BEFORE (clip bên trái theo pos) */}
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
            >
              <Scene withCurtains={false} />
            </div>

            {/* Divider */}
            <div
              className="absolute inset-y-0 w-px bg-white/80 shadow-[0_0_12px_rgba(0,0,0,0.4)]"
              style={{ left: `${pos}%` }}
            />
            {/* Handle */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-gold shadow-xl flex items-center justify-center text-[#2c2c2c]"
              style={{ left: `${pos}%` }}
            >
              <ChevronsLeftRight size={18} />
            </div>

            {/* Labels */}
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/35 backdrop-blur-sm text-white/80 text-[10px] tracking-widest uppercase pointer-events-none">
              Trước
            </span>
            <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gold/90 text-[#2c2c2c] text-[10px] tracking-widest uppercase pointer-events-none">
              Sau
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
