import { categories, getAllProducts } from "@/lib/data";
import { EditButton } from "./EditButton";

const TAG_COLOR: Record<string, string> = {
  Bestseller: "bg-charcoal text-warm-white",
  Mới: "bg-gold/20 text-yellow-800",
  Limited: "bg-stone-200 text-stone-700",
  Hot: "bg-red-100 text-red-700",
  Smart: "bg-blue-100 text-blue-700",
};

export default function ProductsPage() {
  const all = getAllProducts();
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-charcoal">Sản phẩm</h1>
          <p className="text-stone text-sm mt-1">{all.length} sản phẩm · {categories.length} danh mục</p>
        </div>
        <span className="text-xs text-stone/50 italic">* Chỉnh sửa sẽ kết nối .NET API sau</span>
      </div>

      {/* Category breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-warm-white rounded-2xl p-5 shadow-sm">
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${cat.bg} mb-3`} />
            <p className="font-heading text-base text-charcoal">{cat.title}</p>
            <p className="text-stone text-xs mt-0.5">{cat.products.length} sản phẩm</p>
          </div>
        ))}
      </div>

      {/* Product table */}
      <div className="bg-warm-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-linen">
                {["ID", "Tên sản phẩm", "Danh mục", "Chất liệu", "Kích thước", "Giá / m²", "Tag", ""].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-[10px] tracking-widest uppercase text-stone font-normal whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-linen">
              {all.map((product) => (
                <tr key={product.id} className="hover:bg-cream/50 transition-colors group">
                  <td className="px-5 py-3.5 text-stone text-xs font-mono">{product.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-lg shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${product.color}66, ${product.color}cc)`,
                        }}
                      />
                      <span className="font-heading text-sm text-charcoal">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-stone text-xs whitespace-nowrap">{product.categoryTitle}</td>
                  <td className="px-5 py-3.5 text-stone text-xs">{product.material}</td>
                  <td className="px-5 py-3.5 text-stone text-xs whitespace-nowrap">{product.width} × {product.drop}</td>
                  <td className="px-5 py-3.5 text-charcoal text-sm font-medium whitespace-nowrap">{product.price}₫</td>
                  <td className="px-5 py-3.5">
                    {product.tag ? (
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium tracking-widest uppercase ${TAG_COLOR[product.tag] ?? "bg-stone-100 text-stone-600"}`}>
                        {product.tag}
                      </span>
                    ) : (
                      <span className="text-stone/30 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <EditButton productId={product.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
