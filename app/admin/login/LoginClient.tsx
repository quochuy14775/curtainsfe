"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { authService } from "@/services/authService";

export function LoginClient() {
  const router = useRouter();
  const params = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authService.login(username, password);
      const from = params.get("from") ?? "/admin/dashboard";
      router.push(from);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại.");
      setPassword("");
      passwordRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm bg-warm-white rounded-2xl shadow-sm p-10"
      >
        <div className="mb-8 text-center">
          <p className="font-heading text-2xl text-charcoal">Maison</p>
          <p className="font-heading text-xs tracking-[0.3em] text-gold uppercase">Drapé Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-stone text-[10px] tracking-widest uppercase mb-2">
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              placeholder="admin"
              className="w-full border-b border-linen focus:border-gold outline-none py-3 text-charcoal placeholder:text-stone/40 text-sm transition-colors duration-200 bg-transparent"
            />
          </div>

          <div>
            <label className="block text-stone text-[10px] tracking-widest uppercase mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                ref={passwordRef}
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full border-b border-linen focus:border-gold outline-none py-3 pr-10 text-charcoal placeholder:text-stone/40 text-sm transition-colors duration-200 bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-0 top-3 text-stone hover:text-charcoal transition-colors"
                tabIndex={-1}
              >
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-xs mt-2">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full py-3.5 bg-charcoal text-warm-white text-xs tracking-widest uppercase hover:bg-gold transition-colors duration-300 rounded-full disabled:opacity-50 mt-2"
          >
            {loading ? "Đang kiểm tra..." : "Đăng nhập"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
