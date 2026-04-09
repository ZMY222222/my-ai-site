import { Container } from "@/components/ui/container";

export default function BlogLoadingPage() {
  return (
    <>
      <section className="section pb-10 md:pb-14">
        <Container>
          <div className="animate-pulse rounded-[32px] border border-white/10 bg-[#151B34]/80 p-8 md:p-12">
            <div className="h-4 w-24 rounded bg-white/10" />
            <div className="mt-6 h-12 w-3/4 rounded bg-white/10 md:h-16" />
            <div className="mt-4 h-6 w-full max-w-3xl rounded bg-white/10" />
            <div className="mt-3 h-6 w-5/6 rounded bg-white/10" />
          </div>
        </Container>
      </section>

      <section className="pb-20 md:pb-28">
        <Container>
          <div className="animate-pulse rounded-[32px] border border-white/10 bg-[#151B34]/80 p-8 md:p-10">
            <div className="mb-8 h-4 w-28 rounded bg-white/10" />
            {Array.from({ length: 4 }).map((_, sectionIndex) => (
              <div key={sectionIndex} className="mb-10">
                <div className="h-8 w-48 rounded bg-white/10" />
                <div className="mt-5 h-5 w-full rounded bg-white/10" />
                <div className="mt-3 h-5 w-11/12 rounded bg-white/10" />
                <div className="mt-3 h-5 w-4/5 rounded bg-white/10" />
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}