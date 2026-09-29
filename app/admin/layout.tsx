import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { siteConfig } from "@/lib/site";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F4F0E6] text-[#151814]">
      <header className="border-b border-[#DED9CE] bg-[#FAF8F2]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-4 sm:px-5 lg:px-8">
          <div className="min-w-0">
            <p className="truncate text-[11px] font-bold uppercase tracking-[0.2em] text-[#315B46]">
              {siteConfig.name}
            </p>
            <h1 className="text-lg font-bold tracking-tight">Admin Dashboard</h1>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="rounded-lg border border-[#D8D3C7] px-3 py-1.5 text-sm font-medium text-[#77776F] transition hover:bg-[#E8E3D8] hover:text-[#151814]"
            >
              View site
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-3 py-8 sm:px-5 lg:px-8">
        {children}
      </main>
    </div>
  );
}