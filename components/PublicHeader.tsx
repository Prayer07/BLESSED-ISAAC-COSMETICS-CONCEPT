"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "./SiteHeader";

export default function PublicHeader() {
  const pathname = usePathname();

  const hidden = ["/admin", "/login"].some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  if (hidden) return null;

  return <SiteHeader />;
}