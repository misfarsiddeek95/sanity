import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PRODUCTS, getProduct } from "@/data/products";
import { productMeta } from "@/lib/page-meta";
import { productLd } from "@/lib/schema";
import { ProductPage } from "@/views/Product";

export const dynamicParams = false;
export const generateStaticParams = () => PRODUCTS.map((p) => ({ slug: p.slug }));

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return productMeta(slug);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  return (
    <>
      <JsonLd data={productLd(p)} />
      <ProductPage key={slug} slug={slug} />
    </>
  );
}
