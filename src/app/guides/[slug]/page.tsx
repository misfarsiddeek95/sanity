import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { GUIDES, getGuide } from "@/data/guides";
import { guideMeta } from "@/lib/page-meta";
import { guideLd } from "@/lib/schema";
import { GuidePage } from "@/views/Guides";

export const dynamicParams = false;
export const generateStaticParams = () => GUIDES.map((g) => ({ slug: g.slug }));

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return guideMeta(slug);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();
  return (
    <>
      <JsonLd data={guideLd(g)} />
      <GuidePage slug={slug} />
    </>
  );
}
