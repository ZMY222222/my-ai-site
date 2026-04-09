import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

type PageSectionProps = {
  className?: string;
  children: React.ReactNode;
};

export function PageSection({ className, children }: PageSectionProps) {
  return <section className={cn("pb-20 md:pb-28", className)}>{children}</section>;
}

type PageBlockProps = {
  className?: string;
  children: React.ReactNode;
};

export function PageBlock({ className, children }: PageBlockProps) {
  return (
    <Container>
      <div className={cn("w-full", className)}>{children}</div>
    </Container>
  );
}