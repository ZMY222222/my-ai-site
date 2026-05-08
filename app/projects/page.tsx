import type { Metadata } from "next";
import { TransitionLink } from "@/components/page-transition";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "项目经历 | 朱美阳 · AI训练师",
  description: "6个大模型核心项目全流程实操，覆盖消费级语音助手与车载智能交互两大核心赛道。",
};

const sortedProjects = [...projects].sort((a, b) => {
  const y = parseInt(b.year, 10) - parseInt(a.year, 10);
  if (y !== 0) return y;
  const aStart = (a.period ?? "").split("-")[0];
  const bStart = (b.period ?? "").split("-")[0];
  return bStart.localeCompare(aStart);
});

export default function ProjectsPage() {
  return (
    <>
      <section className="pb-10 pt-16 md:pb-14 md:pt-20">
        <div className="mx-auto max-w-6xl px-6">
          <TransitionLink
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#B8C1D0] transition hover:text-[#E6EAF2]"
          >
            <span>←</span>
            <span>返回首页</span>
          </TransitionLink>

          <div className="mt-6">
            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[#E6EAF2] md:text-4xl">
              项目经历
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[#B8C1D0]">
              6个大模型核心项目全流程实操，覆盖消费级语音助手与车载智能交互两大核心赛道，按时间倒序排列。
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="space-y-6">
            {sortedProjects.map((project) => (
              <article
                key={project.slug}
                className="rounded-[28px] border border-white/10 bg-[#151B34]/80 p-6 transition hover:border-white/20 md:p-8"
              >
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-[#B8C1D0]">
                        {project.company && <span>{project.company}</span>}
                      </div>
                      <h2 className="mt-2 text-xl font-semibold text-[#E6EAF2]">
                        {project.title}
                      </h2>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-[#B8C1D0]">
                        {project.role && (
                          <span className="rounded-full border border-[#6EA8FE]/30 bg-[#6EA8FE]/10 px-3 py-0.5 text-xs text-[#6EA8FE]">
                            {project.role}
                          </span>
                        )}
                        {project.period && <span>{project.period}</span>}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm leading-7 text-[#B8C1D0]">
                    {project.summary}
                  </p>

                  {project.responsibilities && (
                    <div>
                      <div className="mb-3 text-xs uppercase tracking-[0.18em] text-[#6EA8FE]">
                        个人职责
                      </div>
                      <div className="space-y-2">
                        {project.responsibilities.map((r, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 text-sm leading-7 text-[#B8C1D0]"
                          >
                            <span className="mt-[10px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#6EA8FE]/60" />
                            {r}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.results && (
                    <div>
                      <div className="mb-3 text-xs uppercase tracking-[0.18em] text-[#8B7CFF]">
                        核心成果
                      </div>
                      <div className="space-y-2">
                        {project.results.map((r, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 text-sm leading-7 text-[#B8C1D0]"
                          >
                            <span className="mt-[10px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#8B7CFF]/60" />
                            {r}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#B8C1D0]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 border-t border-white/10 pt-8">
            <TransitionLink
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-[#E6EAF2] transition hover:border-white/20 hover:bg-white/10"
            >
              ← 返回首页
            </TransitionLink>
          </div>
        </div>
      </section>
    </>
  );
}
