"use client";

import { useState, useEffect, useCallback } from "react";
import { CallToAction } from "@/components/call-to-action";
import { AnimatedCard } from "@/components/animated-card";
import { AvatarRipple } from "@/components/avatar-ripple";

const cards = [
  {
    href: "/about",
    emoji: "⚡",
    title: "核心优势",
    desc: "小米+长城双大厂，6个核心项目全流程实操，全链路闭环交付能力",
    accent: "About",
  },
  {
    href: "/experience",
    emoji: "📋",
    title: "工作经历",
    desc: "从AI训练实习生到AI训练师，2年完整职业成长路径",
    accent: "Experience",
  },
  {
    href: "/education",
    emoji: "🎓",
    title: "教育背景",
    desc: "湖北汽车工程学院 · 电子信息工程本科 · GPA 3.5 · 优秀毕业生",
    accent: "Education",
  },
  {
    href: "/skills",
    emoji: "🛠️",
    title: "专业技能",
    desc: "SFT微调 · NLP数据工程 · ASR/TTS · Agent · Prompt工程",
    accent: "Skills",
  },
  {
    href: "/projects",
    emoji: "💼",
    title: "项目经历",
    desc: "6个大模型核心项目详情，含职责、成果、技术标签",
    accent: "Projects",
  },
  {
    href: "/portfolio",
    emoji: "🎨",
    title: "作品集",
    desc: "AI文生图 · AI视频 · AI资讯与评测报告",
    accent: "Portfolio",
  },
];

function EntranceCard({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-4">
      <button
        onClick={onClick}
        className="group block rounded-[32px] border border-white/10 bg-[#11162A] p-10 text-center transition hover:border-[#6EA8FE]/30 hover:bg-[#11162A]/90 hover:shadow-[0_0_64px_rgba(110,168,254,0.12)] animate-fade-in-up"
        style={{ animationDelay: "200ms" }}
      >
        <AvatarRipple>
          <div className="flex h-36 w-36 mx-auto items-center justify-center rounded-full border-2 border-[#6EA8FE]/40 bg-[#0D1225] shadow-[0_0_48px_rgba(110,168,254,0.12)] transition group-hover:border-[#6EA8FE]/60 group-hover:shadow-[0_0_64px_rgba(110,168,254,0.22)]">
            <div className="text-center">
              <div className="text-5xl font-bold text-[#6EA8FE] transition group-hover:scale-110">朱</div>
              <div className="mt-1 text-[11px] text-[#BFC8D6]">AI Trainer</div>
            </div>
          </div>
        </AvatarRipple>

        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-[#E6EAF2]">
          朱美阳
        </h1>
        <div className="mt-2 text-sm uppercase tracking-[0.24em] text-[#6EA8FE]">
          AI训练师 / 大模型数据专家
        </div>

        <p className="mt-4 text-sm leading-7 text-[#BFC8D6]">
          2年经验 · 6个核心项目全流程实操 · 15万+数据处理量
        </p>

        <div className="mx-auto mt-6 max-w-[260px] border-t border-white/8 pt-5">
          <div className="grid grid-cols-2 gap-3 text-center text-xs text-[#B8C1D0]">
            <div className="rounded-xl bg-white/[0.04] px-3 py-2.5">
              <div className="text-[#E6EAF2] font-semibold">6</div>
              <div className="mt-0.5">核心项目</div>
            </div>
            <div className="rounded-xl bg-white/[0.04] px-3 py-2.5">
              <div className="text-[#E6EAF2] font-semibold">15万+</div>
              <div className="mt-0.5">处理数据</div>
            </div>
            <div className="rounded-xl bg-white/[0.04] px-3 py-2.5">
              <div className="text-[#E6EAF2] font-semibold">2</div>
              <div className="mt-0.5">大厂经历</div>
            </div>
            <div className="rounded-xl bg-white/[0.04] px-3 py-2.5">
              <div className="text-[#E6EAF2] font-semibold">10+</div>
              <div className="mt-0.5">团队管理</div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-xs text-[#6EA8FE]/40 transition group-hover:text-[#6EA8FE]/70">
          点击进入 →
        </div>
      </button>
    </div>
  );
}

function Sidebar({ onBack, onContact }: { onBack: () => void; onContact: () => void }) {
  return (
    <aside className="lg:sticky lg:top-24 lg:h-fit lg:w-[320px] lg:shrink-0 animate-fade-in-up">
      <div className="rounded-[28px] border border-white/10 bg-[#11162A] p-8">
        <div className="flex flex-col items-center text-center">
          <AvatarRipple>
            <button
              onClick={onBack}
              className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-[#6EA8FE]/40 bg-[#0D1225] shadow-[0_0_48px_rgba(110,168,254,0.12)] transition hover:border-[#6EA8FE]/60 hover:shadow-[0_0_56px_rgba(110,168,254,0.20)]"
              aria-label="返回首页入口"
              title="点击返回入口"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-[#6EA8FE]">朱</div>
                <div className="mt-0.5 text-[10px] text-[#BFC8D6]">AI Trainer</div>
              </div>
            </button>
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
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);
  const [shakeContact, setShakeContact] = useState(false);

  useEffect(() => {
    setEntered(sessionStorage.getItem("home-entered") === "1");
    setAnimateCards(sessionStorage.getItem("home-entered") === "1");
    setMounted(true);
  }, []);

  const handleEnter = () => {
    sessionStorage.setItem("home-entered", "1");
    setEntered(true);
  };

  const handleBack = () => {
    sessionStorage.removeItem("home-entered");
    setEntered(false);
  };

  const handleContact = useCallback(() => {
    setShakeContact(true);
    setTimeout(() => {
      const el = document.getElementById("contact");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 50);
    setTimeout(() => setShakeContact(false), 800);
  }, []);

  useEffect(() => {
    if (entered && !animateCards) {
      const t = setTimeout(() => setAnimateCards(true), 150);
      return () => clearTimeout(t);
    }
    if (!entered) {
      setAnimateCards(false);
    }
  }, [entered, animateCards]);

  if (!mounted) return null;

  if (!entered) {
    return <EntranceCard onClick={handleEnter} />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 md:px-6 md:pt-8 lg:flex lg:gap-8 lg:pt-12">
      <Sidebar onBack={handleBack} onContact={handleContact} />

      <main className="mt-6 flex-1 space-y-8 lg:mt-0">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => (
            <AnimatedCard key={card.href} index={i} href={card.href} animate={animateCards}>
              <div className="rounded-[22px] border border-white/10 bg-[#151B34]/80 p-6 transition hover:border-white/20 hover:bg-[#151B34] hover:scale-[1.02] h-full">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{card.emoji}</span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[#6EA8FE]/60">
                    {card.accent}
                  </span>
                </div>
                <h2 className="mt-4 text-lg font-semibold text-[#E6EAF2] group-hover:text-[#6EA8FE] transition-colors">
                  {card.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#B8C1D0]">{card.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs text-[#6EA8FE]/60 transition group-hover:text-[#6EA8FE] group-hover:gap-2">
                  <span>查看详情</span>
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
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
