import type { Metadata } from "next";
import { TransitionLink } from "@/components/page-transition";

export const metadata: Metadata = {
  title: "核心优势 | 朱美阳 · AI训练师",
  description: "6个大模型核心项目全流程实操，覆盖消费级语音助手与车载智能交互。",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-16 md:px-6 md:pt-20">
      <TransitionLink
        href="/home"
        className="inline-flex items-center gap-2 text-sm text-[#B8C1D0] transition hover:text-[#E6EAF2]"
      >
        <span>←</span>
        <span>返回首页</span>
      </TransitionLink>

      <div className="mt-8 rounded-[28px] border border-white/10 bg-[#151B34]/80 p-8 md:p-10">
        <div className="text-xs uppercase tracking-[0.2em] text-[#6EA8FE]">About</div>
        <h1 className="mt-3 text-3xl font-semibold text-[#E6EAF2]">核心优势</h1>
        <p className="mt-5 text-base leading-8 text-[#B8C1D0]">
          拥有6个大模型核心项目全流程实操经验，覆盖消费级语音助手、车载智能交互两大核心赛道，具备从需求对接、规范搭建、团队管理、数据生产到模型微调、效果验证的全链路闭环能力。所有交付项目均100%达标，可快速适配垂直场景的大模型训练需求。
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="text-lg font-semibold text-[#E6EAF2]">小米 · 人工智能部</div>
            <p className="mt-3 text-sm leading-7 text-[#B8C1D0]">
              小爱同学单轮/多轮对话优化、文生图能力评测。从一线标注执行逐步进阶至全流程质检管控，累计参与完成超8万条标注/评测数据的生产与交付。
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="text-lg font-semibold text-[#E6EAF2]">长城汽车 · 智能座舱</div>
            <p className="mt-3 text-sm leading-7 text-[#B8C1D0]">
              全面负责小魏智能助手核心能力优化的AI训练全流程工作。承接ASR、TTS、Agent三大核心项目，制定标注规范、搭建质控体系、管理10人标注+2人质检团队，累计主导完成超8万条训练数据的全流程生产与交付。
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div className="text-sm font-medium text-[#E6EAF2]">核心竞争力</div>
          <div className="mt-3 grid gap-2 text-sm leading-7 text-[#B8C1D0]">
            {[
              "具备从需求对接、规范搭建、团队管理到数据交付的全链路闭环能力",
              "6个大模型核心项目100%达标交付，无一次延期",
              "可快速适配消费级语音助手、车载智能交互等垂直场景",
              "具备10+人团队培训管控经验，能快速搭建标注团队",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6EA8FE]/60" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
