"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin gold reading-progress line pinned to the very top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left pointer-events-none"
      style={{
        scaleX,
        background:
          "linear-gradient(to right, #a87f33, #c9a96e 50%, #e8d5b0)",
      }}
      aria-hidden
    />
  );
}
