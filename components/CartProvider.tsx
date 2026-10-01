"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  ready: boolean;
  add: (p: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const KEY = "blessed_isaac_cart";
const clamp = (n: number) => Math.max(1, Math.min(99, n));
const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  const value: CartCtx = {
    items,
    ready,
    count: items.reduce((s, i) => s + i.qty, 0),
    add: (p, qty = 1) =>
      setItems((prev) =>
        prev.some((i) => i.id === p.id)
          ? prev.map((i) => (i.id === p.id ? { ...i, qty: clamp(i.qty + qty) } : i))
          : [...prev, { ...p, qty: clamp(qty) }]
      ),
    setQty: (id, qty) =>
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: clamp(qty) } : i))),
    remove: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
    clear: () => setItems([]),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}