"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Xóa",
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm"
          />

          <motion.div
            key="dialog"
            initial={{ scale: 0.96, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 m-auto bg-warm-white flex flex-col overflow-hidden"
            style={{ width: "min(95vw, 400px)", height: "fit-content", borderRadius: "20px", boxShadow: "0 24px 64px rgba(44,44,44,0.18)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-5 shrink-0">
              <div className="flex items-start justify-between gap-3">
                <div className="w-11 h-11 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
                  <Trash2 size={18} className="text-red-500" strokeWidth={1.8} />
                </div>
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  className="shrink-0 w-8 h-8 rounded-full bg-linen/60 flex items-center justify-center text-stone hover:text-charcoal hover:bg-linen transition-colors"
                >
                  <X size={15} />
                </motion.button>
              </div>
              <div className="mt-4">
                <h2 className="font-heading text-xl text-charcoal leading-snug">{title}</h2>
                <p className="text-stone/70 text-sm mt-1.5 leading-relaxed">{description}</p>
              </div>
              <div className="mt-5 h-px bg-linen" />
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 shrink-0">
              <div className="flex gap-3">
                <motion.button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 rounded-xl border border-linen text-stone text-sm hover:border-stone/30 hover:text-charcoal transition-all duration-200 disabled:opacity-50"
                >
                  Hủy
                </motion.button>
                <motion.button
                  type="button"
                  onClick={onConfirm}
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.01 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm flex items-center justify-center gap-2 hover:bg-red-600 transition-all duration-200 disabled:opacity-60"
                  style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Đang xóa...
                    </>
                  ) : (
                    <>
                      <Trash2 size={14} strokeWidth={2} />
                      {confirmLabel}
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
