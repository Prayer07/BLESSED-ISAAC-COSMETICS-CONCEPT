import Link from "next/link";
import { formatNaira } from "@/lib/format";
import type { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group block overflow-hidden rounded-xl border border-[#DED9CE] bg-[#FAF8F2] transition duration-200 hover:-translate-y-0.5 hover:border-[#315B46] hover:shadow-[0_8px_24px_rgba(23,59,42,0.10)]"
    >
      <div className="relative overflow-hidden bg-[#E8E3D8]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className={`aspect-square w-full object-cover transition duration-300 group-hover:scale-[1.03] ${
            product.inStock ? "" : "opacity-60 grayscale"
          }`}
        />
        {!product.inStock && (
          <span className="absolute left-2 top-2 rounded-full bg-[#151814] px-2.5 py-1 text-[11px] font-semibold text-white">
            Out of stock
          </span>
        )}
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="truncate text-sm font-medium text-[#242620]">
          {product.name}
        </h3>
        <p className="mt-1.5 text-base font-bold text-[#173B2A] sm:text-lg">
          {formatNaira(product.price)}
        </p>
      </div>
    </Link>
  );
}