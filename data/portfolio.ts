export type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  src: string;
  category: string;
  date: string;
  sections?: { heading: string; paragraphs: string[] }[];
  galleries?: PortfolioGallery[];
  news?: { title: string; url: string; insight: string }[];
};

export interface ParallaxImage {
  prefix: string;
  label: string;
  src: string;
}

export const PARALLAX_IMAGES: ParallaxImage[] = [
  // film: jpg, png, png, jpg
  { prefix: "film-01", label: "影视制作 01", src: "/portfolio/film-01.jpg" },
  { prefix: "film-02", label: "影视制作 02", src: "/portfolio/film-02.png" },
  { prefix: "film-03", label: "影视制作 03", src: "/portfolio/film-03.png" },
  { prefix: "film-04", label: "影视制作 04", src: "/portfolio/film-04.jpg" },
  // ui: jpg, jpg, jpg, png
  { prefix: "ui-01", label: "UI 设计 01", src: "/portfolio/ui-01.jpg" },
  { prefix: "ui-02", label: "UI 设计 02", src: "/portfolio/ui-02.jpg" },
  { prefix: "ui-03", label: "UI 设计 03", src: "/portfolio/ui-03.jpg" },
  { prefix: "ui-04", label: "UI 设计 04", src: "/portfolio/ui-04.png" },
  // game: jpg, jpg, png, jpg
  { prefix: "game-01", label: "游戏美术 01", src: "/portfolio/game-01.jpg" },
  { prefix: "game-02", label: "游戏美术 02", src: "/portfolio/game-02.jpg" },
  { prefix: "game-03", label: "游戏美术 03", src: "/portfolio/game-03.png" },
  { prefix: "game-04", label: "游戏美术 04", src: "/portfolio/game-04.jpg" },
  // edu: png, png, png, jpg
  { prefix: "edu-01", label: "教育知识 01", src: "/portfolio/edu-01.png" },
  { prefix: "edu-02", label: "教育知识 02", src: "/portfolio/edu-02.png" },
  { prefix: "edu-03", label: "教育知识 03", src: "/portfolio/edu-03.png" },
  { prefix: "edu-04", label: "教育知识 04", src: "/portfolio/edu-04.jpg" },
  // poster: jpg, jpg, jpg, png
  { prefix: "poster-01", label: "商业海报 01", src: "/portfolio/poster-01.jpg" },
  { prefix: "poster-02", label: "商业海报 02", src: "/portfolio/poster-02.jpg" },
  { prefix: "poster-03", label: "商业海报 03", src: "/portfolio/poster-03.jpg" },
  { prefix: "poster-04", label: "商业海报 04", src: "/portfolio/poster-04.png" },
  // photo: jpg, png, png, png
  { prefix: "photo-01", label: "写实摄影 01", src: "/portfolio/photo-01.jpg" },
  { prefix: "photo-02", label: "写实摄影 02", src: "/portfolio/photo-02.png" },
  { prefix: "photo-03", label: "写实摄影 03", src: "/portfolio/photo-03.png" },
  { prefix: "photo-04", label: "写实摄影 04", src: "/portfolio/photo-04.png" },
  // ecommerce: png, png, png, jpg
  { prefix: "ecommerce-01", label: "电商产品 01", src: "/portfolio/ecommerce-01.png" },
  { prefix: "ecommerce-02", label: "电商产品 02", src: "/portfolio/ecommerce-02.png" },
  { prefix: "ecommerce-03", label: "电商产品 03", src: "/portfolio/ecommerce-03.png" },
  { prefix: "ecommerce-04", label: "电商产品 04", src: "/portfolio/ecommerce-04.jpg" },
  // art: all png
  { prefix: "art-01", label: "艺术插画 01", src: "/portfolio/art-01.png" },
  { prefix: "art-02", label: "艺术插画 02", src: "/portfolio/art-02.png" },
  { prefix: "art-03", label: "艺术插画 03", src: "/portfolio/art-03.png" },
  { prefix: "art-04", label: "艺术插画 04", src: "/portfolio/art-04.png" },
  // arch: png, jpg, png, png
  { prefix: "arch-01", label: "建筑效果图 01", src: "/portfolio/arch-01.png" },
  { prefix: "arch-02", label: "建筑效果图 02", src: "/portfolio/arch-02.jpg" },
  { prefix: "arch-03", label: "建筑效果图 03", src: "/portfolio/arch-03.png" },
  { prefix: "arch-04", label: "建筑效果图 04", src: "/portfolio/arch-04.png" },
  // food: png, jpg, png, jpg
  { prefix: "food-01", label: "食品美食 01", src: "/portfolio/food-01.png" },
  { prefix: "food-02", label: "食品美食 02", src: "/portfolio/food-02.jpg" },
  { prefix: "food-03", label: "食品美食 03", src: "/portfolio/food-03.png" },
  { prefix: "food-04", label: "食品美食 04", src: "/portfolio/food-04.jpg" },
];

export type PortfolioGallery = {
  category: string;
  label: string;
  images?: { base: string; alt: string }[];
  videos?: { base: string; alt: string; model: string; videoSrc: string }[];
};

const makeImages = (prefix: string, label: string): { base: string; alt: string }[] =>
  [1, 2, 3, 4].map((i) => ({
    base: `/portfolio/${prefix}-0${i}`,
    alt: `${label} · 图${i}`,
  }));

export const portfolioItems: PortfolioItem[] = [
  {
    id: "ai-text-to-image-gallery",
    title: "AI文生图作品收集",
    description: "使用Midjourney、Stable Diffusion、DALL·E等工具生成的AI图像作品，按场景分类展示不同风格与用途的AI创作成果。",
    src: "/portfolio/photo-cover.png",
    category: "AI 文生图",
    date: "2025",
    galleries: [
      { category: "film", label: "影视制作", images: makeImages("film", "影视制作") },
      { category: "ui", label: "UI 设计", images: makeImages("ui", "UI 设计") },
      { category: "game", label: "游戏美术", images: makeImages("game", "游戏美术") },
      { category: "edu", label: "教育知识", images: makeImages("edu", "教育知识") },
      { category: "poster", label: "商业海报", images: makeImages("poster", "商业海报") },
      { category: "photo", label: "写实摄影", images: makeImages("photo", "写实摄影") },
      { category: "ecommerce", label: "电商产品", images: makeImages("ecommerce", "电商产品") },
      { category: "art", label: "艺术插画", images: makeImages("art", "艺术插画") },
      { category: "arch", label: "建筑效果图", images: makeImages("arch", "建筑效果图") },
      { category: "food", label: "食品美食", images: makeImages("food", "食品美食") },
    ],
  },
  {
    id: "ai-text-to-video-gallery",
    title: "AI文生视频作品收集",
    description: "使用Seedance 2.0、Veo 3.1、Grok imagine等AI视频生成模型创作的作品，按题材分类展示。",
    src: "/portfolio/video-cover.png",
    category: "AI 文生视频",
    date: "2025",
    galleries: [
      {
        category: "ad",
        label: "广告",
        videos: [
          { base: "/portfolio/video-ad-01", alt: "广告 · 视频1", model: "Seedance 2.0", videoSrc: "/portfolio/video-ad-01.mp4" },
          { base: "/portfolio/video-ad-02", alt: "广告 · 视频2", model: "Veo 3.1", videoSrc: "/portfolio/video-ad-02.mp4" },
        ],
      },
      {
        category: "character",
        label: "角色设定",
        videos: [
          { base: "/portfolio/video-char-01", alt: "角色设定 · 视频1", model: "Veo 3.1", videoSrc: "/portfolio/video-char-01.mp4" },
          { base: "/portfolio/video-char-02", alt: "角色设定 · 视频2", model: "Grok imagine", videoSrc: "/portfolio/video-char-02.mp4" },
        ],
      },
      {
        category: "fantasy",
        label: "奇幻",
        videos: [
          { base: "/portfolio/video-fantasy-01", alt: "奇幻 · 视频1", model: "Grok imagine", videoSrc: "/portfolio/video-fantasy-01.mp4" },
          { base: "/portfolio/video-fantasy-02", alt: "奇幻 · 视频2", model: "Seedance 2.0", videoSrc: "/portfolio/video-fantasy-02.mp4" },
        ],
      },
      {
        category: "animal",
        label: "动物搞笑",
        videos: [
          { base: "/portfolio/video-animal-01", alt: "动物搞笑 · 视频1", model: "Seedance 2.0", videoSrc: "/portfolio/video-animal-01.mp4" },
          { base: "/portfolio/video-animal-02", alt: "动物搞笑 · 视频2", model: "Veo 3.1", videoSrc: "/portfolio/video-animal-02.mp4" },
        ],
      },
    ],
  },
  {
    id: "ai-image-to-video-gallery",
    title: "AI图生视频作品收集",
    description: "使用即梦、可灵、VEO等AI图生视频模型创作的作品，按题材分类展示。",
    src: "/portfolio/cover3.png",
    category: "AI 图生视频",
    date: "2025",
    galleries: [
      {
        category: "comic",
        label: "漫剧",
        videos: [
          { base: "/portfolio/video-comic-01", alt: "漫剧 · 视频1", model: "即梦", videoSrc: "/portfolio/video-comic-01.mp4" },
          { base: "/portfolio/video-comic-02", alt: "漫剧 · 视频2", model: "可灵", videoSrc: "/portfolio/video-comic-02.mp4" },
        ],
      },
      {
        category: "landscape",
        label: "风景",
        videos: [
          { base: "/portfolio/video-landscape-01", alt: "风景 · 视频1", model: "可灵", videoSrc: "/portfolio/video-landscape-01.mp4" },
          { base: "/portfolio/video-landscape-02", alt: "风景 · 视频2", model: "VEO", videoSrc: "/portfolio/video-landscape-02.mp4" },
        ],
      },
      {
        category: "ad2",
        label: "广告",
        videos: [
          { base: "/portfolio/video-ad2-01", alt: "广告 · 视频1", model: "VEO", videoSrc: "/portfolio/video-ad2-01.mp4" },
          { base: "/portfolio/video-ad2-02", alt: "广告 · 视频2", model: "即梦", videoSrc: "/portfolio/video-ad2-02.mp4" },
        ],
      },
    ],
  },
  {
    id: "ai-info-and-eval-collection",
    title: "AI资讯及评测报告收集",
    description: "AI行业前沿资讯跟踪、技术趋势分析，以及大模型评测方法论与报告整理。",
    src: "/portfolio/cover4.jpg",
    category: "AI 资讯 & 评测",
    date: "2025",
    sections: [
      {
        heading: "AI 资讯收集",
        paragraphs: [
          "持续跟踪 AI 训练领域的前沿动态，重点关注大模型训练方法论、数据工程最佳实践、多模态模型评测标准等行业趋势。",
        ],
      },
    ],
    galleries: [
      {
        category: "eval-report",
        label: "评测报告收集",
        images: [
          { base: "/portfolio/eval-01", alt: "评测报告 · 图1" },
          { base: "/portfolio/eval-02", alt: "评测报告 · 图2" },
        ],
      },
    ],
    news: [
      {
        title: `Kimi K2.6 开源：一个人，和他的 300 Agents`,
        url: `https://mp.weixin.qq.com/s/OJkV7n1Qf8gU638wtXj9FQ`,
        insight: `Kimi K2.6 的开源标志着国内大模型在Agent能力上的重大突破。一个人能驱动300个Agent协同工作，说明Multi-Agent编排和任务分发已经从实验室走向工程化落地。这对AI训练师而言意味着：未来的核心竞争力不再是"会不会用AI"，而是"能不能设计出高效的多Agent协作流程"，Agent工作流的设计、监控和调优能力将成为关键技能。`,
      },
      {
        title: `AI 漫剧那么火，普通人如何在2026 年分一杯羹？`,
        url: `https://www.xiaoyuzhoufm.com/episode/69e10d6de2c8be3155698b09`,
        insight: `AI漫剧的兴起本质上是内容生产工具民主化的体现。AI大幅降低了漫画/短剧的创作门槛，让普通人也有机会参与内容创作。但核心壁垒仍然在于创意、叙事能力和对用户情绪的把控。AI是放大器，不是替代品——工具越强大，审美和故事能力反而越稀缺。`,
      },
      {
        title: `亲历机器人马拉松：破纪录、狂欢与20个被忽视的洞察`,
        url: `https://www.xiaoyuzhoufm.com/episode/69e62af81d989496e7151289`,
        insight: `机器人马拉松看似娱乐，实则是对具身智能在实际物理环境中运动能力、耐久性和实时决策的综合考验。20个"被忽视的洞察"提醒我们：具身智能离真正成熟还有很长距离，硬件的可靠性、能耗管理、环境适应性等工程问题远比AI算法本身更难解决。硬件+AI的交叉领域将是未来十年的最大机会。`,
      },
      {
        title: `流量 2.0 时代`,
        url: `https://mp.weixin.qq.com/s/qoNuzuz2BX5x9K36tWBgzA`,
        insight: `流量2.0意味着从"流量获取"转向"流量经营"的范式迁移。在AI时代，流量不再只是曝光量，而是AI如何理解和分发你的内容。理解AI推荐算法、AI搜索的运作原理，将成为内容创作者和个人品牌的必修课。你的内容要被AI"看懂"，才能被AI"推荐"。`,
      },
      {
        title: `从特点到 API，Image2 最完整解读`,
        url: `https://mp.weixin.qq.com/s/5e_dwdnVaW47wez0_RWy5A`,
        insight: `Image2的技术解读从API层面切入，说明AI图像生成正从"玩具"变成"基础设施"。当图像生成被封装为标准API，上层应用创新的空间被彻底打开。开发者不再需要关心模型细节，只需关注如何将图像生成能力嵌入业务场景。API经济正在重塑AI产业链的分工。`,
      },
      {
        title: `从BBS版主到AI智能体：石头姐的"一人公司"生存实验与个人IP打造笔记`,
        url: `https://www.xiaoyuzhoufm.com/episode/69e054a0e2c8be315557ba4e`,
        insight: `这是一个非常真实的一人公司案例。从BBS版主到AI智能体的转变，本质上是从"内容管理者"到"AI工作流设计者"的身份升级。石头姐的实践说明：个人IP的核心不在于你多强大，而在于你能用AI把自己"复制"成多少个高效运转的数字分身。一人公司的前提是AI Agent替身的成熟度。`,
      },
      {
        title: `女孩们，请大胆的进入新行业（AI）！`,
        url: `https://www.xiaoyuzhoufm.com/episode/69d638f8b977fb2c476acc94`,
        insight: `AI行业目前仍以男性从业者为主，女性视角的缺失可能导致AI产品的系统性偏见。鼓励女性进入AI行业不仅是公平问题，更是产品安全问题——多样化的训练数据和多样化的团队才能构建更普适的AI系统。AI行业的真正繁荣需要全人类智慧的参与。`,
      },
      {
        title: `凯恩斯：写给2030年的信："不用工作之后，你会做什么？"`,
        url: `https://www.xiaoyuzhoufm.com/episode/69e9cae21d989496e752baa7`,
        insight: `凯恩斯在近百年前就预测了技术进步将带来的"闲暇社会"。如今AI正在加速这个预言成为现实。但问题从"技术能不能替代工作"变成了"人类准备好了没有工作的人生吗"。这不仅是经济问题，更是哲学问题——当工作不再定义人生价值，我们用什么来定义自己？`,
      },
      {
        title: `AI Agent会取代程序员吗？硬核对话硅谷顶尖研究员与AI独角兽`,
        url: `https://www.xiaoyuzhoufm.com/episode/66436819251bd96e6c4a1766`,
        insight: `这个问题已经不需要讨论了：AI Agent不会完全取代程序员，但会彻底改变程序员的工作方式。未来程序员的日常工作将从"写代码"变为"设计Agent、验证Agent输出、维护Agent工作流"。这也意味着初级编码岗位会大幅缩水，但能驾驭多Agent协作的系统架构师价值会飙升。`,
      },
      {
        title: `OpenAI 硬件负责人的闭门分享：为什么硬件「终点」仍是智能手机`,
        url: `https://mp.weixin.qq.com/s/4Anx-PYzppWzrpH5W62Nkw`,
        insight: `这个判断很有启发性。尽管AI Pin、Rabbit R1等新形态硬件层出不穷，但OpenAI认为最终AI硬件的载体还是智能手机。这背后的逻辑是：用户不会为了AI功能单独购买硬件，AI应该作为现有设备的增强层存在。这对硬件创业方向有重要指导意义——与其造新设备，不如做手机AI体验的优化。`,
      },
      {
        title: `分享下我的AI工作台环境和使用经验`,
        url: `https://mp.weixin.qq.com/s/Q06ixuQrzFZIIe1VcJgl_w`,
        insight: `AI工作台的搭建是每个AI从业者都在摸索的事情。这篇文章的价值在于提供了一个可复用的实践参考。从中可以学习到：工具链的选择（哪些AI工具组合在一起能形成闭环）、工作流的设计（怎样编排让AI之间的协作最高效）、以及踩过的坑（哪些工具看似强大但不实用）。AI工作台本质上是个人生产力的操作系统。`,
      },
      {
        title: `a16z创始人：AI时代，技术领先不再安全了`,
        url: `https://mp.weixin.qq.com/s/yP5MnxM4-cBM7vGf-NjZTg`,
        insight: `a16z创始人Marc Andreessen的这观点直击AI时代商业逻辑的核心变化。过去技术领先意味着护城河（如Windows的操作系统垄断），但AI时代模型能力快速趋同，技术先行者的窗口期越来越短。竞争的焦点从"技术领先"转向"数据飞轮、用户粘性和生态系统"，这对AI创业者的战略选择有深远影响。`,
      },
      {
        title: `对话智谱CEO张鹏——一场关于AI原理、商业模式和企业护城河的坦白局`,
        url: `https://www.xiaoyuzhoufm.com/episode/69ac24ec5b2d0ed069cdebbf`,
        insight: `智谱作为国内大模型赛道的头部玩家，张鹏的"坦白"很有参考价值。AI原理上的共识越来越多，差异化越来越难；商业模式上，API调用、企业服务、C端产品三条路径各有挑战；护城河的构建可能不来自模型本身，而来自行业know-how的深度积累和客户关系的沉淀。这对于理解国内AI产业格局很有帮助。`,
      },
      {
        title: `从红果到AI短剧：谁在革谁的命？`,
        url: `https://www.xiaoyuzhoufm.com/episode/69f0d90f740bacea8777122d`,
        insight: `短剧行业正在经历AI带来的二次革命。红果（字节的免费短剧平台）已经颠覆了传统付费短剧模式，而AI短剧的出现可能进一步瓦解制作端——当AI能以极低成本生成短剧内容，传统影视制作公司的存在价值将被重新审视。但精品内容的生产始终需要人的判断力和审美，AI+人工的协作模式才是终局。`,
      },
      {
        title: `前沿：Transformer 发明人揭秘推理模型与 AI 持续指数级增长`,
        url: `https://www.xiaoyuzhoufm.com/episode/692c73f30d5237d4de3dc306`,
        insight: `Transformer发明人的一手分享，信息密度极高。推理模型（如o1/o3）的核心突破在于将"快思考"和"慢思考"解耦——模型不再直接给答案，而是先进行内部推理链。而AI持续指数级增长的关键驱动因素不仅仅是Scaling Law，还包括后训练优化、推理时计算、数据质量的系统性提升。这为AI从业者指明了技术精进的方向。`,
      },
      {
        title: `从 Vibe Coding 到 Agentic Engineering：Karpathy 说自己落后了！`,
        url: `https://mp.weixin.qq.com/s/vmN5-lrCmMXBgHTZHFDkoQ`,
        insight: `Karpathy作为AI领域的风向标人物，他的"自我检讨"极具象征意义。Vibe Coding模式让非程序员也能"感觉式编程"，但Agentic Engineering才是真正的工程范式变革——让Agent自己设计、实现、测试、部署。Karpathy都在担心自己跟不上，说明这个领域的发展速度之快已经超出所有人的预期。终身学习不是口号，是生存必需。`,
      },
      {
        title: `黄仁勋点名Anthropic达里奥，别一当CEO，就开「上帝视角」`,
        url: `https://mp.weixin.qq.com/s/uorE5uunFTs_hzPS926-wg`,
        insight: `黄仁勋罕见公开批评同行，反映了AI行业内部对"AI威胁论"的路线分歧。达里奥·阿莫代（Anthropic CEO）一直强调AI安全风险，而黄仁勋认为过度渲染恐惧会阻碍技术进步。这里没有绝对的对错——安全需要关注，但过度恐惧确实会扼杀创新。AI从业者需要在安全和发展之间找到平衡，而不是走极端。`,
      },
      {
        title: `对罗福莉3.5小时访谈：AI范式已然巨变！OpenClaw、Agent范式、卡分配、组织平权`,
        url: `https://www.xiaoyuzhoufm.com/episode/69eae15a1e94ae692107cc50`,
        insight: `罗福莉作为AI领域极具影响力的研究者，3.5小时的深度访谈分量很重。她指出的几个关键变化：OpenClaw等新一轮Agent框架正在定义新的交互范式；Agent模型对后训练的依赖远超预期，数据质量和训练策略决定Agent能力的上限；"组织平权"是一个容易被忽视但极为重要的趋势——AI正在瓦解传统公司层级，让个体创造者拥有前所未有的力量。`,
      },
    ],
  },
];
