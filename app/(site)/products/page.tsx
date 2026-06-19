"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { SlidersHorizontal, ChevronDown, ArrowLeft, ShoppingBag, Check, LayoutGrid, Tag as TagIcon, Banknote } from "lucide-react";

const PRODUCT_IMAGES = [
  "/products/Rem-cua-mau-vang-dong-mang-phong-cach-hoang-gia-sang-trong_1752891269-1024x768.jpg",
  "/products/rem-cua-cho-van-phong-cong-ty-tphcm-chong-choi-man-hinh-toi-uu-anh-sang_1776927048.jpg",
  "/products/Rem-cua-1-lop-nhe-nhang-cho-can-ho-nho_1756178119-1024x768.jpeg",
  "/products/TOP_6_LO_I_REM_C_A_PH_BI_N_BONARIO_3_1024x1024.webp",
];
import type { ProductWithCategory } from "@/lib/data";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { formatVND, type ProductResponse } from "@/types/product";
import type { CategoryResponse } from "@/types/category";
import { useCartStore } from "@/lib/cart-store";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
import { RecentlyViewed } from "@/components/sections/RecentlyViewed";

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

const ALL_TAGS = ["Bestseller", "Mới", "Limited", "Hot", "Smart"];

const PRICE_MIN = 500_000;
const PRICE_MAX = 5_500_000;
const PRICE_STEP = 100_000;

// ─── MULTI-SELECT DROPDOWN ─────────────────────────────────────────────────────

function MultiDropdown({
  label,
  icon: Icon,
  options,
  selected,
  onToggle,
  onClear,
}: {
  label: string;
  icon: React.ElementType;
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (v: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const hasSelected = selected.length > 0;

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 border rounded-full text-xs tracking-widest uppercase transition-colors duration-200
          px-2.5 py-1.5 sm:px-4 sm:gap-2
          ${hasSelected
            ? "border-charcoal bg-charcoal text-warm-white"
            : "border-[#e8e0d5] text-[#8c8480] hover:border-[#2c2c2c] hover:text-[#2c2c2c]"
          }`}
      >
        <Icon size={13} className="shrink-0" />
        <span className="hidden sm:inline">{label}</span>
        {hasSelected && (
          <span className="w-4 h-4 rounded-full bg-gold text-charcoal text-[9px] flex items-center justify-center font-bold leading-none">
            {selected.length}
          </span>
        )}
        <ChevronDown size={11} className={`hidden sm:block transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "top" }}
            className="absolute left-0 top-full mt-1 z-50 bg-[#fdfbf8] border border-[#e8e0d5] rounded-xl shadow-lg overflow-hidden min-w-[180px]"
          >
            {options.map((opt) => {
              const active = selected.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => onToggle(opt.value)}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors duration-150 ${
                    active ? "text-gold bg-gold/5" : "text-[#2c2c2c] hover:bg-[#f8f5f0] hover:text-gold"
                  }`}
                >
                  <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors duration-150 ${active ? "bg-gold border-gold" : "border-[#d4cdc8]"}`}>
                    {active && <Check size={10} strokeWidth={3} className="text-charcoal" />}
                  </span>
                  {opt.label}
                </button>
              );
            })}
            {hasSelected && (
              <>
                <div className="h-px bg-[#e8e0d5] mx-3" />
                <button
                  onClick={() => { onClear(); setOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-xs tracking-widest uppercase text-[#8c8480] hover:text-red-400 transition-colors duration-150"
                >
                  Bỏ chọn tất cả
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function parsePrice(price: string) {
  return Number(price.replace(/\./g, ""));
}

function formatPrice(v: number) {
  return v >= 1_000_000
    ? `${(v / 1_000_000).toFixed(v % 1_000_000 === 0 ? 0 : 1)}tr`
    : `${(v / 1_000).toFixed(0)}k`;
}

// ─── PRICE RANGE SLIDER (reusable track) ──────────────────────────────────────

function PriceSliderTrack({
  value,
  onChange,
}: {
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const [min, max] = value;
  const pct = (v: number) => ((v - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] text-[#2c2c2c] w-10 text-right tabular-nums">{formatPrice(min)}</span>
      <div className="relative w-40 h-1 rounded-full bg-[#e8e0d5]">
        <div
          className="absolute h-full rounded-full bg-gold"
          style={{ left: `${pct(min)}%`, right: `${100 - pct(max)}%` }}
        />
        <input
          type="range"
          min={PRICE_MIN} max={PRICE_MAX} step={PRICE_STEP}
          value={min}
          onChange={(e) => { const v = Number(e.target.value); if (v < max) onChange([v, max]); }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          style={{ zIndex: min > PRICE_MAX - PRICE_STEP ? 5 : 3 }}
        />
        <input
          type="range"
          min={PRICE_MIN} max={PRICE_MAX} step={PRICE_STEP}
          value={max}
          onChange={(e) => { const v = Number(e.target.value); if (v > min) onChange([min, v]); }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          style={{ zIndex: 4 }}
        />
        <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-gold shadow pointer-events-none"
          style={{ left: `calc(${pct(min)}% - 7px)` }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-gold shadow pointer-events-none"
          style={{ left: `calc(${pct(max)}% - 7px)` }} />
      </div>
      <span className="text-[10px] text-[#2c2c2c] w-10 tabular-nums">{formatPrice(max)}</span>
    </div>
  );
}

// ─── PRICE DROPDOWN (icon pill mobile / inline desktop) ───────────────────────

function PriceDropdown({
  value,
  onChange,
}: {
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isFiltered = value[0] > PRICE_MIN || value[1] < PRICE_MAX;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative shrink-0">
      {/* Mobile: icon pill */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`sm:hidden flex items-center gap-1.5 border rounded-full px-2.5 py-1.5 text-xs transition-colors duration-200 ${
          isFiltered
            ? "border-charcoal bg-charcoal text-warm-white"
            : "border-[#e8e0d5] text-[#8c8480] hover:border-[#2c2c2c] hover:text-[#2c2c2c]"
        }`}
      >
        <Banknote size={13} />
        {isFiltered && <span className="w-1.5 h-1.5 rounded-full bg-gold" />}
      </button>

      {/* Desktop: inline label + slider */}
      <div className="hidden sm:flex items-center gap-3 shrink-0">
        <span className="text-[10px] tracking-widest uppercase text-[#8c8480]">Giá</span>
        <PriceSliderTrack value={value} onChange={onChange} />
      </div>

      {/* Mobile dropdown — absolute, works because parent has no overflow clip */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "top" }}
            className="sm:hidden absolute left-0 top-full mt-1 z-50 bg-[#fdfbf8] border border-[#e8e0d5] rounded-xl shadow-lg p-4 w-[240px]"
          >
            <p className="text-[10px] tracking-widest uppercase text-[#8c8480] mb-4">Lọc theo giá</p>
            <PriceSliderTrack value={value} onChange={onChange} />
            {isFiltered && (
              <>
                <div className="h-px bg-[#e8e0d5] mt-3" />
                <button
                  onClick={() => { onChange([PRICE_MIN, PRICE_MAX]); setOpen(false); }}
                  className="mt-2.5 w-full text-left text-xs tracking-widest uppercase text-[#8c8480] hover:text-red-400 transition-colors duration-150"
                >
                  Xóa bộ lọc
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────

type ProductVM = ProductWithCategory;

// Map sản phẩm từ API về shape ProductWithCategory để cart/wishlist dùng được như cũ.
function toProductVM(p: ProductResponse): ProductVM {
  return {
    id: p.id,
    name: p.name,
    material: p.material,
    price: p.price != null ? formatVND(p.price) : "Liên hệ",
    tag: p.tag ?? undefined,
    color: p.colorHex ?? "#c9a96e",
    width: "",
    drop: "",
    categoryId: String(p.categoryId),
    categoryTitle: p.categoryTitle ?? "",
    imageFront:  p.imageFront  ?? undefined,
    imageLeft:   p.imageLeft   ?? undefined,
    imageRight:  p.imageRight  ?? undefined,
    imageDetail: p.imageDetail ?? undefined,
  };
}

function ProductCard({
  product,
  index,
}: {
  product: ProductVM;
  index: number;
}) {
  const { addItem } = useCartStore();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4), ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[4/3] mb-5 overflow-hidden bg-[#e8e0d5] rounded-2xl">
          <Image
            src={product.imageFront ?? PRODUCT_IMAGES[index % PRODUCT_IMAGES.length]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            quality={85}
            className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/[0.06] to-transparent" />

          {product.tag && (
            <span className={`absolute top-3 left-3 px-3 py-1 text-[9px] tracking-widest uppercase rounded-sm ${tagColor[product.tag] ?? "bg-[#2c2c2c] text-[#fdfbf8]"}`}>
              {product.tag}
            </span>
          )}

          <span className="absolute top-3 right-3 px-2.5 py-1 text-[9px] tracking-widest uppercase rounded-full bg-black/20 text-white/70 backdrop-blur-sm">
            {product.categoryTitle}
          </span>

          <WishlistButton
            productId={product.id}
            className="absolute top-12 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleAddToCart}
            className={`absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors duration-300 opacity-0 group-hover:opacity-100 ${
              added ? "bg-gold text-charcoal" : "bg-black/20 text-white/80 hover:bg-black/35 hover:text-white"
            }`}
            aria-label="Thêm vào giỏ hàng"
          >
            <motion.span
              key={added ? "added" : "idle"}
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="flex"
            >
              {added ? <Check size={15} strokeWidth={2.5} /> : <ShoppingBag size={15} strokeWidth={1.75} />}
            </motion.span>
          </motion.button>
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
            {product.price === "Liên hệ" ? (
              "Liên hệ"
            ) : (
              <>
                {product.price}₫
                <span className="text-[#8c8480] text-xs font-normal ml-1">/m²</span>
              </>
            )}
          </p>
          <div
            className="w-5 h-5 rounded-full border-2 border-[#e8e0d5] shadow-sm"
            style={{ backgroundColor: product.color }}
          />
        </div>
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const cat = searchParams.get("category");
    // Chỉ nhận id danh mục dạng số (khớp với API); bỏ qua slug cũ.
    return cat && /^\d+$/.test(cat) ? [cat] : [];
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

  // Dữ liệu thật từ API
  const [products, setProducts] = useState<ProductVM[]>([]);
  const [cats, setCats] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    Promise.all([productService.getAll(), categoryService.getAll()])
      .then(([prodRes, catRes]) => {
        if (!alive) return;
        setProducts((prodRes.value ?? []).map(toProductVM));
        setCats(catRes.value ?? []);
      })
      .catch(() => { /* giữ danh sách rỗng nếu lỗi */ })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
    setPage(1);
  };
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setPage(1);
  };

  let filtered = products;
  if (selectedCategories.length > 0)
    filtered = filtered.filter((p) => selectedCategories.includes(p.categoryId));
  if (selectedTags.length > 0)
    filtered = filtered.filter((p) => p.tag && selectedTags.includes(p.tag));
  if (priceRange[0] > PRICE_MIN || priceRange[1] < PRICE_MAX)
    filtered = filtered.filter((p) => {
      const price = parsePrice(p.price);
      return price >= priceRange[0] && price <= priceRange[1];
    });
  if (sort === "price-asc")
    filtered = [...filtered].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  if (sort === "price-desc")
    filtered = [...filtered].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const sortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Mặc định";
  const categoryOptions = cats.map((c) => ({ value: String(c.id), label: c.title ?? "" }));
  const tagOptions = ALL_TAGS.map((t) => ({ value: t, label: t }));

  return (
    <>
      {/* PAGE HEADER */}
      <div className="relative h-[55vh] min-h-[380px] overflow-hidden flex items-center justify-center">
        {/* Ảnh hero — cover nhưng không scale quá native resolution */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full max-w-[1920px] max-h-[1080px]">
            <Image
              src="/previews/manh-cau-vong.png"
              alt=""
              fill
              priority
              sizes="100vw"
              quality={100}
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* Overlay tối */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end px-6 lg:px-12 pt-28 pb-12 max-w-7xl mx-auto w-full">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-gold text-[10px] tracking-[0.5em] uppercase mb-4"
            >
              Khám phá
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-4xl md:text-6xl text-white leading-tight"
            >
              Bộ Sưu Tập
              <br />
              <em className="text-gold not-italic">{products.length} sản phẩm</em>
            </motion.h1>
          </div>
        </div>
      </div>

      {/* STICKY FILTER BAR */}
      <div className="sticky top-20 z-30 bg-[#fdfbf8]/95 backdrop-blur-md border-b border-[#e8e0d5] flex items-center">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[#8c8480] hover:text-gold text-xs tracking-widest uppercase transition-colors duration-300 group px-3 md:px-6 py-3 border-r border-[#e8e0d5] shrink-0"
        >
          <ArrowLeft size={11} className="group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="hidden sm:inline">Trang chủ</span>
        </Link>

        {/* Filter chips — icon-only on mobile, full text on sm+ */}
        <div className="flex items-center gap-2 py-3 px-3 md:px-6 flex-1 min-w-0">
          <MultiDropdown
            label="Danh mục"
            icon={LayoutGrid}
            options={categoryOptions}
            selected={selectedCategories}
            onToggle={toggleCategory}
            onClear={() => setSelectedCategories([])}
          />
          <MultiDropdown
            label="Tag"
            icon={TagIcon}
            options={tagOptions}
            selected={selectedTags}
            onToggle={toggleTag}
            onClear={() => setSelectedTags([])}
          />
          <PriceDropdown value={priceRange} onChange={setPriceRange} />
        </div>

        {/* Count + Sort */}
        <div className="shrink-0 flex items-center gap-3 px-3 md:px-4 py-3 border-l border-[#e8e0d5]">
          <span className="text-[#8c8480] text-xs hidden md:block whitespace-nowrap">
            {filtered.length} sản phẩm
          </span>

          <div ref={sortRef} className="relative">
            <button
              onClick={() => setSortOpen((o) => !o)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#e8e0d5] rounded-full text-xs text-[#8c8480] hover:border-[#2c2c2c] hover:text-[#2c2c2c] transition-colors duration-200"
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
                  className="absolute right-0 top-full mt-1 z-50 bg-[#fdfbf8] border border-[#e8e0d5] rounded-xl shadow-lg overflow-hidden w-44"
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

      {/* PRODUCT GRID */}
      <div className="bg-[#fdfbf8] min-h-[60vh]">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-16 py-12 lg:py-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCategories.join(",")}-${selectedTags.join(",")}-${sort}-${page}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 xl:gap-14"
            >
              {paginated.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          {loading && (
            <div className="flex items-center justify-center py-32">
              <div className="w-px h-16 bg-gradient-to-b from-gold to-transparent animate-pulse" />
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <p className="font-heading text-2xl text-[#2c2c2c]">Không có sản phẩm</p>
              <button
                onClick={() => { setSelectedCategories([]); setSelectedTags([]); setPriceRange([PRICE_MIN, PRICE_MAX]); setPage(1); }}
                className="text-xs tracking-widest uppercase text-gold hover:text-[#2c2c2c] transition-colors"
              >
                Xem tất cả →
              </button>
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-16 mb-4">
              {/* Prev */}
              <button
                onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                disabled={page === 1}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-[#e8e0d5] text-[#8c8480] hover:border-gold hover:text-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <ArrowLeft size={13} />
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const isEllipsis = totalPages > 7 && Math.abs(p - page) > 2 && p !== 1 && p !== totalPages;
                const showEllipsisBefore = p === page - 3 && page > 4;
                const showEllipsisAfter = p === page + 3 && page < totalPages - 3;
                if (isEllipsis && !showEllipsisBefore && !showEllipsisAfter) return null;
                if (showEllipsisBefore || showEllipsisAfter) return (
                  <span key={p} className="w-9 h-9 flex items-center justify-center text-[#8c8480] text-xs">…</span>
                );
                return (
                  <button
                    key={p}
                    onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className={`w-9 h-9 flex items-center justify-center rounded-full text-xs tracking-widest transition-colors duration-200 ${
                      p === page
                        ? "bg-[#2c2c2c] text-[#fdfbf8] border border-[#2c2c2c]"
                        : "border border-[#e8e0d5] text-[#8c8480] hover:border-gold hover:text-gold"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              {/* Next */}
              <button
                onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                disabled={page === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-[#e8e0d5] text-[#8c8480] hover:border-gold hover:text-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <ArrowLeft size={13} className="rotate-180" />
              </button>
            </div>
          )}

          {/* Page info */}
          {totalPages > 1 && (
            <p className="text-center text-[10px] tracking-widest uppercase text-[#8c8480] pb-8">
              Trang {page} / {totalPages} · {filtered.length} sản phẩm
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 justify-center pb-16">
          <div className="h-px w-16 bg-gold/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-gold/40" />
          <div className="h-px w-16 bg-gold/30" />
        </div>
      </div>

      {/* Recently viewed */}
      <RecentlyViewed />
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
