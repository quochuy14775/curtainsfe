"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { buildODataQuery, contains } from "@/lib/odata";
import { productService } from "@/services/productService";
import type { ProductResponse } from "@/types/product";
import { TAG_STYLES, formatVND } from "@/types/product";
import { ProductDialog, type ProductFormData } from "./ProductDialog";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { notify } from "@/lib/toast";

export default function ProductsPage() {
  const [items, setItems] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<ProductResponse | null>(null);
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
      filter: debouncedSearch.trim() ? contains("Name", debouncedSearch) : undefined,
      orderby: "Id desc",
    });

    productService.getAllAdmin(query)
      .then((res) => { if (alive) setItems(res.value ?? []); })
      .catch(() => { if (alive) notify.error("Không thể tải sản phẩm."); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [tick, debouncedSearch]);

  const openCreate = () => {
    setSelected(null);
    setIsDialogOpen(true);
  };

  const openEdit = (item: ProductResponse) => {
    setSelected(item);
    setIsDialogOpen(true);
  };

  const handleSave = async (data: ProductFormData) => {
    setSaving(true);
    try {
      const payload = {
        name: data.name,
        material: data.material,
        price: parseFloat(data.price),
        tag: data.tag || undefined,
        categoryId: parseInt(data.categoryId),
      };
      if (selected) {
        await productService.update(selected.id, payload);
        notify.success("Đã cập nhật sản phẩm.");
      } else {
        await productService.create(payload);
        notify.success("Đã thêm sản phẩm mới.");
      }
      refresh();
      setIsDialogOpen(false);
    } catch {
      notify.error("Lưu thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await productService.delete(selected.id);
      setItems((prev) => prev.filter((p) => p.id !== selected.id));
      setIsDeleteOpen(false);
      notify.success("Đã xóa sản phẩm.");
    } catch {
      notify.error("Xóa thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (item: ProductResponse) => {
    try {
      await productService.toggleActive(item.id);
      setItems((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, isActived: !p.isActived } : p))
      );
      notify.success(item.isActived ? "Đã ẩn sản phẩm." : "Đã hiển thị sản phẩm.");
    } catch {
      notify.error("Cập nhật trạng thái thất bại.");
    }
  };

  const activeCount = items.filter((p) => p.isActived).length;

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-charcoal">Sản phẩm</h1>
          <p className="text-stone text-sm mt-1">{items.length} sản phẩm · {activeCount} đang hiển thị</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-charcoal text-warm-white text-xs tracking-widest uppercase rounded-full hover:bg-gold transition-colors duration-200"
        >
          <Plus size={14} /> Thêm sản phẩm
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone/40" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm sản phẩm..."
          className="w-full pl-9 pr-4 py-2.5 bg-warm-white border border-linen rounded-full text-sm text-charcoal placeholder:text-stone/40 focus:border-gold outline-none transition-colors"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="bg-warm-white rounded-2xl shadow-sm overflow-hidden"
      >
        {loading ? (
          <div className="py-16 text-center text-stone/40 text-sm">Đang tải...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-linen bg-cream/40">
                  {["ID", "Tên sản phẩm", "Danh mục", "Chất liệu", "Giá", "Tag", "Trạng thái", ""].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-[10px] tracking-widest uppercase text-stone font-normal whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-linen">
                {items.map((product, idx) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03, duration: 0.3 }}
                    className="group hover:bg-cream/30 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-stone text-xs font-mono">{product.id}</td>
                    <td className="px-5 py-3.5">
                      <span className="font-heading text-sm text-charcoal">{product.name}</span>
                    </td>
                    <td className="px-5 py-3.5 text-stone text-xs whitespace-nowrap">{product.categoryTitle ?? "—"}</td>
                    <td className="px-5 py-3.5 text-stone text-xs">{product.material}</td>
                    <td className="px-5 py-3.5 text-charcoal text-sm font-medium whitespace-nowrap">
                      {formatVND(product.price)} ₫
                    </td>
                    <td className="px-5 py-3.5">
                      {product.tag ? (
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium tracking-widest uppercase ${TAG_STYLES[product.tag] ?? "bg-stone-100 text-stone-600"}`}>
                          {product.tag}
                        </span>
                      ) : (
                        <span className="text-stone/30 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleToggleActive(product)}
                        className={`px-2.5 py-1 rounded-full text-[9px] font-medium tracking-widest uppercase transition-colors ${
                          product.isActived
                            ? "bg-green-50 text-green-700 hover:bg-red-50 hover:text-red-600"
                            : "bg-stone-100 text-stone-500 hover:bg-green-50 hover:text-green-700"
                        }`}
                      >
                        {product.isActived ? "Hiển thị" : "Ẩn"}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-2 rounded-lg text-stone hover:text-charcoal hover:bg-linen transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => { setSelected(product); setIsDeleteOpen(true); }}
                          className="p-2 rounded-lg text-stone hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {items.length === 0 && (
              <div className="py-16 text-center text-stone/40 text-sm">
                {debouncedSearch ? `Không tìm thấy "${debouncedSearch}"` : "Chưa có sản phẩm nào"}
              </div>
            )}
          </div>
        )}
      </motion.div>

      <ProductDialog
        key={selected?.id ?? "new"}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        initialData={
          selected
            ? {
                name: selected.name,
                material: selected.material,
                price: String(selected.price),
                categoryId: String(selected.categoryId),
                tag: selected.tag ?? "",
              }
            : undefined
        }
        title={selected ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        isLoading={saving}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xóa sản phẩm?"
        description={`Bạn chắc chắn muốn xóa "${selected?.name ?? ""}"? Hành động này không thể hoàn tác.`}
        isLoading={saving}
      />
    </div>
  );
}
