"use client";

import dynamic from "next/dynamic";

const LoginClient = dynamic(() => import("./LoginClient").then((m) => ({ default: m.LoginClient })), {
  ssr: false,
});

export default function AdminLogin() {
  return <LoginClient />;
}
