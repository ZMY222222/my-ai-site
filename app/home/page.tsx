"use client";

import { useState, useCallback } from "react";
import { CallToAction } from "@/components/call-to-action";
import { AnimatedCard } from "@/components/animated-card";
import { StarClickEffect } from "@/components/star-click-effect";
import { AvatarRipple } from "@/components/avatar-ripple";

const cards = [
  {
    href: "/about",
    title: "核心优势",
    desc: "小米+长城双大厂，6个核心项目全流程实操，全链路闭环交付能力",
    accent: "About",
    gradient: "from-[#3B82F6] to-[#60A5FA]",
    bg: "from-[#3B82F6]/5 to-[#60A5FA]/3",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
  },
  {
    href: "/experience",
    title: "工作经历",
    desc: "从AI训练实习生到AI训练师，2年完整职业成长路径",
    accent: "Experience",
    gradient: "from-[#8B5CF6] to-[#A78BFA]",
    bg: "from-[#8B5CF6]/5 to-[#A78BFA]/3",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
  },
  {
    href: "/education",
    title: "教育背景",
    desc: "湖北汽车工程学院 · 电子信息工程本科 · GPA 3.5 · 优秀毕业生",
    accent: "Education",
    gradient: "from-[#EC4899] to-[#F472B6]",
    bg: "from-[#EC4899]/5 to-[#F472B6]/3",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.66 3.14 3 7 3s7-1.34 7-3v-5"/>
      </svg>
    ),
  },
  {
    href: "/skills",
    title: "专业技能",
    desc: "SFT微调 · NLP数据工程 · ASR/TTS · Agent · Prompt工程",
    accent: "Skills",
    gradient: "from-[#F59E0B] to-[#FBBF24]",
    bg: "from-[#F59E0B]/5 to-[#FBBF24]/3",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  {
    href: "/projects",
    title: "项目经历",
    desc: "6个大模型核心项目详情，含职责、成果、技术标签",
    accent: "Projects",
    gradient: "from-[#06B6D4] to-[#22D3EE]",
    bg: "from-[#06B6D4]/5 to-[#22D3EE]/3",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
  {
    href: "/portfolio",
    title: "作品集",
    desc: "AI文生图 · AI视频 · AI资讯与评测报告",
    accent: "Portfolio",
    gradient: "from-[#10B981] to-[#34D399]",
    bg: "from-[#10B981]/5 to-[#34D399]/3",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
      </svg>
    ),
  },
];

function Sidebar({ onContact }: { onContact: () => void }) {
  return (
    <aside className="lg:sticky lg:top-24 lg:h-fit lg:w-[320px] lg:shrink-0 animate-fade-in-up">
      <div className="rounded-[28px] border border-white/10 bg-[#11162A] p-8">
        <div className="flex flex-col items-center text-center">
          <AvatarRipple>
            <StarClickEffect>
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-[#6EA8FE]/40 bg-[#0D1225] shadow-[0_0_48px_rgba(110,168,254,0.12)]">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#6EA8FE]">朱</div>
                  <div className="mt-0.5 text-[10px] text-[#BFC8D6]">AI Trainer</div>
                </div>
              </div>
            </StarClickEffect>
          </AvatarRipple>

          <h1 className="mt-4 text-xl font-semibold tracking-[-0.03em] text-[#E6EAF2]">
            朱美阳
          </h1>
          <div className="mt-1 text-xs uppercase tracking-[0.2em] text-[#6EA8FE]">
            AI训练师 / 大模型数据专家
          </div>

          <p className="mt-3 text-sm leading-7 text-[#BFC8D6]">
            2年经验 · 6个核心项目全流程实操 · 15万+数据处理量
          </p>

          <div className="mt-5 flex w-full flex-col gap-2">
            <button
              onClick={onContact}
              className="inline-flex items-center justify-center rounded-xl bg-[#6EA8FE] px-5 py-2.5 text-sm font-medium text-[#0B1020] transition hover:brightness-110 active:brightness-90"
            >
              联系我
            </button>
          </div>

          <div className="mt-5 w-full border-t border-white/8 pt-5">
            <div className="grid grid-cols-2 gap-2 text-center text-xs text-[#B8C1D0]">
              <div className="rounded-xl bg-white/[0.03] px-3 py-2">
                <div className="text-[#E6EAF2] font-semibold">6</div>
                <div className="mt-0.5">核心项目</div>
              </div>
              <div className="rounded-xl bg-white/[0.03] px-3 py-2">
                <div className="text-[#E6EAF2] font-semibold">15万+</div>
                <div className="mt-0.5">处理数据</div>
              </div>
              <div className="rounded-xl bg-white/[0.03] px-3 py-2">
                <div className="text-[#E6EAF2] font-semibold">2</div>
                <div className="mt-0.5">大厂经历</div>
              </div>
              <div className="rounded-xl bg-white/[0.03] px-3 py-2">
                <div className="text-[#E6EAF2] font-semibold">10+</div>
                <div className="mt-0.5">团队管理</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function HomePage() {
  const [shakeContact, setShakeContact] = useState(false);

  const handleContact = useCallback(() => {
    setShakeContact(true);
    setTimeout(() => {
      const el = document.getElementById("contact");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 50);
    setTimeout(() => setShakeContact(false), 800);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 md:px-6 md:pt-8 lg:flex lg:gap-8 lg:pt-12">
      <Sidebar onContact={handleContact} />

      <main className="mt-6 flex-1 space-y-8 lg:mt-0">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => (
            <AnimatedCard key={card.href} index={i} href={card.href} animate={true}>
              <div className={`group/card relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${card.bg} p-[1px] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(96,165,250,0.2)] hover:border-white/20`}>
                {/* Inner card */}
                <div className="relative h-full rounded-2xl bg-[#0D1225]/95 p-6 backdrop-blur-sm">
                  {/* Accent glow dot */}
                  <div className={`absolute -right-3 -top-3 h-20 w-20 rounded-full bg-gradient-to-br ${card.gradient} opacity-20 blur-2xl`} />

                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} bg-opacity-10 text-white/90 shadow-lg`}>
                      {card.icon}
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-white/40">
                      {card.accent}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-[#F1F5F9] transition-colors group-hover/card:text-white">
                    {card.title}
                  </h2>

                  {/* Description */}
                  <p className="mt-2.5 text-sm leading-6 text-[#94A3B8]">
                    {card.desc}
                  </p>

                  {/* CTA */}
                  <div className={`mt-5 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r ${card.gradient} bg-clip-text text-sm font-medium text-transparent transition-all group-hover/card:gap-3`}>
                    <span>查看详情</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </div>

                  {/* Bottom accent line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${card.gradient} rounded-full opacity-0 transition-opacity duration-500 group-hover/card:opacity-100`} />
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>

        <div id="contact"><CallToAction shake={shakeContact} /></div>
      </main>
    </div>
  );
}
