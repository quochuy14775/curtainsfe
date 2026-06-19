// ─── Entity ──────────────────────────────────────────────────────────────────

export type Category = {
  id: number;
  title: string;
  subtitle: string | null;
  isActived: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
};

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export type CategoryResponse = {
  id: number;
  title: string;
  subtitle: string | null;
  productCount: number;
  imageUrl: string | null;
  coverImage: string | null;
};

export type CategoryRequest = {
  title: string;
  subtitle?: string;
  imageUrl?: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

export const CATEGORY_ACCENT_COLORS = [
  "#c9a96e",
  "#e8a0a0",
  "#7eb8d4",
  "#8cc9a0",
  "#b8a0d4",
] as const;

export function getCategoryAccent(id: number): string {
  return CATEGORY_ACCENT_COLORS[id % CATEGORY_ACCENT_COLORS.length];
}
