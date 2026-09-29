import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export const UPLOAD_DIR = path.join(process.cwd(), "uploads");

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function saveImage(file: File) {
  const ext = TYPES[file.type];
  if (!ext) throw new Error("Only JPG, PNG or WEBP images are allowed");
  if (file.size > MAX_SIZE) throw new Error("Image must be 5MB or less");

  await mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${randomUUID()}.${ext}`;
  await writeFile(
    path.join(UPLOAD_DIR, filename),
    Buffer.from(await file.arrayBuffer())
  );

  return `/api/uploads/${filename}`;
}

export async function deleteImage(url: string) {
  if (!url.startsWith("/api/uploads/")) return;
  await unlink(path.join(UPLOAD_DIR, path.basename(url))).catch(() => {});
}