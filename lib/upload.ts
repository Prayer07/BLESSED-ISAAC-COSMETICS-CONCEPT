import { put, del } from "@vercel/blob";
import { randomUUID } from "crypto";

// Vercel functions reject request bodies over 4.5MB
const MAX_SIZE = 4 * 1024 * 1024;

const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function saveImage(file: File) {
  const ext = TYPES[file.type];
  if (!ext) throw new Error("Only JPG, PNG or WEBP images are allowed");
  if (file.size > MAX_SIZE) throw new Error("Image must be 4MB or less");

  const blob = await put(`products/${randomUUID()}.${ext}`, file, {
    access: "public",
    contentType: file.type,
  });

  return blob.url; // full https URL, stored in Product.image
}

export async function deleteImage(url: string) {
  if (!url.includes("blob.vercel-storage.com")) return;
  await del(url).catch(() => {});
}