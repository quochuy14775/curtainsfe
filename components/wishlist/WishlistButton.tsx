"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-store";

/** Heart toggle đặt trên product card — dừng propagation để không kích hoạt Link bao ngoài. */
export function WishlistButton({
  productId,
  className = "",
}: {
  productId: number;
  className?: string;
}) {
  const ids = useWishlist((s) => s.ids);
  const toggle = useWishlist((s) => s.toggle);
  const liked = ids.includes(productId);

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors duration-300 ${
        liked
          ? "bg-gold text-[#2c2c2c]"
          : "bg-black/20 text-white/80 hover:bg-black/35 hover:text-white"
      } ${className}`}
      aria-label={liked ? "Bỏ yêu thích" : "Yêu thích"}
    >
      <motion.span
        key={liked ? "on" : "off"}
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
        className="flex"
      >
        <Heart size={15} className={liked ? "fill-[#2c2c2c]" : ""} />
      </motion.span>
    </motion.button>
  );
}
