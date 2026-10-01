"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";
import SiteFooter from "@/components/SiteFooter";
import { formatNaira } from "@/lib/format";
import { orderLink } from "@/lib/site";
import type { Product } from "@/types/product";

export default function CartPage() {
  const { items, ready, setQty, remove, clear } = useCart();
  const [live, setLive] = useState<Record<string, Product> | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d: { products: Product[] }) => {
        const map: Record<string, Product> = {};
        for (const p of d.products) map[p.id] = p;
        setLive(map);
      })
      .catch(() => {}); // offline: fall back to what the cart saved
  }, []);

  const rows = items.map((i) => {
    const p = live?.[i.id];
    const gone = live !== null && !p;
    const out = !!p && !p.inStock;
    return {
      ...i,
      name: p?.name ?? i.name,
      price: p?.price ?? i.price,
      image: p?.image ?? i.image,
      gone,
      out,
      available: !gone && !out,
    };
  });

  const orderable = rows.filter((r) => r.available);
  const total = orderable.reduce((s, r) => s + r.price * r.qty, 0);

  return (
    <div className="min-h-screen bg-[#F4F0E6] text-[#151814]">
      <main className="mx-auto max-w-3xl px-3 py-8 sm:px-5">
        <h1 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">Your cart</h1>

        {!ready ? null : rows.length === 0 ? (
          <div className="rounded-xl border border-[#D8D3C7] bg-[#FAF8F2] px-6 py-16 text-center">
            <p className="text-sm text-[#77776F]">Your cart is empty.</p>
            <Link
              href="/products"
              className="mt-4 inline-block rounded-lg bg-[#173B2A] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {rows.map((r) => (
                <div
                  key={r.id}
                  className="flex gap-3 rounded-xl border border-[#DED9CE] bg-[#FAF8F2] p-3"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.image}
                    alt={r.name}
                    className={`h-20 w-20 rounded-lg object-cover ${r.available ? "" : "opacity-50 grayscale"}`}
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{r.name}</p>
                    <p className="text-sm font-bold text-[#173B2A]">{formatNaira(r.price)}</p>

                    {!r.available ? (
                      <p className="mt-1 text-xs font-semibold text-red-600">
                        {r.gone ? "No longer available" : "Out of stock"}
                      </p>
                    ) : (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center rounded-lg border border-[#D8D3C7] bg-white">
                          <button onClick={() => setQty(r.id, r.qty - 1)} className="px-2.5 py-1" aria-label="Decrease">
                            −
                          </button>
                          <span className="min-w-6 text-center text-sm font-semibold">{r.qty}</span>
                          <button onClick={() => setQty(r.id, r.qty + 1)} className="px-2.5 py-1" aria-label="Increase">
                            +
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => remove(r.id)}
                    className="self-start text-xs text-[#77776F] hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-[#DED9CE] bg-[#FAF8F2] p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#77776F]">Total</span>
                <span className="text-xl font-bold text-[#173B2A]">{formatNaira(total)}</span>
              </div>

              {orderable.length > 0 ? (
                <a
                  href={orderLink(orderable)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex w-full items-center justify-center rounded-lg bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1EBE5A]"
                >
                  Order on WhatsApp
                </a>
              ) : (
                <p className="mt-4 text-center text-sm text-[#77776F]">
                  Nothing in your cart is available right now.
                </p>
              )}

              <button
                onClick={clear}
                className="mt-3 w-full text-center text-xs text-[#77776F] hover:text-red-600"
              >
                Clear cart
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}