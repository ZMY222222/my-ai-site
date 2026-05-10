import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "专业技能 | 朱美阳 · AI训练师",
  description: "SFT微调、NLP数据工程、ASR/TTS、Agent全链路标注、Prompt工程。",
};

export default function SkillsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
