"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Trash2, X } from "lucide-react";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
  isLoading?: boolean;
}

export function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  productName,
  isLoading = false,
}: DeleteDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm"
          />

          <motion.div
            key="dialog"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 m-auto bg-warm-white flex flex-col"
            style={{ width: "min(95vw, 420px)", borderRadius: "24px" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-linen flex items-center justify-between">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center"
              >
                <AlertCircle size={24} className="text-red-600" />
              </motion.div>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full border border-linen flex items-center justify-center text-stone hover:text-charcoal transition-colors"
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="px-6 py-6 flex-1"
            >
              <h2 className="font-heading text-xl text-charcoal mb-2">
                Xóa sản phẩm?
              </h2>
              <p className="text-stone text-sm leading-relaxed">
                Bạn chắc chắn muốn xóa{" "}
                <span className="font-medium text-charcoal">"{productName}"</span>?
                <br />
                Hành động này không thể hoàn tác.
              </p>
            </motion.div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-linen flex gap-3 justify-end bg-cream">
              <motion.button
                onClick={onClose}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 border border-linen rounded-lg text-stone text-xs tracking-widest uppercase hover:border-charcoal hover:text-charcoal transition-colors disabled:opacity-50"
              >
                Hủy
              </motion.button>
              <motion.button
                onClick={onConfirm}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-red-600 text-white text-xs tracking-widest uppercase rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-4 h-4 border-2 border-white border-t-red-300 rounded-full"
                    />
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    Xóa
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
