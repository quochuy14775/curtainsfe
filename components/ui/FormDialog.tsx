"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface FormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  saveLabel?: string;
  isLoading?: boolean;
  disabled?: boolean;
  width?: string;
  children: React.ReactNode;
}

export function FormDialog({
  isOpen,
  onClose,
  onSave,
  title,
  subtitle,
  icon: Icon,
  saveLabel = "Lưu",
  isLoading = false,
  disabled = false,
  width = "min(95vw, 560px)",
  children,
}: FormDialogProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

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
            className="fixed inset-0 z-50 m-auto flex flex-col bg-warm-white overflow-hidden"
            style={{ width, maxHeight: "88vh", height: "fit-content", borderRadius: "20px", boxShadow: "0 24px 64px rgba(44,44,44,0.18)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-5 shrink-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  {Icon && (
                    <div className="w-11 h-11 rounded-2xl bg-gold/15 flex items-center justify-center shrink-0">
                      <Icon size={20} className="text-gold" strokeWidth={1.8} />
                    </div>
                  )}
                  <div>
                    <h2 className="font-heading text-xl text-charcoal leading-snug">{title}</h2>
                    {subtitle && (
                      <p className="text-stone/70 text-xs mt-0.5">{subtitle}</p>
                    )}
                  </div>
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
              <div className="mt-5 h-px bg-linen" />
            </div>

            {/* Content */}
            <div className="overflow-y-auto px-6 pb-4">
              {children}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 pt-4 shrink-0">
              <div className="h-px bg-linen mb-5" />
              <div className="flex gap-3">
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 rounded-xl border border-linen text-stone text-sm hover:border-stone/30 hover:text-charcoal transition-all duration-200"
                >
                  Hủy
                </motion.button>
                <motion.button
                  type="button"
                  onClick={onSave}
                  disabled={isLoading || disabled}
                  whileHover={{ scale: isLoading || disabled ? 1 : 1.01 }}
                  whileTap={{ scale: isLoading || disabled ? 1 : 0.98 }}
                  className="flex-1 py-3 rounded-xl bg-charcoal text-warm-white text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 enabled:hover:bg-gold"
                  style={{ cursor: isLoading || disabled ? "not-allowed" : "pointer" }}
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-warm-white/30 border-t-warm-white rounded-full"
                      />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Check size={15} strokeWidth={2.5} />
                      {saveLabel}
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
