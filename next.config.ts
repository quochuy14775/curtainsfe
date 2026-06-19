import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90, 100],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  // Proxy mọi request /api/* sang backend (Render) ở phía server.
  // Nhờ vậy browser chỉ thấy domain Vercel => same-origin, cookie thành
  // first-party, không còn lỗi CORS / third-party cookie.
  async rewrites() {
    const backend = process.env.BACKEND_URL ?? "http://localhost:5245";
    return [
      {
        source: "/api/:path*",
        destination: `${backend}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
