"use client";

import { useEffect, useState } from "react";
import { categoryService } from "@/services/categoryService";
import type { CategoryResponse } from "@/types/category";
import { FormDialog } from "@/components/ui/FormDialog";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { PRODUCT_TAGS, formatVND, parsePrice } from "@/types/product";
import { Package } from "lucide-react";

export type ProductFormData = {
  name: string;
  material: string;
  price: string;
  categoryId: string;
  tag?: string;
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
const EMPTY: ProductFormData = { name: "", material: "", price: "", categoryId: "", tag: "" };

export function ProductDialog({ isOpen, onClose, onSave, initialData, title, isLoading = false }: ProductDialogProps) {
  const [form, setForm] = useState<ProductFormData>(initialData ?? EMPTY);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  useEffect(() => {
    categoryService.getAll().then((res) => setCategories(res.value ?? [])).catch(() => {});
  }, []);

  const handleSave = () => {
    if (!form.name || !form.categoryId || !form.price) return;
    onSave(form);
  };

  return (
    <FormDialog
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      title={title}
      subtitle={initialData ? "Cập nhật thông tin sản phẩm" : "Điền thông tin để thêm sản phẩm mới"}
      icon={Package}
      saveLabel={initialData ? "Lưu thay đổi" : "Tạo sản phẩm"}
      isLoading={isLoading}
      disabled={!form.name || !form.categoryId || !form.price}
    >
      <div className="space-y-5">
        <div>
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
              Giá (₫) <span className="text-gold">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={form.price ? formatVND(parsePrice(form.price)) : ""}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "");
                setForm({ ...form, price: digits });
              }}
              placeholder="2.850.000 ₫"
              className="w-full bg-cream/50 border border-linen rounded-lg px-4 py-3 text-charcoal placeholder:text-stone/40 focus:border-gold outline-none transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomSelect
            options={[
              { value: "", label: "Chọn danh mục..." },
              ...categories.map((cat) => ({ value: String(cat.id), label: cat.title })),
            ]}
            value={form.categoryId}
            onChange={(value) => setForm({ ...form, categoryId: value })}
            label="Danh mục *"
          />
          <CustomSelect
            options={TAG_OPTIONS.map((tag) => ({ value: tag, label: tag || "Không có tag" }))}
            value={form.tag ?? ""}
            onChange={(value) => setForm({ ...form, tag: value })}
            label="Tag"
          />
        </div>
      </div>
    </FormDialog>
  );
}
