"use client";

import { useEffect } from "react";
import { initImageProtection } from "@/lib/image-protection";

export function ImageProtectionProvider() {
  useEffect(() => {
    initImageProtection();
  }, []);

  return null;
}
