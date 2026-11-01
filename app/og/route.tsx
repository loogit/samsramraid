import { ImageResponse } from "next/og";
import { TIERS, caseNo, cleanName } from "@/lib/tiers";

export function GET(req: Request) {
  const u = new URL(req.url);
  const t = TIERS.find((x) => x.id === u.searchParams.get("ram"));
  const n = cleanName(u.searchParams.get("n") ?? undefined);
  const c = t?.color ?? "#39ff14";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#050805", color: c, padding: 56, fontFamily: "monospace", border: `14px solid ${c}` }}>
        <div style={{ display: "flex", fontSize: 28, color: "#9aa59a" }}>
          {t ? `NOTICE OF HARDWARE UTILIZATION REVIEW  ${caseNo(t.id, n)}` : "THE ALTMAN UTILIZATION AUDIT"}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {t ? (
            <>
              <div style={{ display: "flex", fontSize: 34, color: "#e8efe8" }}>{`SUBJECT: ${n || "ANONYMOUS HOARDER"} / ${t.label}`}</div>
              <div style={{ display: "flex", fontSize: t.status.length > 22 ? 70 : 92, fontWeight: 800, lineHeight: 1.05, marginTop: 18 }}>{t.status}</div>
            </>
          ) : (
            <>
              <div style={{ display: "flex", fontSize: 96, fontWeight: 800, lineHeight: 1.02 }}>IS SAM COMING FOR YOUR RAM?</div>
              <div style={{ display: "flex", fontSize: 34, color: "#e8efe8", marginTop: 22 }}>Run the free hardware audit. Find out.</div>
            </>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#9aa59a" }}>
          <div style={{ display: "flex" }}>Satire. Not affiliated with OpenAI.</div>
          <div style={{ display: "flex" }}>Check your status</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
