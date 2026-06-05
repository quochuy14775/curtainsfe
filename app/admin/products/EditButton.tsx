"use client";

export function EditButton({ productId }: { productId: number }) {
  return (
    <button
      onClick={() => alert(`[Mock] Sửa sản phẩm ${productId} — sẽ gọi PATCH /api/products/${productId}`)}
      className="text-xs tracking-widest uppercase text-stone hover:text-gold transition-colors opacity-0 group-hover:opacity-100 whitespace-nowrap"
    >
      Sửa
    </button>
  );
}
