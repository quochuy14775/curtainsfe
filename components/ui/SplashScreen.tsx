"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Branded first-visit splash — wordmark shine on charcoal, then curtain-lift.
 * Shows once per browser session (sessionStorage), skipped entirely after that.
 */
export function SplashScreen() {
  // null = undecided (avoid SSR mismatch), then true/false
  const [show, setShow] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("maison-splash-seen")) {
        setShow(false);
        return;
      }
      sessionStorage.setItem("maison-splash-seen", "1");
    } catch {
      // sessionStorage unavailable — just show once
    }
    setShow(true);
    const t = setTimeout(() => setShow(false), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#1e1a16]"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Fabric texture */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(201,169,110,0.12) 2px,rgba(201,169,110,0.12) 3px)",
            }}
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="wordmark-luxe text-4xl md:text-6xl"
          >
            Rèm màn Ngọc Huệ
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-4 text-gold/60 text-[10px] tracking-[0.5em] uppercase"
          >
            Luxury Curtains
          </motion.p>

          {/* Gold divider draw */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 h-px w-40 bg-gradient-to-r from-transparent via-gold to-transparent"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
