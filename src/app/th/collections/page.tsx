import { pageMeta } from "@/lib/meta";
import { CollectionsView } from "@/views/CatalogViews";

export const metadata = pageMeta("collections", "th");

export default function Page() {
  return <CollectionsView lang="th" />;
}
