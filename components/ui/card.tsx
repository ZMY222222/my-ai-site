import { cn } from "@/lib/utils";

type CardProps = {
  className?: string;
  children: React.ReactNode;
};

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/10 bg-[#151B34]/80",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: CardProps) {
  return <div className={cn("p-6 md:p-8", className)}>{children}</div>;
}

export function CardContent({ className, children }: CardProps) {
  return <div className={cn("px-6 pb-6 md:px-8 md:pb-8", className)}>{children}</div>;
}

export function CardTitle({ className, children }: CardProps) {
  return (
    <h3 className={cn("text-xl font-medium leading-8 text-[#E6EAF2]", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children }: CardProps) {
  return (
    <p className={cn("mt-3 text-sm leading-7 text-[#A7B0C0]", className)}>
      {children}
    </p>
  );
}