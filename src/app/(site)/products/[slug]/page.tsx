import { JsonLd, productLd } from "@/lib/jsonld";
import { productMeta, productParams } from "@/lib/meta";
import { ProductView } from "@/views/CatalogViews";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = productParams;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return productMeta(slug, "en");
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return (
    <>
      <JsonLd data={productLd(slug, "en")} />
      <ProductView slug={slug} lang="en" />
    </>
  );
}
