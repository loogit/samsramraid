import type { Metadata } from "next";
import Link from "next/link";
import { SITE, tierOf } from "@/lib/tiers";
import { SIZES } from "@/lib/sizes";

export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(SIZES).map((size) => ({ size }));

export async function generateMetadata({ params }: { params: Promise<{ size: string }> }): Promise<Metadata> {
  const { size } = await params;
  const title = `Is ${size} GB of RAM too much? Sam Altman's verdict`;
  const description = `${SIZES[size]} Plus the satirical Altman Utilization Audit verdict for ${size} GB.`;
  return { title, description, alternates: { canonical: `/ram/${size}` }, openGraph: { title, description, images: [`/og?gb=${size}`] }, twitter: { card: "summary_large_image", title, images: [`/og?gb=${size}`] } };
}

export default async function Page({ params }: { params: Promise<{ size: string }> }) {
  const { size } = await params;
  const t = tierOf(Number(size));
  const ld = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: `Is ${size} GB of RAM too much?`, acceptedAnswer: { "@type": "Answer", text: SIZES[size] } }] };
  return (
    <main className="wrap" style={{ ["--c" as string]: t.color }}>
      <h1>Is {size} GB of RAM too much?</h1>
      <p className="tldr">{SIZES[size]}</p>
      <h2 className="s">The Altman verdict: {t.status}</h2>
      <p>{t.line} (Satire. Sam Altman reportedly called consumer RAM &ldquo;quite terrible&rdquo; on the Cheeky Pint podcast, and the internet has been confessing its gigabytes ever since.)</p>
      <p><Link href={`/?gb=${size}`} className="go" style={{ display: "block", textAlign: "center", textDecoration: "none", padding: 16 }}>GET MY {size} GB WARRANT</Link></p>
      <section><h2 className="s">Other sizes</h2>
        <ul className="sizes">{Object.keys(SIZES).filter((s) => s !== size).map((s) => <li key={s}><Link href={`/ram/${s}`}>{s} GB</Link></li>)}</ul>
      </section>
      <footer>Satire from {SITE.name}. Not affiliated with OpenAI or Sam Altman. <Link href="/">Home</Link></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </main>
  );
}
