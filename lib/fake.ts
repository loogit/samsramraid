import { gbParam, hash, tierOf, type Ram } from "./tiers";
// All figures are fictional by design (satire). Deterministic from the clock so every visitor sees the same ticking numbers.
const T0 = Date.UTC(2026, 10, 1);
const secs = (now: number) => Math.max(0, Math.floor((now - T0) / 1000));
export const fakeTotals = (now: number) => { const audits = 2718281 + Math.floor(secs(now) * 2.3); return { audits, gb: Math.round(audits * 41.3) }; };
export const fakeDonations = (now: number) => ({ donors: 314159 + Math.floor(secs(now) * 0.4), gb: 612000 + Math.floor(secs(now) * 0.9) });
const BASE: Record<string, number> = { retro: 2, "8": 22, "16": 47, "32": 76, "64": 92, "128": 98, "256": 99 };
export const fakePct = (g: Ram, n: string) => { const id = tierOf(g).id; return id === "mac" ? 50 : Math.min(99, BASE[id] + (hash(n + gbParam(g)) % 3)); };
