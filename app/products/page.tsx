import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All Products",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const sp = await searchParams;
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q)?.trim() ?? "";

  const products = await prisma.product.findMany({
    where: q ? { name: { contains: q, mode: "insensitive" } } : undefined,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, price: true, image: true },
  });

  return (
    <div className="min-h-screen bg-[#F4F0E6] text-[#151814]">
      {/* <SiteHeader /> */}

      <main className="mx-auto max-w-7xl px-3 py-8 sm:px-5 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {/* <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#315B46]">
              Blessed
            </p> */}
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              All Products
            </h1>
          </div>

          <form action="/products" className="flex w-full gap-2 sm:w-auto">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search products..."
              className="w-full rounded-lg border border-[#D8D3C7] bg-[#FAF8F2] px-3 py-2 text-sm outline-none focus:border-[#315B46] sm:w-72"
            />
            <button className="rounded-lg bg-[#173B2A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#315B46]">
              Search
            </button>
          </form>
        </div>

        <p className="mb-4 text-sm text-[#77776F]">
          {q ? (
            <>
              {products.length} {products.length === 1 ? "result" : "results"}{" "}
              for &ldquo;{q}&rdquo;{" "}
              <Link href="/products" className="ml-1 text-[#315B46] underline">
                Clear
              </Link>
            </>
          ) : (
            <>
              {products.length} {products.length === 1 ? "product" : "products"}
            </>
          )}
        </p>

        {products.length === 0 ? (
          <div className="rounded-xl border border-[#D8D3C7] bg-[#FAF8F2] px-6 py-16 text-center">
            <p className="text-sm text-[#77776F]">
              {q ? "No products match your search." : "No products yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}