"use client";
import { useEffect, useRef, useState } from "react";
import { TIERS, caseNo, util, cleanName } from "@/lib/tiers";

const LINES = [
  "SCANNING DRAM CONTRACT PRICES...",
  "DETECTING WASTED GIGABYTES...",
  "MEASURING IDLE UTILIZATION: 95%... TERRIBLE",
  "CONTACTING OPENAI DATA CENTER RECON...",
  "CROSS-REFERENCING YOUR GAMING HISTORY...",
  "DRAFTING NOTICE OF HARDWARE SEIZURE...",
];
const fmt = (s: number) => [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((v) => String(v).padStart(2, "0")).join(":");

export default function Audit({ initialId = "", initialName = "" }: { initialId?: string; initialName?: string }) {
  const valid = TIERS.some((t) => t.id === initialId);
  const [id, setId] = useState(valid ? initialId : "");
  const [name, setName] = useState(initialName);
  const [phase, setPhase] = useState<"idle" | "scan" | "result">(valid ? "result" : "idle");
  const [log, setLog] = useState<string[]>([]);
  const [secs, setSecs] = useState(0);
  const [copied, setCopied] = useState(false);
  const timers = useRef<number[]>([]);
  const t = TIERS.find((x) => x.id === id);
  const n = cleanName(name);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    if (phase !== "result" || !t || !t.eta) return;
    setSecs(t.eta);
    const i = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(i);
  }, [phase, t]);

  const link = () => `${location.origin}/?ram=${id}${n ? `&n=${encodeURIComponent(n)}` : ""}`;
  const text = () => (t ? `I ran the Altman Utilization Audit. ${t.label} of RAM = "${t.status}". Sam Altman knows where I live. Check your status before he finds you:` : "");

  function run() {
    if (!t) return;
    setPhase("scan");
    setLog([]);
    timers.current = LINES.map((l, i) => window.setTimeout(() => setLog((p) => [...p, l]), i * 520));
    timers.current.push(window.setTimeout(() => { setPhase("result"); history.replaceState(null, "", link()); }, LINES.length * 520 + 300));
  }
  async function copy() {
    await navigator.clipboard?.writeText(`${text()} ${link()}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  async function share() {
    if (navigator.share) { try { await navigator.share({ text: text(), url: link() }); return; } catch {} }
    copy();
  }

  if (phase === "result" && t) {
    return (
      <div className={t.siren ? "siren" : ""} style={{ ["--c" as string]: t.color }}>
        <article className="warrant" aria-live="polite">
          <span className="stamp">SATIRE</span>
          <h2>NOTICE OF HARDWARE UTILIZATION REVIEW &middot; {caseNo(t.id, n)}</h2>
          <p className="subj">Subject: {n || "Anonymous hoarder"}</p>
          <p className="subj">Configuration: {t.label}</p>
          <div className="status">{t.status}</div>
          <p className="line">{t.line}</p>
          <dl className="stats">
            <div><dt>Measured utilization</dt><dd>{util(t.id, n)}% (terrible)</dd></div>
            <div><dt>Wasted capacity</dt><dd>{t.wasted}</dd></div>
            <div><dt>Strike team ETA</dt><dd>{t.eta ? fmt(secs) : "NEVER. Relax."}</dd></div>
          </dl>
        </article>
        <div className="share">
          <button className="big" onClick={share}>WARN MY FRIENDS BEFORE SAM FINDS THEM</button>
          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text())}&url=${encodeURIComponent(link())}`} target="_blank" rel="noopener">Post on X</a>
          <a href={`https://www.reddit.com/submit?url=${encodeURIComponent(link())}&title=${encodeURIComponent(`I ran the Altman RAM audit with ${t.label}: "${t.status}"`)}`} target="_blank" rel="noopener">Post on Reddit</a>
          <button onClick={copy}>{copied ? "Copied. Spread it." : "Copy link"}</button>
        </div>
        <button className="again" onClick={() => { setPhase("idle"); setId(""); history.replaceState(null, "", "/"); }}>Audit a different machine</button>
      </div>
    );
  }

  return (
    <div className="console" style={{ ["--c" as string]: "#39ff14" }}>
      {phase === "scan" ? (
        <div className="log" role="status">{log.map((l) => <div key={l}>{l}</div>)}</div>
      ) : (
        <>
          <label htmlFor="ram">How much RAM is in your PC?</label>
          <select id="ram" value={id} onChange={(e) => setId(e.target.value)}>
            <option value="">Select your hoard...</option>
            {TIERS.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
          </select>
          <label htmlFor="nm">Name for the warrant (optional)</label>
          <input id="nm" value={name} maxLength={24} onChange={(e) => setName(e.target.value)} placeholder="Your name or Reddit handle" autoComplete="off" />
          <button className="go" disabled={!id} onClick={run}>AUDIT MY RAM</button>
        </>
      )}
    </div>
  );
}
