import { faqLd, JsonLd } from "@/lib/jsonld";
import { pageMeta } from "@/lib/meta";
import { FaqView } from "@/views/PageViews";

export const metadata = pageMeta("faq", "en");

export default function Page() {
  return (
    <>
      <JsonLd data={faqLd("en")} />
      <FaqView lang="en" />
    </>
  );
}
