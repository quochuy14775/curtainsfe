"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { History } from "lucide-react";
import { useRecentlyViewed } from "@/lib/recently-viewed-store";
import { getAllProducts } from "@/lib/data";

/** Dải sản phẩm đã xem gần đây — chỉ render khi có lịch sử. */
export function RecentlyViewed({ excludeId }: { excludeId?: number }) {
  const ids = useRecentlyViewed((s) => s.ids);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    useRecentlyViewed.persist.rehydrate();
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const all = getAllProducts();
  const items = ids
    .filter((id) => id !== excludeId)
    .map((id) => all.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 6);

  if (items.length === 0) return null;

  return (
    <section className="py-16 bg-[#f8f5f0] border-t border-[#e8e0d5]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-3 mb-8">
          <History size={14} className="text-gold" />
          <p className="text-[#8c8480] text-xs tracking-[0.3em] uppercase">Bạn vừa xem</p>
        </div>

        <div className="flex gap-5 overflow-x-auto scrollbar-none pb-2">
          {items.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="flex-none w-40 group"
            >
              <Link href={`/products/${p.id}`}>
                <div className="relative aspect-[3/4] mb-3 overflow-hidden rounded-xl">
                  <div
                    className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                    style={{
                      background: `linear-gradient(160deg, ${p.color}44 0%, ${p.color}99 50%, ${p.color}dd 100%)`,
                    }}
                  />
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.07) 3px,rgba(0,0,0,0.07) 4px)",
                    }}
                  />
                </div>
                <h4 className="font-heading text-sm text-[#2c2c2c] leading-snug group-hover:text-gold transition-colors line-clamp-1">
                  {p.name}
                </h4>
                <p className="text-[#8c8480] text-xs mt-0.5">{p.price}₫/m²</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
