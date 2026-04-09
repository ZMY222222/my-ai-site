import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type BaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButtonProps = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLinkProps = BaseProps & {
  href: string;
};

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#6EA8FE] text-[#0B1020] hover:brightness-110 border border-transparent",
  secondary:
    "border border-white/10 bg-white/5 text-[#E6EAF2] hover:border-white/20 hover:bg-white/10",
  ghost: "text-[#E6EAF2] hover:bg-white/5",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3 text-sm rounded-xl",
};

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    className,
    children,
    ...rest
  } = props as ButtonProps;

  const classes = cn(
    "inline-flex items-center justify-center font-medium transition",
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}