"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export default function CartLink() {
  const { count } = useCart();

  return (
    <Link href="/cart" className="hover:text-[#151814]">
      Cart
      {count > 0 && (
        <span className="ml-1.5 rounded-full bg-[#173B2A] px-1.5 py-0.5 text-[11px] font-semibold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}