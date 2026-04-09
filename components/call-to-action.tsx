import Link from "next/link";

export function CallToAction() {
  return (
    <section className="pb-20 md:pb-28">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#11162A] p-8 md:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left_top,rgba(110,168,254,0.16),transparent_26%),radial-gradient(circle_at_80%_30%,rgba(139,124,255,0.14),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.02),transparent_50%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40" />

          <div className="relative z-10 max-w-3xl">
            <div className="text-sm uppercase tracking-[0.24em] text-[#A7B0C0]">
              Call To Action
            </div>

            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.03em] text-[#E6EAF2] md:text-4xl md:leading-[1.15]">
              让项目、日志与方法沉淀形成一个长期可维护的技术空间
            </h2>

            <p className="mt-5 text-base leading-8 text-[#A7B0C0]">
              这个网站不会停留在一次性展示，而会持续扩展项目案例、训练日志、技术文章与方法专题。它更像一个围绕训练实践不断生长的结构化内容系统。
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-xl bg-[#6EA8FE] px-6 py-3 text-sm font-medium text-[#0B1020] transition hover:brightness-110"
              >
                查看项目案例
              </Link>

              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-[#E6EAF2] transition hover:border-white/20 hover:bg-white/10"
              >
                阅读技术文章
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="text-sm text-[#A7B0C0]">项目案例</div>
                <div className="mt-2 text-sm leading-7 text-[#E6EAF2]">
                  展示训练任务如何被拆解、执行与复盘
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="text-sm text-[#A7B0C0]">训练日志</div>
                <div className="mt-2 text-sm leading-7 text-[#E6EAF2]">
                  记录实验过程中的判断、调整与结论
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="text-sm text-[#A7B0C0]">方法沉淀</div>
                <div className="mt-2 text-sm leading-7 text-[#E6EAF2]">
                  将经验整理为可复用的训练方法与结构
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}