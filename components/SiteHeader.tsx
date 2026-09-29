import Link from "next/link";
import { siteConfig } from "@/lib/site";

export default function SiteHeader() {
  return (
    <header className="border-b border-[#DED9CE] bg-[#FAF8F2]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-4 sm:px-5 lg:px-8">
        <Link
          href="/"
          className="truncate text-sm font-bold tracking-tight text-[#173B2A] sm:text-lg"
        >
          {siteConfig.name}
        </Link>
        <nav className="flex shrink-0 items-center gap-5 text-sm font-medium text-[#77776F]">
          <Link href="/products" className="hover:text-[#151814]">
            Products
          </Link>
        </nav>
      </div>
    </header>
  );
}