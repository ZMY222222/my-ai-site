import type { Metadata } from "next";
import { TransitionLink } from "@/components/page-transition";
import Image from "next/image";
import { portfolioItems } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "作品集 | 朱美阳 · AI训练师",
  description: "AI文生图 · 文生视频 · 图生视频 · AI资讯与评测报告。",
};

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-16 md:px-6 md:pt-20">
      <TransitionLink
        href="/"
        className="inline-flex items-center gap-2 text-sm text-[#B8C1D0] transition hover:text-[#E6EAF2]"
      >
        <span>←</span>
        <span>返回首页</span>
      </TransitionLink>

      <div className="mt-8">
        <div className="text-sm uppercase tracking-[0.24em] text-[#B8C1D0]">
          Portfolio
        </div>
        <h1 className="mt-4 text-3xl font-semibold text-[#E6EAF2]">
          作品集
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[#B8C1D0]">
          日常AI使用案例、向AI咨询的技术问题整理、Prompt工程模板与评测报告。
          每张卡片都可以点进去看完整内容。
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
          {portfolioItems.map((item) => (
            <TransitionLink
              key={item.id}
              href={`/portfolio/${item.id}`}
              className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#151B34]/80 transition hover:border-white/20 hover:bg-[#151B34]"
            >
              <div className="aspect-[4/3] bg-[#0D1225] flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />

                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                <div className="absolute bottom-3 right-3 z-20 rounded-full border border-white/20 bg-[#0B1020]/80 px-3 py-1 text-xs text-[#E6EAF2] opacity-0 transition group-hover:opacity-100">
                  查看详情 →
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase tracking-[0.18em] text-[#6EA8FE]">
                    {item.category}
                  </div>
                  <div className="text-xs text-[#B8C1D0]">{item.date}</div>
                </div>
                <h2 className="mt-2 text-base font-medium text-[#E6EAF2]">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-7 text-[#B8C1D0]">
                  {item.description}
                </p>
              </div>
            </TransitionLink>
          ))}
        </div>
      </div>
    </div>
  );
}
