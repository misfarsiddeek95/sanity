/** Renders structured data. `<` is escaped so content can never close the script tag (XSS-safe). */
export function JsonLd({ data }: { data: object | object[] | null | undefined }) {
  if (!data) return null;
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
