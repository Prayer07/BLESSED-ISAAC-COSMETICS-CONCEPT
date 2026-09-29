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

export function orderLink(product: { id: string; name: string; price: number }) {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

  const lines = [
    "Hello, I want to order this product:",
    "",
    `*${product.name}*`,
    `Price: ${formatNaira(product.price)}`,
  ];

  // lets the owner open the exact product (and see the picture)
  if (base) lines.push("", `${base}/products/${product.id}`);

  return whatsappLink(lines.join("\n"));
}