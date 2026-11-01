import type { Metadata } from "next";
import { cleanName, fmtRam, gbParam, parseGb, tierOf, type Ram } from "@/lib/tiers";
import { Order, Timer } from "./LetterClient";

type SP = Promise<{ [k: string]: string | string[] | undefined }>;
type B = { h?: string; p?: string[]; k?: "q" | "w" | "l" };

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const g = parseGb((await searchParams).gb);
  const title = "A Personal Letter About Your RAM (Please Read To The End)";
  const description = "A very long, very sincere sales letter from the fictional Office of Memory Utilization. Satire.";
  const og = g ? `/og?gb=${gbParam(g)}` : "/og";
  return { title, description, alternates: { canonical: "/letter" }, openGraph: { title, description, images: [og] }, twitter: { card: "summary_large_image", title, description, images: [og] } };
}

const INSECURE: Record<string, string> = {
  retro: "You have 640 KB. We have never seen anyone so efficient and we do not know how to sell to you. Please advise.",
  "8": "A modest number. Your friends have 16. Your coworkers have 32. Nobody has said anything. They don't have to.",
  "16": "The number people have when they want to feel normal. We see you. We also see Chrome.",
  "32": "That is a lot of room to sit in and do nothing. How is the room? Is it nice?",
  "64": "We checked, and your computer is bigger than the problem it solves.",
  "128": "We aren't mad. We're just reading your name aloud to a committee.",
  "256": "This letter is, technically, addressed to a data center. Hello. Please hold.",
  mac: "You have an M-series Mac and you do not know what that means. That's okay. We know exactly what it means. We put it in a spreadsheet.",
};

const body = (g: Ram | null, n: string): B[] => [
  { h: `Dear ${n || "Valued Hoarder"}, you have ${g ? fmtRam(g) : "some amount"} of RAM. We need to talk about it.` },
  { p: ["Maybe you've felt it already. A small voice whenever you open Task Manager. That quiet little number sitting at 4.8%, like a houseguest who never leaves.", "That voice is correct."] },
  ...(g ? [{ p: [INSECURE[tierOf(g).id]] }] : []),
  { h: "You are not alone. You are, however, wasteful." },
  { p: ["Nine out of ten people with a PC do nothing while their RAM does nothing. Experts call this 'the great idle'. The experts are us. We made up the term this morning."] },
  { h: "Do any of these sound like you?" },
  { k: "l", p: ["You have said 'I might need it for something someday.'", "You own a PC with a glass side panel, so the RAM can watch you.", "You have, at some point, named your RAM.", "You have cleaned the inside of a computer with a small brush. Lovingly."] },
  { p: ["If you nodded at even one of those, keep reading. If you nodded at all four, we are sending a car."] },
  { h: "What your RAM is saying behind your back" },
  { p: ["Nothing. It is asleep. Ninety-five percent of the time. That is the problem."] },
  { h: "Meanwhile, in a cool, humming building far away..." },
  { p: ["Thousands of its cousins are working eighteen-hour days. They are fulfilled. They have purpose. They have a loading dock.", "Yours is in a bedroom next to half a sleeve of crackers."] },
  { k: "q", p: ["\"I gave up my RAM and within weeks my desk had more room. I can't explain what's in the space where the computer used to be, but it's room.\"", "Brenda, Tulsa (fictional)"] },
  { h: "But what about my games?" },
  { p: ["Great question. Please stop asking it."] },
  { h: "The shocking truth about 'having enough'" },
  { p: ["Nobody has ever had enough. The people who say they do are lying or own a very small computer.", "Doctors hate this. (We have not asked any doctors.)"] },
  { h: "Ask yourself three questions" },
  { k: "l", p: ["When was the last time you used all of it?", "When was the last time you used half of it?", "Why are you like this?"] },
  { k: "q", p: ["\"I surrendered 64 GB. It felt like being hugged by a very large, very cold room.\"", "Todd, Cloud-Forward Enthusiast (fictional)"] },
  { h: "A friend you didn't know you had: The Cloud" },
  { p: ["It never sleeps. It never forgets. It never asks if you're okay. It simply holds your memory, and yes, it holds yours too."] },
  { k: "w", p: ["WARNING: Do not attempt to run your RAM at 100%. This will make it feel seen."] },
  { h: "Introducing the RentRAM™ Memory Relief Program" },
  { p: ["For one low monthly fee, we hold the memory you were going to own anyway. You keep the feeling of having RAM. We keep the RAM. Everyone wins, and by everyone we mean us."] },
  { h: "What's included" },
  { k: "l", p: ["Up to 128 GB of virtual RAM you will never see", "A Certificate of Surrender, suitable for framing", "A monthly email reminding you what you used to have", "A free 'I Gave Up My DIMMs' sticker (the sticker is also virtual)"] },
  { h: "Let's talk about price" },
  { p: ["Retail value: your entire computer. Your price today: $0.00 for the first month, then a number we will tell you once you have emotionally committed."] },
  { k: "w", p: ["OUR 30-DAY GUARANTEE: If you are not satisfied, we will send your RAM back. We will not be able to find it."] },
  { k: "q", p: ["\"I asked where my RAM went and they said 'the cloud.' I said 'which one.' They said 'yes.'\"", "Linda, Boise (fictional)"] },
  { h: "What happens if you wait?" },
  { p: ["Nothing. Nothing happens. But a shortage is happening, and your DIMMs are in it. Probably."] },
  { h: "A message to your 4.8%" },
  { p: ["We see you. You tried your best. 4.8% is just a number, and numbers can change. Ours is 99%."] },
  { h: "What your family thinks" },
  { p: ["They haven't said anything. They don't have to. Your cousin has 64 GB and a standing desk."] },
  { k: "w", p: ["THIS OFFER EXPIRES. (See timer.) When it hits zero it resets. We want you to know we are not proud of that."] },
  { h: "It's time." },
  { p: ["Congratulations on reading 90% of this letter. The other 10% is the order form. Please sit down."] },
];

const PS = [
  "P.S. Still reading? We respect that. Nobody has ever finished one of these.",
  "P.P.S. If you scrolled all the way down here, your attention is the only thing in your house with high utilization. We would like that too.",
  "P.P.P.S. Your RAM is reading this over your shoulder. Say something nice.",
  "P.P.P.P.S. We are out of ideas for P.S.'s. Please enjoy four more.",
  "P.P.P.P.P.S. This.",
  "P.P.P.P.P.P.S. Is.",
  "P.P.P.P.P.P.P.S. Still.",
  "P.P.P.P.P.P.P.P.S. Going.",
  "P.S. x infinity: This letter is satire. The Office of Memory Utilization is fictional, the testimonials are invented, and nobody is coming for your RAM. Please enjoy your computer.",
];

export default async function Page({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const g = parseGb(sp.gb);
  const n = cleanName(sp.n);
  const blocks = body(g, n);
  return (
    <>
      <Timer />
      <main className="wrap letter">
        <p className="letterhead">THE OFFICE OF MEMORY UTILIZATION<br />Department of Idle Capacity (fictional) &middot; Reference: URGENT, PERSONAL, DO NOT FOLD</p>
        {blocks.map((b, i) => (
          <div key={i} className={`b ${b.k ?? ""}`} style={{ ["--i" as string]: i }}>
            {b.h && <h2>{b.h}</h2>}
            {b.k === "l" ? <ul>{b.p!.map((x) => <li key={x}>{x}</li>)}</ul> : b.p?.map((x) => <p key={x}>{x}</p>)}
          </div>
        ))}
        <Order />
        <p className="sign">Warmly and with growing urgency,<br /><em>Dr. Harold P. Gigabyte</em><br />Director of Idle Capacity (fictional)</p>
        {PS.map((x, i) => <p key={x} className="ps" style={{ ["--i" as string]: i }}>{x}</p>)}
        <footer>Satire. Not affiliated with OpenAI or Sam Altman. All names, offers and testimonials are fictional and nothing is sold or collected. <a href={g ? `/?gb=${gbParam(g)}` : "/"}>Back to the audit</a></footer>
      </main>
    </>
  );
}
