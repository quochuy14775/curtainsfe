"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import type { AppointmentResponse } from "@/types/appointment";
import { NEXT_STATUS, STATUS_LABEL } from "@/types/appointment";

interface OrderActionsProps {
  appointment: AppointmentResponse;
  onAdvance: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export function OrderActions({ appointment, onAdvance, onEdit, onCancel, onDelete }: OrderActionsProps) {
  const [open, setOpen] = useState(false);

  const next = NEXT_STATUS[appointment.status];
  const pick = (action: () => void) => () => { setOpen(false); action(); };

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
                  onClick={pick(onAdvance)}
                  className="w-full text-left px-4 py-2.5 text-xs text-charcoal hover:bg-cream transition-colors"
                >
                  → {STATUS_LABEL[next]}
                </button>
              )}
              <button
                onClick={pick(onEdit)}
                className="w-full text-left px-4 py-2.5 text-xs text-charcoal hover:bg-cream transition-colors"
              >
                Chỉnh sửa
              </button>
              {appointment.phone && (
                <a
                  href={`tel:${appointment.phone}`}
                  onClick={() => setOpen(false)}
                  className="block w-full text-left px-4 py-2.5 text-xs text-charcoal hover:bg-cream transition-colors"
                >
                  Gọi điện
                </a>
              )}
              <hr className="my-1 border-linen" />
              {appointment.status !== "Cancelled" && appointment.status !== "Completed" && (
                <button
                  onClick={pick(onCancel)}
                  className="w-full text-left px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 transition-colors"
                >
                  Huỷ đơn
                </button>
              )}
              <button
                onClick={pick(onDelete)}
                className="w-full text-left px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 transition-colors"
              >
                Xóa đơn
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
