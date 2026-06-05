export type Product = {
  id: number;
  name: string;
  material: string;
  price: string;
  tag?: string;
  color: string;
  width: string;
  drop: string;
};

export type Category = {
  id: string;
  title: string;
  subtitle: string;
  count: string;
  bg: string;
  accent: string;
  products: Product[];
};

export type ProductWithCategory = Product & { categoryId: string; categoryTitle: string };

export function getAllProducts(): ProductWithCategory[] {
  return categories.flatMap((cat) =>
    cat.products.map((p) => ({ ...p, categoryId: cat.id, categoryTitle: cat.title }))
  );
}

export function getProductById(id: number): ProductWithCategory | undefined {
  for (const cat of categories) {
    const product = cat.products.find((p) => p.id === id);
    if (product) return { ...product, categoryId: cat.id, categoryTitle: cat.title };
  }
}

export function getRelatedProducts(id: number, limit = 4): ProductWithCategory[] {
  const product = getProductById(id);
  if (!product) return [];
  return categories
    .find((c) => c.id === product.categoryId)
    ?.products.filter((p) => p.id !== id)
    .slice(0, limit)
    .map((p) => ({ ...p, categoryId: product.categoryId, categoryTitle: product.categoryTitle })) ?? [];
}

export const categories: Category[] = [
  {
    id: "luxury-fabric",
    title: "Rèm Vải Luxury",
    subtitle: "Chất liệu nhập khẩu cao cấp",
    count: "48 sản phẩm",
    bg: "from-stone-800 to-stone-700",
    accent: "#c9a96e",
    products: [
      { id: 101, name: "Velvet Bordeaux", material: "Nhung Bỉ", price: "2.850.000", tag: "Bestseller", color: "#6b2d3e", width: "140cm", drop: "270cm" },
      { id: 102, name: "Velvet Midnight Blue", material: "Nhung Bỉ", price: "2.850.000", color: "#1e2d5a", width: "140cm", drop: "270cm" },
      { id: 103, name: "Velvet Sage Green", material: "Nhung Bỉ", price: "2.950.000", tag: "Mới", color: "#4a6741", width: "140cm", drop: "270cm" },
      { id: 104, name: "Brocade Gold Imperial", material: "Gấm dệt thủ công", price: "4.500.000", tag: "Limited", color: "#8b7040", width: "140cm", drop: "280cm" },
      { id: 105, name: "Damask Ivory", material: "Damask Pháp", price: "3.800.000", color: "#c8bfa8", width: "140cm", drop: "260cm" },
      { id: 106, name: "Chenille Terracotta", material: "Chenille cao cấp", price: "2.400.000", color: "#b5522a", width: "140cm", drop: "270cm" },
      { id: 107, name: "Jacquard Cream Pearl", material: "Jacquard Ý", price: "3.200.000", color: "#e8dcc8", width: "140cm", drop: "280cm" },
      { id: 108, name: "Wool Blend Charcoal", material: "Len pha cao cấp", price: "3.600.000", color: "#3d3d3d", width: "140cm", drop: "270cm" },
    ],
  },
  {
    id: "silk",
    title: "Rèm Lụa",
    subtitle: "Sang trọng, mềm mại",
    count: "32 sản phẩm",
    bg: "from-neutral-700 to-neutral-600",
    accent: "#d4c4a8",
    products: [
      { id: 201, name: "Ivory Pearl Silk", material: "Lụa tơ tằm Ý", price: "4.200.000", tag: "Mới", color: "#d4c4a8", width: "140cm", drop: "260cm" },
      { id: 202, name: "Champagne Silk", material: "Lụa tơ tằm Ý", price: "4.200.000", color: "#f0d9a8", width: "140cm", drop: "260cm" },
      { id: 203, name: "Blush Rose Silk", material: "Lụa tơ tằm", price: "3.900.000", color: "#d4a0a0", width: "140cm", drop: "260cm" },
      { id: 204, name: "Silver Mist Silk", material: "Lụa tơ tằm", price: "4.000.000", tag: "Bestseller", color: "#b8bec4", width: "140cm", drop: "260cm" },
      { id: 205, name: "Deep Teal Silk", material: "Lụa Thái Lan", price: "3.600.000", color: "#2d6e6e", width: "140cm", drop: "260cm" },
      { id: 206, name: "Satin Blanc", material: "Satin lụa Pháp", price: "5.200.000", tag: "Limited", color: "#f5f0ea", width: "140cm", drop: "280cm" },
    ],
  },
  {
    id: "roller",
    title: "Rèm Cuốn",
    subtitle: "Hiện đại, tiện dụng",
    count: "64 sản phẩm",
    bg: "from-zinc-800 to-zinc-700",
    accent: "#c9a96e",
    products: [
      { id: 301, name: "Blackout White", material: "Vải blackout 100%", price: "850.000", tag: "Bestseller", color: "#f5f0ea", width: "Tùy chỉnh", drop: "Tùy chỉnh" },
      { id: 302, name: "Blackout Cream", material: "Vải blackout 100%", price: "850.000", color: "#e8dcc8", width: "Tùy chỉnh", drop: "Tùy chỉnh" },
      { id: 303, name: "Blackout Charcoal", material: "Vải blackout 100%", price: "900.000", color: "#3d3d3d", width: "Tùy chỉnh", drop: "Tùy chỉnh" },
      { id: 304, name: "Sunscreen 5%", material: "Vải sunscreen lọc UV", price: "1.100.000", tag: "Mới", color: "#c4b49a", width: "Tùy chỉnh", drop: "Tùy chỉnh" },
      { id: 305, name: "Sunscreen 10%", material: "Vải sunscreen lọc UV", price: "1.050.000", color: "#b8a888", width: "Tùy chỉnh", drop: "Tùy chỉnh" },
      { id: 306, name: "Day & Night Duo", material: "Zebra / Lớp đôi", price: "1.350.000", tag: "Hot", color: "#8c8480", width: "Tùy chỉnh", drop: "Tùy chỉnh" },
      { id: 307, name: "Motorized Smart", material: "Blackout + Motor tự động", price: "2.800.000", tag: "Smart", color: "#2c2c2c", width: "Tùy chỉnh", drop: "Tùy chỉnh" },
    ],
  },
  {
    id: "rainbow",
    title: "Rèm Cầu Vồng",
    subtitle: "Màu sắc phong phú",
    count: "55 sản phẩm",
    bg: "from-stone-700 to-stone-600",
    accent: "#e8d5b0",
    products: [
      { id: 401, name: "Zebra Classic White", material: "Vải zebra cao cấp", price: "1.200.000", tag: "Bestseller", color: "#f0ebe4", width: "Tùy chỉnh", drop: "Tùy chỉnh" },
      { id: 402, name: "Zebra Beige", material: "Vải zebra cao cấp", price: "1.200.000", color: "#d4c4a8", width: "Tùy chỉnh", drop: "Tùy chỉnh" },
      { id: 403, name: "Zebra Slate Grey", material: "Vải zebra cao cấp", price: "1.250.000", color: "#8c8480", width: "Tùy chỉnh", drop: "Tùy chỉnh" },
      { id: 404, name: "Rainbow Pastel Pink", material: "Vải cầu vồng Hàn Quốc", price: "1.100.000", tag: "Mới", color: "#e8b4b4", width: "Tùy chỉnh", drop: "Tùy chỉnh" },
      { id: 405, name: "Rainbow Sky Blue", material: "Vải cầu vồng Hàn Quốc", price: "1.100.000", color: "#a4c4d8", width: "Tùy chỉnh", drop: "Tùy chỉnh" },
      { id: 406, name: "Rainbow Sage", material: "Vải cầu vồng Hàn Quốc", price: "1.100.000", color: "#a4b89c", width: "Tùy chỉnh", drop: "Tùy chỉnh" },
      { id: 407, name: "Gradient Sunset", material: "Vải gradient đặc biệt", price: "1.600.000", tag: "Limited", color: "#c87941", width: "Tùy chỉnh", drop: "Tùy chỉnh" },
    ],
  },
];
