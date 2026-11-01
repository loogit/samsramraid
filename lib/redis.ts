const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const tok = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
export async function pipe(cmds: (string | number)[][]): Promise<{ result: any }[] | null> {
  if (!url || !tok) return null;
  try {
    const r = await fetch(`${url}/pipeline`, { method: "POST", headers: { Authorization: `Bearer ${tok}` }, body: JSON.stringify(cmds), cache: "no-store" });
    return r.ok ? await r.json() : null;
  } catch { return null; }
}
