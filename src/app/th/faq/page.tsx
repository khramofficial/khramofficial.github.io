import { pageMeta } from "@/lib/meta";
import { FaqView } from "@/views/PageViews";

export const metadata = pageMeta("faq", "th");

export default function Page() {
  return <FaqView lang="th" />;
}
