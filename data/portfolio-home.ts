export interface Project {
  name: string;
  company: string;
  tag: string;
  color: string;
  result: string;
  desc: string;
  icon: string;
  size: "large" | "small";
}

export const PROJECTS: Project[] = [
  {
    name: "ASR 语音识别标注",
    company: "长城汽车",
    tag: "语音",
    color: "#3b82f6",
    result: "准确率 96.2%",
    desc: "车载噪音环境下12万+条语音转写与方言识别",
    icon: "🎙",
    size: "large",
  },
  {
    name: "Agent 旅游助手",
    company: "长城汽车",
    tag: "Agent",
    color: "#8b5cf6",
    result: "意图识别 +12%",
    desc: "12个场景 · 8类意图 · 15种工具调用",
    icon: "🧭",
    size: "small",
  },
  {
    name: "短图文审核系统",
    company: "长城汽车",
    tag: "审核",
    color: "#f59e0b",
    result: "召回率 97.2%",
    desc: "规则引擎+Qwen-VL自动化审核",
    icon: "🛡",
    size: "small",
  },
  {
    name: "SFT 多轮对话标注",
    company: "小米科技",
    tag: "NLP",
    color: "#10b981",
    result: "准确率 95.1%",
    desc: "8万+条对话数据，解决幻觉与指令遵循",
    icon: "💬",
    size: "large",
  },
  {
    name: "图片理解标注",
    company: "小米科技",
    tag: "多模态",
    color: "#ec4899",
    result: "准确率 95.3%",
    desc: "3万+张图片双审质检与OCR标注",
    icon: "👁",
    size: "small",
  },
  {
    name: "文生图评测",
    company: "小米科技",
    tag: "AIGC",
    color: "#06b6d4",
    result: "采纳建议 8项",
    desc: "12维度评测体系 · 1.5万+组对比",
    icon: "🎨",
    size: "small",
  },
];

export interface SkillCategory {
  cat: string;
  items: string[];
}

export const SKILLS: SkillCategory[] = [
  { cat: "数据标注", items: ["SFT对话", "图片理解", "ASR语音", "文生图评测", "内容审核"] },
  { cat: "项目管理", items: ["需求分析", "SOP制定", "质量管控", "Badcase管理"] },
  { cat: "工具技术", items: ["Prompt Engineering", "Coze", "Trae", "飞书", "Python"] },
];

export interface ExperienceItem {
  co: string;
  role: string;
  date: string;
  color: string;
  photo?: string;
  points: string[];
}

export const EXPERIENCES: ExperienceItem[] = [
  {
    co: "长城汽车",
    role: "AI训练师（项目组长）",
    date: "2025.07 — 2026.02",
    color: "#3b82f6",
    photo: "/changcheng.jpg",
    points: [
      "全面负责3个核心AI项目的全流程管理，带领10人团队",
      "累计交付数据23万条，交付准确率最高达97%",
      "搭建闭环管理体系，同类问题重复率降低40%",
      "主导自动化审核，审核效率提升60%",
    ],
  },
  {
    co: "小米科技",
    role: "AI数据标注 / 质检员（实习）",
    date: "2024.12 — 2025.07",
    color: "#f97316",
    photo: "/xiaomi.jpg",
    points: [
      "参与SFT对话、图片理解、文生图评测3个核心项目",
      "独立搭建12维度文生图评测体系，建议采纳8项",
      "负责3万+张图片双审质检，准确率达95.2%",
      "用Coze搭建规则查询助手，效率提升70%",
    ],
  },
];

export interface StatItem {
  num: string;
  label: string;
  sub: string;
}

export const STATS: StatItem[] = [
  { num: "6", label: "核心项目", sub: "NLP/多模态/语音" },
  { num: "30万+", label: "处理数据", sub: "标注+质检+评测" },
  { num: "20+", label: "团队规模", sub: "标注+QA团队" },
  { num: "95%+", label: "交付准确率", sub: "最高达97%" },
];

export interface RadarDimension {
  axis: string;
  value: number;
  color: string;
  longName: string;
  detail: string;
}

export const RADAR_DATA: RadarDimension[] = [
  { axis: "ASR", value: 96.2, color: "#3b82f6", longName: "ASR语音识别", detail: "车载噪声环境 · 12万+条 · 准确率96.2%" },
  { axis: "Agent", value: 88, color: "#8b5cf6", longName: "Agent智能体", detail: "12场景 · 8类意图 · 意图识别+12%" },
  { axis: "审核", value: 97.2, color: "#f59e0b", longName: "内容审核", detail: "Qwen-VL自动化 · 召回率97.2%" },
  { axis: "NLP", value: 95.1, color: "#10b981", longName: "NLP标注", detail: "8万+条对话 · 解决幻觉与指令遵循" },
  { axis: "多模态", value: 95.3, color: "#ec4899", longName: "多模态标注", detail: "3万+张图片 · 双审质检+OCR" },
  { axis: "AIGC", value: 90, color: "#06b6d4", longName: "AIGC评测", detail: "12维度评测体系 · 1.5万+组对比" },
];

export interface PortfolioHomeItem {
  id: string;
  title: string;
  desc: string;
  cover: string;
  color: string;
  count: string;
  icon: string;
}

export const PORTFOLIO_HOME: PortfolioHomeItem[] = [
  {
    id: "ai-text-to-image-gallery",
    title: "AI文生图",
    desc: "Midjourney · SD · DALL·E 多场景作品",
    cover: "/portfolio/photo-cover.png",
    color: "#f59e0b",
    count: "10 类别",
    icon: "🖼",
  },
  {
    id: "ai-text-to-video-gallery",
    title: "AI文生视频",
    desc: "Seedance · Veo · Grok 创作合集",
    cover: "/portfolio/video-cover.png",
    color: "#8b5cf6",
    count: "4 类别",
    icon: "🎬",
  },
  {
    id: "ai-image-to-video-gallery",
    title: "AI图生视频",
    desc: "即梦 · 可灵 · VEO 模型对比",
    cover: "/portfolio/cover3.png",
    color: "#06b6d4",
    count: "3 类别",
    icon: "🎞",
  },
  {
    id: "ai-info-and-eval-collection",
    title: "AI资讯 & 评测",
    desc: "行业趋势分析 · 评测报告",
    cover: "/portfolio/cover4.jpg",
    color: "#10b981",
    count: "17 篇文章",
    icon: "📊",
  },
];
