import type { ReactNode } from "react";
import { ui } from "@/i18n/ui";
import type { Lang } from "@/lib/types";
import { Footer } from "./Footer";
import { Header } from "./Header";

/** Header + main + footer for one language. English pages and /th/ pages each wrap themselves in this. */
export function SiteShell({ lang, path, children }: { lang: Lang; path?: string | null; children: ReactNode }) {
  return (
    <div lang={lang} className="site-shell" data-site-lang={lang}>
      <a href="#main" className="skip-link">
        {ui(lang).nav.skip}
      </a>
      <Header lang={lang} path={path} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer lang={lang} />
    </div>
  );
}
