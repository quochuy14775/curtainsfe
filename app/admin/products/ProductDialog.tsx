"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { categories } from "@/lib/data";
import { CustomSelect } from "./CustomSelect";

export type ProductFormData = {
  name: string;
  material: string;
  price: string;
  categoryId: string;
  tag?: string;
  color: string;
  width: string;
  drop: string;
};

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductFormData) => void;
  initialData?: ProductFormData;
  title: string;
  isLoading?: boolean;
}

const TAG_OPTIONS = ["", "Bestseller", "Mới", "Limited", "Hot", "Smart"];

export function ProductDialog({
  isOpen,
  onClose,
  onSave,
  initialData,
  title,
  isLoading = false,
}: ProductDialogProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<ProductFormData>(
    initialData || {
      name: "",
      material: "",
      price: "",
      categoryId: "",
      tag: "",
      color: "#c9a96e",
      width: "",
      drop: "",
    }
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.categoryId || !form.price) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }
    onSave(form);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            key="dialog"
            ref={ref}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 m-auto bg-warm-white flex flex-col"
            style={{ width: "min(95vw, 700px)", maxHeight: "90vh", borderRadius: "24px" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 md:px-8 pt-6 pb-5 border-b border-linen flex items-center justify-between shrink-0">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="font-heading text-2xl text-charcoal"
              >
                {title}
              </motion.h2>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full border border-linen flex items-center justify-center text-stone hover:text-charcoal hover:border-charcoal transition-colors"
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 px-6 md:px-8 py-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Row 1: Name & Color */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-stone text-xs tracking-widest uppercase mb-2">
                      Tên sản phẩm <span className="text-gold">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Velvet Bordeaux"
                      className="w-full bg-cream/50 border border-linen rounded-lg px-4 py-3 text-charcoal placeholder:text-stone/40 focus:border-gold outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-stone text-xs tracking-widest uppercase mb-2">
                      Màu sắc
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={form.color}
                        onChange={(e) => setForm({ ...form, color: e.target.value })}
                        className="w-12 h-12 rounded-lg border border-linen cursor-pointer"
                      />
                      <input
                        type="text"
                        value={form.color}
                        onChange={(e) => setForm({ ...form, color: e.target.value })}
                        className="flex-1 bg-cream/50 border border-linen rounded-lg px-3 py-2 text-xs font-mono text-charcoal"
                        placeholder="#c9a96e"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Material & Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone text-xs tracking-widest uppercase mb-2">
                      Chất liệu <span className="text-gold">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.material}
                      onChange={(e) => setForm({ ...form, material: e.target.value })}
                      placeholder="Nhung Bỉ"
                      className="w-full bg-cream/50 border border-linen rounded-lg px-4 py-3 text-charcoal placeholder:text-stone/40 focus:border-gold outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-stone text-xs tracking-widest uppercase mb-2">
                      Giá <span className="text-gold">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="2.850.000"
                      className="w-full bg-cream/50 border border-linen rounded-lg px-4 py-3 text-charcoal placeholder:text-stone/40 focus:border-gold outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Row 3: Category & Tag */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomSelect
                    options={[
                      { value: "", label: "Chọn danh mục..." },
                      ...categories.map((cat) => ({
                        value: cat.id,
                        label: cat.title,
                      })),
                    ]}
                    value={form.categoryId}
                    onChange={(value) => setForm({ ...form, categoryId: value })}
                    label="Danh mục *"
                  />
                  <CustomSelect
                    options={TAG_OPTIONS.map((tag) => ({
                      value: tag,
                      label: tag || "Không có tag",
                    }))}
                    value={form.tag}
                    onChange={(value) => setForm({ ...form, tag: value })}
                    label="Tag"
                  />
                </div>

                {/* Row 4: Width & Drop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone text-xs tracking-widest uppercase mb-2">
                      Chiều rộng
                    </label>
                    <input
                      type="text"
                      value={form.width}
                      onChange={(e) => setForm({ ...form, width: e.target.value })}
                      placeholder="140cm"
                      className="w-full bg-cream/50 border border-linen rounded-lg px-4 py-3 text-charcoal placeholder:text-stone/40 focus:border-gold outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-stone text-xs tracking-widest uppercase mb-2">
                      Chiều dài
                    </label>
                    <input
                      type="text"
                      value={form.drop}
                      onChange={(e) => setForm({ ...form, drop: e.target.value })}
                      placeholder="270cm"
                      className="w-full bg-cream/50 border border-linen rounded-lg px-4 py-3 text-charcoal placeholder:text-stone/40 focus:border-gold outline-none transition-colors"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="px-6 md:px-8 py-4 border-t border-linen shrink-0 flex gap-3 justify-end bg-cream">
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 border border-linen rounded-lg text-stone text-xs tracking-widest uppercase hover:border-charcoal hover:text-charcoal transition-colors"
              >
                Hủy
              </motion.button>
              <motion.button
                onClick={handleSubmit}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-charcoal text-warm-white text-xs tracking-widest uppercase rounded-lg hover:bg-gold transition-colors disabled:opacity-60 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-4 h-4 border-2 border-warm-white border-t-gold rounded-full"
                    />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    Lưu
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
