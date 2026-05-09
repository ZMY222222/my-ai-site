import type { Metadata } from "next";
import { TransitionLink } from "@/components/page-transition";

const skills = [
  "SFT监督微调全流程",
  "NLP数据工程体系搭建",
  "多模态大模型评测",
  "ASR语音识别数据集构建",
  "TTS语音合成数据优化",
  "Agent智能体全链路标注",
  "Prompt Engineering",
  "标注规范与SOP编写",
  "10+人团队培训管控",
  "数据清洗与格式化交付",
];

const skillCategories = [
  {
    title: "大模型训练与优化",
    text: "精通SFT监督微调全流程，熟练完成单轮/多轮对话系统指令跟随、拟人度、上下文连贯性专项优化，具备Agent智能体思考-行动全链路标注与模型调优能力。",
  },
  {
    title: "NLP数据工程体系搭建",
    text: "可独立完成标注规范制定、标注员培训、全流程质量管控、数据清洗与格式化交付，覆盖单轮/多轮对话、语音转写、拼音标注全类型NLP数据。",
  },
  {
    title: "语音模型数据集构建",
    text: "精通ASR语音识别、TTS语音合成训练数据集的标注、校对、质控全流程，适配多方言、车载场景专项优化。",
  },
  {
    title: "工具与规范能力",
    text: "精通Prompt Engineering，熟练使用标注平台、大模型微调工具，可独立编写标注规范、质检标准、项目执行SOP，具备10+人标注团队培训管控能力。",
  },
];

export const metadata: Metadata = {
  title: "专业技能 | 朱美阳 · AI训练师",
  description: "SFT微调、NLP数据工程、ASR/TTS、Agent全链路标注、Prompt工程。",
};

export default function SkillsPage() {
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
        <div className="text-xs uppercase tracking-[0.2em] text-[#6EA8FE]">Skills</div>
        <h1 className="mt-3 text-3xl font-semibold text-[#E6EAF2]">专业技能</h1>

        <div className="mt-6 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-[#6EA8FE]/20 bg-[#6EA8FE]/8 px-4 py-2 text-sm text-[#BFC8D6] transition hover:border-[#6EA8FE]/40 hover:bg-[#6EA8FE]/12"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {skillCategories.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-white/20"
            >
              <h2 className="text-base font-semibold text-[#E6EAF2]">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#B8C1D0]">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-[#6EA8FE]/15 bg-[#6EA8FE]/5 p-6">
          <div className="text-sm font-medium text-[#6EA8FE]">能力标签</div>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { num: "6", label: "核心项目" },
              { num: "15万+", label: "数据处理" },
              { num: "2 年", label: "AI训练经验" },
              { num: "10+人", label: "团队管理" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-[#E6EAF2]">{stat.num}</div>
                <div className="mt-1 text-xs text-[#B8C1D0]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
