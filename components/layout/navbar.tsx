"use client";

import { usePathname } from "next/navigation";
import { MobileNav } from "@/components/mobile-nav";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site";
import { TransitionLink } from "@/components/page-transition";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#0B1020]/80 backdrop-blur-xl">
      <Container>
        <div className="flex h-[76px] items-center justify-between gap-4">
          <TransitionLink href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#151B34] text-sm font-semibold text-[#6EA8FE] shadow-[0_0_24px_rgba(110,168,254,0.18)]">
              AI
            </div>
            <div>
              <div className="text-sm font-medium text-[#E6EAF2]">
                {siteConfig.name}
              </div>
              <div className="text-xs text-[#B8C1D0]">
                Training · Systems · Workflow
              </div>
            </div>
          </TransitionLink>

          <nav className="hidden items-center gap-8 md:flex">
            {siteConfig.nav.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <TransitionLink
                  key={item.href}
                  href={item.href}
                  className={`relative text-sm transition-colors pb-1 ${
                    isActive
                      ? "text-[#E6EAF2] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-[#60A5FA]"
                      : "text-[#B8C1D0] hover:text-[#60A5FA] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-[#60A5FA] after:origin-center after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
                  }`}
                >
                  {item.label}
                </TransitionLink>
              );
            })}
          </nav>

          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
