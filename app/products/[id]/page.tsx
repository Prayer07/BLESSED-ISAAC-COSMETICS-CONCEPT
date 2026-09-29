import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/format";
import { orderLink } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    select: { name: true },
  });
  return { title: product ? `${product.name} | Blessed` : "Product not found" };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) notFound();

  return (
    <div className="min-h-screen bg-[#F4F0E6] text-[#151814]">

      <main className="mx-auto max-w-5xl px-3 py-8 sm:px-5 lg:px-8">
        <Link
          href="/products"
          className="mb-6 inline-block text-sm text-[#77776F] hover:text-[#151814]"
        >
          &larr; Back to all products
        </Link>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-[#DED9CE] bg-[#E8E3D8]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              className="aspect-square w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#315B46]">
              Blessed Isaac Cosmetics
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-4 text-3xl font-bold text-[#173B2A]">
              {formatNaira(product.price)}
            </p>

            <a
              href={orderLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1EBE5A]"
            >
              Order on WhatsApp
            </a>
            <p className="mt-3 text-xs text-[#77776F]">
              You&apos;ll be taken to WhatsApp to confirm your order with the seller.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}