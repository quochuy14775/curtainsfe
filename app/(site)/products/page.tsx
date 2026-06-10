"use client";

import { Suspense, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { SlidersHorizontal, ChevronDown, ArrowLeft } from "lucide-react";
import { categories, getAllProducts } from "@/lib/data";
import { useCartStore } from "@/lib/cart-store";

const tagColor: Record<string, string> = {
  Bestseller: "bg-[#2c2c2c] text-[#fdfbf8]",
  Mới: "bg-gold text-[#2c2c2c]",
  Limited: "bg-stone-600 text-white",
  Hot: "bg-red-700 text-white",
  Smart: "bg-blue-800 text-white",
};

const SORT_OPTIONS = [
  { value: "default", label: "Mặc định" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
];

function parsePrice(price: string) {
  return Number(price.replace(/\./g, ""));
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────

function ProductCard({
  product,
  index,
}: {
  product: ReturnType<typeof getAllProducts>[number];
  index: number;
}) {
  const { addItem } = useCartStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4), ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[2/3] mb-5 overflow-hidden bg-[#e8e0d5] rounded-2xl">
          <div
            className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]"
            style={{
              background: `linear-gradient(160deg,${product.color}33 0%,${product.color}77 45%,${product.color}cc 100%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.07) 3px,rgba(0,0,0,0.07) 4px)",
            }}
          />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent" />

          {product.tag && (
            <span className={`absolute top-3 left-3 px-3 py-1 text-[9px] tracking-widest uppercase rounded-sm ${tagColor[product.tag] ?? "bg-[#2c2c2c] text-[#fdfbf8]"}`}>
              {product.tag}
            </span>
          )}

          <span className="absolute top-3 right-3 px-2.5 py-1 text-[9px] tracking-widest uppercase rounded-full bg-black/20 text-white/70 backdrop-blur-sm">
            {product.categoryTitle}
          </span>

          <div
            className="absolute inset-x-0 bottom-0 py-4 bg-[#2c2c2c]/90 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
          >
            <span className="text-[#fdfbf8] text-[10px] tracking-[0.3em] uppercase">Thêm vào giỏ</span>
          </div>
        </div>
      </Link>

      <div>
        <p className="text-gold text-[10px] tracking-widest uppercase mb-1.5 truncate">{product.material}</p>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-heading text-lg text-[#2c2c2c] leading-snug group-hover:text-gold transition-colors duration-300 mb-2 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <p className="text-[#2c2c2c] font-medium">
            {product.price}₫
            <span className="text-[#8c8480] text-xs font-normal ml-1">/m²</span>
          </p>
          <div
            className="w-5 h-5 rounded-full border-2 border-[#e8e0d5] shadow-sm"
            style={{ backgroundColor: product.color }}
          />
        </div>
        <p className="text-[#8c8480] text-xs mt-1.5">{product.width} × {product.drop}</p>
      </div>
    </motion.div>
  );
}

// ─── MAIN CONTENT ─────────────────────────────────────────────────────────────

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sortRef = useRef<HTMLDivElement>(null);
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState("default");
  const [activeCategory, setActiveCategory] = useState<string | null>(
    searchParams.get("category")
  );

  const handleCategoryChange = (categoryId: string | null) => {
    setActiveCategory(categoryId);
    const url = categoryId ? `/products?category=${categoryId}` : "/products";
    router.replace(url, { scroll: false });
  };

  const allProducts = getAllProducts();
  let filtered = activeCategory
    ? allProducts.filter((p) => p.categoryId === activeCategory)
    : allProducts;

  if (sort === "price-asc")
    filtered = [...filtered].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  if (sort === "price-desc")
    filtered = [...filtered].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));

  const activeCat = categories.find((c) => c.id === activeCategory);
  const sortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Mặc định";

  return (
    <>
      {/* PAGE HEADER */}
      <div className="bg-[#2c2c2c] pt-32 pb-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#fdfbf8]/40 hover:text-gold text-xs tracking-widest uppercase transition-colors duration-300 mb-8 group"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform duration-200" />
            Trang chủ
          </Link>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-gold text-[10px] tracking-[0.5em] uppercase mb-4"
          >
            {activeCat ? activeCat.subtitle : "Khám phá"}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-4xl md:text-6xl text-[#fdfbf8] leading-tight"
          >
            {activeCat ? activeCat.title : "Bộ Sưu Tập"}
            <br />
            <em className="text-gold not-italic">
              {activeCat ? activeCat.count : `${allProducts.length} sản phẩm`}
            </em>
          </motion.h1>
        </div>
      </div>

      {/* STICKY FILTER BAR */}
      <div className="sticky top-20 z-30 bg-[#fdfbf8]/95 backdrop-blur-md border-b border-[#e8e0d5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-3 flex items-center justify-between gap-4">
          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none flex-1 min-w-0">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs tracking-widest uppercase transition-all duration-200 ${
                activeCategory === null
                  ? "bg-[#2c2c2c] text-[#fdfbf8]"
                  : "border border-[#e8e0d5] text-[#8c8480] hover:border-[#2c2c2c] hover:text-[#2c2c2c]"
              }`}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs tracking-widest uppercase transition-all duration-200 ${
                  activeCategory === cat.id
                    ? "bg-[#2c2c2c] text-[#fdfbf8]"
                    : "border border-[#e8e0d5] text-[#8c8480] hover:border-[#2c2c2c] hover:text-[#2c2c2c]"
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>

          {/* Count + Sort */}
          <div className="shrink-0 flex items-center gap-4">
            <span className="text-[#8c8480] text-xs hidden sm:block">
              {filtered.length} sản phẩm
            </span>

            <div ref={sortRef} className="relative">
              <button
                onClick={() => setSortOpen((o) => !o)}
                className="flex items-center gap-2 px-4 py-1.5 border border-[#e8e0d5] rounded-full text-xs text-[#8c8480] hover:border-[#2c2c2c] hover:text-[#2c2c2c] transition-colors duration-200"
              >
                <SlidersHorizontal size={11} />
                <span className="hidden sm:inline">{sortLabel}</span>
                <ChevronDown
                  size={11}
                  className={`transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {sortOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
                    animate={{ opacity: 1, y: 0, scaleY: 1 }}
                    exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformOrigin: "top" }}
                    onMouseLeave={() => setSortOpen(false)}
                    className="absolute right-0 top-full mt-1 z-20 bg-[#fdfbf8] border border-[#e8e0d5] rounded-xl shadow-lg overflow-hidden w-44"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <li key={opt.value}>
                        <button
                          onClick={() => { setSort(opt.value); setSortOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 ${
                            opt.value === sort
                              ? "text-gold bg-gold/5"
                              : "text-[#2c2c2c] hover:bg-[#f8f5f0] hover:text-gold"
                          }`}
                        >
                          {opt.label}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="bg-[#fdfbf8] min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory ?? "all"}-${sort}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 xl:gap-10"
            >
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <p className="font-heading text-2xl text-[#2c2c2c]">Không có sản phẩm</p>
              <button
                onClick={() => handleCategoryChange(null)}
                className="text-xs tracking-widest uppercase text-gold hover:text-[#2c2c2c] transition-colors"
              >
                Xem tất cả →
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 justify-center pb-20">
          <div className="h-px w-16 bg-gold/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-gold/40" />
          <div className="h-px w-16 bg-gold/30" />
        </div>
      </div>
    </>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fdfbf8] flex items-center justify-center">
          <div className="w-px h-16 bg-gradient-to-b from-gold to-transparent animate-pulse" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
