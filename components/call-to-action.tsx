export function CallToAction({ shake }: { shake?: boolean }) {
  return (
    <section id="contact" className="scroll-mt-28 py-4">
      <div className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#11162A] p-8 md:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left_top,rgba(110,168,254,0.16),transparent_26%),radial-gradient(circle_at_80%_30%,rgba(139,124,255,0.14),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.02),transparent_50%)]" />

          <div className="relative z-10 max-w-3xl">
            <div className="text-sm uppercase tracking-[0.24em] text-[#B8C1D0]">
              Contact
            </div>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.03em] text-[#E6EAF2] md:text-4xl md:leading-[1.15]">
              期待与您交流
            </h2>
            <p className="mt-5 text-base leading-8 text-[#B8C1D0]">
              如果您对我的项目经历感兴趣，或想了解大模型训练、数据工程相关的协作机会，欢迎随时联系。
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className={`rounded-2xl border border-white/10 bg-white/[0.04] p-4 ${shake ? "animate-shake" : ""}`} style={shake ? { animationDelay: "0ms" } : undefined}>
                <div className="text-sm text-[#B8C1D0]">电话</div>
                <div className="mt-2 text-sm leading-7 text-[#E6EAF2]">
                  13409687811
                </div>
              </div>

              <div className={`rounded-2xl border border-white/10 bg-white/[0.04] p-4 ${shake ? "animate-shake" : ""}`} style={shake ? { animationDelay: "100ms" } : undefined}>
                <div className="text-sm text-[#B8C1D0]">邮箱</div>
                <div className="mt-2 text-sm leading-7 text-[#E6EAF2]">
                  2595617884@qq.com
                </div>
              </div>

              <div className={`rounded-2xl border border-white/10 bg-white/[0.04] p-4 ${shake ? "animate-shake" : ""}`} style={shake ? { animationDelay: "200ms" } : undefined}>
                <div className="text-sm text-[#B8C1D0]">基础信息</div>
                <div className="mt-2 text-sm leading-7 text-[#E6EAF2]">
                  23岁 · 男 · 2年经验
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
