import { siteConfig } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="mt-1 border-t border-[#DED9CE] bg-[#FAF8F2]">
      <div className="mx-auto grid max-w-7xl gap-6 px-3 py-8 text-sm text-[#77776F] sm:grid-cols-3 sm:px-5 lg:px-8">
        <div>
          <p className="font-bold tracking-tight text-[#173B2A]">
            {siteConfig.name}
          </p>
          <p className="mt-2">{siteConfig.address}</p>
        </div>

        <div>
          <p className="font-semibold text-[#151814]">Contact</p>
          <a
            href={`tel:+${siteConfig.whatsapp}`}
            className="mt-2 block hover:text-[#151814]"
          >
            {siteConfig.phone}
          </a>
        </div>

        <div>
          <p className="font-semibold text-[#151814]">Follow us</p>
          <a
            href={`https://www.instagram.com/${siteConfig.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block hover:text-[#151814]"
          >
            Instagram
          </a>
          <a
            href={`https://www.tiktok.com/@${siteConfig.tiktok}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block hover:text-[#151814]"
          >
            TikTok
          </a>
        </div>
      </div>

      <div className="border-t border-[#DED9CE] py-4 text-center text-xs text-[#77776F]">
        &copy; {new Date().getFullYear()} {siteConfig.name}
      </div>
    </footer>
  );
}