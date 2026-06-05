"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import type { Order, OrderStatus } from "@/lib/mock-admin";
import { STATUS_LABEL } from "@/lib/mock-admin";

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "contacted",
  contacted: "confirmed",
  confirmed: "done",
};

export function OrderActions({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);

  const next = NEXT_STATUS[order.status];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-stone hover:bg-linen hover:text-charcoal transition-colors opacity-0 group-hover:opacity-100"
      >
        <MoreHorizontal size={14} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-8 z-20 w-44 bg-warm-white rounded-xl shadow-lg border border-linen overflow-hidden py-1"
            >
              {next && (
                <button
                  onClick={() => { setOpen(false); alert(`[Mock] Cập nhật "${order.id}" → ${STATUS_LABEL[next]}`); }}
                  className="w-full text-left px-4 py-2.5 text-xs text-charcoal hover:bg-cream transition-colors"
                >
                  → {STATUS_LABEL[next]}
                </button>
              )}
              <button
                onClick={() => { setOpen(false); alert(`[Mock] Gọi ${order.phone}`); }}
                className="w-full text-left px-4 py-2.5 text-xs text-charcoal hover:bg-cream transition-colors"
              >
                Gọi điện
              </button>
              {order.email && (
                <button
                  onClick={() => { setOpen(false); window.open(`mailto:${order.email}`); }}
                  className="w-full text-left px-4 py-2.5 text-xs text-charcoal hover:bg-cream transition-colors"
                >
                  Gửi email
                </button>
              )}
              <hr className="my-1 border-linen" />
              <button
                onClick={() => { setOpen(false); alert(`[Mock] Huỷ "${order.id}"`); }}
                className="w-full text-left px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 transition-colors"
              >
                Huỷ đơn
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
