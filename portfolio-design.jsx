import { useState, useEffect, useRef } from "react";

const PROJECTS = [
  { name: "ASR 语音识别标注", company: "长城汽车", tag: "语音", color: "#3b82f6", result: "准确率 96.2%", desc: "车载噪音环境下12万+条语音转写与方言识别", icon: "🎙", size: "large" },
  { name: "Agent 旅游助手", company: "长城汽车", tag: "Agent", color: "#8b5cf6", result: "意图识别 +12%", desc: "12个场景 · 8类意图 · 15种工具调用", icon: "🧭", size: "small" },
  { name: "短图文审核系统", company: "长城汽车", tag: "审核", color: "#f59e0b", result: "召回率 97.2%", desc: "规则引擎+Qwen-VL自动化审核", icon: "🛡", size: "small" },
  { name: "SFT 多轮对话标注", company: "小米科技", tag: "NLP", color: "#10b981", result: "准确率 95.1%", desc: "8万+条对话数据，解决幻觉与指令遵循", icon: "💬", size: "large" },
  { name: "图片理解标注", company: "小米科技", tag: "多模态", color: "#ec4899", result: "准确率 95.3%", desc: "3万+张图片双审质检与OCR标注", icon: "👁", size: "small" },
  { name: "文生图评测", company: "小米科技", tag: "AIGC", color: "#06b6d4", result: "采纳建议 8项", desc: "12维度评测体系 · 1.5万+组对比", icon: "🎨", size: "small" },
];

const SKILLS = [
  { cat: "数据标注", items: ["SFT对话", "图片理解", "ASR语音", "文生图评测", "内容审核"] },
  { cat: "项目管理", items: ["需求分析", "SOP制定", "质量管控", "Badcase管理"] },
  { cat: "工具技术", items: ["Prompt Engineering", "Coze", "Trae", "飞书", "Python"] },
];

function useInView(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

function Section({ children, delay = 0 }) {
  const ref = useRef(null);
  const visible = useInView(ref);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.7s ${delay}s cubic-bezier(.16,1,.3,1), transform 0.7s ${delay}s cubic-bezier(.16,1,.3,1)`,
    }}>{children}</div>
  );
}

function Orb({ top, left, color, size }) {
  return (
    <div style={{
      position: "absolute", top, left, width: size, height: size,
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      borderRadius: "50%", filter: "blur(80px)", opacity: 0.12, pointerEvents: "none",
    }} />
  );
}

export default function Portfolio() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{
      minHeight: "100vh", background: "#06090F",
      color: "#e2e8f0", fontFamily: "'DM Sans', 'Noto Sans SC', system-ui, sans-serif",
      position: "relative", overflow: "hidden",
    }}
      onMouseMove={e => setMouse({ x: e.clientX, y: e.clientY })}
    >
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* Background effects */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <Orb top="-10%" left="60%" color="#3b82f6" size="600px" />
        <Orb top="30%" left="-10%" color="#8b5cf6" size="500px" />
        <Orb top="70%" left="70%" color="#06b6d4" size="400px" />
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03,
          backgroundImage: `radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }} />
      </div>

      {/* Cursor glow */}
      <div style={{
        position: "fixed", left: mouse.x - 200, top: mouse.y - 200,
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 1, transition: "left 0.3s, top 0.3s",
      }} />

      <div style={{ position: "relative", zIndex: 2 }}>
        {/* Nav */}
        <nav style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "20px 48px", position: "sticky", top: 0, zIndex: 10,
          background: scrollY > 50 ? "rgba(6,9,15,0.8)" : "transparent",
          backdropFilter: scrollY > 50 ? "blur(20px)" : "none",
          borderBottom: scrollY > 50 ? "0.5px solid rgba(255,255,255,0.06)" : "none",
          transition: "all 0.3s",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: "#fff",
              fontFamily: "'Space Mono', monospace",
            }}>朱</div>
            <span style={{ fontSize: 15, fontWeight: 500, color: "#fff", letterSpacing: "0.5px" }}>Meiyang Zhu</span>
          </div>
          <div style={{ display: "flex", gap: 32 }}>
            {["项目", "经历", "技能", "联系"].map((t, i) => (
              <span key={i} style={{
                fontSize: 13, color: "rgba(255,255,255,0.4)", cursor: "pointer",
                transition: "color 0.2s", letterSpacing: "0.5px",
              }}
                onMouseEnter={e => e.target.style.color = "#fff"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}
              >{t}</span>
            ))}
          </div>
        </nav>

        {/* Hero */}
        <div style={{ padding: "100px 48px 80px", maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <Section>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 16px", borderRadius: 20,
              background: "rgba(59,130,246,0.08)", border: "0.5px solid rgba(59,130,246,0.2)",
              fontSize: 13, color: "#60a5fa", marginBottom: 28,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", animation: "pulse 2s infinite" }} />
              正在寻找AI训练师 / 数据工程相关机会
            </div>
          </Section>

          <Section delay={0.1}>
            <h1 style={{
              fontSize: 56, fontWeight: 700, letterSpacing: "-2px",
              background: "linear-gradient(180deg, #ffffff 30%, rgba(255,255,255,0.5) 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              lineHeight: 1.1, margin: "0 0 16px",
            }}>
              朱美阳
            </h1>
          </Section>

          <Section delay={0.15}>
            <p style={{
              fontSize: 18, color: "rgba(255,255,255,0.4)", lineHeight: 1.6,
              maxWidth: 500, margin: "0 auto 48px", fontWeight: 400,
            }}>
              两年AI训练师经验<br />
              <span style={{ color: "rgba(255,255,255,0.55)" }}>小米 + 长城</span>双大厂，
              <span style={{ color: "rgba(255,255,255,0.55)" }}>6个核心项目</span>全流程交付
            </p>
          </Section>

          <Section delay={0.2}>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1,
              background: "rgba(255,255,255,0.04)", borderRadius: 16,
              border: "0.5px solid rgba(255,255,255,0.06)", overflow: "hidden",
              marginBottom: 48,
            }}>
              {[
                { num: "6", label: "核心项目", sub: "NLP/多模态/语音" },
                { num: "30万+", label: "处理数据", sub: "标注+质检+评测" },
                { num: "20+", label: "团队规模", sub: "标注+QA团队" },
                { num: "95%+", label: "交付准确率", sub: "最高达97%" },
              ].map((s, i) => (
                <div key={i} style={{
                  padding: "24px 16px", background: "rgba(255,255,255,0.02)",
                  textAlign: "center", borderRight: i < 3 ? "0.5px solid rgba(255,255,255,0.04)" : "none",
                }}>
                  <div style={{
                    fontSize: 28, fontWeight: 700, color: "#fff",
                    fontFamily: "'Space Mono', monospace", letterSpacing: "-1px",
                  }}>{s.num}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section delay={0.25}>
            <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
              <button style={{
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                color: "#fff", fontSize: 14, fontWeight: 500,
                padding: "12px 28px", borderRadius: 10, border: "none", cursor: "pointer",
                letterSpacing: "0.3px",
              }}>查看项目经历</button>
              <button style={{
                background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.7)",
                fontSize: 14, fontWeight: 500, padding: "12px 28px", borderRadius: 10,
                border: "0.5px solid rgba(255,255,255,0.1)", cursor: "pointer",
              }}>下载简历 ↓</button>
            </div>
          </Section>
        </div>

        {/* Projects - Bento Grid */}
        <div style={{ padding: "40px 48px 60px", maxWidth: 900, margin: "0 auto" }}>
          <Section>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
              <span style={{
                fontSize: 11, fontFamily: "'Space Mono', monospace",
                color: "rgba(255,255,255,0.25)", letterSpacing: "2px",
              }}>01</span>
              <div style={{ width: 24, height: "0.5px", background: "rgba(255,255,255,0.15)" }} />
              <span style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>项目经历</span>
            </div>
          </Section>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "auto auto auto",
            gap: 12,
          }}>
            {PROJECTS.map((p, i) => (
              <Section key={i} delay={i * 0.06}>
                <div
                  style={{
                    gridColumn: p.size === "large" ? "span 1" : "span 1",
                    padding: 24, borderRadius: 16,
                    background: "rgba(255,255,255,0.02)",
                    border: "0.5px solid rgba(255,255,255,0.06)",
                    cursor: "pointer", transition: "all 0.3s ease",
                    position: "relative", overflow: "hidden",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = `${p.color}40`;
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                  }}
                >
                  <div style={{
                    position: "absolute", top: -30, right: -30, width: 100, height: 100,
                    background: `radial-gradient(circle, ${p.color}10 0%, transparent 70%)`,
                    borderRadius: "50%",
                  }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: `${p.color}15`, display: "flex",
                      alignItems: "center", justifyContent: "center", fontSize: 16,
                    }}>{p.icon}</div>
                    <span style={{
                      fontSize: 11, color: p.color, padding: "3px 10px",
                      background: `${p.color}10`, borderRadius: 6,
                      fontFamily: "'Space Mono', monospace",
                    }}>{p.tag}</span>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>{p.company}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: 16 }}>{p.desc}</div>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    fontSize: 13, color: p.color, fontWeight: 500,
                  }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: p.color }} />
                    {p.result}
                  </div>
                </div>
              </Section>
            ))}
          </div>
        </div>

        {/* Experience Timeline */}
        <div style={{ padding: "40px 48px 60px", maxWidth: 900, margin: "0 auto" }}>
          <Section>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
              <span style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.25)", letterSpacing: "2px" }}>02</span>
              <div style={{ width: 24, height: "0.5px", background: "rgba(255,255,255,0.15)" }} />
              <span style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>工作经历</span>
            </div>
          </Section>

          {[
            {
              co: "长城汽车", role: "AI训练师（项目组长）", date: "2025.07 — 2026.02",
              color: "#3b82f6",
              points: [
                "全面负责3个核心AI项目的全流程管理，带领10人团队",
                "累计交付数据23万条，交付准确率最高达97%",
                "搭建闭环管理体系，同类问题重复率降低40%",
                "主导自动化审核，审核效率提升60%",
              ]
            },
            {
              co: "小米科技", role: "AI数据标注 / 质检员（实习）", date: "2024.12 — 2025.07",
              color: "#f97316",
              points: [
                "参与SFT对话、图片理解、文生图评测3个核心项目",
                "独立搭建12维度文生图评测体系，建议采纳8项",
                "负责3万+张图片双审质检，准确率达95.2%",
                "用Coze搭建规则查询助手，效率提升70%",
              ]
            }
          ].map((exp, ei) => (
            <Section key={ei} delay={ei * 0.1}>
              <div style={{
                display: "flex", gap: 24, marginBottom: 40,
              }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
                  <div style={{
                    width: 12, height: 12, borderRadius: "50%",
                    background: exp.color, border: `3px solid ${exp.color}30`,
                    flexShrink: 0,
                  }} />
                  <div style={{ width: "1.5px", flex: 1, background: `linear-gradient(180deg, ${exp.color}40, transparent)`, marginTop: 8 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                    <div>
                      <span style={{ fontSize: 18, fontWeight: 600, color: "#fff" }}>{exp.co}</span>
                      <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginLeft: 12 }}>{exp.role}</span>
                    </div>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontFamily: "'Space Mono', monospace" }}>{exp.date}</span>
                  </div>
                  <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                    {exp.points.map((pt, pi) => (
                      <div key={pi} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.2)", marginTop: 7, flexShrink: 0 }} />
                        <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Section>
          ))}
        </div>

        {/* Skills */}
        <div style={{ padding: "40px 48px 60px", maxWidth: 900, margin: "0 auto" }}>
          <Section>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
              <span style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.25)", letterSpacing: "2px" }}>03</span>
              <div style={{ width: 24, height: "0.5px", background: "rgba(255,255,255,0.15)" }} />
              <span style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>专业技能</span>
            </div>
          </Section>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {SKILLS.map((s, si) => (
              <Section key={si} delay={si * 0.08}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
                  <span style={{
                    fontSize: 12, color: "rgba(255,255,255,0.3)", width: 64,
                    fontFamily: "'Space Mono', monospace", paddingTop: 8, flexShrink: 0,
                  }}>{s.cat}</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {s.items.map((item, ii) => (
                      <span key={ii} style={{
                        fontSize: 13, color: "rgba(255,255,255,0.6)",
                        padding: "8px 16px", borderRadius: 8,
                        background: "rgba(255,255,255,0.03)",
                        border: "0.5px solid rgba(255,255,255,0.06)",
                        transition: "all 0.2s",
                        cursor: "default",
                      }}
                        onMouseEnter={e => {
                          e.target.style.background = "rgba(59,130,246,0.08)";
                          e.target.style.borderColor = "rgba(59,130,246,0.2)";
                          e.target.style.color = "#93c5fd";
                        }}
                        onMouseLeave={e => {
                          e.target.style.background = "rgba(255,255,255,0.03)";
                          e.target.style.borderColor = "rgba(255,255,255,0.06)";
                          e.target.style.color = "rgba(255,255,255,0.6)";
                        }}
                      >{item}</span>
                    ))}
                  </div>
                </div>
              </Section>
            ))}
          </div>
        </div>

        {/* Education */}
        <div style={{ padding: "40px 48px 20px", maxWidth: 900, margin: "0 auto" }}>
          <Section>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <span style={{ fontSize: 11, fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.25)", letterSpacing: "2px" }}>04</span>
              <div style={{ width: 24, height: "0.5px", background: "rgba(255,255,255,0.15)" }} />
              <span style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>教育背景</span>
            </div>
            <div style={{
              padding: 24, borderRadius: 16, background: "rgba(255,255,255,0.02)",
              border: "0.5px solid rgba(255,255,255,0.06)",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 4 }}>湖北汽车工程学院</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>电子信息工程（本科）</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontFamily: "'Space Mono', monospace" }}>2021 — 2025</div>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  {["GPA 3.5", "Top 7%", "优秀毕业生"].map((t, i) => (
                    <span key={i} style={{
                      fontSize: 11, color: "rgba(255,255,255,0.45)",
                      padding: "3px 10px", borderRadius: 6,
                      background: "rgba(255,255,255,0.04)",
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* Contact */}
        <div style={{ padding: "80px 48px 60px", textAlign: "center" }}>
          <Section>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", letterSpacing: "2px", fontFamily: "'Space Mono', monospace", marginBottom: 16 }}>CONTACT</p>
            <h2 style={{
              fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 12,
              background: "linear-gradient(90deg, #fff, rgba(255,255,255,0.6))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>期待与您交流</h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.35)", marginBottom: 32 }}>
              如果您对我的项目经历感兴趣，欢迎随时联系
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
              {[
                { label: "134 0968 7811", icon: "📱" },
                { label: "2595617884@qq.com", icon: "✉️" },
              ].map((c, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 20px", borderRadius: 10,
                  background: "rgba(255,255,255,0.03)",
                  border: "0.5px solid rgba(255,255,255,0.08)",
                  fontSize: 14, color: "rgba(255,255,255,0.6)",
                  cursor: "pointer", transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)"; e.currentTarget.style.background = "rgba(59,130,246,0.05)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                >
                  <span>{c.icon}</span> {c.label}
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div style={{
          padding: "24px 48px", borderTop: "0.5px solid rgba(255,255,255,0.04)",
          display: "flex", justifyContent: "space-between",
          fontSize: 12, color: "rgba(255,255,255,0.2)",
        }}>
          <span>© 2026 朱美阳</span>
          <span style={{ fontFamily: "'Space Mono', monospace" }}>Built with passion</span>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
