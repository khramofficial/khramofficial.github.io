import { pageMeta } from "@/lib/meta";
import { FaqView } from "@/views/PageViews";

export const metadata = pageMeta("faq", "en");

export default function Page() {
  return <FaqView lang="en" />;
}
