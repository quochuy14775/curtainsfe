"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { CheckCircle, ChevronDown } from "lucide-react";
import { categories } from "@/lib/data";

const CATEGORY_OPTIONS = [
  { value: "", label: "Chọn loại rèm..." },
  ...categories.map((c) => ({ value: c.id, label: c.title })),
  { value: "other", label: "Khác / Chưa xác định" },
];

function CustomSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
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

  const selected = CATEGORY_OPTIONS.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between border-b py-3 text-sm transition-colors duration-200 outline-none ${
          open ? "border-gold" : "border-linen hover:border-stone/40"
        } ${value ? "text-charcoal" : "text-stone/50"}`}
      >
        <span>{selected?.label ?? "Chọn loại rèm..."}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-stone shrink-0 ml-2"
        >
          <ChevronDown size={14} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "top" }}
            className="absolute z-30 top-full left-0 right-0 mt-1 bg-warm-white border border-linen rounded-xl shadow-xl overflow-hidden"
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 ${
                    opt.value === value
                      ? "text-gold bg-gold/5"
                      : opt.value === ""
                      ? "text-stone/50"
                      : "text-charcoal hover:bg-cream hover:text-gold"
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
  );
}

type FormState = {
  name: string;
  phone: string;
  email: string;
  category: string;
  note: string;
};

const initialForm: FormState = { name: "", phone: "", email: "", category: "", note: "" };

export function ContactBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const field = (key: keyof FormState) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  };

  const inputCls =
    "w-full bg-transparent border-b border-linen focus:border-gold outline-none py-3 text-charcoal placeholder:text-stone/50 text-sm transition-colors duration-200";

  return (
    <section id="contact" ref={ref} className="py-28 bg-cream">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        {/* Heading */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-gold text-xs tracking-[0.4em] uppercase mb-6"
          >
            Tư vấn miễn phí
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-4xl md:text-6xl text-charcoal leading-tight mb-6"
          >
            Không Gian Đẹp
            <br />
            <em className="text-gold not-italic">Bắt Đầu Từ Đây</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-stone text-base leading-relaxed max-w-lg mx-auto"
          >
            Đội ngũ chuyên gia của chúng tôi sẵn sàng đến tận nhà tư vấn, đo đạc và lắp đặt miễn phí trong nội thành TP.HCM.
          </motion.p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="bg-warm-white rounded-2xl p-8 md:p-12 shadow-sm"
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center justify-center gap-5 py-12 text-center"
              >
                <CheckCircle size={48} className="text-gold" />
                <h3 className="font-heading text-2xl text-charcoal">Cảm ơn bạn!</h3>
                <p className="text-stone text-sm max-w-sm leading-relaxed">
                  Chúng tôi đã nhận được yêu cầu tư vấn. Đội ngũ sẽ liên hệ với bạn trong vòng <strong>24 giờ</strong>.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm(initialForm); }}
                  className="mt-2 text-xs tracking-widest uppercase text-gold hover:text-charcoal transition-colors duration-200"
                >
                  Gửi yêu cầu khác →
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-stone text-[10px] tracking-widest uppercase mb-2">
                      Họ và tên <span className="text-gold">*</span>
                    </label>
                    <input
                      {...field("name")}
                      required
                      placeholder="Nguyễn Văn A"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-stone text-[10px] tracking-widest uppercase mb-2">
                      Số điện thoại <span className="text-gold">*</span>
                    </label>
                    <input
                      {...field("phone")}
                      required
                      type="tel"
                      placeholder="0901 234 567"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-stone text-[10px] tracking-widest uppercase mb-2">
                      Email
                    </label>
                    <input
                      {...field("email")}
                      type="email"
                      placeholder="email@example.com"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-stone text-[10px] tracking-widest uppercase mb-2">
                      Loại rèm quan tâm
                    </label>
                    <CustomSelect
                      value={form.category}
                      onChange={(v) => setForm((f) => ({ ...f, category: v }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone text-[10px] tracking-widest uppercase mb-2">
                    Yêu cầu thêm
                  </label>
                  <textarea
                    {...field("note")}
                    rows={3}
                    placeholder="Kích thước cửa sổ, phong cách nội thất, ngân sách dự kiến..."
                    className={`${inputCls} resize-none`}
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-12 py-4 bg-charcoal text-warm-white text-xs tracking-widest uppercase hover:bg-gold transition-colors duration-300 rounded-full disabled:opacity-60"
                  >
                    {loading ? "Đang gửi..." : "Gửi yêu cầu tư vấn"}
                  </button>
                  <div className="flex flex-col sm:flex-row gap-3 sm:ml-4">
                    <a href="tel:+84901234567" className="text-xs tracking-widest uppercase text-stone hover:text-charcoal transition-colors text-center">
                      Gọi ngay: 0901 234 567
                    </a>
                    <span className="hidden sm:block text-linen">|</span>
                    <a href="mailto:hello@maisondrage.vn" className="text-xs tracking-widest uppercase text-stone hover:text-charcoal transition-colors text-center">
                      Email
                    </a>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Divider ornament */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 flex items-center gap-4 justify-center"
        >
          <div className="h-px w-16 bg-gold/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-gold/40" />
          <div className="h-px w-16 bg-gold/30" />
        </motion.div>
      </div>
    </section>
  );
}
