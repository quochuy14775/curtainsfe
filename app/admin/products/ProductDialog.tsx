"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { categoryService } from "@/services/categoryService";
import { uploadService } from "@/services/uploadService";
import type { CategoryResponse } from "@/types/category";
import { FormDialog } from "@/components/ui/FormDialog";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { ColorPickerPopover } from "@/components/ui/ColorPickerPopover";
import { formatVND, parsePrice } from "@/types/product";
import { notify } from "@/lib/toast";
import { Package, ImagePlus, Loader2, X } from "lucide-react";

export type ProductFormData = {
  name: string;
  material: string;
  price: string;
  contactOnly: boolean;
  categoryId: string;
  tag?: string;
  colorHex?: string;
  colorGroup?: string;
  imageFront?:  string;
  imageLeft?:   string;
  imageRight?:  string;
  imageDetail?: string;
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

const PRESET_COLORS = [
  { hex: "#c9a96e", name: "Vàng Gold" },
  { hex: "#2c2c2c", name: "Đen Charcoal" },
  { hex: "#f5f0ea", name: "Trắng Kem" },
  { hex: "#8b6f5e", name: "Nâu Mocha" },
  { hex: "#4a6741", name: "Xanh Rêu" },
  { hex: "#9b2335", name: "Đỏ Bordeaux" },
  { hex: "#1e3a5f", name: "Xanh Navy" },
  { hex: "#d4b8a0", name: "Be Nude" },
];
const IMAGE_SLOTS = [
  { key: "imageFront",  label: "Chính diện" },
  { key: "imageLeft",   label: "Góc trái"   },
  { key: "imageRight",  label: "Góc phải"   },
  { key: "imageDetail", label: "Chi tiết"   },
] as const;
type ImageKey = typeof IMAGE_SLOTS[number]["key"];

const EMPTY: ProductFormData = {
  name: "", material: "", price: "", contactOnly: false,
  categoryId: "", tag: "", colorHex: "", colorGroup: "",
  imageFront: "", imageLeft: "", imageRight: "", imageDetail: "",
};

const inputCls = "w-full bg-cream/50 border border-linen rounded-xl px-4 py-3 text-charcoal placeholder:text-stone/40 focus:border-gold outline-none transition-colors text-sm";

export function ProductDialog({ isOpen, onClose, onSave, initialData, title, isLoading = false }: ProductDialogProps) {
  const [form, setForm] = useState<ProductFormData>(initialData ?? EMPTY);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [uploading, setUploading] = useState<ImageKey | null>(null);

  useEffect(() => {
    categoryService.getAll().then((res) => setCategories(res.value ?? [])).catch(() => {});
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, slot: ImageKey) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) { notify.error("Vui lòng chọn file ảnh."); return; }
    if (file.size > 5 * 1024 * 1024)    { notify.error("Ảnh tối đa 5MB.");           return; }
    setUploading(slot);
    try {
      const url = await uploadService.uploadImage(file);
      setForm((f) => ({ ...f, [slot]: url }));
      notify.success("Đã tải ảnh lên.");
    } catch {
      notify.error("Tải ảnh thất bại.");
    } finally {
      setUploading(null);
    }
  };

  const handleSave = () => {
    if (!form.name || !form.categoryId) return;
    if (!form.contactOnly && !form.price) return;
    onSave(form);
  };

  const isDisabled = !form.name || !form.categoryId || (!form.contactOnly && !form.price);

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
      disabled={isDisabled}
      width="min(95vw, 900px)"
    >
      <div className="space-y-4">

        {/* Tên */}
        <div>
          <label className="block text-stone text-[10px] tracking-widest uppercase mb-1.5">
            Tên sản phẩm <span className="text-gold">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Velvet Bordeaux"
            className={inputCls}
          />
        </div>

        {/* Chất liệu + Danh mục */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-stone text-[10px] tracking-widest uppercase mb-1.5">
              Chất liệu <span className="text-gold">*</span>
            </label>
            <input
              type="text"
              value={form.material}
              onChange={(e) => setForm({ ...form, material: e.target.value })}
              placeholder="Nhung Bỉ"
              className={inputCls}
            />
          </div>
          <CustomSelect
            options={[
              { value: "", label: "Chọn danh mục..." },
              ...categories.map((cat) => ({ value: String(cat.id), label: cat.title })),
            ]}
            value={form.categoryId}
            onChange={(value) => setForm({ ...form, categoryId: value })}
            label="Danh mục *"
          />
        </div>

        {/* Giá + Tag */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-stone text-[10px] tracking-widest uppercase">
                Giá (₫) {!form.contactOnly && <span className="text-gold">*</span>}
              </label>
              <button
                type="button"
                onClick={() => setForm({ ...form, contactOnly: !form.contactOnly, price: "" })}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] transition-all duration-200 ${
                  form.contactOnly
                    ? "bg-gold/15 border-gold/40 text-yellow-800"
                    : "border-linen text-stone hover:border-stone/30"
                }`}
              >
                <span className={`w-3 h-3 rounded-full border flex items-center justify-center transition-all duration-200 ${
                  form.contactOnly ? "bg-gold border-gold" : "border-stone/30"
                }`}>
                  {form.contactOnly && <span className="w-1.5 h-1.5 rounded-full bg-white block" />}
                </span>
                Liên hệ
              </button>
            </div>
            <input
              type="text"
              inputMode="numeric"
              disabled={form.contactOnly}
              value={form.contactOnly ? "" : (form.price ? formatVND(parsePrice(form.price)) : "")}
              onChange={(e) => setForm({ ...form, price: e.target.value.replace(/\D/g, "") })}
              placeholder={form.contactOnly ? "Liên hệ" : "1.000.000 ₫"}
              className={`${inputCls} disabled:bg-linen/60 disabled:text-stone/40 disabled:cursor-not-allowed`}
            />
          </div>
          <CustomSelect
            options={TAG_OPTIONS.map((tag) => ({ value: tag, label: tag || "Không có tag" }))}
            value={form.tag ?? ""}
            onChange={(value) => setForm({ ...form, tag: value })}
            label="Tag"
          />
        </div>

        {/* Màu sắc */}
        <div>
          <label className="block text-stone text-[10px] tracking-widest uppercase mb-2">Màu sắc</label>

          {/* Preset swatches + custom picker */}
          <div className="flex items-center gap-2 flex-wrap mb-3">
            {PRESET_COLORS.map((preset) => {
              const active = form.colorHex === preset.hex;
              return (
                <button
                  key={preset.hex}
                  type="button"
                  title={preset.name}
                  onClick={() => setForm({ ...form, colorHex: preset.hex, colorGroup: form.colorGroup || preset.name })}
                  className="w-8 h-8 rounded-full transition-all duration-150 shrink-0 relative"
                  style={{
                    backgroundColor: preset.hex,
                    outline: active ? `2px solid ${preset.hex}` : "none",
                    outlineOffset: "2px",
                    boxShadow: active ? "none" : "inset 0 0 0 1.5px rgba(0,0,0,0.08)",
                  }}
                >
                  {active && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}

            {/* Custom color picker */}
            <ColorPickerPopover
              value={form.colorHex || "#c9a96e"}
              onChange={(hex) => setForm({ ...form, colorHex: hex })}
            />
          </div>

          {/* Selected color detail */}
          {form.colorHex && (
            <div className="flex items-center gap-3 px-3 py-2.5 bg-cream/60 rounded-xl border border-linen mb-3">
              <div className="w-7 h-7 rounded-lg shrink-0" style={{ backgroundColor: form.colorHex }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-charcoal truncate">{form.colorGroup || "Màu tuỳ chỉnh"}</p>
                <p className="text-[10px] font-mono text-stone/60">{form.colorHex}</p>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, colorHex: "", colorGroup: "" })}
                className="text-stone/40 hover:text-stone transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          )}

          {/* Color group name */}
          <input
            type="text"
            value={form.colorGroup ?? ""}
            onChange={(e) => setForm({ ...form, colorGroup: e.target.value })}
            placeholder="Tên nhóm màu (VD: Vàng Gold, Xanh Navy...)"
            className={inputCls}
          />
        </div>

        {/* Ảnh sản phẩm — 4 góc */}
        <div>
          <label className="block text-stone text-[10px] tracking-widest uppercase mb-2">Ảnh sản phẩm</label>
          <div className="grid grid-cols-2 gap-3">
            {IMAGE_SLOTS.map(({ key, label }) => {
              const url = form[key];
              const isUploading = uploading === key;
              return (
                <div key={key}>
                  <p className="text-stone text-[10px] tracking-widest uppercase mb-1">{label}</p>
                  {url ? (
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-linen">
                      <Image src={url} alt={label} fill className="object-cover" sizes="280px" />
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, [key]: "" }))}
                        className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-charcoal/70 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <label className={`flex flex-col items-center justify-center gap-1.5 w-full aspect-square rounded-xl border-2 border-dashed border-linen cursor-pointer hover:border-gold hover:bg-cream/40 transition-colors ${isUploading ? "pointer-events-none opacity-60" : ""}`}>
                      {isUploading ? (
                        <Loader2 size={18} className="text-gold animate-spin" />
                      ) : (
                        <ImagePlus size={18} className="text-stone/50" />
                      )}
                      <span className="text-stone text-[10px]">{isUploading ? "Đang tải..." : "Chọn ảnh"}</span>
                      <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, key)} className="hidden" disabled={!!uploading} />
                    </label>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </FormDialog>
  );
}
