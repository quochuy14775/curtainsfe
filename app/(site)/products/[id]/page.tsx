import { notFound } from "next/navigation";
import { ProductDetailClient } from "./ProductDetailClient";
import type { Metadata } from "next";
import type { ProductResponse } from "@/types/product";
import { formatVND } from "@/types/product";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

async function fetchProduct(id: number): Promise<ProductResponse | null> {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/api/Product/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function fetchRelated(categoryId: number, excludeId: number): Promise<ProductResponse[]> {
  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/Product?$filter=CategoryId eq ${categoryId} and Id ne ${excludeId}&$top=4`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.value ?? [];
  } catch {
    return [];
  }
}

function toVM(p: ProductResponse) {
  return {
    id: p.id,
    name: p.name,
    material: p.material,
    price: p.price != null ? formatVND(p.price) : "Liên hệ",
    tag: p.tag ?? undefined,
    color: p.colorHex ?? "#c9a96e",
    width: "",
    drop: "",
    imageFront:  p.imageFront  ?? undefined,
    imageLeft:   p.imageLeft   ?? undefined,
    imageRight:  p.imageRight  ?? undefined,
    imageDetail: p.imageDetail ?? undefined,
    categoryId: String(p.categoryId),
    categoryTitle: p.categoryTitle ?? "",
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = await fetchProduct(Number(id));
  if (!p) return { title: "Sản phẩm không tồn tại" };
  return {
    title: `${p.name} — Rèm Màn Ngọc Huệ`,
    description: `${p.material} · ${p.price ?? "Liên hệ"}₫/m²`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const p = await fetchProduct(Number(id));
  if (!p) notFound();

  const relatedRaw = await fetchRelated(p.categoryId, p.id);

  return (
    <ProductDetailClient
      product={toVM(p)}
      related={relatedRaw.map(toVM)}
    />
  );
}
