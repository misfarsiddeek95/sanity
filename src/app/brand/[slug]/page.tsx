import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { BRANDS, getBrand } from "@/data/products";
import { brandDesc, brandMeta } from "@/lib/page-meta";
import { collectionLd } from "@/lib/schema";
import { BrandPage } from "@/views/Catalog";

export const dynamicParams = false;
export const generateStaticParams = () => BRANDS.map((b) => ({ slug: b.slug }));

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return brandMeta(slug);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const b = getBrand(slug);
  if (!b) notFound();
  return (
    <>
      <JsonLd data={collectionLd(b.name, brandDesc(b.name))} />
      <BrandPage slug={slug} />
    </>
  );
}
