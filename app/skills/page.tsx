"use client";

import { TransitionLink } from "@/components/page-transition";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

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

const radarData = [
  { skill: "SFT微调", value: 90, fullMark: 100 },
  { skill: "NLP数据工程", value: 85, fullMark: 100 },
  { skill: "语音数据处理", value: 80, fullMark: 100 },
  { skill: "Agent全链路", value: 85, fullMark: 100 },
  { skill: "Prompt工程", value: 88, fullMark: 100 },
  { skill: "团队管理", value: 75, fullMark: 100 },
];

const skillCategories = [
  { id: "sft", title: "大模型训练与优化", text: "精通SFT监督微调全流程，熟练完成单轮/多轮对话系统指令跟随、拟人度、上下文连贯性专项优化，具备Agent智能体思考-行动全链路标注与模型调优能力。" },
  { id: "nlp", title: "NLP数据工程体系搭建", text: "可独立完成标注规范制定、标注员培训、全流程质量管控、数据清洗与格式化交付，覆盖单轮/多轮对话、语音转写、拼音标注全类型NLP数据。" },
  { id: "voice", title: "语音模型数据集构建", text: "精通ASR语音识别、TTS语音合成训练数据集的标注、校对、质控全流程，适配多方言、车载场景专项优化。" },
  { id: "tool", title: "工具与规范能力", text: "精通Prompt Engineering，熟练使用标注平台、大模型微调工具，可独立编写标注规范、质检标准、项目执行SOP，具备10+人标注团队培训管控能力。" },
];

const tagToId: Record<string, string> = {
  "SFT监督微调全流程": "sft", "NLP数据工程体系搭建": "nlp",
  "ASR语音识别数据集构建": "voice", "TTS语音合成数据优化": "voice",
  "Prompt Engineering": "tool", "标注规范与SOP编写": "tool",
};

export default function SkillsPage() {
  const scrollTo = (tag: string) => {
    const id = tagToId[tag] || "sft";
    document.getElementById(`skill-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-16 md:px-6 md:pt-20">
      <TransitionLink href="/home" className="inline-flex items-center gap-2 text-sm text-[#E0E0E0] transition hover:text-[#F5F5F5]" style={{ textShadow: "0 0 2px rgba(0,212,255,0.3)" }}>
        <span>←</span><span>返回首页</span>
      </TransitionLink>

      <div className="mt-8 rounded-[28px] border border-white/10 bg-[#151B34]/80 p-8 md:p-10">
        <div className="text-xs uppercase tracking-[0.2em] text-[#00D4FF]">Skills</div>
        <h1 className="mt-3 text-3xl font-semibold text-[#F5F5F5]">专业技能</h1>

        <div className="mt-6 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <button key={skill} onClick={() => scrollTo(skill)} className="rounded-full border border-[#00D4FF]/20 bg-[#00D4FF]/8 px-4 py-2 text-sm text-[#E0E0E0] transition hover:border-[#00D4FF]/50 hover:bg-[#00D4FF]/16 hover:text-[#F5F5F5] cursor-pointer">
              {skill}
            </button>
          ))}
        </div>

        <div className="mt-8 mx-auto" style={{ maxWidth: "420px" }}>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: "#E0E0E0", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.08)" }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "rgba(0,212,255,0.5)", fontSize: 10 }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
              <Radar name="技能熟练度" dataKey="value" stroke="#00D4FF" strokeWidth={2} fill="#00D4FF" fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {skillCategories.map((item) => (
            <div key={item.id} id={`skill-${item.id}`} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/20 hover:shadow-[0_8px_30px_rgba(255,107,53,0.08)] hover:-translate-y-1">
              <h2 className="text-base font-semibold text-[#F5F5F5]">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#E0E0E0]">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-[#00D4FF]/15 bg-[#00D4FF]/5 p-6">
          <div className="text-sm font-medium text-[#00D4FF]">能力标签</div>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[{ num: "6", label: "核心项目" }, { num: "15万+", label: "数据处理" }, { num: "2 年", label: "AI训练经验" }, { num: "10+人", label: "团队管理" }].map((stat) => (
              <div key={stat.label} className="text-center"><div className="text-2xl font-bold text-[#F5F5F5]">{stat.num}</div><div className="mt-1 text-xs text-[#E0E0E0]">{stat.label}</div></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
