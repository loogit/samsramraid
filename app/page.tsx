import type { Metadata } from "next";
import { cleanName, fmtRam, gbParam, parseGb, tierOf } from "@/lib/tiers";
import HomeClient from "./HomeClient";

type SP = Promise<{ [k: string]: string | string[] | undefined }>;

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const sp = await searchParams;
  const g = parseGb(sp.gb);
  if (!g) return {};
  const t = tierOf(g);
  const n = cleanName(sp.n);
  const og = `/og?gb=${gbParam(g)}${n ? `&n=${encodeURIComponent(n)}` : ""}`;
  const title = `${n || "Someone"} has ${fmtRam(g)} of RAM: ${t.status}`;
  return { title, openGraph: { title, images: [og] }, twitter: { card: "summary_large_image", title, images: [og] } };
}

export default async function Page({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  return <HomeClient initialGb={typeof sp.gb === "string" ? sp.gb : ""} initialName={cleanName(sp.n)} />;
}