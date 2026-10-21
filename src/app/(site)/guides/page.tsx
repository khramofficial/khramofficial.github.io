import { pageMeta } from "@/lib/meta";
import { GuidesIndexView } from "@/views/GuideViews";

export const metadata = pageMeta("guides", "en");

export default function Page() {
  return <GuidesIndexView lang="en" />;
}
