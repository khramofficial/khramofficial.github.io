import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/SiteShell";

export default function Layout({ children }: { children: ReactNode }) {
  return <SiteShell lang="en">{children}</SiteShell>;
}
