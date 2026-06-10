"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Tag, Search } from "lucide-react";
import { categoryService } from "@/services/categoryService";
import type { CategoryRequest, CategoryResponse } from "@/types/category";
import { getCategoryAccent } from "@/types/category";
import { buildODataQuery, contains } from "@/lib/odata";
import { CategoryDialog } from "./CategoryDialog";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { notify } from "@/lib/toast";

export default function CategoriesPage() {
  const [items, setItems] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<CategoryResponse | null>(null);
  const [saving, setSaving] = useState(false);
  const [tick, setTick] = useState(0);

  const refresh = () => setTick((t) => t + 1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let alive = true;

    const query = buildODataQuery({
      filter: debouncedSearch.trim() ? contains("Title", debouncedSearch) : undefined,
      orderby: "Title asc",
    });

    categoryService.getAll(query)
      .then((res) => { if (alive) setItems(res.value ?? []); })
      .catch(() => { if (alive) notify.error("Không thể tải danh mục."); })
      .finally(() => { if (alive) setLoading(false); });

    return () => { alive = false; };
  }, [tick, debouncedSearch]);

  const openCreate = () => { setSelected(null); setIsOpen(true); };
  const openEdit = (item: CategoryResponse) => { setSelected(item); setIsOpen(true); };

  const handleSave = async (data: CategoryRequest) => {
    setSaving(true);
    try {
      if (selected) {
        await categoryService.update(selected.id, data);
        notify.success("Đã cập nhật danh mục.");
      } else {
        await categoryService.create(data);
        notify.success("Đã thêm danh mục mới.");
      }
      refresh();
      setIsOpen(false);
    } catch {
      notify.error("Lưu thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await categoryService.delete(selected.id);
      setItems((prev) => prev.filter((c) => c.id !== selected.id));
      setIsDeleteOpen(false);
      notify.success("Đã xóa danh mục.");
    } catch {
      notify.error("Xóa thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const totalProducts = items.reduce((sum, c) => sum + c.productCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-charcoal">Phân loại</h1>
          <p className="text-stone text-sm mt-1">{items.length} danh mục · {totalProducts} sản phẩm</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-charcoal text-warm-white text-xs tracking-widest uppercase rounded-full hover:bg-gold transition-colors duration-200"
        >
          <Plus size={14} /> Thêm danh mục
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone/40" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm danh mục..."
          className="w-full pl-9 pr-4 py-2.5 bg-warm-white border border-linen rounded-full text-sm text-charcoal placeholder:text-stone/40 focus:border-gold outline-none transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-warm-white rounded-2xl border border-linen overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-stone/40 text-sm">Đang tải...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-linen bg-cream/40">
                <th className="text-left px-6 py-4 text-stone text-[10px] tracking-widest uppercase">Danh mục</th>
                <th className="text-left px-6 py-4 text-stone text-[10px] tracking-widest uppercase hidden md:table-cell">Mô tả</th>
                <th className="text-center px-6 py-4 text-stone text-[10px] tracking-widest uppercase">Sản phẩm</th>
                <th className="px-6 py-4 w-24" />
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => {
                const accent = getCategoryAccent(item.id);
                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-linen last:border-0 hover:bg-cream/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${accent}20`, border: `1.5px solid ${accent}40` }}
                        >
                          <Tag size={13} style={{ color: accent }} />
                        </div>
                        <span className="font-heading text-sm text-charcoal">{item.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-stone hidden md:table-cell">{item.subtitle}</td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: `${accent}20`, color: accent }}
                      >
                        {item.productCount} sản phẩm
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-2 rounded-lg text-stone hover:text-charcoal hover:bg-linen transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => { setSelected(item); setIsDeleteOpen(true); }}
                          className="p-2 rounded-lg text-stone hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        )}
        {!loading && items.length === 0 && (
          <div className="py-16 text-center text-stone/40 text-sm">
            {search ? `Không tìm thấy "${search}"` : "Chưa có danh mục nào"}
          </div>
        )}
      </div>

      <CategoryDialog
        key={selected?.id ?? "new"}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleSave}
        initialData={selected ?? undefined}
        isLoading={saving}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Xóa danh mục?"
        description={`Bạn chắc chắn muốn xóa "${selected?.title ?? ""}"? Hành động này không thể hoàn tác.`}
        isLoading={saving}
      />
    </div>
  );
}
