"use client";
import { useEffect, useState } from "react";
import BSOD from "../BSOD";

const START = 14 * 60 + 59;
const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export function Timer() {
  const [s, setS] = useState(START);
  const [resets, setResets] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setS((v) => { if (v <= 1) { setResets((r) => r + 1); return START; } return v - 1; }), 1000);
    return () => clearInterval(i);
  }, []);
  return (
    <div className="sticky" role="timer">
      OFFER EXPIRES IN {mmss(s)}{resets > 0 ? ` (it reset ${resets} time${resets > 1 ? "s" : ""}. we're not proud of that.)` : ""}
    </div>
  );
}

const BOXES = [
  "I agree to surrender my DIMMs, voluntarily and with enthusiasm.",
  "I understand my RAM was never really mine. It was on loan from the idea of memory.",
  "I will not use more than 5% of anything, ever again.",
  "I have read the 4 pages of terms. I have not. I am clicking this anyway.",
];

export function Order() {
  const [done, setDone] = useState(false);
  const [showBSOD, setShowBSOD] = useState(false);
  const post = encodeURIComponent("I made it to the end of the RAM sales letter. I did not surrender my DIMMs. Read it if you dare:");

  const handleDonateClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowBSOD(true);
  };

  const handleBSODComplete = () => {
    // Use setTimeout to ensure state update happens after the callback returns
    setTimeout(() => {
      setShowBSOD(false);
      alert("Reboot successful. Local memory fully cleared. Sam Altman thanks you for your 100% utilization sacrifice.");
    }, 0);
  };

  if (done)
    return (
      <div className="order">
        <h2>ORDER RECEIVED.</h2>
        <p>Just kidding. Nothing was collected, charged, or surrendered. This is a joke site and there is no checkout. Your RAM remains yours. For now.</p>
        <p>You made it to the end of a letter that nobody finishes. That's rarer than 128 GB.</p>
        <div className="share">
          <a href={`https://twitter.com/intent/tweet?text=${post}&url=${encodeURIComponent(location.origin + "/letter")}`} target="_blank" rel="noopener">Brag on X</a>
          <button onClick={() => navigator.clipboard?.writeText(`${location.origin}/letter`)}>Copy link to the letter</button>
          <a href={"/donate" + location.search} onClick={handleDonateClick} style={{ cursor: "pointer", color: "var(--c)" }}>Donate your RAM instead</a>
          <a href="/">Back to the audit</a>
        </div>
        <BSOD isVisible={showBSOD} onComplete={handleBSODComplete} />
      </div>
    );
  return (
    <form className="order" onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
      <h2>RENTRAM&trade; MEMORY RELIEF PROGRAM: ORDER FORM</h2>
      {BOXES.map((b) => <label key={b} className="chk"><input type="checkbox" required /> {b}</label>)}
      <button className="go" type="submit">SURRENDER MY RAM</button>
      <p className="fine">No payment is collected. There is no payment form. This is a joke.</p>
    </form>
  );
}
