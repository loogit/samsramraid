import { NextResponse } from "next/server";
import { parseGb } from "@/lib/tiers";
import { pipe } from "@/lib/redis";

export async function GET() {
  const r = await pipe([["GET", "donors"], ["GET", "donated"]]);
  return NextResponse.json({ donors: Number(r?.[0]?.result ?? 0), gb: Number(r?.[1]?.result ?? 0) });
}
export async function POST(req: Request) {
  const g = parseGb(String((await req.json().catch(() => ({}))).gb));
  if (!g) return NextResponse.json({ error: "bad input" }, { status: 400 });
  const r = await pipe([["INCR", "donors"], ["INCRBYFLOAT", "donated", g === "mac" ? 0 : g]]);
  return NextResponse.json({ donors: Number(r?.[0]?.result ?? 0), gb: Number(r?.[1]?.result ?? 0) });
}
