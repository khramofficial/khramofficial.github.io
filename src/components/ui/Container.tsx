import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  children,
  narrow = false,
  className,
}: {
  children: ReactNode;
  narrow?: boolean;
  className?: string;
}) {
  return <div className={cn("container-k", narrow && "container-narrow", className)}>{children}</div>;
}
