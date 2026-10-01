import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { saveImage, deleteImage } from "@/lib/upload";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ product });
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const form = await req.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const data: { name?: string; price?: number; image?: string; inStock?: boolean } = {};

  const name = form.get("name")?.toString().trim();
  if (name) data.name = name;

  if (form.has("price")) {
    const price = Number(form.get("price"));
    if (!Number.isInteger(price) || price < 0) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }
    data.price = price;
  }

  if (form.has("inStock")) data.inStock = form.get("inStock") === "true";
  
  const image = form.get("image");
  if (image instanceof File && image.size > 0) {
    try {
      data.image = await saveImage(image);
    } catch (e) {
      return NextResponse.json({ error: (e as Error).message }, { status: 400 });
    }
  }

  try {
    const product = await prisma.product.update({ where: { id }, data });
    if (data.image) await deleteImage(existing.image); // remove old one
    return NextResponse.json({ product });
  } catch (e) {
    if (data.image) await deleteImage(data.image);
    if ((e as { code?: string }).code === "P2002") {
      return NextResponse.json(
        { error: "A product with this name already exists" },
        { status: 409 }
      );
    }
    throw e;
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.product.delete({ where: { id } });
  await deleteImage(existing.image);

  return NextResponse.json({ ok: true });
}