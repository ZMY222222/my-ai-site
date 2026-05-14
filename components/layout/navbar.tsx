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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#00D4FF]/30 bg-[#151B34] text-sm font-bold italic text-[#00D4FF]" style={{ textShadow: "0 0 6px rgba(0,212,255,0.9), 0 0 14px rgba(0,212,255,0.5), 0 0 28px rgba(0,212,255,0.3)", boxShadow: "0 0 20px rgba(0,212,255,0.25)" }}>
              AI
            </div>
            <div>
              <div className="text-sm font-bold italic text-[#F5F5F5]" style={{ textShadow: "0 0 4px rgba(0,212,255,0.6), 0 0 10px rgba(0,212,255,0.3)" }}>
                {siteConfig.name}
              </div>
              <div className="text-xs text-[#E0E0E0]">
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
                  className={`relative text-base font-medium italic transition-colors pb-1 ${
                    isActive
                      ? "text-[#F5F5F5] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-[#00D4FF]"
                      : "text-[#E0E0E0] hover:text-[#00D4FF] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-[#00D4FF] after:origin-center after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
                  }`}
                  style={isActive ? { textShadow: "0 0 5px rgba(0,212,255,0.7), 0 0 12px rgba(0,212,255,0.4)" } : undefined}
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
