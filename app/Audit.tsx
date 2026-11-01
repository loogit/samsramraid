"use client";
import { useEffect, useRef, useState } from "react";
import { caseNo, cleanName, fmtRam, gbParam, parseGb, tierOf, util, wasted, type Ram } from "@/lib/tiers";

const LINES = ["SCANNING DRAM CONTRACT PRICES...", "DETECTING WASTED GIGABYTES...", "MEASURING IDLE UTILIZATION: 95%... TERRIBLE", "CONTACTING OPENAI DATA CENTER RECON...", "CROSS-REFERENCING YOUR GAMING HISTORY...", "DRAFTING NOTICE OF HARDWARE SEIZURE..."];
const F: Record<string, number> = { GB: 1, MB: 1 / 1024, KB: 1 / 1048576 };
const CHIPS = [8, 16, 32, 48, 64, 128];
const fmt = (s: number) => [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((v) => String(v).padStart(2, "0")).join(":");
const big = (g: number) => (g >= 1048576 ? `${(g / 1048576).toFixed(1)} PB` : g >= 1024 ? `${(g / 1024).toFixed(1)} TB` : `${Math.round(g)} GB`);
type Stats = { audits: number; gb: number; pct?: number | null };

export default function Audit({ initialGb = "", initialName = "" }: { initialGb?: string; initialName?: string }) {
  const init = parseGb(initialGb);
  const [g, setG] = useState<Ram | null>(init);
  const [val, setVal] = useState("");
  const [unit, setUnit] = useState("GB");
  const [mac, setMac] = useState(false);
  const [name, setName] = useState(initialName);
  const [phase, setPhase] = useState<"idle" | "scan" | "result">(init ? "result" : "idle");
  const [log, setLog] = useState<string[]>([]);
  const [secs, setSecs] = useState(0);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const timers = useRef<number[]>([]);
  const n = cleanName(name);
  const typed = Number(val) > 0 ? Number(val) * F[unit] : null;
  const pick: Ram | null = mac ? "mac" : typed && typed <= 4096 ? typed : null;
  const t = g ? tierOf(g) : null;

  useEffect(() => { fetch("/api/audit").then((r) => r.json()).then(setStats).catch(() => {}); return () => timers.current.forEach(clearTimeout); }, []);
  useEffect(() => {
    if (phase !== "result" || !t?.eta) return;
    setSecs(t.eta);
    const i = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(i);
  }, [phase, t]);

  const qs = (x: Ram) => `gb=${gbParam(x)}${n ? `&n=${encodeURIComponent(n)}` : ""}`;
  const link = (x: Ram) => `${location.origin}/?${qs(x)}`;
  const text = (x: Ram) => `${tierOf(x).post} ${fmtRam(x)} = "${tierOf(x).status}". Check yours before he finds you:`;

  function run() {
    if (!pick) return;
    const x = pick;
    setG(x); setPhase("scan"); setLog([]);
    timers.current = LINES.map((l, i) => window.setTimeout(() => setLog((p) => [...p, l]), i * 520));
    timers.current.push(window.setTimeout(() => {
      setPhase("result");
      history.replaceState(null, "", link(x));
      fetch("/api/audit", { method: "POST", body: JSON.stringify({ gb: x }) }).then((r) => r.json()).then(setStats).catch(() => {});
    }, LINES.length * 520 + 300));
  }
  async function copy(x: Ram) {
    await navigator.clipboard?.writeText(`${text(x)} ${link(x)}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }
  async function share(x: Ram) {
    if (navigator.share) { try { await navigator.share({ text: text(x), url: link(x) }); return; } catch {} }
    copy(x);
  }

  if (phase === "result" && g && t) {
    return (
      <div className={t.siren ? "siren" : ""} style={{ ["--c" as string]: t.color }}>
        <article className="warrant" aria-live="polite">
          <span className="stamp">SATIRE</span>
          <h2>NOTICE OF HARDWARE UTILIZATION REVIEW &middot; {caseNo(g, n)}</h2>
          <p className="subj">Subject: {n || "Anonymous hoarder"}</p>
          <p className="subj">Configuration: {fmtRam(g)}</p>
          <div className="status">{t.status}</div>
          <p className="line">{t.line}</p>
          <dl className="stats">
            <div><dt>Measured utilization</dt><dd>{util(g, n)}% (terrible)</dd></div>
            <div><dt>Wasted capacity</dt><dd>{wasted(g)}</dd></div>
            <div><dt>Strike team ETA</dt><dd>{t.eta ? fmt(secs) : "NEVER. Relax."}</dd></div>
            {stats?.pct != null && t.id !== "mac" && <div><dt>Hoard ranking</dt><dd>More RAM than {stats.pct}% of audited machines</dd></div>}
          </dl>
        </article>
        <div className="share">
          <button className="big" onClick={() => share(g)}>WARN MY FRIENDS BEFORE SAM FINDS THEM</button>
          <a href={`/og?${qs(g)}&dl=1`} download="altman-warrant.png">Download warrant image</a>
          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text(g))}&url=${encodeURIComponent(link(g))}`} target="_blank" rel="noopener">Post on X</a>
          <a href={`https://www.reddit.com/submit?url=${encodeURIComponent(link(g))}&title=${encodeURIComponent(`${tierOf(g).post} (${fmtRam(g)}: "${t.status}")`)}`} target="_blank" rel="noopener">Post on Reddit</a>
          <button onClick={() => copy(g)}>{copied ? "Copied. Spread it." : "Copy link"}</button>
        </div>
        <button className="again" onClick={() => { setPhase("idle"); setG(null); history.replaceState(null, "", "/"); }}>Audit a different machine</button>
      </div>
    );
  }

  return (
    <div className="console" style={{ ["--c" as string]: "#39ff14" }}>
      {phase === "scan" ? (
        <div className="log" role="status">{log.map((l) => <div key={l}>{l}</div>)}</div>
      ) : (
        <>
          <label htmlFor="ram">How much RAM is in your PC? Type your exact number.</label>
          <div className="row">
            <input id="ram" type="number" inputMode="decimal" min="0" step="any" value={val} disabled={mac} onChange={(e) => setVal(e.target.value)} placeholder="e.g. 48" />
            <select aria-label="Unit" value={unit} disabled={mac} onChange={(e) => setUnit(e.target.value)}>{Object.keys(F).map((u) => <option key={u}>{u}</option>)}</select>
          </div>
          <div className="chips">{CHIPS.map((c) => <button key={c} type="button" className="chip" onClick={() => { setMac(false); setUnit("GB"); setVal(String(c)); }}>{c} GB</button>)}</div>
          <label className="chk"><input type="checkbox" checked={mac} onChange={(e) => setMac(e.target.checked)} /> I'm on an M-series Mac and have no idea what RAM is</label>
          <label htmlFor="nm">Name for the warrant (optional)</label>
          <input id="nm" value={name} maxLength={24} onChange={(e) => setName(e.target.value)} placeholder="Your name or Reddit handle" autoComplete="off" />
          <button className="go" disabled={!pick} onClick={run}>AUDIT MY RAM</button>
          {stats && stats.audits > 0 && <p className="counter">{stats.audits.toLocaleString()} machines audited &middot; {big(stats.gb)} of RAM confessed</p>}
        </>
      )}
    </div>
  );
}
