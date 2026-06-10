"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

type DropdownRect = { top: number; left: number; width: number };

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Chọn...",
  label,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rect, setRect] = useState<DropdownRect | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const updateRect = useCallback(() => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setRect({ top: r.bottom + 6, left: r.left, width: r.width });
  }, []);

  const open = () => {
    updateRect();
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleClose = (e: MouseEvent) => {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        dropdownRef.current?.contains(e.target as Node)
      ) return;
      setIsOpen(false);
    };
    const handleScroll = () => { updateRect(); };
    document.addEventListener("mousedown", handleClose);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClose);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen, updateRect]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative">
      {label && (
        <label className="block text-stone text-xs tracking-widest uppercase mb-2">
          {label}
        </label>
      )}

      <motion.button
        ref={triggerRef}
        type="button"
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        whileHover={{ backgroundColor: "rgb(245, 240, 234)" }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-between bg-cream/50 border border-linen rounded-lg px-4 py-3 text-sm text-left outline-none transition-colors"
      >
        <span className={selectedOption ? "text-charcoal" : "text-stone/40"}>
          {selectedOption?.label || placeholder}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-stone shrink-0"
        >
          <ChevronDown size={16} />
        </motion.span>
      </motion.button>

      {isOpen && rect && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          <motion.ul
            ref={dropdownRef}
            key="dropdown"
            initial={{ opacity: 0, y: -6, scaleY: 0.96 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.96 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              top: rect.top,
              left: rect.left,
              width: rect.width,
              transformOrigin: "top",
              zIndex: 9999,
            }}
            className="bg-warm-white border border-linen rounded-xl shadow-xl overflow-hidden max-h-56 overflow-y-auto"
          >
            {options.map((opt, idx) => (
              <motion.li
                key={opt.value}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.02 }}
              >
                <motion.button
                  type="button"
                  onClick={() => { onChange(opt.value); setIsOpen(false); }}
                  whileHover={{ backgroundColor: "rgb(245, 240, 234)" }}
                  className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between transition-colors ${
                    opt.value === value ? "bg-gold/10 text-gold font-medium" : "text-charcoal"
                  } ${opt.value === "" ? "text-stone/50" : ""}`}
                >
                  <span>{opt.label}</span>
                  {opt.value === value && (
                    <motion.span
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="text-gold"
                    >
                      <Check size={14} />
                    </motion.span>
                  )}
                </motion.button>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
