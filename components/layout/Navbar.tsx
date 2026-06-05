"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, ShoppingBag, Sun, Moon } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { SearchDialog } from "@/components/sections/SearchDialog";
import { useTheme } from "@/components/providers/ThemeProvider";

const links = [
  { label: "Bộ sưu tập", href: "#collections" },
  { label: "Sản phẩm", href: "#products" },
  { label: "Về chúng tôi", href: "#about" },
  { label: "Liên hệ", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { items, openCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    setMounted(true);
    useCartStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const cartCount = mounted ? items.reduce((sum, i) => sum + i.quantity, 0) : 0;

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-warm-white/95 dark:bg-[#1a1917]/95 backdrop-blur-md shadow-sm border-b border-linen"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex flex-col leading-none">
            <span className="font-heading text-xl font-semibold tracking-wide text-charcoal">
              Maison
            </span>
            <span className="font-heading text-xs tracking-[0.3em] text-gold uppercase">
              Drapé
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm tracking-widest uppercase text-stone hover:text-charcoal transition-colors duration-300 group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 text-stone hover:text-charcoal transition-colors group"
              aria-label="Tìm kiếm"
            >
              <Search size={16} />
              <span className="text-xs text-stone/50 border border-linen rounded px-1.5 py-0.5 group-hover:border-stone transition-colors hidden lg:inline">
                ⌘K
              </span>
            </button>

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={toggle}
                className="text-stone hover:text-charcoal transition-colors"
                aria-label={theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative text-stone hover:text-charcoal transition-colors"
              aria-label="Giỏ hàng"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2">
                  <span className="absolute inset-0 rounded-full bg-gold animate-ping opacity-60" />
                  <span className="relative flex w-5 h-5 rounded-full bg-gold text-[#2c2c2c] text-[9px] items-center justify-center font-bold">
                    {cartCount}
                  </span>
                </span>
              )}
            </button>

            <Link
              href="#products"
              className="px-6 py-2.5 bg-charcoal text-[#fdfbf8] text-xs tracking-widest uppercase hover:bg-gold transition-colors duration-300 rounded-full"
            >
              Mua ngay
            </Link>
          </div>

          {/* Mobile: search + theme + cart + hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-stone hover:text-charcoal transition-colors"
              aria-label="Tìm kiếm"
            >
              <Search size={18} />
            </button>
            {mounted && (
              <button
                onClick={toggle}
                className="text-stone hover:text-charcoal transition-colors"
                aria-label={theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}
            <button
              onClick={openCart}
              className="relative text-stone hover:text-charcoal transition-colors"
              aria-label="Giỏ hàng"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2">
                  <span className="absolute inset-0 rounded-full bg-gold animate-ping opacity-60" />
                  <span className="relative flex w-5 h-5 rounded-full bg-gold text-[#2c2c2c] text-[9px] items-center justify-center font-bold">
                    {cartCount}
                  </span>
                </span>
              )}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex flex-col gap-1.5 p-2"
              aria-label="Menu"
            >
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="block w-6 h-px bg-charcoal origin-center"
              />
              <motion.span
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block w-6 h-px bg-charcoal"
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className="block w-6 h-px bg-charcoal origin-center"
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-warm-white dark:bg-[#1a1917] flex flex-col items-center justify-center gap-8"
          >
            {links.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-heading text-3xl text-charcoal hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
