"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { categories, getAllProducts, getProductById } from "@/lib/data";
import { EditButton } from "./EditButton";
import { ProductDialog, type ProductFormData } from "./ProductDialog";
import { DeleteDialog } from "./DeleteDialog";

const TAG_COLOR: Record<string, string> = {
  Bestseller: "bg-charcoal text-warm-white",
  Mới: "bg-gold/20 text-yellow-800",
  Limited: "bg-stone-200 text-stone-700",
  Hot: "bg-red-100 text-red-700",
  Smart: "bg-blue-100 text-blue-700",
};

export default function ProductsPage() {
  const all = getAllProducts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectedProduct = selectedProductId ? getProductById(selectedProductId) : null;

  const handleEdit = (id: number) => {
    setSelectedProductId(id);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedProductId(null);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setSelectedProductId(id);
    setIsDeleteOpen(true);
  };

  const handleSave = async (data: ProductFormData) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
    setIsDialogOpen(false);
    alert(`[Mock] ${selectedProductId ? "Sửa" : "Tạo"} sản phẩm: ${data.name}`);
  };

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
    setIsDeleteOpen(false);
    alert(`[Mock] Xóa sản phẩm ${selectedProduct?.name} thành công`);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-charcoal">Sản phẩm</h1>
          <p className="text-stone text-sm mt-1">{all.length} sản phẩm · {categories.length} danh mục</p>
        </div>
        <motion.button
          onClick={handleCreate}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-5 py-3 bg-gold text-charcoal text-xs tracking-widest uppercase rounded-lg hover:bg-gold/90 transition-colors font-medium"
        >
          <Plus size={16} />
          Thêm sản phẩm
        </motion.button>
      </div>

      {/* Category breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.4 }}
            whileHover={{ y: -4 }}
            className="bg-warm-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <motion.div
              className={`w-8 h-8 rounded-xl bg-gradient-to-br ${cat.bg} mb-3`}
              whileHover={{ scale: 1.1, rotate: 5 }}
            />
            <p className="font-heading text-base text-charcoal">{cat.title}</p>
            <p className="text-stone text-xs mt-0.5">{cat.products.length} sản phẩm</p>
          </motion.div>
        ))}
      </div>

      {/* Product table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-warm-white rounded-2xl shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-linen">
                {["ID", "Tên sản phẩm", "Danh mục", "Chất liệu", "Kích thước", "Giá", "Tag", ""].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-[10px] tracking-widest uppercase text-stone font-normal whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-linen">
              {all.map((product, idx) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03, duration: 0.3 }}
                  whileHover={{ backgroundColor: "rgba(253, 251, 248, 0.5)" }}
                  className="group"
                >
                  <td className="px-5 py-3.5 text-stone text-xs font-mono">{product.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="w-7 h-7 rounded-lg shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${product.color}66, ${product.color}cc)`,
                        }}
                        whileHover={{ scale: 1.15 }}
                      />
                      <span className="font-heading text-sm text-charcoal">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-stone text-xs whitespace-nowrap">{product.categoryTitle}</td>
                  <td className="px-5 py-3.5 text-stone text-xs">{product.material}</td>
                  <td className="px-5 py-3.5 text-stone text-xs whitespace-nowrap">{product.width} × {product.drop}</td>
                  <td className="px-5 py-3.5 text-charcoal text-sm font-medium whitespace-nowrap">{product.price}₫</td>
                  <td className="px-5 py-3.5">
                    {product.tag ? (
                      <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: idx * 0.03 + 0.1 }}
                        className={`px-2 py-0.5 rounded-full text-[9px] font-medium tracking-widest uppercase inline-block ${TAG_COLOR[product.tag] ?? "bg-stone-100 text-stone-600"}`}
                      >
                        {product.tag}
                      </motion.span>
                    ) : (
                      <span className="text-stone/30 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <EditButton productId={product.id} onEdit={handleEdit} />
                      <motion.button
                        onClick={() => handleDelete(product.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-xs tracking-widest uppercase text-stone/60 hover:text-red-600 transition-colors whitespace-nowrap"
                      >
                        Xóa
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Dialogs */}
      <ProductDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        initialData={
          selectedProduct
            ? {
                name: selectedProduct.name,
                material: selectedProduct.material,
                price: selectedProduct.price,
                categoryId: selectedProduct.categoryId,
                tag: selectedProduct.tag,
                color: selectedProduct.color,
                width: selectedProduct.width,
                drop: selectedProduct.drop,
              }
            : undefined
        }
        title={selectedProductId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        isLoading={isLoading}
      />

      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        productName={selectedProduct?.name || ""}
        isLoading={isLoading}
      />
    </div>
  );
}
