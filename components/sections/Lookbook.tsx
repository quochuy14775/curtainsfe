"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { X, MapPin, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";

const PROJECTS = [
  {
    id: 1,
    title: "Penthouse Landmark 81",
    location: "Bình Thạnh, TP.HCM",
    type: "Rèm lụa tơ tằm Ý",
    tall: true,
    image: "/completed/z7937815952988_6f4fd478549d9e7019d31b6eb4090dca.jpg",
  },
  {
    id: 2,
    title: "Villa Thảo Điền",
    location: "Quận 2, TP.HCM",
    type: "Rèm nhung Bỉ + voile",
    tall: false,
    image: "/completed/z7937815991273_98dd527c3935b18c567732bfce28e83a.jpg",
  },
  {
    id: 3,
    title: "Căn hộ The Marq",
    location: "Quận 1, TP.HCM",
    type: "Rèm cầu vồng Hàn Quốc",
    tall: false,
    image: "/completed/z7937815988483_bf826289676ecd0fc725ef3f762c77ff.jpg",
  },
  {
    id: 4,
    title: "Văn phòng Deutsches Haus",
    location: "Quận 1, TP.HCM",
    type: "Rèm cuốn cao cấp",
    tall: true,
    image: "/completed/z7937815978578_e105a5f634c8939f0066b586bccab450.jpg",
  },
  {
    id: 5,
    title: "Biệt thự Phú Mỹ Hưng",
    location: "Quận 7, TP.HCM",
    type: "Rèm gấm dệt thủ công",
    tall: false,
    image: "/completed/z7937815965442_555d9226c43b72fc78a8503353eabdca.jpg",
  },
  {
    id: 6,
    title: "Boutique Hotel Đà Lạt",
    location: "Đà Lạt, Lâm Đồng",
    type: "Rèm len pha + blackout",
    tall: false,
    image: "/completed/z7937815974450_134e0e718613435b77fbf34dce24147f.jpg",
  },
  {
    id: 7,
    title: "Căn hộ Vinhomes Grand Park",
    location: "Quận 9, TP.HCM",
    type: "Rèm vải cao cấp",
    tall: false,
    image: "/completed/z7937815956205_747fbdbae545371481e419e0bb1f8744.jpg",
  },
];

type Project = (typeof PROJECTS)[number];

export function Lookbook() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  // Lightbox: khoá scroll + điều hướng phím
  useEffect(() => {
    document.body.style.overflow = activeIdx !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeIdx]);

  useEffect(() => {
    if (activeIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIdx(null);
      if (e.key === "ArrowRight") setActiveIdx((i) => (i! + 1) % PROJECTS.length);
      if (e.key === "ArrowLeft") setActiveIdx((i) => (i! - 1 + PROJECTS.length) % PROJECTS.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIdx]);

  const active = activeIdx !== null ? PROJECTS[activeIdx] : null;

  return (
    <section id="lookbook" className="py-28 bg-[#fdfbf8]">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-gold text-[10px] tracking-[0.5em] uppercase mb-4"
            >
              Lookbook
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-4xl md:text-5xl text-[#2c2c2c] leading-tight"
            >
              Công Trình
              <br />
              <em className="text-[#8c8480] not-italic">Đã Hoàn Thiện</em>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-[#8c8480] text-sm leading-relaxed max-w-xs"
          >
            Hơn 2.400 không gian trên khắp Việt Nam đã tin tưởng lựa chọn chúng tôi.
          </motion.p>
        </div>

        {/* Masonry grid */}
        <div className="columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
          {PROJECTS.map((p, i) => (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setActiveIdx(i)}
              className="relative w-full mb-5 break-inside-avoid overflow-hidden rounded-2xl group cursor-zoom-in text-left"
            >
              <div className="transition-transform duration-700 group-hover:scale-105">
                <Image src={p.image} alt={p.title} width={0} height={0} sizes="(max-width:768px) 50vw, 33vw" className="w-full h-auto block" />
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-500" />

              {/* Info */}
              <div className="absolute inset-x-0 bottom-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-[10px] tracking-widest uppercase mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gold">
                  {p.type}
                </p>
                <h3 className="font-heading text-xl text-white leading-tight drop-shadow">
                  {p.title}
                </h3>
                <p className="flex items-center gap-1.5 text-white/60 text-xs mt-1">
                  <MapPin size={10} /> {p.location}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {active && (
          <>
            <motion.div
              key="lb-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setActiveIdx(null)}
              className="fixed inset-0 z-[70] bg-[#16130f]/90 backdrop-blur-md"
            />
            <motion.div
              key={`lb-${active.id}`}
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed z-[71] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden pointer-events-none"
            >
              <div className="relative w-full pointer-events-auto">
                <Image src={active.image} alt={active.title} width={0} height={0} sizes="90vw" className="max-w-[90vw] max-h-[90vh] w-auto h-auto block" />

                {/* Caption */}
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-[10px] tracking-widest uppercase mb-2 text-gold">
                    {active.type}
                  </p>
                  <h3 className="font-heading text-3xl text-white">{active.title}</h3>
                  <p className="flex items-center gap-1.5 text-white/60 text-sm mt-2">
                    <MapPin size={12} /> {active.location}
                  </p>
                </div>

                {/* Controls */}
                <button
                  onClick={() => setActiveIdx(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Đóng"
                >
                  <X size={16} />
                </button>
                <button
                  onClick={() => setActiveIdx((i) => (i! - 1 + PROJECTS.length) % PROJECTS.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:text-gold flex items-center justify-center transition-colors"
                  aria-label="Trước"
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  onClick={() => setActiveIdx((i) => (i! + 1) % PROJECTS.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:text-gold flex items-center justify-center transition-colors"
                  aria-label="Sau"
                >
                  <ArrowRight size={16} />
                </button>

                {/* Counter */}
                <span className="absolute top-5 left-5 text-white/50 text-xs tracking-widest font-mono">
                  {String(activeIdx! + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
