import { pageMeta } from "@/lib/meta";
import { GuidesIndexView } from "@/views/GuideViews";

export const metadata = pageMeta("guides", "th");

export default function Page() {
  return <GuidesIndexView lang="th" />;
}
