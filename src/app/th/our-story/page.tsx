import { pageMeta } from "@/lib/meta";
import { StoryView } from "@/views/PageViews";

export const metadata = pageMeta("story", "th");

export default function Page() {
  return <StoryView lang="th" />;
}
