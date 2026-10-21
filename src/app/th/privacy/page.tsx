import { pageMeta } from "@/lib/meta";
import { PrivacyView } from "@/views/PageViews";

export const metadata = pageMeta("privacy", "th");

export default function Page() {
  return <PrivacyView lang="th" />;
}
