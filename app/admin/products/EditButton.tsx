"use client";

import { Pencil } from "lucide-react";

export function EditButton({
  productId,
  onEdit,
}: {
  productId: number;
  onEdit: (id: number) => void;
}) {
  return (
    <button
      onClick={() => onEdit(productId)}
      className="text-xs tracking-widest uppercase text-stone hover:text-gold transition-colors opacity-0 group-hover:opacity-100 whitespace-nowrap flex items-center gap-1.5 ml-auto"
    >
      <Pencil size={14} />
      Sửa
    </button>
  );
}
