"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useContactInfo } from "@/lib/useContactInfo";

const WHATSAPP_ICON = (
  <svg viewBox="0 0 24 24" fill="white" width="18" height="18" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export function FloatingContact() {
  const [open, setOpen] = useState(false);
  const contact = useContactInfo();

  const CONTACTS = [
    contact.zaloUrl && {
      label: "Zalo",
      href: contact.zaloUrl,
      bg: "#0068FF",
      icon: <span className="font-bold text-white text-base select-none leading-none">Z</span>,
    },
    contact.whatsappUrl && {
      label: "WhatsApp",
      href: contact.whatsappUrl,
      bg: "#25D366",
      icon: WHATSAPP_ICON,
    },
  ].filter(Boolean) as { label: string; href: string; bg: string; icon: React.ReactNode }[];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
      <AnimatePresence>
        {open &&
          CONTACTS.map((c, i) => (
            <motion.a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.5, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 16 }}
              transition={{ delay: i * 0.07, type: "spring", stiffness: 320, damping: 26 }}
              className="relative w-12 h-12 rounded-full flex items-center justify-center shadow-lg group"
              style={{ backgroundColor: c.bg }}
              aria-label={c.label}
            >
              {c.icon}
              <span className="absolute right-14 whitespace-nowrap text-[10px] tracking-widest uppercase font-medium bg-[#2c2c2c]/90 text-[#fdfbf8] px-2.5 py-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {c.label}
              </span>
            </motion.a>
          ))}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-gold shadow-xl flex items-center justify-center text-[#2c2c2c]"
        aria-label={open ? "Đóng" : "Liên hệ"}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={20} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle size={20} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
