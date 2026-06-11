"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Page transition — gold curtain sweep khi điều hướng giữa các route.
 * template.tsx remount theo mỗi navigation nên animation chạy lại tự nhiên.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <>
      {/* Curtain sweep — quét từ dưới lên rồi biến mất */}
      <motion.div
        className="fixed inset-0 z-[90] pointer-events-none origin-top"
        style={{
          background: "linear-gradient(160deg, #2c2420 0%, #1e1a16 100%)",
        }}
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      />
      {/* Gold line theo mép rèm */}
      <motion.div
        className="fixed inset-x-0 z-[91] h-[2px] pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, transparent, #c9a96e 30%, #e8d5b0 50%, #c9a96e 70%, transparent)",
        }}
        initial={{ top: "100%", opacity: 1 }}
        animate={{ top: "0%", opacity: 0 }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
