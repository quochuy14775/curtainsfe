"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import Image from "next/image";
import Link from "next/link";
import {
  Ruler,
  Truck,
  ShieldCheck,
  Phone,
  Star,
  CheckCircle,
  ArrowRight,
  CalendarDays,
  Palette,
  Hammer,
} from "lucide-react";
import { categoryService } from "@/services/categoryService";
import type { CategoryResponse } from "@/types/category";
import { getCategoryAccent } from "@/types/category";
import { appointmentService } from "@/services/appointmentService";
import { useContactInfo } from "@/lib/useContactInfo";
import { telHref } from "@/types/contact";
import { Magnetic } from "@/components/ui/Magnetic";
import { FabricAtelier } from "@/components/sections/FabricAtelier";
import { PriceEstimator } from "@/components/sections/PriceEstimator";
import { Lookbook } from "@/components/sections/Lookbook";

// ─── DATA ────────────────────────────────────────────────────────────────────

const USP_ITEMS = [
  {
    icon: Ruler,
    title: "Đo & Tư Vấn Tận Nhà",
    desc: "Chuyên gia đến tận nơi đo đạc, tư vấn phong cách phù hợp không gian và ngân sách của bạn.",
  },
  {
    icon: Truck,
    title: "Lắp Đặt Chuyên Nghiệp",
    desc: "Đội ngũ thợ lành nghề hơn 10 năm kinh nghiệm, lắp đặt nhanh gọn trong ngày.",
  },
  {
    icon: ShieldCheck,
    title: "Bảo Hành 5 Năm",
    desc: "Cam kết chất lượng tuyệt đối — bảo hành toàn diện cho cả vải và phụ kiện.",
  },
  {
    icon: Phone,
    title: "Hỗ Trợ 24/7",
    desc: "Đội ngũ chăm sóc khách hàng luôn sẵn sàng giải đáp mọi thắc mắc của bạn.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Liên Hệ & Đặt Lịch",
    desc: "Gọi điện hoặc điền form — chúng tôi xác nhận lịch hẹn trong vòng 2 giờ.",
    icon: CalendarDays,
  },
  {
    number: "02",
    title: "Tư Vấn Thiết Kế",
    desc: "Chuyên gia đến tận nhà, mang theo bộ mẫu vải để bạn trải nghiệm thực tế.",
    icon: Palette,
  },
  {
    number: "03",
    title: "Sản Xuất & Lắp Đặt",
    desc: "Rèm may đo riêng và lắp đặt hoàn chỉnh trong vòng 5–7 ngày làm việc.",
    icon: Hammer,
  },
];

const STATS = [
  { value: 2400, suffix: "+", format: true, label: "Không gian đã hoàn thiện" },
  { value: 98, suffix: "%", format: false, label: "Khách hàng hài lòng" },
  { value: 25, suffix: "+", format: false, label: "Năm kinh nghiệm" },
  { value: 80, suffix: "+", format: false, label: "Chất liệu độc quyền" },
];

const TESTIMONIALS = [
  {
    name: "Chị Lan Phương",
    role: "Chủ căn hộ Vinhomes Central Park",
    quote:
      "Rèm lụa phòng khách đẹp hơn cả kỳ vọng. Đội thợ chuyên nghiệp, lắp đặt xong trong buổi sáng, không để lại bụi bẩn gì cả.",
    stars: 5,
  },
  {
    name: "Anh Minh Tuấn",
    role: "Giám đốc điều hành, Q.2 TP.HCM",
    quote:
      "Đã dùng rèm của nhiều thương hiệu nhưng đây là lần đầu tôi cảm nhận được sự khác biệt thực sự. Chất liệu nhập khẩu, đường may tuyệt hảo.",
    stars: 5,
  },
  {
    name: "Chị Bảo Châu",
    role: "Interior Designer, Studio BC",
    quote:
      "Tôi đã giới thiệu cho hơn 20 khách hàng của mình. Sự tư vấn chuyên nghiệp và kho chất liệu đa dạng giúp tôi dễ dàng đáp ứng mọi phong cách.",
    stars: 5,
  },
];

// ─── HERO ────────────────────────────────────────────────────────────────────

const HERO_SLIDES = [
  "/previews/decor.png",
  "/previews/decor2.png",
  "/previews/manh-cau-vong.png",
    "/previews/venetianblinds02-5117.jpg",
    "/previews/decor3.png",
];

// Line-by-line editorial reveal for the hero heading
function RevealLine({
  children,
  delay,
  className = "",
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <span className="block overflow-hidden pb-[0.15em] pt-[0.05em]">
      <motion.span
        className={`block ${className}`}
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function Hero() {
  const curtainL = useRef<HTMLDivElement>(null);
  const curtainR = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);

  // Curtain open animation on mount
  useEffect(() => {
    gsap.set([curtainL.current, curtainR.current], { scaleX: 1 });
    gsap.set(overlay.current, { opacity: 1 });
    gsap.set(content.current, { opacity: 0, y: 50 });

    const tl = gsap.timeline({ delay: 0.2 });
    tl.to([curtainL.current, curtainR.current], {
      scaleX: 0,
      duration: 1.5,
      ease: "power4.inOut",
    })
      .to(overlay.current, { opacity: 0, duration: 0.5, ease: "power2.out" }, "-=0.7")
      .to(content.current, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, "-=0.5");

    return () => { tl.kill(); };
  }, []);

  // Auto-advance slides
  useEffect(() => {
    timerRef.current = setTimeout(
      () => setCurrent((c) => (c + 1) % HERO_SLIDES.length),
      6000
    );
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current]);

  return (
    <section ref={sectionRef} className="relative h-screen min-h-[700px] overflow-hidden grain">
      {/* ── Background image slideshow ── */}
      <motion.div className="absolute inset-0 z-0" style={{ scale: scrollScale }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={current}
            className="absolute inset-0"
            initial={{ scale: 1.07, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.97, opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.32, 0, 0.2, 1] }}
          >
            <Image
              src={HERO_SLIDES[current]}
              alt=""
              fill
              priority={current === 0}
              quality={100}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.20)" }} />
      </motion.div>


      {/* Cinematic vignette */}
      <div className="absolute inset-0 hero-vignette pointer-events-none z-[2]" />

      {/* Scrim gradient — tối đậm ở góc dưới-trái nơi đặt khối nội dung, giữ phần ảnh còn lại sáng */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background:
            "linear-gradient(60deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 38%, transparent 65%)",
        }}
      />

      {/* Curtain overlay */}
      <div ref={overlay} className="absolute inset-0 bg-[#2c2c2c] z-10" style={{ willChange: "opacity" }} />

      {/* Curtains */}
      <div ref={curtainL} className="absolute inset-y-0 left-0 w-1/2 z-20 origin-left" style={{ background: "linear-gradient(to right,#2c2c2c,#3d3530)" }}>
        {[20, 40, 60, 80].map((p) => (
          <div key={p} className="absolute inset-y-0 w-px opacity-20" style={{ left: `${p}%`, background: "rgba(201,169,110,0.4)" }} />
        ))}
      </div>
      <div ref={curtainR} className="absolute inset-y-0 right-0 w-1/2 z-20 origin-right" style={{ background: "linear-gradient(to left,#2c2c2c,#3d3530)" }}>
        {[20, 40, 60, 80].map((p) => (
          <div key={p} className="absolute inset-y-0 w-px opacity-20" style={{ left: `${p}%`, background: "rgba(201,169,110,0.4)" }} />
        ))}
      </div>

      {/* Content — khối nội dung gom về giữa-trái */}
      <div ref={content} className="relative z-30 h-full flex items-center">
        <div className="px-8 md:px-14 lg:px-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-white/80 text-[10px] tracking-[0.3em] uppercase">Chất lượng là hàng đầu</span>
          </motion.div>
          <h1
            className="font-heading text-[clamp(2.4rem,6vw,5.5rem)] leading-[1.05] font-bold tracking-tight"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.35)" }}
          >
            <RevealLine delay={1.4}>
              <span style={{ color: "#e0d2bd" }}>Rèm Cửa Cao Cấp</span>
            </RevealLine>
            <RevealLine delay={1.6}>
              <span style={{ color: "#d4c4ae" }}>Cho Không Gian Của Bạn</span>
            </RevealLine>
          </h1>

          {/* Description */}
          <motion.p
            className="mt-10 text-xs md:text-sm max-w-[420px] leading-relaxed text-white/70"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9, duration: 0.7 }}
          >
            Từ tư vấn đến lắp đặt — đội ngũ chuyên gia mang đến giải pháp hoàn hảo, đúng tiến độ và vượt mong đợi.
          </motion.p>
        </div>
      </div>

      {/* Bottom bar — buttons centered */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-30 flex justify-center pb-10"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.1, duration: 0.7 }}
      >
        <div className="flex items-center gap-4">
          <Magnetic>
            <Link
              href="/products"
              aria-label="Khám phá bộ sưu tập"
              className="group inline-flex items-center justify-center gap-2 bg-gold text-[#2c2c2c] hover:bg-[#e8d5b0] transition-colors duration-300 shadow-[0_8px_30px_rgba(201,169,110,0.3)] rounded-full w-12 h-12 sm:w-auto sm:h-auto sm:px-8 sm:py-4"
            >
              <ArrowRight size={16} className="shrink-0 transition-transform duration-300 group-hover:rotate-90" />
              <span className="hidden sm:inline text-sm tracking-widest uppercase font-medium">Khám phá bộ sưu tập</span>
            </Link>
          </Magnetic>
          <Magnetic strength={0.2}>
            <a
              href="#contact"
              aria-label="Tư vấn miễn phí"
              className="inline-flex items-center justify-center gap-2 border border-[#fdfbf8]/30 text-[#fdfbf8]/80 hover:border-gold hover:text-gold transition-colors duration-300 rounded-full w-12 h-12 sm:w-auto sm:h-auto sm:px-8 sm:py-4"
            >
              <Phone size={15} className="shrink-0" />
              <span className="hidden sm:inline text-sm tracking-widest uppercase">Tư vấn miễn phí</span>
            </a>
          </Magnetic>
        </div>
      </motion.div>

      {/* Top bar — slide dots */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-30 flex items-center justify-center px-8 md:px-14 lg:px-20 pt-6"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.1, duration: 0.7 }}
      >
        <div className="flex items-center gap-3">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              className="relative h-px w-8 bg-white/20 overflow-hidden border-none p-0 cursor-pointer"
            >
              <span
                className="absolute inset-0 bg-[#c9a96e] origin-left transition-transform duration-300"
                style={{ transform: i === current ? "scaleX(1)" : "scaleX(0)" }}
              />
            </button>
          ))}
        </div>
      </motion.div>

    </section>
  );
}

// ─── MARQUEE ─────────────────────────────────────────────────────────────────

const marqueeItems = [
  "Rèm Vải Luxury","✦","Tư vấn tận nhà","✦","Chất liệu nhập khẩu",
  "✦","Bảo hành 5 năm","✦","Miễn phí lắp đặt nội thành","✦",
  "Hơn 80 chất liệu độc quyền","✦","Giao hàng toàn quốc","✦",
];
const marqueeTrack = [...marqueeItems, ...marqueeItems];

function Marquee() {
  return (
    <div className="bg-[#2c2c2c] border-y border-white/10 py-4 overflow-hidden select-none">
      <div className="flex whitespace-nowrap marquee-track">
        {marqueeTrack.map((item, i) => (
          <span
            key={i}
            className={
              item === "✦"
                ? "text-gold mx-6 text-xs"
                : "text-[#fdfbf8]/60 text-xs tracking-widest uppercase mx-2"
            }
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── WHY US ──────────────────────────────────────────────────────────────────

function WhyUs() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="why-us" className="py-28 bg-[#f8f5f0]">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-gold text-[10px] tracking-[0.5em] uppercase mb-5"
          >
            Vì sao chọn chúng tôi
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-4xl md:text-5xl text-[#2c2c2c] leading-tight"
          >
            Dịch Vụ Trọn Gói
            <br />
            <em className="text-gold not-italic">Từ A Đến Z</em>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {USP_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group card-sheen bg-[#fdfbf8] border border-[#e8e0d5] rounded-2xl p-8 hover:border-gold/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center mb-6 group-hover:bg-gold/10 group-hover:scale-110 transition-all duration-300">
                  <Icon size={20} className="text-gold" />
                </div>
                <h3 className="font-heading text-lg text-[#2c2c2c] mb-3 leading-tight">{item.title}</h3>
                <p className="text-[#8c8480] text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ────────────────────────────────────────────────────────────

function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-28 bg-[#2c2c2c] overflow-hidden grain">
      <div ref={ref} className="max-w-4xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-gold text-[10px] tracking-[0.5em] uppercase mb-5"
          >
            Quy trình
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-4xl md:text-5xl text-[#fdfbf8] leading-tight"
          >
            Chỉ 3 Bước Đơn Giản
            <br />
            <em className="text-gold not-italic">Để Có Không Gian Mơ Ước</em>
          </motion.h2>
        </div>

        {/* ── Vertical zigzag timeline ── */}
        <div className="relative">
          {/* Mobile line — bên trái, thẳng với dot (center của w-[48px]) */}
          <div className="absolute md:hidden left-[23px] top-0 bottom-0 w-px bg-white/10" />
          <motion.div
            className="absolute md:hidden left-[23px] top-0 w-px bg-gradient-to-b from-gold/70 via-gold/50 to-gold/20 origin-top"
            style={{ bottom: 0 }}
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Desktop line — giữa */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-white/10" />
          <motion.div
            className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 w-px bg-gradient-to-b from-gold/70 via-gold/50 to-gold/20 origin-top"
            style={{ bottom: 0 }}
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />

          {STEPS.map((step, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.22, ease: [0.22, 1, 0.36, 1] }}
                className={`relative ${i < STEPS.length - 1 ? "mb-10 md:mb-16" : ""}`}
              >
                {/* ── Mobile: line kia bên trái, card chiếm full width ── */}
                <div className="flex md:hidden items-start gap-0">
                  {/* Dot */}
                  <div className="relative z-10 w-[48px] shrink-0 flex justify-center pt-4">
                    <motion.div
                      className="relative w-3.5 h-3.5 rounded-full bg-gold"
                      initial={{ scale: 0 }}
                      animate={inView ? { scale: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.55 + i * 0.22 }}
                      style={{ boxShadow: "0 0 0 4px rgba(201,169,110,0.12), 0 0 12px rgba(201,169,110,0.45)" }}
                    >
                      <motion.div
                        className="absolute inset-[-7px] rounded-full border border-gold/25"
                        animate={inView ? { scale: [1, 1.7, 1], opacity: [0.5, 0, 0.5] } : {}}
                        transition={{ duration: 2.5, delay: 0.8 + i * 0.22, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </motion.div>
                  </div>
                  {/* Card */}
                  <div className="flex-1">
                    <div className="border border-white/10 rounded-2xl p-5 hover:border-gold/30 transition-colors duration-500 bg-white/[0.02] group text-left">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-full border border-gold/30 bg-gold/8 flex items-center justify-center shrink-0 group-hover:bg-gold/15 transition-all duration-500">
                          <step.icon size={16} className="text-gold" strokeWidth={1.5} />
                        </div>
                        <h3 className="font-heading text-lg text-[#fdfbf8] leading-tight">{step.title}</h3>
                      </div>
                      <p className="text-[#fdfbf8]/45 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </div>

                {/* ── Desktop: zigzag trái/phải ── */}
                <div className={`hidden md:flex items-center gap-0 ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
                  {/* Card */}
                  <div className={`w-[calc(50%-36px)] ${isLeft ? "pr-10" : "pl-10"}`}>
                    <div className={`border border-white/10 rounded-2xl p-7 hover:border-gold/30 transition-colors duration-500 bg-white/[0.02] group ${isLeft ? "text-right" : "text-left"}`}>
                      <div className={`flex items-center gap-3 mb-3 ${isLeft ? "flex-row-reverse" : "flex-row"}`}>
                        <div className="w-10 h-10 rounded-full border border-gold/30 bg-gold/8 flex items-center justify-center shrink-0 group-hover:bg-gold/15 group-hover:border-gold/50 transition-all duration-500">
                          <step.icon size={18} className="text-gold" strokeWidth={1.5} />
                        </div>
                        <h3 className="font-heading text-xl text-[#fdfbf8] leading-tight">{step.title}</h3>
                      </div>
                      <p className="text-[#fdfbf8]/45 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                  {/* Dot */}
                  <div className="relative z-10 w-[72px] shrink-0 flex justify-center">
                    <motion.div
                      className="relative w-4 h-4 rounded-full bg-gold"
                      initial={{ scale: 0 }}
                      animate={inView ? { scale: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.55 + i * 0.22 }}
                      style={{ boxShadow: "0 0 0 4px rgba(201,169,110,0.15), 0 0 14px rgba(201,169,110,0.5)" }}
                    >
                      <motion.div
                        className="absolute inset-[-8px] rounded-full border border-gold/25"
                        animate={inView ? { scale: [1, 1.7, 1], opacity: [0.5, 0, 0.5] } : {}}
                        transition={{ duration: 2.5, delay: 0.8 + i * 0.22, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </motion.div>
                  </div>
                  {/* Spacer */}
                  <div className="w-[calc(50%-52px)]" />
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="text-center mt-20"
        >
          <Magnetic className="inline-block">
            <a
              href="#contact"
              className="inline-flex items-center gap-3 px-10 py-4 bg-gold text-[#2c2c2c] text-sm tracking-widest uppercase hover:bg-[#e8d5b0] transition-colors duration-300 rounded-full font-medium shadow-[0_8px_30px_rgba(201,169,110,0.2)]"
            >
              Đặt lịch tư vấn ngay <ArrowRight size={14} />
            </a>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}

// ─── COLLECTIONS ─────────────────────────────────────────────────────────────

function Collections() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [cats, setCats] = useState<CategoryResponse[]>([]);

  useEffect(() => {
    categoryService.getAll()
      .then((res) => {
        const sorted = (res.value ?? [])
          .sort((a, b) => b.productCount - a.productCount)
          .slice(0, 4);
        setCats(sorted);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="collections" className="py-28 bg-[#fdfbf8]">
      <div ref={ref}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-gold text-[10px] tracking-[0.5em] uppercase mb-4"
            >
              Bộ sưu tập
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-4xl md:text-5xl text-[#2c2c2c] leading-tight"
            >
              Từng Dòng Sản Phẩm
              <br />
              <em className="text-[#8c8480] not-italic">Một Câu Chuyện Riêng</em>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-gold border-b border-gold pb-1 hover:text-[#2c2c2c] hover:border-[#2c2c2c] transition-colors duration-300"
            >
              Xem tất cả sản phẩm <ArrowRight size={12} />
            </Link>
          </motion.div>
        </div>

        <div className="max-w-[1400px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-6 lg:px-12">
          {cats.map((cat, i) => {
            const accent = getCategoryAccent(cat.id);
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={`/products?category=${cat.id}`}
                  className="group relative aspect-[3/4] overflow-hidden rounded-xl flex flex-col justify-between p-3 md:p-4 cursor-pointer block bg-[#2c2c2c]"
                >
                  {/* Background image */}
                  {(cat.coverImage || cat.imageUrl) && (
                    <Image
                      src={cat.coverImage ?? cat.imageUrl!}
                      alt={cat.title ?? ""}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      quality={85}
                      className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                    />
                  )}

                  {/* Dim overlay giống hero */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/20 transition-opacity duration-500 group-hover:from-black/85 group-hover:via-black/40" />

                  {/* Top — dot + product count */}
                  <div className="relative flex items-center justify-between">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accent, boxShadow: `0 0 8px ${accent}80` }} />
                    <span className="text-xs tracking-[0.25em] uppercase text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
                      {cat.productCount} sản phẩm
                    </span>
                  </div>

                  {/* Bottom — tên + mô tả + cta */}
                  <div className="relative">
                    <h3 className="font-heading text-[#fdfbf8] leading-tight mb-1 text-xl md:text-2xl">
                      {cat.title}
                    </h3>
                    {cat.subtitle && (
                      <p className="text-[#fdfbf8]/60 text-xs md:text-sm leading-relaxed">{cat.subtitle}</p>
                    )}
                    <div
                      className="mt-3 inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ color: accent }}
                    >
                      Khám phá <ArrowRight size={10} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── STATS ───────────────────────────────────────────────────────────────────

function CountUp({
  value,
  suffix,
  format,
  start,
}: {
  value: number;
  suffix: string;
  format: boolean;
  start: boolean;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const duration = 1800;
    let t0: number | null = null;

    const tick = (now: number) => {
      if (t0 === null) t0 = now;
      const p = Math.min((now - t0) / duration, 1);
      // easeOutQuart — fast start, gentle landing
      const eased = 1 - Math.pow(1 - p, 4);
      setDisplay(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, value]);

  const text = format ? display.toLocaleString("vi-VN") : String(display);
  return (
    <span>
      {text}
      {suffix}
    </span>
  );
}

function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20 bg-[#f8f5f0] border-y border-[#e8e0d5]">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-[#e8e0d5]">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center px-6"
            >
              <p className="font-heading text-4xl md:text-5xl text-gold mb-2">
                <CountUp value={stat.value} suffix={stat.suffix} format={stat.format} start={inView} />
              </p>
              <p className="text-[#8c8480] text-xs tracking-widest uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="relative py-28 bg-[#2c2c2c] overflow-hidden grain">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-gold text-[10px] tracking-[0.5em] uppercase mb-5"
          >
            Khách hàng nói gì
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-4xl md:text-5xl text-[#fdfbf8] leading-tight"
          >
            Tin Tưởng Được
            <br />
            <em className="text-gold not-italic">Xây Dựng Qua Năm Tháng</em>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="border border-white/10 rounded-2xl p-8 hover:border-gold/30 transition-colors duration-500 flex flex-col gap-6"
            >
              <div className="flex gap-1">
                {Array.from({ length: t.stars }).map((_, s) => (
                  <Star key={s} size={12} className="fill-gold text-gold" />
                ))}
              </div>
              <blockquote className="text-[#fdfbf8]/70 text-sm leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="border-t border-white/10 pt-5">
                <p className="font-heading text-[#fdfbf8] text-base">{t.name}</p>
                <p className="text-[#8c8480] text-xs mt-1 tracking-wide">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 flex items-center gap-4 justify-center"
        >
          <div className="h-px w-16 bg-gold/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-gold/40" />
          <div className="h-px w-16 bg-gold/30" />
        </motion.div>
      </div>
    </section>
  );
}

// ─── CTA / CONTACT ────────────────────────────────────────────────────────────

type FormState = { name: string; phone: string; address: string; note: string };
const emptyForm: FormState = { name: "", phone: "", address: "", note: "" };

function ContactCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contact = useContactInfo();

  const field = (key: keyof FormState) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneDigits = form.phone.replace(/\D/g, "");
    if (phoneDigits.length < 9 || phoneDigits.length > 11) {
      setError("Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await appointmentService.create({
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim() || undefined,
        note: form.note.trim() || undefined,
      });
      setSubmitted(true);
    } catch {
      setError("Gửi không thành công. Vui lòng thử lại hoặc gọi trực tiếp cho chúng tôi.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-transparent border-b border-[#e8e0d5] focus:border-gold outline-none py-3 text-[#2c2c2c] placeholder:text-[#8c8480]/50 text-sm transition-colors duration-200";

  return (
    <section id="contact" ref={ref} className="py-28 bg-[#f8f5f0]">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Left */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-gold text-[10px] tracking-[0.5em] uppercase mb-6"
            >
              Tư vấn miễn phí
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-4xl md:text-5xl text-[#2c2c2c] leading-tight mb-8"
            >
              Không Gian Đẹp
              <br />
              <em className="text-gold not-italic">Bắt Đầu Từ Đây</em>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-4 mb-10"
            >
              {[
                "Chuyên gia đến tận nhà — không phí di chuyển",
                "Mang theo 200+ mẫu vải để bạn chọn trực tiếp",
                "Báo giá chi tiết ngay trong buổi tư vấn",
                "Không áp lực — quyết định khi bạn sẵn sàng",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle size={16} className="text-gold mt-0.5 shrink-0" />
                  <p className="text-[#8c8480] text-sm">{item}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="border-t border-[#e8e0d5] pt-8"
            >
              <p className="text-[#8c8480] text-xs tracking-widest uppercase mb-4">Hoặc liên hệ trực tiếp</p>
              <a
                href={telHref(contact.phone)}
                className="inline-flex items-center gap-3 font-heading text-2xl text-[#2c2c2c] hover:text-gold transition-colors duration-300"
              >
                <Phone size={20} className="text-gold" />
                {contact.phone}
              </a>
            </motion.div>
          </div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[#fdfbf8] rounded-2xl p-8 md:p-10 shadow-sm border border-[#e8e0d5]"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center justify-center gap-5 py-16 text-center"
                >
                  <CheckCircle size={48} className="text-gold" />
                  <h3 className="font-heading text-2xl text-[#2c2c2c]">Đã nhận lịch hẹn!</h3>
                  <p className="text-[#8c8480] text-sm max-w-sm leading-relaxed">
                    Chuyên gia sẽ gọi xác nhận trong vòng <strong>2 giờ</strong>.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm(emptyForm); }}
                    className="mt-2 text-xs tracking-widest uppercase text-gold hover:text-[#2c2c2c] transition-colors duration-200"
                  >
                    Đặt lịch khác →
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-7"
                >
                  <div>
                    <label className="block text-[#8c8480] text-[10px] tracking-widest uppercase mb-2">
                      Họ và tên <span className="text-gold">*</span>
                    </label>
                    <input {...field("name")} required placeholder="Nguyễn Văn A" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[#8c8480] text-[10px] tracking-widest uppercase mb-2">
                      Số điện thoại <span className="text-gold">*</span>
                    </label>
                    <input {...field("phone")} required type="tel" placeholder="0901 234 567" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[#8c8480] text-[10px] tracking-widest uppercase mb-2">
                      Địa chỉ
                    </label>
                    <input {...field("address")} placeholder="123 Đường ABC, Quận 1, TP.HCM" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[#8c8480] text-[10px] tracking-widest uppercase mb-2">
                      Ghi chú thêm
                    </label>
                    <textarea
                      {...field("note")}
                      rows={3}
                      placeholder="Số phòng cần rèm, phong cách mong muốn, thời gian thuận tiện..."
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                  {error && (
                    <p className="text-red-500 text-xs text-center">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-[#2c2c2c] text-[#fdfbf8] text-xs tracking-widest uppercase hover:bg-gold transition-colors duration-300 rounded-full disabled:opacity-60"
                  >
                    {loading ? "Đang gửi..." : "Đặt lịch tư vấn miễn phí"}
                  </button>
                  <p className="text-center text-[#8c8480]/60 text-[10px]">
                    Hoàn toàn miễn phí · Không ràng buộc · Phản hồi trong 2 giờ
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Stats />
      <Collections />
      <WhyUs />
      <HowItWorks />
      <PriceEstimator />
      <Lookbook />
      <Testimonials />
      <ContactCTA />
    </>
  );
}
