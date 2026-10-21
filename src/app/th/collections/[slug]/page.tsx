import { collectionMeta, collectionParams } from "@/lib/meta";
import { CollectionView } from "@/views/CatalogViews";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = collectionParams;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return collectionMeta(slug, "th");
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <CollectionView slug={slug} lang="th" />;
}
