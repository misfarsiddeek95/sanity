import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { COLLECTIONS } from "@/data/products";
import { collectionDesc, collectionMeta } from "@/lib/page-meta";
import { collectionLd } from "@/lib/schema";
import { CollectionPage } from "@/views/Catalog";

export const dynamicParams = false;
export const generateStaticParams = () => COLLECTIONS.map((c) => ({ slug: c.slug }));

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return collectionMeta(slug);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const c = COLLECTIONS.find((x) => x.slug === slug);
  if (!c) notFound();
  return (
    <>
      <JsonLd data={collectionLd(c.label, collectionDesc(c))} />
      <CollectionPage slug={slug} />
    </>
  );
}
