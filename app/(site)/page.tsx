"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import Link from "next/link";
import {
  Ruler,
  Truck,
  ShieldCheck,
  Phone,
  Star,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { categories } from "@/lib/data";

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
  },
  {
    number: "02",
    title: "Tư Vấn Thiết Kế",
    desc: "Chuyên gia đến tận nhà, mang theo bộ mẫu vải để bạn trải nghiệm thực tế.",
  },
  {
    number: "03",
    title: "Sản Xuất & Lắp Đặt",
    desc: "Rèm may đo riêng và lắp đặt hoàn chỉnh trong vòng 5–7 ngày làm việc.",
  },
];

const STATS = [
  { number: "2.400+", label: "Không gian đã hoàn thiện" },
  { number: "98%", label: "Khách hàng hài lòng" },
  { number: "15+", label: "Năm kinh nghiệm" },
  { number: "80+", label: "Chất liệu độc quyền" },
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

function Hero() {
  const curtainL = useRef<HTMLDivElement>(null);
  const curtainR = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });
    tl.to([curtainL.current, curtainR.current], {
      scaleX: 0,
      duration: 1.5,
      ease: "power4.inOut",
    })
      .to(overlay.current, { opacity: 0, duration: 0.5, ease: "power2.out" }, "-=0.7")
      .from(content.current, { opacity: 0, y: 50, duration: 1, ease: "power3.out" }, "-=0.5");
  }, []);

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(150deg,#3a3028 0%,#2c2420 40%,#1e1a16 100%)" }}
      />
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(201,169,110,0.12) 2px,rgba(201,169,110,0.12) 3px)",
        }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 60%,rgba(201,169,110,0.25) 0%,transparent 70%)",
        }}
      />

      <div ref={overlay} className="absolute inset-0 bg-[#2c2c2c] z-10" style={{ willChange: "opacity" }} />

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

      <div ref={content} className="relative z-30 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.p
          className="text-gold text-[10px] tracking-[0.5em] uppercase mb-6 border border-gold/30 px-4 py-2 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          Bộ sưu tập 2026 · Miễn phí tư vấn tận nhà
        </motion.p>

        <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-[#fdfbf8] leading-[1.05] mb-6 max-w-5xl">
          Rèm Cửa Cao Cấp
          <br />
          <em className="text-gold not-italic">Cho Không Gian Của Bạn</em>
        </h1>

        <p className="text-[#fdfbf8]/60 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
          Từ tư vấn đến lắp đặt — đội ngũ chuyên gia mang đến giải pháp hoàn hảo,
          đúng tiến độ và vượt mong đợi.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/products"
            className="px-10 py-4 bg-gold text-[#2c2c2c] text-sm tracking-widest uppercase hover:bg-[#e8d5b0] transition-colors duration-300 rounded-full font-medium"
          >
            Khám phá bộ sưu tập
          </Link>
          <a
            href="#contact"
            className="px-10 py-4 border border-[#fdfbf8]/30 text-[#fdfbf8]/80 text-sm tracking-widest uppercase hover:border-gold hover:text-gold transition-colors duration-300 rounded-full"
          >
            Tư vấn miễn phí
          </a>
        </div>

        <div className="mt-14 flex flex-wrap justify-center gap-8 text-[#fdfbf8]/40 text-xs tracking-widest uppercase">
          {["Miễn phí đo đạc", "Bảo hành 5 năm", "Giao hàng nội thành"].map((t) => (
            <span key={t} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-gold inline-block" />
              {t}
            </span>
          ))}
        </div>

        <motion.div
          className="absolute bottom-10 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <span className="text-[#fdfbf8]/30 text-[10px] tracking-widest uppercase">Cuộn xuống</span>
          <div className="w-px h-10 bg-gradient-to-b from-gold to-transparent" />
        </motion.div>
      </div>
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
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        style={{ willChange: "transform" }}
      >
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
      </motion.div>
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
                className="group bg-[#fdfbf8] border border-[#e8e0d5] rounded-2xl p-8 hover:border-gold/50 hover:shadow-lg transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center mb-6 group-hover:bg-gold/10 transition-colors duration-300">
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
    <section className="py-28 bg-[#2c2c2c] overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-12">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative text-center group"
            >
              <div className="relative mx-auto w-24 h-24 mb-8">
                <div className="absolute inset-0 rounded-full border border-gold/20 group-hover:border-gold/50 transition-colors duration-500" />
                <div className="absolute inset-2 rounded-full border border-gold/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-heading text-3xl text-gold/60 group-hover:text-gold transition-colors duration-500">
                    {step.number}
                  </span>
                </div>
              </div>
              <h3 className="font-heading text-xl text-[#fdfbf8] mb-4">{step.title}</h3>
              <p className="text-[#fdfbf8]/50 text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              {i < STEPS.length - 1 && (
                <div className="hidden md:flex absolute top-12 -right-4 items-center justify-center z-10">
                  <ArrowRight size={16} className="text-gold/30" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-center mt-16"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-3 px-10 py-4 bg-gold text-[#2c2c2c] text-sm tracking-widest uppercase hover:bg-[#e8d5b0] transition-colors duration-300 rounded-full font-medium"
          >
            Đặt lịch tư vấn ngay <ArrowRight size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ─── COLLECTIONS ─────────────────────────────────────────────────────────────

function Collections() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="collections" className="py-28 bg-[#fdfbf8]">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/products?category=${cat.id}`}
                className="group relative aspect-[3/4] overflow-hidden cursor-pointer block rounded-2xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-b ${cat.bg} transition-transform duration-700 group-hover:scale-105`} />
                <div
                  className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg,transparent,transparent 8px,rgba(255,255,255,0.3) 8px,rgba(255,255,255,0.3) 9px)",
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  <div className="w-8 h-px" style={{ backgroundColor: cat.accent }} />
                  <div>
                    <p className="text-xs tracking-widest uppercase mb-2" style={{ color: cat.accent }}>
                      {cat.count}
                    </p>
                    <h3 className="font-heading text-2xl text-[#fdfbf8] leading-tight mb-1">{cat.title}</h3>
                    <p className="text-[#fdfbf8]/60 text-sm">{cat.subtitle}</p>
                    <p
                      className="mt-4 text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                      style={{ color: cat.accent }}
                    >
                      Khám phá →
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── STATS ───────────────────────────────────────────────────────────────────

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
              <p className="font-heading text-4xl md:text-5xl text-gold mb-2">{stat.number}</p>
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
    <section id="about" className="py-28 bg-[#2c2c2c] overflow-hidden">
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

  const field = (key: keyof FormState) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
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
                href="tel:+84901234567"
                className="inline-flex items-center gap-3 font-heading text-2xl text-[#2c2c2c] hover:text-gold transition-colors duration-300"
              >
                <Phone size={20} className="text-gold" />
                0901 234 567
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
      <WhyUs />
      <HowItWorks />
      <Collections />
      <Stats />
      <Testimonials />
      <ContactCTA />
    </>
  );
}
