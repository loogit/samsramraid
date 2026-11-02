"use client";
import { useEffect, useState } from "react";
import { fakeDonations } from "@/lib/fake";
import { caseNo, cleanName, donorOf, fmtRam, gbParam, parseGb, tierOf } from "@/lib/tiers";
import BSOD from "../BSOD";

const GOAL = 1048576;
const big = (g: number) => (g >= 1048576 ? `${(g / 1048576).toFixed(2)} PB` : g >= 1024 ? `${(g / 1024).toFixed(1)} TB` : `${Math.round(g)} GB`);
type S = { donors: number; gb: number };

export default function Donate({ gb, name }: { gb: string; name: string }) {
  const g = parseGb(gb);
  const n = cleanName(name);
  const [s, setS] = useState<S | null>(null);
  const [done, setDone] = useState(false);
  const [showBSOD, setShowBSOD] = useState(false);
  const [copied, setCopied] = useState(false);
  const key = g ? `donated:${gbParam(g)}` : "";
  useEffect(() => {
    const tick = () => setS(fakeDonations(Date.now()));
    tick();
    const i = setInterval(tick, 2000);
    try { if (key && localStorage.getItem(key)) setDone(true); } catch {}
    return () => clearInterval(i);
  }, [key]);

  const qs = g ? `gb=${gbParam(g)}${n ? `&n=${encodeURIComponent(n)}` : ""}` : "";
  const text = g ? `I donated ${fmtRam(g)} of RAM to Sam's Cloud and received a Certificate of Donation: "${donorOf(tierOf(g))}". Donate yours:` : "";
  const link = () => `${location.origin}/donate?${qs}`;
  function confirm() {
    if (!g) return;
    setShowBSOD(true);
  }
  const handleBSODComplete = () => {
    // Use setTimeout to ensure state update happens after the callback returns
    setTimeout(() => {
      setShowBSOD(false);
      setDone(true);
      try { localStorage.setItem(key, "1"); } catch {}
      alert("Reboot successful. Local memory fully cleared. Sam Altman thanks you for your 100% utilization sacrifice.");
    }, 0);
  }
  async function copy() { await navigator.clipboard?.writeText(`${text} ${link()}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  async function share() { if (navigator.share) { try { await navigator.share({ text, url: link() }); return; } catch {} } copy(); }
  const t = g ? tierOf(g) : null;
  const pct = s ? ((s.gb % GOAL) / GOAL) * 100 : 0;

  return (
    <section>
      <h2 className="s">Step 16: Confirm your donation</h2>
      {s && s.donors > 0 && (
        <div className="counterbox">
          <p><strong>{big(s.gb)}</strong> donated by <strong>{s.donors.toLocaleString()}</strong> donors. Goal: 1 PB by Friday. (Friday keeps moving.)</p>
          <div className="bar" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${Math.max(pct, 0.6)}%` }} /></div>
          <p className="fine">Data center utilization improvement so far: +{(s.gb / 1e9).toFixed(8)}%. All figures courtesy of the Office of Memory Utilization (fictional).</p>
        </div>
      )}
      {!g ? (
        <p>To get a Certificate of Donation, <a href="/">run the audit first</a> so we know how much you are giving up.</p>
      ) : !done ? (
        <>
          <p>Have you completed Steps 1 through 15 with your {fmtRam(g)}? Confirm below. (Do not actually do them. Confirming in your imagination is fully accepted.)</p>
          <button className="go" style={{ ["--c" as string]: t!.color }} onClick={confirm}>I HAVE DONATED MY RAM</button>
        </>
      ) : (
        <div style={{ ["--c" as string]: t!.color }}>
          <article className="warrant" aria-live="polite">
            <span className="stamp">SATIRE</span>
            <h2>CERTIFICATE OF DONATION &middot; {caseNo(g, n)}</h2>
            <p className="subj">Donor: {n || "Anonymous"}</p>
            <p className="subj">Donated: {fmtRam(g)} to Sam&apos;s Cloud</p>
            <div className="status">{donorOf(t!)}</div>
            <p className="line">Thank you for your service. This donation is not tax-deductible, not real, and has been received by nobody. Your RAM is still in your computer, where it is doing 4.8% of something.</p>
          </article>
          <div className="share">
            <button className="big" onClick={share}>BRAG ABOUT MY DONATION</button>
            <a href={`/og?${qs}&cert=1&dl=1`} download="certificate-of-donation.png">Download certificate</a>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link())}`} target="_blank" rel="noopener">Post on X</a>
            <a href={`https://www.reddit.com/submit?url=${encodeURIComponent(link())}&title=${encodeURIComponent(`I donated ${fmtRam(g)} of RAM to Sam's Cloud: ${donorOf(t!)}`)}`} target="_blank" rel="noopener">Post on Reddit</a>
            <button onClick={copy}>{copied ? "Copied. Spread it." : "Copy link"}</button>
          </div>
        </div>
      )}
      <BSOD isVisible={showBSOD} onComplete={handleBSODComplete} />
    </section>
  );
}
