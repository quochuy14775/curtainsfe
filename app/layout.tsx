import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ImageProtectionProvider } from "@/components/providers/ImageProtectionProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://curtainsfe.vercel.app"),
  verification: {
    google: "74qbB2yovjS9FFaLNc53q9CzdiUhZT1SqZEMYVbqZ74",
  },
  title: "Ngọc Huệ — Rèm Cửa Cao Cấp",
  description:
    "Khám phá bộ sưu tập rèm cửa cao cấp. Tư vấn tận nhà, lắp đặt chuyên nghiệp.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Ngọc Huệ — Rèm Cửa Cao Cấp",
    description:
      "Khám phá bộ sưu tập rèm cửa cao cấp. Tư vấn tận nhà, lắp đặt chuyên nghiệp.",
    url: "https://curtainsfe.vercel.app",
    siteName: "Ngọc Huệ Rèm Màn",
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-warm-white">
        <ImageProtectionProvider />
        {children}
      </body>
    </html>
  );
}
