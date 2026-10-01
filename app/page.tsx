import Link from "next/link";
import { prisma } from "@/lib/prisma";
import HeroImageBackground from "@/components/HeroImageBackground";
import ProductCard from "@/components/ProductCard";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, name: true, price: true, image: true, inStock: true },
    }),
    prisma.product.count(),
  ]);

  return (
    <div className="min-h-screen bg-[#F4F0E6] text-[#151814]">
      <section className="relative min-h-[500px] overflow-hidden">
        <HeroImageBackground />

        <div className="pointer-events-none absolute inset-0 bg-black/45" />

        <div className="relative mx-auto flex min-h-[500px] max-w-7xl items-center px-3 py-16 sm:px-5 lg:px-8">
          <div className="max-w-xl">

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Quality products,
              <br />
              made for you.
            </h1>

            <p className="mt-5 max-w-md text-sm leading-6 text-white/80 sm:text-base">
              Discover our collection of carefully selected products, made to
              bring quality and value into your everyday life.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-3 py-8 sm:px-5 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#151814] sm:text-3xl">
              Latest Products
            </h2>
          </div>

          <p className="text-xs font-medium text-[#77776F] sm:text-sm">
            {total} {total === 1 ? "product" : "products"}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-xl border border-[#D8D3C7] bg-[#FAF8F2] px-6 py-16 text-center">
            <p className="text-sm text-[#77776F]">
              No products yet. Check back soon.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/products"
                className="inline-block rounded-lg bg-[#173B2A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#315B46]"
              >
                View all products
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}