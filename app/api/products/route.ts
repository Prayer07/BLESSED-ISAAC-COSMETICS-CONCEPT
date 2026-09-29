import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { saveImage, deleteImage } from "@/lib/upload";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const name = form.get("name")?.toString().trim();
  const price = Number(form.get("price"));
  const image = form.get("image");

  if (!name || !Number.isInteger(price) || price < 0) {
    return NextResponse.json(
      { error: "Valid name and price (whole number) are required" },
      { status: 400 }
    );
  }
  if (!(image instanceof File) || image.size === 0) {
    return NextResponse.json({ error: "Image is required" }, { status: 400 });
  }

  let url: string;
  try {
    url = await saveImage(image);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }

  try {
    const product = await prisma.product.create({
      data: { name, price, image: url },
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch (e) {
    await deleteImage(url); // don't leave orphan files
    if ((e as { code?: string }).code === "P2002") {
      return NextResponse.json(
        { error: "A product with this name already exists" },
        { status: 409 }
      );
    }
    throw e;
  }
}