import type { Metadata } from "next";
import Audit from "./Audit";
import { TIERS, cleanName } from "@/lib/tiers";

type SP = Promise<{ [k: string]: string | string[] | undefined }>;

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const sp = await searchParams;
  const t = TIERS.find((x) => x.id === sp.ram);
  if (!t) return {};
  const n = cleanName(sp.n);
  const og = `/og?ram=${t.id}${n ? `&n=${encodeURIComponent(n)}` : ""}`;
  const title = `${n || "Someone"} has ${t.label} of RAM: ${t.status}`;
  return { title, openGraph: { title, images: [og] }, twitter: { card: "summary_large_image", title, images: [og] } };
}

const FAQ = [
  ["What did Sam Altman say about RAM in personal computers?", "On the Cheeky Pint podcast, OpenAI CEO Sam Altman reportedly said it is 'quite terrible' that everyday people have memory chips sitting in their PCs and gaming rigs. His argument, as reported, was that consumer machines use their RAM only about 5% of the time, and that memory would see 'maximum utilization' pooled in large data centers."],
  ["Why is everyone posting 'it was me' memes about RAM?", "Because the comment landed in the middle of a DRAM shortage. AI data centers are buying huge amounts of memory, which has pushed up prices for upgrades and consumer electronics. People responded by posting their RAM amounts, from 128 GB down to a few kilobytes, as if confessing to a crime against Sam."],
  ["Does this site actually scan my computer?", "No. It is a joke. You pick a RAM size from a dropdown and get a fake notice. Nothing is scanned, tracked or sent anywhere. Your name only lives in the share link you choose to post."],
  ["Is this affiliated with OpenAI or Sam Altman?", "No. This is satire and fan commentary. It is not affiliated with, endorsed by or connected to OpenAI, Sam Altman or any related company, and the verdicts are invented."],
  ["How much RAM puts me on the strike team list?", "On this site's wholly fictional scale: 8 GB or less is 'unworthy', 16 GB is under review, 32 GB is a high-risk hoarder, 64 GB is critical, 128 GB triggers a dispatched strike team, and 256 GB or more means you are the shortage."],
];

export default async function Page({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const ld = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
  return (
    <>
      <div className="ticker" aria-hidden><span>BREAKING: Local man discovers 32 GB of RAM in own PC &middot; Utilization reported at a terrible 4.8% &middot; Strike team status: pending &middot; Please do not hide your DIMMs &middot; Please do not hide your DIMMs &middot;</span></div>
      <main className="wrap">
        <h1>Is Sam coming for your RAM?</h1>
        <p className="sub">Sam Altman reportedly called it &ldquo;quite terrible&rdquo; for normal people to keep RAM in their PCs. Confess your gigabytes. Get your official notice. Warn your friends.</p>
        <Audit initialId={typeof sp.ram === "string" ? sp.ram : ""} initialName={cleanName(sp.n)} />

        <section>
          <h2 className="s">What actually happened</h2>
          <p>In an interview on the Cheeky Pint podcast, OpenAI CEO Sam Altman reportedly argued that the world has limited RAM and that consumer PCs use theirs roughly 5% of the time. In his framing, that memory would be better pooled in centralized data centers, where it can reach &ldquo;maximum utilization&rdquo;.</p>
          <p>The internet noticed that AI companies are major buyers of memory chips, and that DRAM prices have climbed. The result: the &ldquo;tell Sam Altman how many GB of RAM it was&rdquo; meme, where people confess their RAM like a crime. This site turns the joke into a tool. Run the audit, then post your warrant.</p>
        </section>

        <section>
          <h2 className="s">Questions the strike team gets asked</h2>
          {FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
        </section>

        <footer>Satire. Not affiliated with OpenAI or Sam Altman. No scanning, no tracking, no data collected. Verdicts are fictional. Quotes are paraphrased from public reporting.</footer>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
