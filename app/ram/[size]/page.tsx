import type { Metadata } from "next";
import Link from "next/link";
import { SITE, tierOf } from "@/lib/tiers";

export const SIZES: Record<string, string> = {
  "4": "4 GB is enough for light browsing and office work, but it is tight on current versions of Windows and modern browsers.",
  "8": "8 GB handles everyday browsing, streaming and light gaming, and is a common baseline for budget laptops. Heavy multitasking will push against it.",
  "16": "16 GB is the sweet spot for most gaming and general work. It leaves comfortable room for a browser full of tabs plus a game or a few apps.",
  "32": "32 GB gives real headroom for heavy multitasking, content creation, virtual machines and some local AI workloads. Most people don't need it, but it won't be wasted if you do.",
  "48": "48 GB usually comes from a 2x24 GB DDR5 kit. It suits heavy multitasking, development, and larger creative projects.",
  "64": "64 GB is workstation territory: large VMs, video editing, big builds and local language models. Gaming alone rarely needs it.",
  "96": "96 GB typically comes from a 2x48 GB DDR5 kit, aimed at heavy development, many virtual machines and large datasets.",
  "128": "128 GB is a specialist configuration for large datasets, many VMs and bigger local AI models. Typical desktop use will not come close.",
  "192": "192 GB is an extreme desktop or workstation configuration, built for very large datasets, simulation and large model work.",
  "256": "256 GB is server-class memory, for heavy virtualization and big in-memory workloads.",
};
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
