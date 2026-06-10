"use client";

import { useState } from "react";
import { FormDialog } from "@/components/ui/FormDialog";
import { Tag } from "lucide-react";
import type { CategoryRequest, CategoryResponse } from "@/types/category";

interface CategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CategoryRequest) => void;
  initialData?: CategoryResponse;
  isLoading?: boolean;
}

const EMPTY = { title: "", subtitle: "" };

export function CategoryDialog({ isOpen, onClose, onSave, initialData, isLoading = false }: CategoryDialogProps) {
  const [form, setForm] = useState<CategoryRequest>(
    initialData ? { title: initialData.title, subtitle: initialData.subtitle ?? "" } : EMPTY
  );

  const handleSave = () => {
    if (!form.title.trim()) return;
    onSave(form);
  };

  return (
    <FormDialog
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      title={initialData ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
      subtitle={initialData ? `Đang sửa: ${initialData.title}` : "Điền thông tin để tạo danh mục"}
      icon={Tag}
      saveLabel={initialData ? "Lưu thay đổi" : "Tạo danh mục"}
      isLoading={isLoading}
      disabled={!form.title.trim()}
      width="min(95vw, 480px)"
    >
      <div className="space-y-5">
        <div>
          <label className="block text-stone text-xs tracking-widest uppercase mb-2">
            Tên danh mục <span className="text-gold">*</span>
          </label>
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="VD: Rèm Lụa Cao Cấp"
            className="w-full bg-cream/50 border border-linen rounded-lg px-4 py-3 text-charcoal placeholder:text-stone/40 focus:border-gold outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-stone text-xs tracking-widest uppercase mb-2">
            Mô tả
          </label>
          <input
            value={form.subtitle ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
            placeholder="VD: Chất liệu nhập khẩu cao cấp"
            className="w-full bg-cream/50 border border-linen rounded-lg px-4 py-3 text-charcoal placeholder:text-stone/40 focus:border-gold outline-none transition-colors"
          />
        </div>
      </div>
    </FormDialog>
  );
}
