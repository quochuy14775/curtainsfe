"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Check, Truck, RotateCcw } from "lucide-react";
import type { ProductWithCategory } from "@/lib/data";
import { useCartStore } from "@/lib/cart-store";

const tagColor: Record<string, string> = {
  Bestseller: "bg-charcoal text-[#fdfbf8]",
  Mới: "bg-gold text-charcoal",
  Limited: "bg-stone-600 text-white",
  Hot: "bg-red-700 text-white",
  Smart: "bg-blue-800 text-white",
};

const GALLERY_VIEWS = [
  { label: "Chính diện", angle: "160deg", stripeOp: 0.2 },
  { label: "Góc nghiêng", angle: "220deg", stripeOp: 0.28 },
  { label: "Ánh sáng bên", angle: "60deg", stripeOp: 0.15 },
  { label: "Chi tiết vải", angle: "105deg", stripeOp: 0.35 },
];

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
  const inView = useInView(relatedRef, { once: true, margin: "-80px" });

  const [activeView, setActiveView] = useState(0);
  const [activeTab, setActiveTab] = useState<TabId>("specs");
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-warm-white pt-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-stone text-xs tracking-widest uppercase hover:text-charcoal transition-colors duration-200"
        >
          <ArrowLeft size={13} />
          Trang chủ
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
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-linen">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeView}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(${GALLERY_VIEWS[activeView].angle}, ${product.color}33 0%, ${product.color}88 40%, ${product.color}cc 100%)`,
                  }}
                />
              </AnimatePresence>

              {/* Fabric texture */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  opacity: GALLERY_VIEWS[activeView].stripeOp,
                  backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(0,0,0,0.08) 4px, rgba(0,0,0,0.08) 5px)`,
                }}
              />
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,0.08) 4px, rgba(0,0,0,0.08) 5px)`,
                }}
              />

              {/* View label */}
              <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm text-white/80 text-[9px] tracking-widest uppercase px-2 py-1 rounded">
                {GALLERY_VIEWS[activeView].label}
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
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {GALLERY_VIEWS.map((view, i) => (
                <button
                  key={i}
                  onClick={() => setActiveView(i)}
                  className={`relative aspect-[3/2] rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    activeView === i
                      ? "border-gold scale-[1.03] shadow-md"
                      : "border-transparent opacity-60 hover:opacity-90"
                  }`}
                  aria-label={view.label}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(${view.angle}, ${product.color}44 0%, ${product.color}bb 100%)`,
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      opacity: view.stripeOp,
                      backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px)`,
                    }}
                  />
                  <span className="absolute inset-0 flex items-end justify-center pb-1">
                    <span className="text-white/70 text-[8px] tracking-wide">{view.label}</span>
                  </span>
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
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-stone text-[10px] tracking-widest uppercase mb-1">Chất liệu</p>
                        <p className="font-heading text-charcoal text-sm">{product.material}</p>
                      </div>
                      <div>
                        <p className="text-stone text-[10px] tracking-widest uppercase mb-1">Rộng</p>
                        <p className="font-heading text-charcoal text-sm">{product.width}</p>
                      </div>
                      <div>
                        <p className="text-stone text-[10px] tracking-widest uppercase mb-1">Dài</p>
                        <p className="font-heading text-charcoal text-sm">{product.drop}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-linen">
                      <div>
                        <p className="text-stone text-[10px] tracking-widests uppercase mb-1">Xuất xứ</p>
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
              <a
                href="/#contact"
                className="flex-1 py-4 border border-charcoal text-charcoal text-xs tracking-widest uppercase hover:border-gold hover:text-gold transition-colors duration-300 rounded-full text-center"
              >
                Tư vấn miễn phí
              </a>
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
    </div>
  );
}
