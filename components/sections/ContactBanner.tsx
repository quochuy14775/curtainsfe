"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function ContactBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="contact" ref={ref} className="py-28 bg-cream">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-gold text-xs tracking-[0.4em] uppercase mb-6"
        >
          Tư vấn miễn phí
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-4xl md:text-6xl text-charcoal leading-tight mb-8"
        >
          Không Gian Đẹp
          <br />
          <em className="text-gold not-italic">Bắt Đầu Từ Đây</em>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-stone text-base leading-relaxed mb-12 max-w-lg mx-auto"
        >
          Đội ngũ chuyên gia của chúng tôi sẵn sàng đến tận nhà tư vấn, đo
          đạc và lắp đặt miễn phí trong nội thành TP.HCM.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <a
            href="tel:+84901234567"
            className="px-10 py-4 bg-charcoal text-warm-white text-sm tracking-widest uppercase hover:bg-gold transition-colors duration-300 min-w-48 text-center"
          >
            Gọi ngay
          </a>
          <a
            href="mailto:hello@maisondrage.vn"
            className="px-10 py-4 border border-charcoal text-charcoal text-sm tracking-widest uppercase hover:border-gold hover:text-gold transition-colors duration-300 min-w-48 text-center"
          >
            Gửi email
          </a>
        </motion.div>

        {/* Divider ornament */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
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
