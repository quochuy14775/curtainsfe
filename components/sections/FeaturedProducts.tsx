"use client";

import { useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { getAllProducts } from "@/lib/data";
import { useCartStore } from "@/lib/cart-store";

const FEATURED_IDS = [101, 201, 104, 401, 301];
const allProducts = getAllProducts();
const products = FEATURED_IDS.map((id) => allProducts.find((p) => p.id === id)).filter(Boolean) as typeof allProducts;

export function FeaturedProducts() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { addItem } = useCartStore();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section id="products" className="py-28 bg-warm-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <p className="text-gold text-xs tracking-[0.4em] uppercase mb-4">Nổi bật</p>
            <h2 className="font-heading text-4xl md:text-5xl text-charcoal leading-tight">
              Sản Phẩm
              <br />
              <em className="text-stone not-italic">Được Yêu Thích</em>
            </h2>
          </div>

          <div className="flex gap-3">
            <button
              onClick={scrollPrev}
              className="w-12 h-12 border border-linen rounded-full flex items-center justify-center text-stone hover:border-charcoal hover:text-charcoal transition-colors duration-300"
              aria-label="Previous"
            >
              ←
            </button>
            <button
              onClick={scrollNext}
              className="w-12 h-12 border border-linen rounded-full flex items-center justify-center text-stone hover:border-charcoal hover:text-charcoal transition-colors duration-300"
              aria-label="Next"
            >
              →
            </button>
          </div>
        </motion.div>
      </div>

      {/* Carousel */}
      <div ref={emblaRef} className="overflow-hidden pl-6 lg:pl-12 max-w-7xl mx-auto">
        <div className="flex gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex-none w-72 md:w-80 group cursor-pointer"
            >
              {/* Product image area */}
              <Link href={`/products/${product.id}`}>
                <div className="relative aspect-[3/4] mb-5 overflow-hidden bg-linen rounded-xl">
                  <div
                    className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                    style={{
                      background: `linear-gradient(160deg, ${product.color}44 0%, ${product.color}88 50%, ${product.color}cc 100%)`,
                    }}
                  />
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)`,
                    }}
                  />
                  {product.tag && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-charcoal text-warm-white text-xs tracking-widest uppercase">
                      {product.tag}
                    </div>
                  )}
                  <div
                    className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 bg-charcoal/90 py-4 text-center"
                    onClick={(e) => { e.preventDefault(); addItem(product); }}
                  >
                    <span className="text-warm-white text-xs tracking-widest uppercase">
                      Thêm vào giỏ
                    </span>
                  </div>
                </div>
              </Link>

              {/* Info */}
              <div>
                <p className="text-gold text-xs tracking-widest uppercase mb-1">{product.material}</p>
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-heading text-lg text-charcoal mb-2 group-hover:text-gold transition-colors duration-300">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center justify-between">
                  <p className="text-charcoal text-sm font-medium">
                    {product.price}₫<span className="text-stone text-xs ml-1">/m²</span>
                  </p>
                  <div
                    className="w-4 h-4 rounded-full border border-white/50 shadow-sm"
                    style={{ backgroundColor: product.color }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
