import type { Metadata } from "next";
import { cleanName, donorOf, fmtRam, gbParam, parseGb, tierOf } from "@/lib/tiers";
import Donate from "./DonateClient";

type SP = Promise<{ [k: string]: string | string[] | undefined }>;
const STEPS: [string, string, string][] = [
  ["Confirm your eligibility", "You are eligible if your RAM utilization is under 5%. Everyone is. We checked. Check Task Manager anyway and take a moment with the number.", "If it says 60%, that is Chrome. Chrome is not eligible."],
  ["Say goodbye", "Open a blank text file. Type 'goodbye'. Do not save it. Some things are between you and your RAM.", "Optional: play one (1) slow song."],
  ["Back up your files", "Copy anything you care about to external storage or, in the spirit of the program, to the cloud. Do this before anything else. It is the only genuinely sensible step on this list.", "Sam's Cloud does not accept files. It only accepts gratitude."],
  ["Shut down completely", "Choose Shut Down, not Sleep and not Hibernate. Sleep is just your computer pretending. Wait for the fans to stop. Wait a little longer. Wait until the room feels different.", "Hold Shift while clicking Shut Down for a full shutdown on Windows."],
  ["Unplug everything", "Remove the power cable from the wall or the back of the case. Press and hold the power button for five seconds to drain the last of the electricity. Your PC may whisper. This is normal.", "Label the cables. You will not need them. Label them anyway."],
  ["Ground yourself", "Touch a bare metal part of the case before handling any internal part. If you feel nothing, you are grounded. If you feel something, that is the 4.8%.", "Do not wear a wool sweater. Do not wear your feelings."],
  ["Open the case", "Remove the side panel, usually two thumbscrews at the back. Place the screws in a small bowl. Screws are not donatable. We asked.", "Lay the case on its side. Be gentle. It has had a long life."],
  ["Locate the memory", "Find the long, thin sticks next to the processor, usually in pairs. They may be hiding under a cooler or a decorative shroud. This is normal. They are shy.", "If you cannot find them, you may have a Mac. Please sit this one out."],
  ["Release the clips", "Press the small clips at each end of the slot outward or down. The stick will pop up slightly. Do not force it. Forcing is for people with 256 GB.", "Some boards have a clip on one side only. Those are the single-parent slots."],
  ["Handle with respect", "Lift each stick straight up by its short edges. Never touch the gold contacts. Hold it like a small, expensive cracker.", "Do not lick the RAM. We have to say this."],
  ["Wrap it", "Place each stick in an anti-static bag. If you have none, use the bag your RAM came in. If you have none of those, you have already lost.", "Do not use your sandwich as padding."],
  ["Label it", "Write on the bag: donor name, capacity, and the case number on your certificate. Use a pen. A marker is a cry for help.", "Also add the word 'FRAGILE'. It builds character."],
  ["Package it", "Use a padded envelope or a small box with crumpled paper. Seal with tape. Seal again with intent.", "Tell the postal worker nothing. They know."],
  ["Address it", "Sam's Cloud Receiving Dock, Bay 0, 1 Idle Capacity Way, Nowhere, XX 00000. This address is fictional. Do not mail anything there. It does not exist and neither does the dock.", "If you did mail something there, congratulations, it is now art."],
  ["Await confirmation", "You will receive an acknowledgment within six to eight geological eras. In the meantime, please do not use your computer. It has no memory. It is going through something.", "Reinstall your RAM to feel better. This is allowed. It is the best step."],
  ["Receive your certificate", "This is the only real part. Come back to this page, press the button below, and get your Certificate of Donation, suitable for sharing and, if you must, framing.", "Frame it next to your other degrees."],
];
const FAQ: [string, string][] = [
  ["Is this tax-deductible?", "No. Nothing here is real, including the tax part."],
  ["What if I only donate half?", "The Office of Memory Utilization calls that a compromise. The Cloud calls it a start."],
  ["Can I donate someone else's RAM?", "Please ask your RAM. It has views."],
  ["Will my computer still work?", "Without RAM, no. That is why you should not actually do this, and why the final step is reinstalling it."],
  ["Who is collecting the donations?", "No one. There is no dock, no bay and no cloud. It is a joke website and your RAM is exactly where you left it."],
];

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const sp = await searchParams;
  const g = parseGb(sp.gb);
  const n = cleanName(sp.n);
  const title = g ? `${n || "Someone"} donated ${fmtRam(g)} of RAM: ${donorOf(tierOf(g))}` : "How to Donate Your RAM to Sam's Cloud: 16 Detailed Steps";
  const og = `/og?${g ? `gb=${gbParam(g)}${n ? `&n=${encodeURIComponent(n)}` : ""}&cert=1` : ""}`;
  return { title, description: "A deeply detailed and completely fictional guide to donating your RAM to Sam's Cloud, with a Certificate of Donation. Satire.", alternates: { canonical: "/donate" }, openGraph: { title, images: [og] }, twitter: { card: "summary_large_image", title, images: [og] } };
}

export default async function Page({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const ld = { "@context": "https://schema.org", "@type": "HowTo", name: "How to donate your RAM to Sam's Cloud (satire)", step: STEPS.map(([name, text]) => ({ "@type": "HowToStep", name, text })) };
  return (
    <main className="wrap donate">
      <h1>Donate your RAM to Sam&apos;s Cloud</h1>
      <p className="tldr">Form DR-1: Donor Relinquishment of Idle Memory. Sixteen steps, one certificate, zero actual donations. Read them all, or skip to the end for your certificate.</p>
      <div className="notice"><strong>Important:</strong> Do not actually remove or mail your RAM. Nobody is collecting it, the address is fictional, and your PC needs RAM to work. This whole page is satire. If you genuinely have old hardware to give away, look for a certified e-waste recycler or a local charity.</div>
      <h2 className="s">What you will need</h2>
      <ul className="need"><li>One (1) computer with an unhealthy amount of RAM</li><li>One (1) Phillips #2 screwdriver, if your case needs one</li><li>One (1) anti-static bag</li><li>One (1) pen. Not a marker.</li><li>One (1) sense of closure</li></ul>
      <h2 className="s">The instructions</h2>
      <ol className="steps">{STEPS.map(([t, b, tip]) => <li key={t}><h3>{t}</h3><p>{b}</p><p className="tip"><em>Tip:</em> {tip}</p></li>)}</ol>
      <Donate gb={typeof sp.gb === "string" ? sp.gb : ""} name={cleanName(sp.n)} />
      <section><h2 className="s">Questions donors ask</h2>{FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>
      <footer>Satire. Not affiliated with OpenAI or Sam Altman. Nothing is collected, sold or donated. <a href="/">Back to the audit</a></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </main>
  );
}
