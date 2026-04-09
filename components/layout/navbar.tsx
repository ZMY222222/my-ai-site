"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileNav } from "@/components/mobile-nav";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#0B1020]/80 backdrop-blur-xl">
      <Container>
        <div className="flex h-[76px] items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#151B34] text-sm font-semibold text-[#6EA8FE] shadow-[0_0_24px_rgba(110,168,254,0.18)]">
              AI
            </div>
            <div>
              <div className="text-sm font-medium text-[#E6EAF2]">
                {siteConfig.name}
              </div>
              <div className="text-xs text-[#A7B0C0]">
                Training · Systems · Workflow
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {siteConfig.nav.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm transition ${
                    isActive
                      ? "text-[#E6EAF2]"
                      : "text-[#A7B0C0] hover:text-[#E6EAF2]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:block">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#E6EAF2] transition hover:border-white/20 hover:bg-white/10"
            >
              联系我
            </Link>
          </div>

          <MobileNav />
        </div>
      </Container>
    </header>
  );
}