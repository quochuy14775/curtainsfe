"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "sonner";
import { LayoutDashboard, ClipboardList, Package, Tag, LogOut, Menu, X } from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Đơn tư vấn", icon: ClipboardList },
  { href: "/admin/products", label: "Sản phẩm", icon: Package },
  { href: "/admin/categories", label: "Phân loại", icon: Tag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen flex bg-[#f4f2ef]">
      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-charcoal flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="px-7 py-7 border-b border-white/10">
          <Link href="/admin/dashboard" onClick={() => setSidebarOpen(false)}>
            <p className="font-heading text-lg text-warm-white">Maison</p>
            <p className="font-heading text-[10px] tracking-[0.3em] text-gold uppercase">Drapé Admin</p>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors duration-200 ${
                  active
                    ? "bg-gold/20 text-gold"
                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-5 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-white/40 hover:text-white/60 transition-colors"
          >
            ↗ Xem trang chủ
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-white/40 hover:text-red-400 transition-colors"
          >
            <LogOut size={14} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="md:hidden flex items-center gap-4 px-5 py-4 bg-warm-white border-b border-linen">
          <button onClick={() => setSidebarOpen(true)} className="text-charcoal">
            <Menu size={20} />
          </button>
          <p className="font-heading text-base text-charcoal">
            {navItems.find((n) => pathname.startsWith(n.href))?.label ?? "Admin"}
          </p>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#2c2c2c",
              color: "#fdfaf6",
              border: "1px solid rgba(201,169,110,0.25)",
              borderRadius: "14px",
              fontFamily: "var(--font-body, sans-serif)",
              fontSize: "13px",
              letterSpacing: "0.01em",
              padding: "14px 18px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            },
          }}
        />
      </div>
    </div>
  );
}
