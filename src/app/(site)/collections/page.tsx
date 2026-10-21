import { pageMeta } from "@/lib/meta";
import { CollectionsView } from "@/views/CatalogViews";

export const metadata = pageMeta("collections", "en");

export default function Page() {
  return <CollectionsView lang="en" />;
}
