import type { ReactNode } from "react";
import { Container } from "./Container";

export function PageIntro({
  eyebrow,
  title,
  children,
  aside,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="border-b border-gold/10">
      <Container className="grid gap-8 py-14 md:py-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end lg:gap-16">
        <div className="flex min-w-0 flex-col gap-6">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display-1">{title}</h1>
          {children ? <div className="lede measure flex flex-col gap-4 text-ivory/85">{children}</div> : null}
        </div>
        {aside ? <div className="min-w-0">{aside}</div> : null}
      </Container>
    </section>
  );
}
