"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site";
import { TransitionLink } from "@/components/page-transition";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "关闭导航菜单" : "打开导航菜单"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#E6EAF2] transition hover:border-white/20 hover:bg-white/10 md:hidden"
      >
        <span className="relative block h-4 w-5">
          <span
            className={`absolute left-0 top-0 block h-[2px] w-5 rounded-full bg-current transition ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-[7px] block h-[2px] w-5 rounded-full bg-current transition ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 top-[14px] block h-[2px] w-5 rounded-full bg-current transition ${
              open ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      <div
        className={`fixed inset-0 z-[60] md:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <button
          type="button"
          aria-label="关闭导航菜单遮罩"
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-[#020617]/70 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          className={`absolute right-0 top-0 h-full w-[86%] max-w-[360px] border-l border-white/10 bg-[#0B1020] p-6 shadow-2xl transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-[#E6EAF2]">
                {siteConfig.name}
              </div>
              <div className="mt-1 text-xs text-[#B8C1D0]">
                Training · Systems · Workflow
              </div>
            </div>

            <button
              type="button"
              aria-label="关闭导航菜单"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#E6EAF2] transition hover:border-white/20 hover:bg-white/10"
            >
              ×
            </button>
          </div>

          <nav className="mt-8 space-y-3">
            {siteConfig.nav.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <TransitionLink
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-2xl border px-4 py-4 text-sm transition ${
                    isActive
                      ? "border-[#6EA8FE]/30 bg-[#6EA8FE]/10 text-[#E6EAF2]"
                      : "border-white/10 bg-white/[0.03] text-[#B8C1D0] hover:border-white/20 hover:bg-white/[0.05] hover:text-[#E6EAF2]"
                  }`}
                >
                  {item.label}
                </TransitionLink>
              );
            })}
          </nav>

          <div className="mt-8 rounded-[24px] border border-white/10 bg-[#151B34]/80 p-5">
            <div className="text-sm text-[#B8C1D0]">当前网站定位</div>
            <p className="mt-3 text-sm leading-7 text-[#BFC8D6]">
              面向训练实践、项目沉淀、方法复盘与长期技术内容维护的 AI训练师个人网站。
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
