import { notFound } from "next/navigation";
import { categories, getProductById, getRelatedProducts } from "@/lib/data";
import { ProductDetailClient } from "./ProductDetailClient";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return categories
    .flatMap((c) => c.products)
    .map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(Number(id));
  if (!product) return { title: "Sản phẩm không tồn tại" };
  return {
    title: `${product.name} — Maison Drapé`,
    description: `${product.material} · ${product.width} × ${product.drop} · ${product.price}₫/m²`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(Number(id));
  if (!product) notFound();
  const related = getRelatedProducts(Number(id));
  return <ProductDetailClient product={product} related={related} />;
}
