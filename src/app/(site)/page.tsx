import { pageMeta } from "@/lib/meta";
import { HomeView } from "@/views/HomeView";

export const metadata = pageMeta("home", "en");

export default function Page() {
  return <HomeView lang="en" />;
}
