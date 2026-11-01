export const SITE = {
  name: "The Altman Utilization Audit",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://samsramraid.com",
};
export type Ram = number | "mac";
export type Tier = { id: string; max?: number; status: string; color: string; line: string; post: string; eta: number; siren?: boolean };
export const TIERS: Tier[] = [
  { id: "retro", max: 0.01, status: "PROTECTED BY IRRELEVANCE", color: "#b9b9ff", eta: 0, post: "Even Sam doesn't want my RAM.",
    line: "Not even Sam wants this. You are a museum, not a target. Carry on." },
  { id: "8", max: 8, status: "UNWORTHY", color: "#39ff14", eta: 0, post: "Sam looked at my RAM and sighed.",
    line: "Sam viewed your machine by satellite and sighed. You may keep your e-waste. For now." },
  { id: "16", max: 16, status: "UNDER REVIEW", color: "#c8ff2e", eta: 0, post: "Sam is drafting a strongly worded email about my RAM.",
    line: "Borderline. If Chrome has more than three tabs open, a strongly worded email is already being drafted." },
  { id: "32", max: 32, status: "HIGH-RISK HOARDER", color: "#ffb000", eta: 259200, post: "Sam is tracking my IP over my RAM.",
    line: "Your rig is sitting on a pile of 'wasted' DRAM. Leave the PC on the porch to ensure a peaceful transition of assets." },
  { id: "64", max: 64, status: "CRITICAL HOARDER", color: "#ff6a00", eta: 14400, post: "I'm apparently a critical RAM hoarder.",
    line: "You run a personal data center in a bedroom. A man in a fleece vest has been told your zip code." },
  { id: "128", max: 128, status: "STRIKE TEAM DISPATCHED", color: "#ff2a2a", eta: 1800, siren: true, post: "A strike team has been dispatched to my house over my RAM.",
    line: "A drone is en route to desolder your motherboard. Hide your family. Hide your DIMMs. Hide your DIMMs first." },
  { id: "256", max: Infinity, status: "YOU ARE THE SHORTAGE", color: "#ff2a6d", eta: 420, siren: true, post: "I am personally the global chip shortage.",
    line: "You, personally, are the global chip shortage. Nobody else can be reached for comment. Please remain seated." },
  { id: "mac", status: "UNIFIED MEMORY, UNIFIED DENIAL", color: "#00e5ff", eta: 3600, post: "I don't know how much RAM I have. Sam does.",
    line: "You do not know how much RAM you have. Sam does. He has always known." },
];
export const tierOf = (g: Ram): Tier => (g === "mac" ? TIERS[7] : TIERS.find((t) => t.max !== undefined && g <= t.max)!);
export const parseGb = (v?: string | string[]): Ram | null => {
  if (v === "mac") return "mac";
  const x = typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(x) && x > 0 && x <= 4096 ? x : null;
};
export const gbParam = (g: Ram) => (g === "mac" ? "mac" : String(+g.toPrecision(6)));
export const fmtRam = (g: Ram) => g === "mac" ? "M-series Mac" : g >= 1 ? `${+g.toFixed(2)} GB` : g >= 0.001 ? `${+(g * 1024).toFixed(1)} MB` : `${Math.round(g * 1048576)} KB`;
export const wasted = (g: Ram) => (g === "mac" ? "unknown (you wouldn't know)" : g < 0.01 ? "0 KB (it's all in use)" : fmtRam(g * 0.95));
export const hash = (s: string) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
export const caseNo = (g: Ram, n: string) => `ALT-${(hash(gbParam(g) + n) % 900000) + 100000}`;
export const util = (g: Ram, n: string) => (4 + (hash(n + gbParam(g)) % 10) / 10).toFixed(1);
export const cleanName = (v?: string | string[]) => (typeof v === "string" ? v.replace(/[^\p{L}\p{N} ._'-]/gu, "").slice(0, 24).trim() : "");
