"use client";

import { useState } from "react";

export function CallToAction({ shake }: { shake?: boolean }) {
  const [toast, setToast] = useState("");

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText("13409687811");
      setToast("已复制");
      setTimeout(() => setToast(""), 2000);
    } catch {
      setToast("复制失败");
      setTimeout(() => setToast(""), 2000);
    }
  };

  return (
    <section id="contact" className="scroll-mt-28 py-4">
      <div className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#11162A] p-8 md:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left_top,rgba(0,212,255,0.16),transparent_26%),radial-gradient(circle_at_80%_30%,rgba(139,124,255,0.14),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.02),transparent_50%)]" />

          <div className="relative z-10 max-w-3xl">
            <div className="text-sm uppercase tracking-[0.24em] text-[#E0E0E0]">Contact</div>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.03em] text-[#F5F5F5] md:text-4xl md:leading-[1.15]">期待与您交流</h2>
            <p className="mt-5 text-base leading-8 text-[#E0E0E0]">
              如果您对我的项目经历感兴趣，或想了解大模型训练、数据工程相关的协作机会，欢迎随时联系。
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {/* Phone */}
              <button
                onClick={copyPhone}
                className={`rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition-all hover:-translate-y-1 hover:border-[#00D4FF]/30 hover:shadow-lg hover:shadow-[#00D4FF]/5 ${shake ? "animate-shake" : ""}`}
                style={shake ? { animationDelay: "0ms" } : undefined}
              >
                <div className="text-sm text-[#E0E0E0]">电话</div>
                <div className="mt-2 text-sm font-mono leading-7 text-[#F5F5F5]">134****7811</div>
                <div className="mt-1 text-xs text-[#00D4FF]/60">点击复制完整号码</div>
              </button>

              {/* Email */}
              <a
                href="mailto:2595617884@qq.com"
                className={`rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-all hover:-translate-y-1 hover:border-[#00D4FF]/30 hover:shadow-lg hover:shadow-[#00D4FF]/5 block ${shake ? "animate-shake" : ""}`}
                style={shake ? { animationDelay: "100ms" } : undefined}
              >
                <div className="flex items-center gap-2 text-sm text-[#E0E0E0]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  发送邮件
                </div>
                <div className="mt-2 text-sm leading-7 text-[#F5F5F5]">25956***@qq.com</div>
              </a>

              {/* WeChat */}
              <div
                className={`rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-all hover:-translate-y-1 hover:border-[#00D4FF]/30 hover:shadow-lg hover:shadow-[#00D4FF]/5 group relative ${shake ? "animate-shake" : ""}`}
                style={shake ? { animationDelay: "200ms" } : undefined}
              >
                <div className="text-sm text-[#E0E0E0]">微信</div>
                <div className="mt-2 text-sm leading-7 text-[#F5F5F5]">ZMY_AI_Trainer</div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
                  <div className="rounded-lg border border-white/10 bg-[#1A2040] px-3 py-1.5 text-xs text-[#E0E0E0] whitespace-nowrap shadow-lg">
                    微信号: ZMY_AI_Trainer
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {toast && (
          <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[100] rounded-full bg-[#FF6B35] px-5 py-2 text-sm font-medium text-white shadow-lg animate-fade-in-up">
            {toast}
          </div>
        )}
      </div>
    </section>
  );
}
