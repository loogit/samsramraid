export const SITE = {
  name: "The Altman Utilization Audit",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://samsramraid.com",
};
export type Tier = { id: string; label: string; status: string; color: string; line: string; eta: number; wasted: string; siren?: boolean };
export const TIERS: Tier[] = [
  { id: "8", label: "8 GB or less", status: "UNWORTHY", color: "#39ff14", eta: 0, wasted: "under 7.6 GB",
    line: "Sam viewed your machine by satellite and sighed. You may keep your e-waste. For now." },
  { id: "16", label: "16 GB", status: "UNDER REVIEW", color: "#c8ff2e", eta: 0, wasted: "15.2 GB",
    line: "Borderline. If Chrome has more than three tabs open, a strongly worded email is already being drafted." },
  { id: "32", label: "32 GB", status: "HIGH-RISK HOARDER", color: "#ffb000", eta: 259200, wasted: "30.4 GB",
    line: "Your rig is sitting on a pile of 'wasted' DRAM. Leave the PC on the porch to ensure a peaceful transition of assets." },
  { id: "64", label: "64 GB", status: "CRITICAL HOARDER", color: "#ff6a00", eta: 14400, wasted: "60.8 GB",
    line: "You run a personal data center in a bedroom. A man in a fleece vest has been told your zip code." },
  { id: "128", label: "128 GB", status: "STRIKE TEAM DISPATCHED", color: "#ff2a2a", eta: 1800, wasted: "121.6 GB", siren: true,
    line: "A drone is en route to desolder your motherboard. Hide your family. Hide your DIMMs. Hide your DIMMs first." },
  { id: "256", label: "256 GB or more", status: "YOU ARE THE SHORTAGE", color: "#ff2a6d", eta: 420, wasted: "all of it", siren: true,
    line: "You, personally, are the global chip shortage. Nobody else can be reached for comment. Please remain seated." },
  { id: "mac", label: "M-series Mac (no idea what RAM is)", status: "UNIFIED MEMORY, UNIFIED DENIAL", color: "#00e5ff", eta: 3600, wasted: "unknown (you wouldn't know)",
    line: "You do not know how much RAM you have. Sam does. He has always known." },
  { id: "retro", label: "640 KB (I run DOS)", status: "PROTECTED BY IRRELEVANCE", color: "#b9b9ff", eta: 0, wasted: "0 KB (it's all in use)",
    line: "Not even Sam wants this. You are a museum, not a target. Carry on." },
];
export const hash = (s: string) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
export const caseNo = (id: string, n: string) => `ALT-${(hash(id + n) % 900000) + 100000}`;
export const util = (id: string, n: string) => (4 + (hash(n + id) % 10) / 10).toFixed(1);
export const cleanName = (v?: string | string[]) => (typeof v === "string" ? v.replace(/[^\p{L}\p{N} ._'-]/gu, "").slice(0, 24).trim() : "");
