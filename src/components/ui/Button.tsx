import type { ReactNode } from "react";
import { cn, external as externalAttrs } from "@/lib/utils";

type Variant = "primary" | "ghost";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: "md" | "sm";
  /** Opens in a new tab with rel="noopener noreferrer"; pass the screen-reader hint in the page language */
  external?: string | false;
  className?: string;
  track?: string;
}

/** A link styled as a button. Internal links are plain <a> so every page is a real, crawlable URL. */
export function ButtonLink({ href, children, variant = "primary", size = "md", external, className, track }: ButtonLinkProps) {
  return (
    <a
      href={href}
      className={cn("btn", variant === "primary" ? "btn-primary" : "btn-ghost", size === "sm" && "btn-sm", className)}
      data-track={track}
      {...(external ? externalAttrs : {})}
    >
      {children}
      {external ? <ExternalMark label={external} /> : null}
    </a>
  );
}

/** A clearly unavailable action: not a link, announced as disabled. */
export function DisabledButton({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span role="link" aria-disabled="true" className={cn("btn", className)}>
      {children}
    </span>
  );
}

export function ExternalMark({ label }: { label: string }) {
  return (
    <>
      <svg aria-hidden="true" width="11" height="11" viewBox="0 0 12 12" fill="none" className="shrink-0">
        <path d="M4 2h6v6M10 2 3 9" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <span className="sr-only">{label}</span>
    </>
  );
}
