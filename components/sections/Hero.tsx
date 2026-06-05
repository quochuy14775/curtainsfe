"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  const curtainLeftRef = useRef<HTMLDivElement>(null);
  const curtainRightRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    tl.to(
      [curtainLeftRef.current, curtainRightRef.current],
      { scaleX: 0, duration: 1.6, ease: "power4.inOut", stagger: 0 }
    )
      .to(overlayRef.current, { opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.8")
      .from(contentRef.current, { opacity: 0, y: 40, duration: 1, ease: "power3.out" }, "-=0.6");
  }, []);

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden bg-charcoal">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(135deg, #3a3028 0%, #2c2420 40%, #1e1a16 100%)` }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(201,169,110,0.15) 2px, rgba(201,169,110,0.15) 3px)`,
        }}
      />
      <div ref={overlayRef} className="absolute inset-0 bg-charcoal z-10" style={{ willChange: "opacity" }} />

      {/* Curtain Left */}
      <div
        ref={curtainLeftRef}
        className="absolute inset-y-0 left-0 w-1/2 z-20 origin-left"
        style={{ background: "linear-gradient(to right, #2c2c2c, #3d3530)", willChange: "transform" }}
      >
        {[20, 40, 60, 80].map((pos) => (
          <div key={pos} className="absolute inset-y-0 w-px opacity-20" style={{ left: `${pos}%`, background: "rgba(201,169,110,0.4)" }} />
        ))}
      </div>

      {/* Curtain Right */}
      <div
        ref={curtainRightRef}
        className="absolute inset-y-0 right-0 w-1/2 z-20 origin-right"
        style={{ background: "linear-gradient(to left, #2c2c2c, #3d3530)", willChange: "transform" }}
      >
        {[20, 40, 60, 80].map((pos) => (
          <div key={pos} className="absolute inset-y-0 w-px opacity-20" style={{ left: `${pos}%`, background: "rgba(201,169,110,0.4)" }} />
        ))}
      </div>

      {/* Content */}
      <div ref={contentRef} className="relative z-30 h-full flex flex-col items-center justify-center text-center px-6">
        <p className="text-gold text-xs tracking-[0.4em] uppercase mb-8">Bộ sưu tập 2026</p>
        <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-warm-white leading-[1.1] mb-8 max-w-4xl">
          Vẻ Đẹp <em className="text-gold not-italic">Tinh Tế</em>
          <br />
          Trong Từng Nếp Gấp
        </h1>
        <p className="text-warm-white/60 text-lg md:text-xl max-w-xl leading-relaxed mb-12">
          Rèm cửa cao cấp — nơi chất liệu sang trọng và thiết kế đỉnh cao biến không gian sống thành tác phẩm nghệ thuật.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link href="#collections" className="px-10 py-4 bg-gold text-charcoal text-sm tracking-widest uppercase hover:bg-gold-light transition-colors duration-300 rounded-full">
            Khám phá ngay
          </Link>
          <Link href="#about" className="px-10 py-4 border border-warm-white/30 text-warm-white/80 text-sm tracking-widest uppercase hover:border-gold hover:text-gold transition-colors duration-300 rounded-full">
            Về chúng tôi
          </Link>
        </div>

        <motion.div
          className="absolute bottom-12 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <span className="text-warm-white/40 text-xs tracking-widest uppercase">Cuộn xuống</span>
          <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
