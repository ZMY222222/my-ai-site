"use client";

import { useState, useEffect, useRef } from "react";
import { EXPERIENCES, STATS, RADAR_DATA, PORTFOLIO_HOME } from "@/data/portfolio-home";
import { useInView } from "@/hooks/use-in-view";
import { useRouter } from "next/navigation";
import { FlipRadarCard } from "@/components/flip-radar-card";
import { IconNavSelector } from "@/components/icon-nav-selector";
import { ScrollRevealPhoto } from "@/components/scroll-reveal-photo";
import { SkillsPiano } from "@/components/skills-piano";

const ACCENT_COLORS = ["#FF3AF2", "#00F5D4", "#FFE600", "#FF6B35", "#7B2FFF"];

const SECTION_BG = {
  hero:      "#0D0D1A",
  portfolio: "#1E0535",
  projects:  "#051E35",
  skills:    "#1A1A0A",
  education: "#2E0A1A",
  contact:   "#0A2E1A",
  footer:    "#0D0D1A",
};

function ColorDivider({ color, nextColor }: { color: string; nextColor?: string }) {
  return (
    <div className="relative" style={{ height: 8 }}>
      <div
        className="absolute inset-0"
        style={{
          background: nextColor
            ? `linear-gradient(90deg, ${color}, ${nextColor})`
            : color,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: nextColor
            ? `linear-gradient(90deg, ${color}40, ${nextColor}40)`
            : `${color}40`,
          filter: "blur(12px)",
        }}
      />
    </div>
  );
}

const INTRO = "两年AI训练师经验 · 小米+长城双大厂 · 6个核心项目全流程交付";

const navItems = [
  { label: "作品", id: "portfolio", color: "#FF3AF2" },
  { label: "项目 & 经历", id: "projects", color: "#00F5D4" },
  { label: "技能", id: "skills", color: "#FFE600" },
  { label: "联系", id: "contact", color: "#7B2FFF" },
];


function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ${delay}s cubic-bezier(.16,1,.3,1), transform 0.7s ${delay}s cubic-bezier(.16,1,.3,1)`,
      }}
    >
      {children}
    </div>
  );
}

function FloatingChars({ text, baseDelay, baseDuration, className, style, charClassName }: {
  text: string;
  baseDelay: number;
  baseDuration: number;
  className?: string;
  style?: React.CSSProperties;
  charClassName?: string;
}) {
  return (
    <span className={className} style={{ display: "inline-flex", flexWrap: "wrap", justifyContent: "center", ...style }}>
      {Array.from(text).map((ch, i) => (
        <span
          key={i}
          className={charClassName}
          style={{
            display: "inline-block",
            animation: `float ${baseDuration + (i % 4) * 0.3}s ease-in-out infinite`,
            animationDelay: `${baseDelay + i * 0.12}s`,
            whiteSpace: ch === " " ? "pre" : undefined,
          }}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

function TypeWriter() {
  return (
    <div style={{ textAlign: "center" }}>
      <h1
        className="font-outfit font-black"
        style={{
          fontSize: 72,
          letterSpacing: "-2px",
          lineHeight: 1.1,
          margin: "0 auto 16px",
        }}
      >
        <FloatingChars text="朱美阳" baseDelay={0} baseDuration={2.8} charClassName="gradient-text" />
      </h1>

      <p
        className="font-outfit font-bold text-shadow-double"
        style={{
          fontSize: 22,
          color: "#E0E0E0",
          lineHeight: 1.6,
        }}
      >
        <FloatingChars text="AI训练师 / 大模型数据专家" baseDelay={0.3} baseDuration={3} />
      </p>
    </div>
  );
}

function FloatingEmoji({
  emoji,
  style,
}: {
  emoji: string;
  style: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      className="absolute pointer-events-none select-none text-2xl animate-float"
      style={{ ...style, opacity: 0.15 }}
    >
      {emoji}
    </span>
  );
}

function DashedCircle({
  size,
  color,
  style,
}: {
  size: number;
  color: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden="true"
      className="absolute pointer-events-none animate-spin-slow"
      style={{
        width: size,
        height: size,
        border: `2px dashed ${color}`,
        borderRadius: "50%",
        opacity: 0.12,
        ...style,
      }}
    />
  );
}

function ColorSquare({
  color,
  style,
}: {
  color: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden="true"
      className="absolute pointer-events-none animate-wiggle"
      style={{
        width: 12,
        height: 12,
        background: color,
        opacity: 0.18,
        borderRadius: 2,
        ...style,
      }}
    />
  );
}

function SectionHeading({
  num,
  title,
  accent,
  bgText,
}: {
  num: string;
  title: string;
  accent: string;
  bgText: string;
}) {
  return (
    <div className="relative mb-12">
      <span
        className="absolute -top-16 -left-4 font-outfit font-black text-[120px] md:text-[180px] uppercase leading-none select-none pointer-events-none"
        style={{ color: accent, opacity: 0.04 }}
        aria-hidden="true"
      >
        {bgText}
      </span>
      <div className="relative flex items-center gap-4">
        <div
          className="flex items-center justify-center w-14 h-14 rounded-2xl border-4 font-space-mono font-bold text-xl"
          style={{
            borderColor: accent,
            color: accent,
            background: `${accent}15`,
            borderStyle: "dashed",
          }}
        >
          {num}
        </div>
        <h2
          className="font-outfit font-black uppercase text-5xl md:text-7xl text-shadow-triple"
          style={{ color: "#FFFFFF" }}
        >
          {title}
        </h2>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [selectedPortfolio, setSelectedPortfolio] = useState(PORTFOLIO_HOME[0]?.id ?? null);
  const [activeNav, setActiveNav] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = navItems.map((n) => n.id);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveNav(entry.target.id);
          }
        }
      },
      { threshold: 0.3 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen font-dm-sans relative"
      style={{ color: "#e2e8f0" }}
      onMouseMove={(e) => setMouse({ x: e.clientX, y: e.clientY })}
    >
      <div
        className="fixed pointer-events-none"
        style={{
          left: mouse.x - 250,
          top: mouse.y - 250,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${ACCENT_COLORS[0]}12 0%, transparent 70%)`,
          zIndex: 100,
          transition: "left 0.15s, top 0.15s",
        }}
      />

        <nav
          className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 md:px-12"
          style={{
            background: scrollY > 50 ? "rgba(13,13,26,0.85)" : "transparent",
            backdropFilter: scrollY > 50 ? "blur(24px)" : "none",
            borderBottom: scrollY > 50 ? `4px solid ${ACCENT_COLORS[0]}` : "4px solid transparent",
            transition: "all 0.3s",
          }}
        >
          <button
            className="flex items-center gap-3 cursor-pointer border-none bg-transparent p-0"
            onClick={() => router.push("/")}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-[15px] font-black text-white border-4 animate-pulse-glow"
              style={{
                background: `linear-gradient(135deg, ${ACCENT_COLORS[0]}, ${ACCENT_COLORS[4]})`,
                borderColor: ACCENT_COLORS[2],
                fontFamily: "'Space Mono', monospace",
              }}
            >
              朱
            </div>
            <span
              className="text-[17px] font-bold tracking-[1px] text-white font-outfit"
              style={{
                textShadow: `0 0 8px ${ACCENT_COLORS[0]}80`,
              }}
            >
              Meiyang Zhu
            </span>
          </button>
          <div className="flex gap-6 md:gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToId(item.id)}
                className="relative text-[15px] font-bold tracking-[0.5px] border-none bg-transparent cursor-pointer p-0 pb-1 transition-all duration-200 font-outfit uppercase"
                style={{
                  color: activeNav === item.id ? item.color : `${item.color}90`,
                  borderBottom: activeNav === item.id ? `4px solid ${item.color}` : `4px solid ${item.color}30`,
                  textShadow: activeNav === item.id ? `0 0 12px ${item.color}60` : "none",
                }}
                onMouseEnter={(e) => {
                  if (activeNav !== item.id) {
                    e.currentTarget.style.color = item.color;
                    e.currentTarget.style.borderBottom = `4px solid ${item.color}`;
                    e.currentTarget.style.textShadow = `0 0 12px ${item.color}60`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeNav !== item.id) {
                    e.currentTarget.style.color = `${item.color}90`;
                    e.currentTarget.style.borderBottom = `4px solid ${item.color}30`;
                    e.currentTarget.style.textShadow = "none";
                  }
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        <section className="relative overflow-hidden" style={{ background: SECTION_BG.hero }}>
          <div className="relative px-6 pb-20 pt-[100px] md:px-12 md:pb-28 md:pt-[140px]" style={{ maxWidth: 900, margin: "0 auto" }}>
          <span
            className="absolute top-8 left-0 font-outfit font-black text-[200px] md:text-[280px] uppercase leading-none select-none pointer-events-none"
            style={{ color: ACCENT_COLORS[0], opacity: 0.04 }}
            aria-hidden="true"
          >
            HELLO
          </span>

          <FloatingEmoji emoji="🚀" style={{ top: "10%", left: "5%" }} />
          <FloatingEmoji emoji="✨" style={{ top: "20%", right: "8%", animationDelay: "1s" }} />
          <FloatingEmoji emoji="💫" style={{ bottom: "25%", left: "15%", animationDelay: "2s" }} />
          <FloatingEmoji emoji="⚡" style={{ top: "35%", right: "15%", animationDelay: "0.5s" }} />
          <DashedCircle size={120} color={ACCENT_COLORS[0]} style={{ top: "5%", right: "10%" }} />
          <DashedCircle size={80} color={ACCENT_COLORS[1]} style={{ bottom: "15%", left: "3%" }} />
          <ColorSquare color={ACCENT_COLORS[2]} style={{ top: "30%", left: "8%" }} />
          <ColorSquare color={ACCENT_COLORS[3]} style={{ bottom: "30%", right: "5%" }} />

          <div className="relative">
            <TypeWriter />

            <div
              className="max-w-[560px] mx-auto mb-16 text-center"
              style={{ marginTop: 24 }}
            >
              <FloatingChars
                text={INTRO}
                baseDelay={0.6}
                baseDuration={3.2}
                className="text-lg md:text-xl font-medium font-dm-sans"
                style={{
                  color: "#F5F5F5",
                  textShadow: `0 0 6px ${ACCENT_COLORS[0]}40`,
                }}
              />
            </div>

            <Section delay={0.15}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-16">
                {STATS.map((s, i) => {
                  const accent = ACCENT_COLORS[i % 5];
                  const clashBorder = ACCENT_COLORS[(i + 2) % 5];
                  const floatDurations = ["3s", "3.5s", "2.8s", "3.2s"];
                  const floatDelays = ["0s", "0.6s", "1.2s", "0.3s"];
                  return (
                    <div
                      key={i}
                      className="relative py-8 px-5 text-center rounded-3xl border-4 backdrop-blur-sm"
                      style={{
                        background: "#2D1B4E80",
                        borderColor: clashBorder,
                        borderStyle: i % 2 === 0 ? "solid" : "dashed",
                        boxShadow: `8px 8px 0 ${accent}, 16px 16px 0 ${ACCENT_COLORS[(i + 3) % 5]}`,
                        animation: `float ${floatDurations[i]} ease-in-out infinite`,
                        animationDelay: floatDelays[i],
                      }}
                    >
                      <div
                        className="text-[36px] font-black tracking-[-2px] font-space-mono"
                        style={{ color: accent, textShadow: `0 0 20px ${accent}80` }}
                      >
                        {s.num}
                      </div>
                      <div
                        className="text-[15px] font-bold mt-2 font-outfit uppercase"
                        style={{ color: "#FFFFFF" }}
                      >
                        {s.label}
                      </div>
                      <div
                        className="text-[13px] mt-1 font-space-mono"
                        style={{ color: "rgba(255,255,255,0.55)" }}
                      >
                        {s.sub}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>
          </div>
          </div>
        </section>

        <ColorDivider color={ACCENT_COLORS[0]} nextColor={ACCENT_COLORS[4]} />

        <section className="relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${SECTION_BG.hero}, ${SECTION_BG.portfolio})` }}>
          <div className="relative px-6 py-10 md:px-12 md:py-16" style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="absolute inset-0 pattern-checker opacity-[0.03]" aria-hidden="true" />
          <ScrollRevealPhoto photoA="/A1.jpg" photoB="/B1.jpg" borderColor={ACCENT_COLORS[0]} shadowColor={ACCENT_COLORS[2]} shadowColor2={ACCENT_COLORS[4]} />
          </div>
        </section>

        <ColorDivider color={ACCENT_COLORS[4]} nextColor={ACCENT_COLORS[0]} />

        <section
          id="portfolio"
          className="relative overflow-hidden"
          style={{ background: SECTION_BG.portfolio }}
        >
          <div className="relative px-6 py-24 md:px-12 md:py-32" style={{ maxWidth: 900, margin: "0 auto" }}>
          <FloatingEmoji emoji="🎯" style={{ top: "5%", right: "3%" }} />
          <FloatingEmoji emoji="🔥" style={{ bottom: "10%", left: "5%", animationDelay: "1.5s" }} />
          <DashedCircle size={100} color={ACCENT_COLORS[0]} style={{ top: "10%", left: "0%" }} />
          <ColorSquare color={ACCENT_COLORS[2]} style={{ top: "15%", right: "12%" }} />
          <ColorSquare color={ACCENT_COLORS[1]} style={{ bottom: "20%", left: "10%" }} />

          <Section>
            <SectionHeading num="01" title="作品集" accent={ACCENT_COLORS[0]} bgText="WORKS" />
          </Section>

          <Section delay={0.06}>
            <IconNavSelector
              items={PORTFOLIO_HOME.map((p) => ({
                id: p.id,
                title: p.title,
                icon: p.icon,
                color: p.color,
                cover: p.cover,
              }))}
              activeId={selectedPortfolio}
              onSelect={setSelectedPortfolio}
            />
          </Section>

          {(() => {
            const item = PORTFOLIO_HOME.find((p) => p.id === selectedPortfolio);
            if (!item) return null;
            return (
              <Section key={item.id} delay={0.1}>
                <button
                  onClick={() => router.push(`/portfolio/${item.id}`)}
                  className="w-full text-left cursor-pointer border-none bg-transparent p-0 mt-6"
                >
                  <div
                    className="group relative rounded-3xl overflow-hidden border-4 transition-all duration-300 ease-out backdrop-blur-sm"
                    style={{
                      background: "#2D1B4E80",
                      borderColor: ACCENT_COLORS[0],
                      boxShadow: `8px 8px 0 ${ACCENT_COLORS[2]}, 16px 16px 0 ${ACCENT_COLORS[1]}`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = item.color;
                      e.currentTarget.style.transform = "translateY(-4px) rotate(-0.5deg)";
                      e.currentTarget.style.boxShadow = `12px 12px 0 ${item.color}, 24px 24px 0 ${ACCENT_COLORS[0]}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = ACCENT_COLORS[0];
                      e.currentTarget.style.transform = "translateY(0) rotate(0deg)";
                      e.currentTarget.style.boxShadow = `8px 8px 0 ${ACCENT_COLORS[2]}, 16px 16px 0 ${ACCENT_COLORS[1]}`;
                    }}
                  >
                    <div
                      className="absolute -top-[60px] -right-[60px] w-[160px] h-[160px] rounded-full pointer-events-none"
                      aria-hidden="true"
                      style={{ background: `radial-gradient(circle, ${item.color}25 0%, transparent 70%)` }}
                    />
                    <div className="flex gap-5 p-6 items-center">
                      <div
                        className="w-24 h-24 rounded-2xl shrink-0 overflow-hidden border-4"
                        style={{ background: `${item.color}15`, borderColor: ACCENT_COLORS[2], borderStyle: "dashed" }}
                      >
                        <img src={item.cover} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{item.icon}</span>
                          <span
                            className="text-xl font-black text-white font-outfit uppercase"
                            style={{ textShadow: `0 0 10px ${item.color}60` }}
                          >
                            {item.title}
                          </span>
                        </div>
                        <p
                          className="text-[14px] mb-3 leading-relaxed font-dm-sans"
                          style={{ color: "rgba(255,255,255,0.6)" }}
                        >
                          {item.desc}
                        </p>
                        <span
                          className="inline-block text-[12px] px-3 py-1 rounded-full border-2 font-space-mono font-bold"
                          style={{
                            color: item.color,
                            background: `${item.color}15`,
                            borderColor: item.color,
                          }}
                        >
                          {item.count}
                        </span>
                      </div>
                      <div className="text-white/20 group-hover:text-white/60 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </button>
              </Section>
            );
          })()}
          </div>
        </section>

        <ColorDivider color={ACCENT_COLORS[0]} nextColor={ACCENT_COLORS[1]} />

        <section className="relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${SECTION_BG.portfolio}, ${SECTION_BG.projects})` }}>
          <div className="relative px-6 py-10 md:px-12 md:py-16" style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="absolute inset-0 pattern-dots opacity-[0.04]" aria-hidden="true" />
          <ScrollRevealPhoto photoA="/A2.jpg" photoB="/B2.jpg" borderColor={ACCENT_COLORS[1]} shadowColor={ACCENT_COLORS[3]} shadowColor2={ACCENT_COLORS[0]} />
          </div>
        </section>

        <ColorDivider color={ACCENT_COLORS[1]} nextColor={ACCENT_COLORS[0]} />

        <section
          id="projects"
          className="relative overflow-hidden"
          style={{ background: SECTION_BG.projects }}
        >
          <div className="relative px-6 py-24 md:px-12 md:py-32" style={{ maxWidth: 700, margin: "0 auto" }}>
          <FloatingEmoji emoji="💬" style={{ top: "8%", left: "2%" }} />
          <FloatingEmoji emoji="✨" style={{ bottom: "15%", right: "5%", animationDelay: "2s" }} />
          <DashedCircle size={90} color={ACCENT_COLORS[1]} style={{ bottom: "5%", right: "0%" }} />
          <ColorSquare color={ACCENT_COLORS[0]} style={{ top: "20%", right: "8%" }} />
          <ColorSquare color={ACCENT_COLORS[3]} style={{ bottom: "25%", left: "3%" }} />

          <Section>
            <SectionHeading num="02" title="项目 & 经历" accent={ACCENT_COLORS[1]} bgText="EXPERIENCE" />
          </Section>
          <Section delay={0.1}>
            <FlipRadarCard radarData={RADAR_DATA} experiences={EXPERIENCES} />
          </Section>
          </div>
        </section>

        <ColorDivider color={ACCENT_COLORS[1]} nextColor={ACCENT_COLORS[2]} />

        <section className="relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${SECTION_BG.projects}, ${SECTION_BG.skills})` }}>
          <div className="relative px-6 py-10 md:px-12 md:py-16" style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="absolute inset-0 pattern-stripes opacity-[0.03]" aria-hidden="true" />
          <ScrollRevealPhoto photoA="/A3.jpg" photoB="/B3.jpg" borderColor={ACCENT_COLORS[2]} shadowColor={ACCENT_COLORS[4]} shadowColor2={ACCENT_COLORS[1]} />
          </div>
        </section>

        <ColorDivider color={ACCENT_COLORS[2]} nextColor={ACCENT_COLORS[1]} />

        <section
          id="skills"
          className="relative overflow-hidden"
          style={{ background: SECTION_BG.skills }}
        >
          <div className="relative px-6 py-24 md:px-12 md:py-32" style={{ maxWidth: 960, margin: "0 auto" }}>
          <FloatingEmoji emoji="🎯" style={{ top: "6%", right: "6%" }} />
          <FloatingEmoji emoji="💫" style={{ bottom: "12%", left: "4%", animationDelay: "1s" }} />
          <DashedCircle size={110} color={ACCENT_COLORS[2]} style={{ top: "3%", left: "5%" }} />
          <ColorSquare color={ACCENT_COLORS[4]} style={{ top: "18%", right: "3%" }} />
          <ColorSquare color={ACCENT_COLORS[0]} style={{ bottom: "15%", right: "10%" }} />

          <Section>
            <SectionHeading num="03" title="专业技能" accent={ACCENT_COLORS[2]} bgText="SKILLS" />
          </Section>
          <Section delay={0.08}>
            <SkillsPiano />
          </Section>
          </div>
        </section>

        <ColorDivider color={ACCENT_COLORS[2]} nextColor={ACCENT_COLORS[3]} />

        <section
          id="education"
          className="relative overflow-hidden"
          style={{ background: SECTION_BG.education }}
        >
          <div className="relative px-6 py-24 md:px-12 md:py-32" style={{ maxWidth: 900, margin: "0 auto" }}>
          <FloatingEmoji emoji="🚀" style={{ top: "10%", right: "8%" }} />
          <FloatingEmoji emoji="⚡" style={{ bottom: "20%", left: "6%", animationDelay: "0.8s" }} />
          <DashedCircle size={70} color={ACCENT_COLORS[3]} style={{ bottom: "10%", right: "5%" }} />
          <ColorSquare color={ACCENT_COLORS[1]} style={{ top: "15%", left: "5%" }} />

          <span
            className="absolute -top-8 -left-4 font-outfit font-black text-[120px] md:text-[180px] uppercase leading-none select-none pointer-events-none"
            style={{ color: ACCENT_COLORS[3], opacity: 0.04 }}
            aria-hidden="true"
          >
            EDU
          </span>

          <Section>
            <div className="relative flex items-center gap-4 mb-12">
              <div
                className="flex items-center justify-center w-14 h-14 rounded-2xl border-4 font-space-mono font-bold text-xl"
                style={{
                  borderColor: ACCENT_COLORS[3],
                  color: ACCENT_COLORS[3],
                  background: `${ACCENT_COLORS[3]}15`,
                  borderStyle: "solid",
                }}
              >
                04
              </div>
              <h2
                className="font-outfit font-black uppercase text-5xl md:text-7xl text-shadow-triple"
                style={{ color: "#FFFFFF" }}
              >
                教育背景
              </h2>
            </div>

            <div
              className="relative p-8 rounded-3xl border-4 backdrop-blur-sm"
              style={{
                background: "#2D1B4E80",
                borderColor: ACCENT_COLORS[2],
                borderStyle: "dashed",
                boxShadow: `8px 8px 0 ${ACCENT_COLORS[3]}, 16px 16px 0 ${ACCENT_COLORS[0]}`,
                transform: "rotate(-0.5deg)",
              }}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <div
                    className="text-2xl font-black text-white mb-2 font-outfit"
                    style={{ textShadow: `0 0 12px ${ACCENT_COLORS[3]}60` }}
                  >
                    湖北汽车工程学院
                  </div>
                  <div
                    className="text-[15px] font-dm-sans"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    电子信息工程（本科）
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="text-sm font-bold font-space-mono"
                    style={{ color: ACCENT_COLORS[3] }}
                  >
                    2021 — 2025
                  </div>
                  <div className="flex gap-3 mt-3 justify-end flex-wrap">
                    {["GPA 3.5", "Top 7%", "优秀毕业生"].map((t, i) => {
                      const tagColor = ACCENT_COLORS[(i + 3) % 5];
                      return (
                        <span
                          key={i}
                          className="text-[12px] px-3 py-1 rounded-full border-2 font-bold font-space-mono"
                          style={{
                            color: tagColor,
                            borderColor: tagColor,
                            background: `${tagColor}15`,
                          }}
                        >
                          {t}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </Section>
          </div>
        </section>

        <ColorDivider color={ACCENT_COLORS[3]} nextColor={ACCENT_COLORS[4]} />

        <section
          id="contact"
          className="relative overflow-hidden"
          style={{ background: SECTION_BG.contact }}
        >
          <div className="relative px-6 py-24 md:px-12 md:py-32 text-center" style={{ maxWidth: 900, margin: "0 auto" }}>
          <FloatingEmoji emoji="💰" style={{ top: "8%", left: "10%" }} />
          <FloatingEmoji emoji="🔥" style={{ top: "15%", right: "12%", animationDelay: "1.2s" }} />
          <FloatingEmoji emoji="✨" style={{ bottom: "20%", left: "8%", animationDelay: "0.5s" }} />
          <DashedCircle size={140} color={ACCENT_COLORS[4]} style={{ top: "5%", right: "15%" }} />
          <DashedCircle size={60} color={ACCENT_COLORS[0]} style={{ bottom: "10%", left: "20%" }} />
          <ColorSquare color={ACCENT_COLORS[2]} style={{ top: "25%", left: "15%" }} />
          <ColorSquare color={ACCENT_COLORS[3]} style={{ bottom: "30%", right: "18%" }} />

          <span
            className="absolute top-0 left-1/2 -translate-x-1/2 font-outfit font-black text-[150px] md:text-[220px] uppercase leading-none select-none pointer-events-none"
            style={{ color: ACCENT_COLORS[4], opacity: 0.04 }}
            aria-hidden="true"
          >
            CONTACT
          </span>

          <Section>
            <div className="relative inline-block">
              <div
                className="flex items-center justify-center gap-3 mb-6"
              >
                <div
                  className="w-3 h-8 rounded-full"
                  style={{ background: ACCENT_COLORS[4] }}
                />
                <p
                  className="text-[14px] tracking-[3px] mb-0 font-black font-space-mono uppercase"
                  style={{ color: ACCENT_COLORS[4] }}
                >
                  CONTACT
                </p>
              </div>
              <h2
                className="text-4xl md:text-6xl font-black mb-4 font-outfit uppercase gradient-text"
              >
                期待与您交流
              </h2>
              <p
                className="text-[16px] mb-12 font-dm-sans"
                style={{
                  color: "rgba(255,255,255,0.65)",
                  textShadow: `0 0 6px ${ACCENT_COLORS[4]}30`,
                }}
              >
                如果您对我的项目经历感兴趣，欢迎随时联系
              </p>
            </div>

            <div className="flex justify-center gap-6 flex-wrap">
              {[
                { label: "134 0968 7811", icon: "📱" },
                { label: "2595617884@qq.com", icon: "✉️" },
              ].map((c, i) => {
                const cardAccent = ACCENT_COLORS[(i + 4) % 5];
                const borderClash = ACCENT_COLORS[(i + 1) % 5];
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-7 py-4 rounded-3xl text-base cursor-pointer transition-all duration-300 border-4 font-bold font-dm-sans backdrop-blur-sm"
                    style={{
                      background: "#2D1B4E80",
                      borderColor: borderClash,
                      color: "rgba(255,255,255,0.8)",
                      boxShadow: `6px 6px 0 ${cardAccent}`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = cardAccent;
                      e.currentTarget.style.boxShadow = `0 0 30px ${cardAccent}40, 8px 8px 0 ${borderClash}`;
                      e.currentTarget.style.transform = "translateY(-2px) rotate(-1deg)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = borderClash;
                      e.currentTarget.style.boxShadow = `6px 6px 0 ${cardAccent}`;
                      e.currentTarget.style.transform = "translateY(0) rotate(0deg)";
                    }}
                  >
                    <span className="text-2xl">{c.icon}</span>
                    <span>{c.label}</span>
                  </div>
                );
              })}
            </div>
          </Section>
          </div>
        </section>

        <ColorDivider color={ACCENT_COLORS[4]} nextColor={ACCENT_COLORS[0]} />

        <footer className="relative py-12 text-center" style={{ background: SECTION_BG.footer }}>
          <div className="pattern-dots opacity-[0.03] absolute inset-0" aria-hidden="true" />
          <p
            className="text-sm font-space-mono relative"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            © 2025 Meiyang Zhu · Built with 🔥
          </p>
        </footer>
    </div>
  );
}
