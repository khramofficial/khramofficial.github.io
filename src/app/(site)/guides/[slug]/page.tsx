import { guideLd, JsonLd } from "@/lib/jsonld";
import { guideMeta, guideParams } from "@/lib/meta";
import { GuideView } from "@/views/GuideViews";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = guideParams;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return guideMeta(slug);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return (
    <>
      <JsonLd data={guideLd(slug)} />
      <GuideView slug={slug} />
    </>
  );
}
