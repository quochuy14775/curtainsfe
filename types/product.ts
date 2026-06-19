// ─── Entity ───────────────────────────────────────────────────────────────────

export type Product = {
  id: number;
  name: string;
  material: string;
  price: number;
  tag: string | null;
  categoryId: number;
  isActived: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
};

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export type ProductResponse = {
  id: number;
  name: string;
  material: string;
  price: number | null;
  tag: string | null;
  colorHex: string | null;
  colorGroup: string | null;
  imageUrl: string | null;
  categoryId: number;
  categoryTitle: string | null;
  isActived: boolean;
};

export type ProductRequest = {
  name: string;
  material: string;
  price: number | null;
  tag?: string;
  colorHex?: string;
  colorGroup?: string;
  imageUrl?: string;
  categoryId: number;
};

// ─── Constants ────────────────────────────────────────────────────────────────

export const PRODUCT_TAGS = ["Bestseller", "Mới", "Limited", "Hot", "Smart"] as const;
export type ProductTag = typeof PRODUCT_TAGS[number];

export const TAG_STYLES: Record<string, string> = {
  Bestseller: "bg-charcoal text-warm-white",
  Mới:        "bg-gold/20 text-yellow-800",
  Limited:    "bg-stone-200 text-stone-700",
  Hot:        "bg-red-100 text-red-700",
  Smart:      "bg-blue-100 text-blue-700",
};

// ─── Formatters ───────────────────────────────────────────────────────────────

export function formatVND(price: number): string {
  return new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(price);
}

export function displayPrice(price: number | null): string {
  return price == null ? "Liên hệ" : `${formatVND(price)} ₫`;
}

export function parsePrice(raw: string): number {
  return parseInt(raw.replace(/\D/g, ""), 10) || 0;
}
