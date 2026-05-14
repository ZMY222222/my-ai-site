import type { Metadata } from "next";
import { TransitionLink } from "@/components/page-transition";

const workHistory = [
  {
    company: "长城汽车股份有限公司",
    department: "智能座舱事业部 · 小魏智能助手团队",
    role: "AI训练师",
    period: "2025.07 - 2026.04",
    highlights: [
      "全面负责小魏智能助手核心能力优化的AI训练全流程工作",
      "对接AI产品经理与算法工程师，承接ASR、TTS、Agent三大核心项目",
      "制定标注规范、搭建质控体系、管理10人标注+2人质检团队",
      "累计主导完成超8万条语音/对话类训练数据的全流程生产与交付",
    ],
  },
  {
    company: "小米科技有限责任公司",
    department: "人工智能部 · 小爱同学团队",
    role: "AI训练实习生",
    period: "2024.12 - 2025.06",
    highlights: [
      "先后负责小爱同学单轮/多轮对话优化、文生图能力评测项目",
      "从一线标注执行逐步进阶至全流程质检管控",
      "配合AI训练师完成标注规范落地、团队培训、数据质量管控",
      "累计参与完成超8万条标注/评测数据的生产与交付",
    ],
  },
];

export const metadata: Metadata = {
  title: "工作经历 | 朱美阳 · AI训练师",
  description: "小米小爱同学 → 长城汽车智能座舱，2年AI训练师职业成长路径。",
};

export default function ExperiencePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-16 md:px-6 md:pt-20">
      <TransitionLink
        href="/home"
        className="inline-flex items-center gap-2 text-sm text-[#E0E0E0] transition hover:text-[#F5F5F5]"
        style={{ textShadow: "0 0 2px rgba(0,212,255,0.3)" }}
      >
        <span>←</span>
        <span>返回首页</span>
      </TransitionLink>

      <div className="mt-8 rounded-[28px] border border-white/10 bg-[#151B34]/80 p-8 md:p-10">
        <div className="text-xs uppercase tracking-[0.2em] text-[#00D4FF]" style={{ textShadow: "0 0 3px rgba(0,212,255,0.6), 0 0 8px rgba(0,212,255,0.3)" }}>Experience</div>
        <h1 className="mt-3 text-3xl font-semibold text-[#F5F5F5]">工作经历</h1>

        <div className="mt-8 space-y-6">
          {workHistory.map((job, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
            >
              <div className="flex flex-wrap items-center gap-2 text-sm text-[#E0E0E0]">
                <span className="font-semibold text-[#00D4FF]">{job.role}</span>
                <span className="text-white/20">|</span>
                <span>{job.period}</span>
              </div>
              <h2 className="mt-2 text-xl font-semibold text-[#F5F5F5]">{job.company}</h2>
              <p className="mt-1 text-sm text-[#E0E0E0]">{job.department}</p>
              <div className="mt-4 space-y-2">
                {job.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm leading-7 text-[#E0E0E0]">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00D4FF]/60" />
                    {h}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <TransitionLink
            href="/projects"
            className="inline-flex items-center gap-2 rounded-xl border border-[#00D4FF]/25 bg-[#00D4FF]/8 px-6 py-3 text-sm font-medium text-[#00D4FF] transition hover:border-[#00D4FF]/40 hover:bg-[#00D4FF]/12 active:scale-95"
          >
            详细项目了解 →
          </TransitionLink>
        </div>
      </div>
    </div>
  );
}
