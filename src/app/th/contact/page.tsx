import { pageMeta } from "@/lib/meta";
import { ContactView } from "@/views/PageViews";

export const metadata = pageMeta("contact", "th");

export default function Page() {
  return <ContactView lang="th" />;
}
