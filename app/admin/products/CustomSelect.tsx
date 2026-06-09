"use client";

import { useState, useRef, useEffect } from "react";
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

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Chọn...",
  label,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={ref} className="relative">
      {label && (
        <label className="block text-stone text-xs tracking-widest uppercase mb-2">
          {label}
        </label>
      )}

      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ backgroundColor: "rgb(245, 240, 234)" }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-between bg-cream/50 border border-linen rounded-lg px-4 py-3 text-charcoal placeholder:text-stone/40 focus:border-gold outline-none transition-colors text-left text-sm"
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

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "top" }}
            className="absolute z-30 top-full left-0 right-0 mt-2 bg-warm-white border border-linen rounded-lg shadow-lg overflow-hidden max-h-60 overflow-y-auto"
          >
            {options.map((opt, idx) => (
              <motion.li
                key={opt.value}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
              >
                <motion.button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  whileHover={{ backgroundColor: "rgb(245, 240, 234)" }}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between group ${
                    opt.value === value
                      ? "bg-gold/10 text-gold font-medium"
                      : "text-charcoal hover:text-gold"
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
                      <Check size={16} />
                    </motion.span>
                  )}
                </motion.button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
