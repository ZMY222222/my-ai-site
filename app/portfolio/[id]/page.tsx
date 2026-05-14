import { notFound } from "next/navigation";
import { TransitionLink } from "@/components/page-transition";
import Image from "next/image";
import { portfolioItems, PARALLAX_IMAGES } from "@/data/portfolio";
import { ParallaxGallery } from "@/components/parallax-gallery";
import { GalleryGrid } from "@/components/gallery-grid";
import { VideoCard } from "@/components/video-card";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return portfolioItems.map((item) => ({ id: item.id }));
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { id } = await params;
  const item = portfolioItems.find((p) => p.id === id);

  if (!item) notFound();

  return (
    <>
      <section className="pb-10 pt-16 md:pb-14 md:pt-20">
        <div className="mx-auto max-w-6xl px-6">
          <TransitionLink
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm text-[#E0E0E0] transition hover:text-[#F5F5F5]"
          >
            <span>←</span>
            <span>返回作品集</span>
          </TransitionLink>

          <div className="mt-6">
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-[#00D4FF]/30 bg-[#00D4FF]/10 px-3 py-0.5 text-xs text-[#00D4FF]">
                {item.category}
              </span>
              <span className="text-sm text-[#E0E0E0]">{item.date}</span>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#F5F5F5] md:text-4xl">
              {item.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[#E0E0E0]">
              {item.description}
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-[24px] border border-white/10">
            <div className="aspect-[16/9] bg-[#0D1225] relative">
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
              />
            </div>
          </div>
        </div>
      </section>

      {id === "ai-text-to-image-gallery" && (
        <ParallaxGallery images={PARALLAX_IMAGES} />
      )}

      {item.sections && (
        <section className="pb-20 md:pb-28">
          <div className="mx-auto max-w-4xl px-6">
            <div className="space-y-10">
              {item.sections.map((section) => (
                <div key={section.heading}>
                  <h2 className="text-xl font-semibold text-[#F5F5F5]">
                    {section.heading}
                  </h2>
                  <div className="mt-4 space-y-4">
                    {section.paragraphs.map((p, i) => (
                      <p key={i} className="text-base leading-8 text-[#E0E0E0]">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {item.news && (
        <section className="pb-20 md:pb-28">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="mb-8 text-2xl font-semibold text-[#F5F5F5]">
              📰 近期AI资讯跟踪
            </h2>
            <div className="space-y-6">
              {item.news.map((article, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-white/20"
                >
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 flex-shrink-0 rounded-lg bg-[#00D4FF]/10 px-2.5 py-1 text-xs font-medium text-[#00D4FF]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-medium text-[#F5F5F5] leading-7 transition hover:text-[#00D4FF]"
                      >
                        {article.title}
                      </a>
                      <p className="mt-2 text-sm leading-7 text-[#E0E0E0]">
                        {article.insight}
                      </p>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-xs text-[#00D4FF]/70 transition hover:text-[#00D4FF]"
                      >
                        <span>阅读原文</span>
                        <span>↗</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {item.galleries && (
        <>
          {item.galleries.some((g) => g.images?.length) ? (
            <GalleryGrid galleries={item.galleries} />
          ) : null}
          {item.galleries.some((g) => g.videos?.length) ? (
            <section className="pb-20 md:pb-28">
              <div className="mx-auto max-w-6xl px-6">
                {item.galleries.map((gallery) => (
                  <div key={gallery.category} className="mb-16">
                    <h2 className="mb-6 border-b border-white/10 pb-4 text-2xl font-semibold text-[#F5F5F5]">
                      {gallery.label}
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {gallery.videos?.map((vid) => (
                        <VideoCard
                          key={vid.alt}
                          base={vid.base}
                          alt={vid.alt}
                          model={vid.model}
                          videoSrc={vid.videoSrc}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}

      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-4xl px-6">
          <div className="border-t border-white/10 pt-8">
            <TransitionLink
              href="/portfolio"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-[#F5F5F5] transition hover:border-white/20 hover:bg-white/10"
            >
              ← 返回作品集
            </TransitionLink>
          </div>
        </div>
      </section>
    </>
  );
}
