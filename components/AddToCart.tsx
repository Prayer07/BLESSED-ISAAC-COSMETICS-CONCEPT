"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { orderLink } from "@/lib/site";

type Props = {
  product: { id: string; name: string; price: number; image: string; inStock: boolean };
};

export default function AddToCart({ product }: Props) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product.inStock) {
    return (
      <button
        disabled
        className="mt-6 w-full cursor-not-allowed rounded-lg bg-[#D8D3C7] px-6 py-3 text-sm font-semibold text-[#77776F]"
      >
        Out of stock
      </button>
    );
  }

  function change(n: number) {
    setQty((q) => Math.max(1, Math.min(99, q + n)));
    setAdded(false);
  }

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Quantity</span>
        <div className="flex items-center rounded-lg border border-[#D8D3C7] bg-white">
          <button onClick={() => change(-1)} className="px-3 py-1.5 text-lg" aria-label="Decrease">
            −
          </button>
          <span className="min-w-8 text-center text-sm font-semibold">{qty}</span>
          <button onClick={() => change(1)} className="px-3 py-1.5 text-lg" aria-label="Increase">
            +
          </button>
        </div>
      </div>

      <button
        onClick={() => {
          add(
            { id: product.id, name: product.name, price: product.price, image: product.image },
            qty
          );
          setAdded(true);
        }}
        className="w-full rounded-lg bg-[#173B2A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#315B46]"
      >
        {added ? "Added ✓" : "Add to cart"}
      </button>

      {added && (
        <Link href="/cart" className="block text-center text-sm text-[#315B46] underline">
          View cart
        </Link>
      )}

      <a
        href={orderLink([{ id: product.id, name: product.name, price: product.price, qty }])}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center rounded-lg bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1EBE5A]"
      >
        Order now on WhatsApp
      </a>
    </div>
  );
}