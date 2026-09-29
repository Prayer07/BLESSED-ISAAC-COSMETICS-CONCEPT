import ProductsManager from "@/components/ProductsManager";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, price: true, image: true },
  });

  return <ProductsManager products={products} />;
}