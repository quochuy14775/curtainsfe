"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingBag, Check, Truck, RotateCcw, ZoomIn } from "lucide-react";
import type { ProductWithCategory } from "@/lib/data";
import { useCartStore } from "@/lib/cart-store";
import { useRecentlyViewed } from "@/lib/recently-viewed-store";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
import { RecentlyViewed } from "@/components/sections/RecentlyViewed";

const tagColor: Record<string, string> = {
  Bestseller: "bg-charcoal text-[#fdfbf8]",
  Mới: "bg-gold text-charcoal",
  Limited: "bg-stone-600 text-white",
  Hot: "bg-red-700 text-white",
  Smart: "bg-blue-800 text-white",
};

const PLACEHOLDER = "/placeholder-curtain.png";

const TABS = [
  { id: "specs", label: "Thông số" },
  { id: "desc", label: "Mô tả" },
  { id: "policy", label: "Chính sách" },
] as const;
type TabId = (typeof TABS)[number]["id"];

type Props = {
  product: ProductWithCategory;
  related: ProductWithCategory[];
};

export function ProductDetailClient({ product, related }: Props) {
  const { addItem } = useCartStore();
  const relatedRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const inView = useInView(relatedRef, { once: true, margin: "-80px" });

  const galleryViews = [
    { label: "Chính diện", src: product.imageFront  || PLACEHOLDER },
    { label: "Góc trái",   src: product.imageLeft   || PLACEHOLDER },
    { label: "Góc phải",   src: product.imageRight  || PLACEHOLDER },
    { label: "Chi tiết",   src: product.imageDetail || PLACEHOLDER },
  ].filter((v) => v.src !== PLACEHOLDER || product.imageFront == null);

  const [activeView, setActiveView] = useState(0);
  const [activeTab, setActiveTab] = useState<TabId>("specs");
  const [added, setAdded] = useState(false);
  // Lens kính lúp soi chất liệu vải — vị trí theo % để scale mọi kích thước
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null);

  const aspectRatio = 0.80;
  const currentAspectRatio = aspectRatio;

  // Ghi nhận sản phẩm đã xem
  useEffect(() => {
    useRecentlyViewed.persist.rehydrate();
    useRecentlyViewed.getState().add(product.id);
  }, [product.id]);

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleLensMove = (e: React.MouseEvent) => {
    const rect = galleryRef.current?.getBoundingClientRect();
    if (!rect) return;
    setLens({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div className="min-h-screen bg-warm-white pt-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-stone text-xs tracking-widest uppercase hover:text-charcoal transition-colors duration-200"
        >
          <ArrowLeft size={13} />
          Sản phẩm
        </Link>
      </div>

      {/* Main product */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4"
          >
            {/* Main view */}
            <div
              ref={galleryRef}
              onMouseMove={handleLensMove}
              onMouseLeave={() => setLens(null)}
              className="relative rounded-2xl overflow-hidden bg-linen cursor-zoom-in transition-all duration-300"
              style={{ aspectRatio: currentAspectRatio }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeView}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={galleryViews[activeView].src}
                    alt={galleryViews[activeView].label}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 552px"
                    quality={90}
                    className="object-cover object-center"
                    priority={activeView === 0}
                  />
                </motion.div>
              </AnimatePresence>

              {/* View label */}
              <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm text-white/80 text-[9px] tracking-widest uppercase px-2 py-1 rounded">
                {galleryViews[activeView].label}
              </div>

              {/* Tag */}
              {product.tag && (
                <div className={`absolute top-6 left-6 px-3 py-1 text-xs tracking-widest uppercase ${tagColor[product.tag] ?? "bg-charcoal text-[#fdfbf8]"}`}>
                  {product.tag}
                </div>
              )}

              {/* Color chip */}
              <div className="absolute bottom-4 right-4 flex flex-col items-center gap-1.5">
                <div
                  className="w-10 h-10 rounded-full border-4 border-white/60 shadow-xl"
                  style={{ backgroundColor: product.color }}
                />
                <span className="text-white/60 text-[9px] tracking-widest uppercase">{product.color}</span>
              </div>

              {/* Wishlist */}
              <div className="absolute bottom-4 left-4">
                <WishlistButton productId={product.id} />
              </div>

              {/* Zoom hint */}
              {!lens && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/20 backdrop-blur-sm text-white/70 text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full pointer-events-none">
                  <ZoomIn size={10} /> Di chuột soi vải
                </div>
              )}

              {/* Magnifier lens — zoom ảnh thực 3× */}
              {lens && (
                <div
                  className="absolute w-44 h-44 rounded-full pointer-events-none border-2 border-white/70 shadow-2xl overflow-hidden"
                  style={{
                    left: `${lens.x}%`,
                    top: `${lens.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${galleryViews[activeView].src})`,
                      backgroundSize: "300%",
                      backgroundPosition: `${lens.x}% ${lens.y}%`,
                    }}
                  />
                  {/* Sheen kính */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.2) 0%, transparent 42%)",
                    }}
                  />
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/80 text-[8px] tracking-widest uppercase drop-shadow">
                    ×3
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {galleryViews.map((view, i) => (
                <button
                  key={i}
                  onClick={() => setActiveView(i)}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    activeView === i
                      ? "border-gold scale-[1.03] shadow-md"
                      : "border-transparent opacity-60 hover:opacity-90"
                  }`}
                  style={{ aspectRatio: aspectRatio }}
                  aria-label={view.label}
                >
                  <Image
                    src={view.src}
                    alt={view.label}
                    fill
                    sizes="150px"
                    quality={75}
                    className="object-cover object-center"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="flex flex-col justify-center gap-6"
          >
            <div>
              <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">
                {product.categoryTitle}
              </p>
              <h1 className="font-heading text-4xl md:text-5xl text-charcoal leading-tight mb-4">
                {product.name}
              </h1>
              <p className="text-stone text-sm leading-relaxed">
                Chất liệu {product.material} — được tuyển chọn kỹ càng để mang lại vẻ đẹp bền vững và sang trọng cho không gian sống của bạn.
              </p>
            </div>

            {/* Tabs */}
            <div>
              <div className="flex gap-6 border-b border-linen">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 text-[11px] tracking-widest uppercase relative transition-colors duration-200 ${
                      activeTab === tab.id ? "text-charcoal" : "text-stone hover:text-charcoal"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.span
                        layoutId="tab-indicator"
                        className="absolute bottom-0 left-0 right-0 h-px bg-gold"
                      />
                    )}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "specs" && (
                  <motion.div
                    key="specs"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="pt-5"
                  >
                    <div className="grid grid-cols-2 gap-x-8 gap-y-5 sm:flex sm:gap-8">
                      <div>
                        <p className="text-stone text-[10px] tracking-widest uppercase mb-1">Chất liệu</p>
                        <p className="font-heading text-charcoal text-sm">{product.material}</p>
                      </div>
                      <div>
                        <p className="text-stone text-[10px] tracking-widest uppercase mb-1">Xuất xứ</p>
                        <p className="font-heading text-charcoal text-sm">Nhập khẩu</p>
                      </div>
                      <div>
                        <p className="text-stone text-[10px] tracking-widest uppercase mb-1">Giặt</p>
                        <p className="font-heading text-charcoal text-sm">Giặt khô</p>
                      </div>
                      <div>
                        <p className="text-stone text-[10px] tracking-widest uppercase mb-1">Đơn vị</p>
                        <p className="font-heading text-charcoal text-sm">m²</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "desc" && (
                  <motion.div
                    key="desc"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="pt-5 space-y-3"
                  >
                    <p className="text-stone text-sm leading-relaxed">
                      {product.material} là chất liệu cao cấp được nhập khẩu và tuyển chọn kỹ lưỡng, mang đến cảm giác mềm mại, thoáng mát và sang trọng cho không gian nội thất của bạn.
                    </p>
                    <ul className="space-y-2">
                      {[
                        "Chống phai màu, bền màu theo thời gian",
                        "Cản sáng tốt, phù hợp phòng ngủ & phòng khách",
                        "Dễ vệ sinh, ít nhăn",
                        "Tương thích với hầu hết hệ thanh treo tiêu chuẩn",
                      ].map((feat) => (
                        <li key={feat} className="flex items-start gap-2 text-stone text-sm">
                          <span className="text-gold mt-0.5 shrink-0">·</span>
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {activeTab === "policy" && (
                  <motion.div
                    key="policy"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="pt-5 space-y-4"
                  >
                    {[
                      {
                        icon: <Check size={14} />,
                        title: "Bảo hành 12 tháng",
                        desc: "Lỗi kỹ thuật do nhà sản xuất được đổi trả miễn phí trong vòng 12 tháng.",
                      },
                      {
                        icon: <Truck size={14} />,
                        title: "Đo đạc & lắp đặt miễn phí",
                        desc: "Nội thành TP.HCM. Ngoại thành liên hệ để được báo giá vận chuyển.",
                      },
                      {
                        icon: <RotateCcw size={14} />,
                        title: "Đổi trả trong 7 ngày",
                        desc: "Sản phẩm chưa qua sử dụng, còn nguyên tag được đổi trả trong vòng 7 ngày.",
                      },
                    ].map((item) => (
                      <div key={item.title} className="flex gap-3">
                        <span className="text-gold mt-0.5 shrink-0">{item.icon}</span>
                        <div>
                          <p className="text-charcoal text-xs font-medium tracking-wide mb-0.5">{item.title}</p>
                          <p className="text-stone text-xs leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-3xl text-charcoal">{product.price}₫</span>
              <span className="text-stone text-sm">/m²</span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-charcoal text-[#fdfbf8] text-xs tracking-widest uppercase hover:bg-gold transition-colors duration-300 rounded-full"
              >
                {added ? (
                  <>
                    <Check size={14} />
                    Đã thêm
                  </>
                ) : (
                  <>
                    <ShoppingBag size={14} />
                    Thêm vào giỏ
                  </>
                )}
              </button>
              <Link
                href="/#contact"
                className="flex-1 py-4 border border-charcoal text-charcoal text-xs tracking-widest uppercase hover:border-gold hover:text-gold transition-colors duration-300 rounded-full text-center"
              >
                Tư vấn miễn phí
              </Link>
            </div>

            <p className="text-stone text-xs">
              Đo đạc và lắp đặt miễn phí trong nội thành TP.HCM · Bảo hành 100%
            </p>
          </motion.div>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="bg-cream py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <motion.div
              ref={relatedRef}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="mb-10"
            >
              <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">Cùng bộ sưu tập</p>
              <h2 className="font-heading text-3xl text-charcoal">Sản Phẩm Liên Quan</h2>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {related.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="group cursor-pointer"
                >
                  <Link href={`/products/${p.id}`}>
                    <div className="relative aspect-[3/4] mb-3 overflow-hidden bg-linen rounded-xl">
                      <div
                        className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                        style={{
                          background: `linear-gradient(160deg, ${p.color}44 0%, ${p.color}99 50%, ${p.color}dd 100%)`,
                        }}
                      />
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)`,
                        }}
                      />
                      {p.tag && (
                        <span className={`absolute top-2 left-2 px-2 py-0.5 text-[9px] tracking-widest uppercase ${tagColor[p.tag] ?? "bg-charcoal text-[#fdfbf8]"}`}>
                          {p.tag}
                        </span>
                      )}
                      <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-charcoal/90 py-2.5 text-center">
                        <button
                          onClick={(e) => { e.preventDefault(); addItem(p); }}
                          className="text-[#fdfbf8] text-[9px] tracking-widest uppercase w-full"
                        >
                          Thêm vào giỏ
                        </button>
                      </div>
                    </div>
                    <p className="text-gold text-[9px] tracking-widest uppercase mb-0.5 truncate">{p.material}</p>
                    <h3 className="font-heading text-sm text-charcoal group-hover:text-gold transition-colors duration-300 line-clamp-2">
                      {p.name}
                    </h3>
                    <p className="text-charcoal text-xs font-medium mt-1">{p.price}₫</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recently viewed */}
      <RecentlyViewed excludeId={product.id} />
    </div>
  );
}
