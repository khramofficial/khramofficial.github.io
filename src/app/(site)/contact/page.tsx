import { pageMeta } from "@/lib/meta";
import { ContactView } from "@/views/PageViews";

export const metadata = pageMeta("contact", "en");

export default function Page() {
  return <ContactView lang="en" />;
}
