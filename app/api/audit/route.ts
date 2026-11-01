import { NextResponse } from "next/server";
import { TIERS, parseGb, tierOf } from "@/lib/tiers";

const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const tok = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
const ORDER = TIERS.filter((t) => t.id !== "mac").map((t) => t.id);

async function pipe(cmds: (string | number)[][]): Promise<{ result: any }[] | null> {
  if (!url || !tok) return null;
  try {
    const r = await fetch(`${url}/pipeline`, { method: "POST", headers: { Authorization: `Bearer ${tok}` }, body: JSON.stringify(cmds), cache: "no-store" });
    return r.ok ? await r.json() : null;
  } catch { return null; }
}
const toMap = (a: string[] = []) => { const m: Record<string, number> = {}; for (let i = 0; i < a.length; i += 2) m[a[i]] = Number(a[i + 1]); return m; };
function pct(m: Record<string, number>, mine: string) {
  const total = ORDER.reduce((s, k) => s + (m[k] || 0), 0);
  const i = ORDER.indexOf(mine);
  if (i < 0 || total < 10) return null;
  const below = ORDER.slice(0, i).reduce((s, k) => s + (m[k] || 0), 0);
  return Math.round((100 * (below + (m[mine] || 0) / 2)) / total);
}

export async function GET() {
  const r = await pipe([["GET", "audits"], ["GET", "gb"]]);
  return NextResponse.json({ audits: Number(r?.[0]?.result ?? 0), gb: Number(r?.[1]?.result ?? 0) });
}
export async function POST(req: Request) {
  const g = parseGb(String((await req.json().catch(() => ({}))).gb));
  if (!g) return NextResponse.json({ error: "bad input" }, { status: 400 });
  const id = tierOf(g).id;
  const r = await pipe([["INCR", "audits"], ["INCRBYFLOAT", "gb", g === "mac" ? 0 : g], ["HINCRBY", "tiers", id, 1], ["HGETALL", "tiers"]]);
  if (!r) return NextResponse.json({ audits: 0, gb: 0, pct: null });
  return NextResponse.json({ audits: Number(r[0].result), gb: Number(r[1].result), pct: pct(toMap(r[3].result), id) });
}
