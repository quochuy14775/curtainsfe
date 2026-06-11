"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone } from "lucide-react";

/**
 * Sticky CTA — pill "Tư vấn miễn phí" hiện ở góc trái dưới sau khi
 * khách cuộn qua 50% trang; ẩn khi đã cuộn tới form liên hệ.
 */
export function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const progress = total > 0 ? scrolled / total : 0;

        // Ẩn khi form liên hệ đã vào viewport
        const contact = document.getElementById("contact");
        const contactVisible = contact
          ? contact.getBoundingClientRect().top < window.innerHeight * 0.7
          : false;

        setVisible(progress > 0.45 && !contactVisible);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2"
        >
          <a
            href="/#contact"
            className="flex items-center gap-2.5 pl-4 pr-5 py-3 bg-[#2c2c2c] text-[#fdfbf8] rounded-full shadow-xl border border-white/10 hover:bg-gold hover:text-[#2c2c2c] transition-colors duration-300 group"
          >
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-gold animate-ping opacity-75 group-hover:bg-[#2c2c2c]" />
              <span className="relative w-2 h-2 rounded-full bg-gold group-hover:bg-[#2c2c2c]" />
            </span>
            <span className="text-[10px] tracking-[0.25em] uppercase font-medium">
              Tư vấn miễn phí
            </span>
          </a>
          <a
            href="tel:+84901234567"
            className="w-11 h-11 rounded-full bg-gold text-[#2c2c2c] shadow-xl flex items-center justify-center hover:bg-[#e8d5b0] transition-colors duration-300"
            aria-label="Gọi ngay"
          >
            <Phone size={16} />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
