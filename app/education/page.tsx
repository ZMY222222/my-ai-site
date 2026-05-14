import type { Metadata } from "next";
import { TransitionLink } from "@/components/page-transition";

const education = {
  school: "湖北汽车工程学院",
  major: "电子信息工程（本科）",
  period: "2021.06 - 2025.06",
  details: [
    "GPA 3.5/4.0 · 排名8/120",
    "一次一等校奖学金、两次二等校奖学金",
    "英语四级 · 优秀毕业生",
  ],
};

export const metadata: Metadata = {
  title: "教育背景 | 朱美阳 · AI训练师",
  description: "湖北汽车工程学院 · 电子信息工程本科，GPA 3.5/4.0。",
};

export default function EducationPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-16 md:px-6 md:pt-20">
      <TransitionLink
        href="/home"
        className="inline-flex items-center gap-2 text-sm text-[#F5F5F5] transition hover:text-[#00D4FF]"
        style={{ textShadow: "0 0 2px rgba(0,212,255,0.3)" }}
      >
        <span>←</span>
        <span>返回首页</span>
      </TransitionLink>

      <div className="mt-8 rounded-[28px] border border-white/10 bg-[#151B34]/80 p-8 md:p-10">
        <div className="text-xs uppercase tracking-[0.2em] text-[#00D4FF]" style={{ textShadow: "0 0 3px rgba(0,212,255,0.6), 0 0 8px rgba(0,212,255,0.3)" }}>Education</div>
        <h1 className="mt-3 text-3xl font-semibold text-[#F5F5F5]" style={{ textShadow: "0 0 5px rgba(0,212,255,0.8), 0 0 12px rgba(0,212,255,0.5), 0 0 25px rgba(0,212,255,0.3), 0 0 50px rgba(0,212,255,0.15)" }}>教育背景</h1>

        <div className="mt-8">
          <div className="text-2xl font-semibold text-[#F5F5F5]" style={{ textShadow: "0 0 3px rgba(0,212,255,0.5), 0 0 8px rgba(0,212,255,0.25)" }}>{education.school}</div>
          <div className="mt-2 text-base text-[#F5F5F5]" style={{ textShadow: "0 0 2px rgba(0,212,255,0.4), 0 0 6px rgba(0,212,255,0.2)" }}>
            {education.major} · {education.period}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {education.details.map((d) => (
              <span
                key={d}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-[#F5F5F5]"
                style={{ textShadow: "0 0 2px rgba(0,212,255,0.2)" }}
              >
                {d}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="text-sm font-medium text-[#00D4FF]" style={{ textShadow: "0 0 3px rgba(0,212,255,0.5), 0 0 8px rgba(0,212,255,0.25)" }}>专业方向</div>
            <p className="mt-2 text-sm leading-7 text-[#F5F5F5]" style={{ textShadow: "0 0 2px rgba(0,212,255,0.4), 0 0 6px rgba(0,212,255,0.2)" }}>
              电子信息工程专业背景，具备信号处理、数据分析基础能力，为AI训练中的数据工程和模型评测工作提供了扎实的理工科基础。
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="text-sm font-medium text-[#00D4FF]" style={{ textShadow: "0 0 3px rgba(0,212,255,0.5), 0 0 8px rgba(0,212,255,0.25)" }}>学业表现</div>
            <p className="mt-2 text-sm leading-7 text-[#F5F5F5]" style={{ textShadow: "0 0 2px rgba(0,212,255,0.4), 0 0 6px rgba(0,212,255,0.2)" }}>
              在校期间保持优异的学业成绩，GPA 3.5 排名前7%，多次获得校奖学金。被评为优秀毕业生，展现了持续学习和自我驱动的能力。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
