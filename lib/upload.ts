import { put, del } from "@vercel/blob";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export const UPLOAD_DIR = path.join(process.cwd(), "uploads");

const isProd = process.env.NODE_ENV === "production";

// Vercel rejects request bodies over ~4.5MB, so keep the same limit everywhere
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

  const filename = `${randomUUID()}.${ext}`;

  // production: Vercel Blob, returns a full https URL
  if (isProd) {
    const blob = await put(`products/${filename}`, file, {
      access: "public",
      contentType: file.type,
    });
    return blob.url;
  }

  // development: local uploads/ folder, served by /api/uploads/[filename]
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(
    path.join(UPLOAD_DIR, filename),
    Buffer.from(await file.arrayBuffer())
  );
  return `/api/uploads/${filename}`;
}

// decides by the shape of the stored URL, not by environment
export async function deleteImage(url: string) {
  if (url.startsWith("/api/uploads/")) {
    await unlink(path.join(UPLOAD_DIR, path.basename(url))).catch(() => {});
    return;
  }

  if (url.includes("blob.vercel-storage.com")) {
    await del(url).catch(() => {});
  }
}