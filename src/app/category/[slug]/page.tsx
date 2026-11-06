import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { CATEGORIES } from "@/data/products";
import { categoryDesc, categoryMeta } from "@/lib/page-meta";
import { collectionLd } from "@/lib/schema";
import { CategoryPage } from "@/views/Catalog";

export const dynamicParams = false;
export const generateStaticParams = () => CATEGORIES.map((c) => ({ slug: c.slug }));

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return categoryMeta(slug);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const c = CATEGORIES.find((x) => x.slug === slug);
  if (!c) notFound();
  return (
    <>
      <JsonLd data={collectionLd(c.label, categoryDesc(c))} />
      <CategoryPage slug={slug} />
    </>
  );
}
