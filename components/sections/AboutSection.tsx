"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const stats = [
  { number: "15+", label: "Năm kinh nghiệm" },
  { number: "2.400+", label: "Khách hàng tin tưởng" },
  { number: "80+", label: "Chất liệu độc quyền" },
  { number: "100%", label: "Bảo hành chất lượng" },
];

export function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <section id="about" className="py-28 bg-charcoal overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left — Text */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-gold text-xs tracking-[0.4em] uppercase mb-6"
            >
              Câu chuyện của chúng tôi
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-4xl md:text-5xl text-warm-white leading-tight mb-8"
            >
              Nghệ Thuật Dệt May
              <br />
              <em className="text-gold not-italic">Từ Trái Tim</em>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-warm-white/60 text-base leading-relaxed mb-6"
            >
              Từ năm 2010, Maison Drapé đã không ngừng theo đuổi vẻ đẹp trong
              từng chi tiết. Mỗi tấm rèm là sự kết hợp giữa chất liệu nhập
              khẩu đỉnh cao và bàn tay tài hoa của nghệ nhân Việt Nam.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-warm-white/60 text-base leading-relaxed mb-12"
            >
              Chúng tôi tin rằng không gian sống đẹp bắt đầu từ những tấm rèm
              — chúng không chỉ lọc ánh sáng, mà còn định hình cảm xúc và
              phong cách của cả căn phòng.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <a
                href="#contact"
                className="inline-flex items-center gap-3 text-sm tracking-widest uppercase text-gold border-b border-gold pb-1 hover:text-gold-light hover:border-gold-light transition-colors duration-300"
              >
                Tư vấn miễn phí <span>→</span>
              </a>
            </motion.div>
          </div>

          {/* Right — Stats + Visual */}
          <div>
            {/* Parallax decorative block */}
            <motion.div
              style={{ y }}
              className="relative mb-12 aspect-square max-w-sm mx-auto"
            >
              <div className="absolute inset-0 border border-gold/20" />
              <div className="absolute inset-6 border border-gold/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="font-heading text-8xl text-gold/20 leading-none">M</p>
                  <p className="text-gold/40 text-xs tracking-[0.5em] uppercase mt-2">
                    Maison Drapé
                  </p>
                </div>
              </div>
              {/* Corner accents */}
              {[
                "top-0 left-0",
                "top-0 right-0",
                "bottom-0 left-0",
                "bottom-0 right-0",
              ].map((pos) => (
                <div key={pos} className={`absolute ${pos} w-4 h-4 border-gold`}>
                  <div className="w-full h-px bg-gold absolute top-0" />
                  <div className="h-full w-px bg-gold absolute left-0" />
                </div>
              ))}
            </motion.div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                  className="border border-white/10 p-6 hover:border-gold/40 transition-colors duration-300"
                >
                  <p className="font-heading text-3xl text-gold mb-1">
                    {stat.number}
                  </p>
                  <p className="text-warm-white/50 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
