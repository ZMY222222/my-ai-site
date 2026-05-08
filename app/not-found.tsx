import { TransitionLink } from "@/components/page-transition";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0B1020] px-6 py-24 text-[#E6EAF2]">
      <div className="mx-auto flex max-w-3xl flex-col items-start">
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-[#B8C1D0]">
          404
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-[-0.03em] md:text-5xl">
          页面不存在
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-8 text-[#B8C1D0]">
          你访问的内容可能已被移动、删除，或者链接地址输入有误。
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <TransitionLink
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-[#6EA8FE] px-6 py-3 text-sm font-medium text-[#0B1020] transition hover:brightness-110"
          >
            返回首页
          </TransitionLink>

          <TransitionLink
            href="/projects"
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-[#E6EAF2] transition hover:border-white/20 hover:bg-white/10"
          >
            查看项目
          </TransitionLink>
        </div>
      </div>
    </main>
  );
}
