import Link from "next/link";
import { CallToAction } from "@/components/call-to-action";
import { articles } from "@/data/articles";
import { projects } from "@/data/projects";

const skills = [
  "NLP 训练优化",
  "多模态小模型",
  "数据处理",
  "训练流程设计",
  "模型调优",
  "误差分析",
  "实验复盘",
  "方法沉淀",
];

const workflow = [
  {
    title: "任务定义",
    text: "明确训练目标、输入输出形式、评估边界与真实使用场景，确保训练方向稳定。",
  },
  {
    title: "数据方案",
    text: "围绕任务组织样本结构、清洗规则与版本策略，让数据真正服务训练目标。",
  },
  {
    title: "训练执行",
    text: "控制实验节奏、参数调整顺序与日志记录方式，减少无效试错。",
  },
  {
    title: "评估复盘",
    text: "关注指标变化、错误样本与输出行为，形成下一轮迭代依据。",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="pb-12 pt-12 md:pb-16 md:pt-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="rounded-[32px] border border-white/10 bg-[#11162A] p-8 md:p-12">
            <div className="text-sm uppercase tracking-[0.24em] text-[#A7B0C0]">
              AI Trainer
            </div>

            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.03em] text-[#E6EAF2] md:text-6xl md:leading-[1.08]">
              构建可落地的 AI 训练系统
              <br />
              聚焦 NLP、多模态小模型优化与训练流程设计
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-[#A7B0C0] md:text-lg">
              我专注于数据处理、训练方案设计、模型调优与实验复盘，持续沉淀围绕真实任务的训练方法、案例经验与技术记录。
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-xl bg-[#6EA8FE] px-6 py-3 text-sm font-medium text-[#0B1020] transition hover:brightness-110"
              >
                查看项目案例
              </Link>

              <Link
                href="/training-log"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-[#E6EAF2] transition hover:border-white/20 hover:bg-white/10"
              >
                阅读训练日志
              </Link>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[#151B34]/80 p-6">
            <div className="text-sm text-[#A7B0C0]">当前关注</div>

            <div className="mt-5 space-y-4">
              {[
                "NLP 任务训练优化与指令数据构造",
                "多模态小模型适配与训练稳定性",
                "训练前数据处理与版本管理",
                "围绕错误样本的评估与调优复盘",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-[#D7DDEA]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-14 md:pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <div>
            <div className="text-sm uppercase tracking-[0.24em] text-[#A7B0C0]">
              Capabilities
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-[#E6EAF2]">
              能力 / 方向概览
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[#A7B0C0]">
              围绕训练任务落地，我将问题拆解为数据、策略、过程、评估与迭代几个关键环节，持续优化模型效果与训练效率。
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#D7DDEA]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-14 md:pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <div>
            <div className="text-sm uppercase tracking-[0.24em] text-[#A7B0C0]">
              Projects
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-[#E6EAF2]">
              精选项目
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[#A7B0C0]">
              这些案例重点展示训练任务如何被拆解、组织、执行与复盘，而不仅仅是结果展示。
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {projects.slice(0, 3).map((project) => (
              <article
                key={project.slug}
                className="rounded-[28px] border border-white/10 bg-[#151B34]/80 p-6"
              >
                <div className="text-sm text-[#A7B0C0]">
                  {project.category} · {project.year}
                </div>
                <h3 className="mt-4 text-xl font-medium text-[#E6EAF2]">
                  {project.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#A7B0C0]">
                  {project.summary}
                </p>
                <div className="mt-6">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="text-sm text-[#6EA8FE] transition hover:text-[#8B7CFF]"
                  >
                    查看详情 →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-14 md:pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <div>
            <div className="text-sm uppercase tracking-[0.24em] text-[#A7B0C0]">
              Workflow
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-[#E6EAF2]">
              训练流程 / 方法论
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[#A7B0C0]">
              相比单次实验结果，我更关注训练工作的结构化推进方式，以及这些方法是否能长期复用。
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {workflow.map((item, index) => (
              <div
                key={item.title}
                className="rounded-[28px] border border-white/10 bg-[#151B34]/80 p-6"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm text-[#6EA8FE]">
                  0{index + 1}
                </div>
                <h3 className="mt-5 text-xl font-medium text-[#E6EAF2]">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#A7B0C0]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-14 md:pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <div>
            <div className="text-sm uppercase tracking-[0.24em] text-[#A7B0C0]">
              Writing
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-[#E6EAF2]">
              技术文章推荐
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[#A7B0C0]">
              这里记录训练中的判断依据、实验路径、问题分析与方法总结，作为长期更新的技术内容沉淀区。
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {articles.slice(0, 3).map((article) => (
              <article
                key={article.slug}
                className="rounded-[28px] border border-white/10 bg-[#151B34]/80 p-6"
              >
                <div className="text-sm text-[#A7B0C0]">
                  {article.category} · {article.date}
                </div>
                <h3 className="mt-4 text-xl font-medium text-[#E6EAF2]">
                  {article.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#A7B0C0]">
                  {article.summary}
                </p>
                <div className="mt-6">
                  <Link
                    href={`/blog/${article.slug}`}
                    className="text-sm text-[#6EA8FE] transition hover:text-[#8B7CFF]"
                  >
                    阅读文章 →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-14 md:pb-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[28px] border border-white/10 bg-[#11162A] p-8">
            <div className="text-sm uppercase tracking-[0.24em] text-[#A7B0C0]">
              About
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-[#E6EAF2]">
              关于我
            </h2>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#151B34]/80 p-8">
            <p className="text-base leading-8 text-[#A7B0C0]">
              我是 AI训练师，长期关注
              NLP、多模态小模型训练优化、数据处理与训练流程设计。相比“做一个模型”，我更在意训练系统是否清晰、可复现、可迭代。这个网站会持续整理项目案例、训练日志与方法沉淀。
            </p>
            <div className="mt-6">
              <Link
                href="/about"
                className="inline-flex text-sm text-[#6EA8FE] transition hover:text-[#8B7CFF]"
              >
                查看完整介绍 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CallToAction />
    </>
  );
}