# lib/tiers.ts

- Ram · type · L5-L5 — type Ram = number | "mac";
- Tier · type · L6-L6 — type Tier = { id: string; max?: number; status: string; color: string; line: string; post: string; eta: number; siren?: boolean };
- tierOf · function · L25-L25 — tierOf = (g: Ram): Tier
- parseGb · function · L26-L30 — parseGb = (v?: string | string[]): Ram | null
- gbParam · function · L31-L31 — gbParam = (g: Ram)
- fmtRam · function · L32-L32 — fmtRam = (g: Ram)
- wasted · function · L33-L33 — wasted = (g: Ram)
- hash · function · L34-L34 — hash = (s: string)
- caseNo · function · L35-L35 — caseNo = (g: Ram, n: string)
- util · function · L36-L36 — util = (g: Ram, n: string)
- cleanName · function · L37-L37 — cleanName = (v?: string | string[])
- donorOf · function · L39-L39 — donorOf = (t: Tier)
