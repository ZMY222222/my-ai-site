import { Container } from "@/components/ui/container";

export default function TrainingLogLoadingPage() {
  return (
    <>
      <section className="section pb-10 md:pb-14">
        <Container>
          <div className="animate-pulse rounded-[32px] border border-white/10 bg-[#151B34]/80 p-8 md:p-12">
            <div className="h-4 w-28 rounded bg-white/10" />
            <div className="mt-6 h-12 w-3/4 rounded bg-white/10 md:h-16" />
            <div className="mt-4 h-6 w-full max-w-3xl rounded bg-white/10" />
            <div className="mt-3 h-6 w-5/6 rounded bg-white/10" />
          </div>
        </Container>
      </section>

      <section className="pb-20 md:pb-28">
        <Container>
          <div className="space-y-8">
            <div className="animate-pulse rounded-[28px] border border-white/10 bg-[#151B34]/80 p-8">
              <div className="h-4 w-16 rounded bg-white/10" />
              <div className="mt-3 h-6 w-40 rounded bg-white/10" />
            </div>

            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-[28px] border border-white/10 bg-[#151B34]/80 p-8"
              >
                <div className="h-8 w-40 rounded bg-white/10" />
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