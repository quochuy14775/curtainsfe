"use client";

import { useEffect, useState } from "react";
import { contactService } from "@/services/contactService";
import { DEFAULT_CONTACT, type ContactInfo } from "@/types/contact";

// Cache cấp module: chỉ fetch /contact một lần cho toàn trang, các component dùng chung.
let cache: ContactInfo | null = null;
let inflight: Promise<ContactInfo> | null = null;
const subscribers = new Set<(c: ContactInfo) => void>();

// Trường nào trống/null thì lấy giá trị mặc định.
function withDefaults(data: Partial<ContactInfo> | null): ContactInfo {
  const merged = { ...DEFAULT_CONTACT };
  if (data) {
    (Object.keys(DEFAULT_CONTACT) as (keyof ContactInfo)[]).forEach((key) => {
      const v = data[key];
      if (v != null && String(v).trim() !== "") merged[key] = v as string;
    });
  }
  return merged;
}

function load(): Promise<ContactInfo> {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    inflight = contactService
      .get()
      .then((data) => {
        cache = withDefaults(data);
        subscribers.forEach((fn) => fn(cache!));
        return cache;
      })
      .catch(() => {
        cache = DEFAULT_CONTACT;
        return cache;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

export function useContactInfo(): ContactInfo {
  const [contact, setContact] = useState<ContactInfo>(cache ?? DEFAULT_CONTACT);

  useEffect(() => {
    let alive = true;
    const update = (c: ContactInfo) => {
      if (alive) setContact(c);
    };
    subscribers.add(update);
    load().then(update);
    return () => {
      alive = false;
      subscribers.delete(update);
    };
  }, []);

  return contact;
}
