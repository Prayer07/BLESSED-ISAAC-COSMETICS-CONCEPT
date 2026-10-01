import { formatNaira } from "@/lib/format";

export const siteConfig = {
  name: "BLESSED ISAAC COSMETICS CONCEPT",
  address: "Kaduna 1 Plaza, Shop AO65/AO66",
  phone: "09161115060",
  // international format for wa.me: no "+", no leading 0
  whatsapp: "2349161115060",
  tiktok: "blessedisaaccosmetics_ng",
  instagram: "blessed_isaac_cosmetics_1",
};

export function whatsappLink(message: string) {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}

type OrderItem = { id: string; name: string; price: number; qty: number };

export function orderLink(items: OrderItem[]) {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const lines = ["Hello, I want to order:", ""];
  items.forEach((i, n) => {
    lines.push(`${n + 1}. *${i.name}* x${i.qty} - ${formatNaira(i.price * i.qty)}`);
    if (base) lines.push(`   ${base}/products/${i.id}`);
  });
  lines.push("", `Total: ${formatNaira(total)}`);

  return whatsappLink(lines.join("\n"));
}