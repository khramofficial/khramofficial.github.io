import { pageMeta } from "@/lib/meta";
import { StoryView } from "@/views/PageViews";

export const metadata = pageMeta("story", "en");

export default function Page() {
  return <StoryView lang="en" />;
}
