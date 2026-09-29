import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { UPLOAD_DIR } from "@/lib/upload";

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const safe = path.basename(filename); // blocks ../ tricks
  const type = MIME[safe.split(".").pop() ?? ""];
  if (!type) return new NextResponse("Not found", { status: 404 });

  try {
    const file = await readFile(path.join(UPLOAD_DIR, safe));
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}