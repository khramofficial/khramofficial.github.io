import { faqLd, JsonLd } from "@/lib/jsonld";
import { pageMeta } from "@/lib/meta";
import { FaqView } from "@/views/PageViews";

export const metadata = pageMeta("faq", "th");

export default function Page() {
  return (
    <>
      <JsonLd data={faqLd("th")} />
      <FaqView lang="th" />
    </>
  );
}
