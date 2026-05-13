"use client";

import { useState, useEffect, useRef } from "react";
import { EXPERIENCES, STATS, RADAR_DATA, PORTFOLIO_HOME } from "@/data/portfolio-home";
import { useInView } from "@/hooks/use-in-view";
import { useRouter } from "next/navigation";
import { FlipRadarCard } from "@/components/flip-radar-card";
import { IconNavSelector } from "@/components/icon-nav-selector";
import { ClickRippleCanvas } from "@/components/click-ripple-canvas";
import { ScrollRevealPhoto } from "@/components/scroll-reveal-photo";
import { SkillsPiano } from "@/components/skills-piano";

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

const INTRO = "两年AI训练师经验 · 小米+长城双大厂 · 6个核心项目全流程交付";

function TypeWriter() {
  return (
    <div style={{ textAlign: "center" }}>
      <h1 className="typewriter-name" style={{
        fontSize: 58,
        fontWeight: 700,
        letterSpacing: "-2px",
        background: "linear-gradient(180deg, #ffffff 30%, rgba(255,255,255,0.45) 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        lineHeight: 1.1,
        margin: "0 auto 16px",
        display: "inline-block",
      }}>
        <span className="tw-inner tw-name">朱美阳</span>
      </h1>

      <br />

      <p className="typewriter-title" style={{
        fontSize: 18,
        color: "rgba(255,255,255,0.5)",
        lineHeight: 1.6,
        display: "inline-block",
      }}>
        <span className="tw-inner tw-title">AI训练师 / 大模型数据专家</span>
      </p>

      <style>{`
        .tw-inner {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          width: 0;
        }
        .tw-name {
          border-right: 2px solid #3b82f6;
          animation:
            typeName 0.8s steps(3) 0.5s forwards,
            cursorBlink 0.6s step-end 0.5s 6,
            forceShow 0s 5s forwards;
        }
        .tw-title {
          border-right-color: transparent;
          animation:
            typeTitle 1.2s steps(14) 1.8s forwards,
            showCursor 0s 1.8s forwards,
            cursorBlink 0.6s step-end 1.8s 8,
            hideCursor 0s 4.5s forwards,
            forceShow 0s 5s forwards;
        }
        @keyframes typeName  { from { width: 0; } to { width: 3em; } }
        @keyframes typeTitle { from { width: 0; } to { width: 14em; } }
        @keyframes cursorBlink { 0%,100% { border-right-color: #3b82f6; } 50% { border-right-color: transparent; } }
        @keyframes showCursor  { to { border-right-color: #3b82f6; } }
        @keyframes hideCursor  { to { border-right-color: transparent; } }
        @keyframes forceShow  { to { width: auto; overflow: visible; border-right: none; } }
      `}</style>
    </div>
  );
}

const navItems = [
  { label: "作品", id: "portfolio" },
  { label: "项目 & 经历", id: "projects" },
  { label: "技能", id: "skills" },
  { label: "联系", id: "contact" },
];

export default function HomePage() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [selectedPortfolio, setSelectedPortfolio] = useState(PORTFOLIO_HOME[0]?.id ?? null);
  const router = useRouter();

  // RAF-throttled scroll for parallax
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

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "transparent",
        color: "#e2e8f0",
        fontFamily: "'DM Sans', 'Noto Sans SC', system-ui, sans-serif",
        position: "relative",
      }}
      onMouseMove={(e) => setMouse({ x: e.clientX, y: e.clientY })}
    >
      {/* ================================================================
           LAYER Z-INDEX MAP
           z=-1 → ParticleNetworkBackground (existing, handled by layout)
           z=0  → Parallax background (grid + orbs)
           z=1  → ClickRippleCanvas (click ripple overlay)
           z=2  → Cursor glow + page content
      ================================================================ */}

      {/* Layer 0 — Parallax Background */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {/* Layer 0a: Dot grid (farthest, 10% scroll) */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            transform: `translateY(${scrollY * 0.1}px)`,
            willChange: "transform",
          }}
        />

        {/* Layer 0b: Blur orbs (middle, 30% scroll) */}
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
            willChange: "transform",
          }}
        >
          <div style={{
            position: "absolute", top: "-10%", left: "60%",
            width: 600, height: 600,
            background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
            borderRadius: "50%", filter: "blur(80px)", opacity: 0.12,
          }} />
          <div style={{
            position: "absolute", top: "30%", left: "-10%",
            width: 500, height: 500,
            background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
            borderRadius: "50%", filter: "blur(80px)", opacity: 0.12,
          }} />
          <div style={{
            position: "absolute", top: "70%", left: "70%",
            width: 400, height: 400,
            background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
            borderRadius: "50%", filter: "blur(80px)", opacity: 0.12,
          }} />
        </div>
      </div>

      {/* Layer 1 — Click Ripple Canvas */}
      <ClickRippleCanvas />

      {/* Layer 2 — Cursor glow + Content */}
      <div className="relative" style={{ zIndex: 3 }}>
        {/* Cursor glow */}
        <div
          className="fixed pointer-events-none"
          style={{
            left: mouse.x - 200,
            top: mouse.y - 200,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
            zIndex: 1,
            transition: "left 0.3s, top 0.3s",
          }}
        />

        {/* Nav */}
        <nav
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 md:px-12"
          style={{
            background: scrollY > 50 ? "rgba(6,9,15,0.8)" : "transparent",
            backdropFilter: scrollY > 50 ? "blur(20px)" : "none",
            borderBottom: scrollY > 50 ? "0.5px solid rgba(255,255,255,0.06)" : "0.5px solid transparent",
            transition: "all 0.3s",
          }}
        >
          <button
            className="flex items-center gap-2.5 cursor-pointer border-none bg-transparent p-0"
            onClick={() => router.push("/")}
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[13px] font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                fontFamily: "'Space Mono', monospace",
              }}
            >
              朱
            </div>
            <span className="text-[15px] font-medium tracking-[0.5px] text-white">Meiyang Zhu</span>
          </button>
          <div className="flex gap-8">
            {navItems.map((item, i) => (
              <button
                key={i}
                onClick={() => scrollToId(item.id)}
                className="text-[13px] tracking-[0.5px] border-none bg-transparent cursor-pointer p-0 transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.4)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Hero with Typewriter */}
        <section className="px-6 pb-12 pt-[100px] md:px-12 md:pb-16 md:pt-[120px]" style={{ maxWidth: 800, margin: "0 auto" }}>
          <TypeWriter />

          <p
            className="text-sm md:text-[15px] leading-relaxed max-w-[500px] mx-auto mb-12 font-normal"
            style={{
              color: "rgba(255,255,255,0.35)",
              opacity: 1,
              textAlign: "center",
            }}
          >
            {INTRO}
          </p>

          <Section delay={0.15}>
            <div
              className="grid grid-cols-4 gap-0 rounded-2xl overflow-hidden mb-12 border"
              style={{
                background: "rgba(255,255,255,0.04)",
                borderColor: "rgba(255,255,255,0.06)",
              }}
            >
              {STATS.map((s, i) => (
                <div
                  key={i}
                  className="py-6 px-4 text-center"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    borderRight: i < 3 ? "0.5px solid rgba(255,255,255,0.04)" : "none",
                  }}
                >
                  <div
                    className="text-[28px] font-bold tracking-[-1px] text-white"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    {s.num}
                  </div>
                  <div className="text-[13px] mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {s.label}
                  </div>
                  <div className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </section>

        {/* Scroll-Reveal Photo Area 1 */}
        <section className="px-6 py-10 md:px-12 md:py-16" style={{ maxWidth: 900, margin: "0 auto" }}>
          <ScrollRevealPhoto photoA="/A1.jpg" photoB="/B1.jpg" />
        </section>

        {/* Portfolio */}
        <section id="portfolio" className="px-6 py-10 md:px-12 md:py-16" style={{ maxWidth: 900, margin: "0 auto" }}>
          <Section>
            <div className="flex items-center gap-3 mb-8">
              <span
                className="text-[11px] tracking-[2px]"
                style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.25)" }}
              >
                01
              </span>
              <div className="w-6 h-px" style={{ background: "rgba(255,255,255,0.15)" }} />
              <span className="text-sm font-medium text-white">作品集</span>
            </div>
          </Section>

          <Section delay={0.06}>
            <IconNavSelector
              items={PORTFOLIO_HOME.map((p) => ({
                id: p.id,
                title: p.title,
                icon: p.icon,
                color: p.color,
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
                  className="w-full text-left cursor-pointer border-none bg-transparent p-0 mt-4"
                >
                  <div
                    className="group relative rounded-2xl overflow-hidden border transition-all duration-300 ease-out"
                    style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `${item.color}50`;
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                    }}
                  >
                    <div
                      className="absolute -top-[40px] -right-[40px] w-[120px] h-[120px] rounded-full pointer-events-none"
                      style={{ background: `radial-gradient(circle, ${item.color}12 0%, transparent 70%)` }}
                    />
                    <div className="flex gap-4 p-5 items-center">
                      <div className="w-20 h-20 rounded-xl shrink-0 overflow-hidden" style={{ background: `${item.color}10` }}>
                        <img src={item.cover} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-lg">{item.icon}</span>
                          <span className="text-base font-semibold text-white">{item.title}</span>
                        </div>
                        <p className="text-[13px] mb-2 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{item.desc}</p>
                        <span className="inline-block text-[11px] px-2.5 py-[3px] rounded-md" style={{ color: item.color, background: `${item.color}10`, fontFamily: "'Space Mono', monospace" }}>{item.count}</span>
                      </div>
                      <div className="text-[#ffffff20] group-hover:text-[#ffffff40] transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                      </div>
                    </div>
                    <div className="h-[2px] w-full rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(90deg, transparent, ${item.color}60, transparent)` }} />
                  </div>
                </button>
              </Section>
            );
          })()}
        </section>

        {/* Scroll-Reveal Photo Area 2 */}
        <section className="px-6 py-10 md:px-12 md:py-16" style={{ maxWidth: 900, margin: "0 auto" }}>
          <ScrollRevealPhoto photoA="/A2.jpg" photoB="/B2.jpg" />
        </section>

        {/* Projects & Experience — 3D Flip Card */}
        <section id="projects" className="px-6 py-10 md:px-12 md:py-16" style={{ maxWidth: 700, margin: "0 auto" }}>
          <Section>
            <div className="flex items-center gap-3 mb-8">
              <span className="text-[11px] tracking-[2px]" style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.25)" }}>02</span>
              <div className="w-6 h-px" style={{ background: "rgba(255,255,255,0.15)" }} />
              <span className="text-sm font-medium text-white">项目 & 经历</span>
            </div>
          </Section>
          <Section delay={0.1}>
            <FlipRadarCard radarData={RADAR_DATA} experiences={EXPERIENCES} />
          </Section>
        </section>

        {/* Scroll-Reveal Photo Area 3 */}
        <section className="px-6 py-10 md:px-12 md:py-16" style={{ maxWidth: 900, margin: "0 auto" }}>
          <ScrollRevealPhoto photoA="/A3.jpg" photoB="/B3.jpg" />
        </section>

        {/* Skills — Piano */}
        <section id="skills" className="px-6 py-10 md:px-12 md:py-16" style={{ maxWidth: 960, margin: "0 auto" }}>
          <Section>
            <div className="flex items-center gap-3 mb-8">
              <span className="text-[11px] tracking-[2px]" style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.25)" }}>03</span>
              <div className="w-6 h-px" style={{ background: "rgba(255,255,255,0.15)" }} />
              <span className="text-sm font-medium text-white">专业技能</span>
            </div>
          </Section>
          <Section delay={0.08}>
            <SkillsPiano />
          </Section>
        </section>

        {/* Education */}
        <section id="education" className="px-6 py-10 md:px-12 md:py-16" style={{ maxWidth: 900, margin: "0 auto" }}>
          <Section>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[11px] tracking-[2px]" style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.25)" }}>04</span>
              <div className="w-6 h-px" style={{ background: "rgba(255,255,255,0.15)" }} />
              <span className="text-sm font-medium text-white">教育背景</span>
            </div>
            <div className="p-6 rounded-2xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4" style={{ background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.06)" }}>
              <div>
                <div className="text-base font-semibold text-white mb-1">湖北汽车工程学院</div>
                <div className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>电子信息工程（本科）</div>
              </div>
              <div className="text-right">
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'Space Mono', monospace" }}>2021 — 2025</div>
                <div className="flex gap-2 mt-2 justify-end">
                  {["GPA 3.5", "Top 7%", "优秀毕业生"].map((t, i) => (
                    <span key={i} className="text-[11px] px-2.5 py-[3px] rounded-md" style={{ color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.04)" }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        </section>

        {/* Contact */}
        <section id="contact" className="px-6 py-20 md:px-12 md:py-16 text-center">
          <Section>
            <p className="text-[13px] tracking-[2px] mb-4" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'Space Mono', monospace" }}>CONTACT</p>
            <h2 className="text-[32px] font-bold mb-3 gradient-text" style={{ backgroundImage: "linear-gradient(90deg, #fff, rgba(255,255,255,0.6))" }}>期待与您交流</h2>
            <p className="text-[15px] mb-8" style={{ color: "rgba(255,255,255,0.35)" }}>如果您对我的项目经历感兴趣，欢迎随时联系</p>
            <div className="flex justify-center gap-4 flex-wrap">
              {[{ label: "134 0968 7811", icon: "📱" }, { label: "2595617884@qq.com", icon: "✉️" }].map((c, i) => (
                <div key={i} className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm cursor-pointer transition-all duration-200"
                  style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)"; e.currentTarget.style.background = "rgba(59,130,246,0.05)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                ><span>{c.icon}</span> {c.label}</div>
              ))}
            </div>
          </Section>
        </section>

      </div>

      {/* Inline keyframes for blink cursor */}
      <style>{`
        .gradient-text {
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
      `}</style>
    </div>
  );
}
