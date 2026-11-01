import { ImageResponse } from "next/og";
import { caseNo, cleanName, donorOf, fmtRam, parseGb, tierOf } from "@/lib/tiers";

export async function GET(req: Request) {
  const u = new URL(req.url);
  const g = parseGb(u.searchParams.get("gb") ?? undefined);
  const t = g ? tierOf(g) : null;
  const n = cleanName(u.searchParams.get("n") ?? undefined);
  const cert = u.searchParams.get("cert");
  const c = t?.color ?? "#39ff14";
  const img = new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#050805", color: c, padding: 56, fontFamily: "monospace", border: `14px solid ${c}` }}>
        <div style={{ display: "flex", fontSize: 28, color: "#9aa59a" }}>{t && g ? `${cert ? "CERTIFICATE OF DONATION" : "NOTICE OF HARDWARE UTILIZATION REVIEW"}  ${caseNo(g, n)}` : "THE ALTMAN UTILIZATION AUDIT"}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {t && g ? (
            <>
              <div style={{ display: "flex", fontSize: 34, color: "#e8efe8" }}>{cert ? `DONOR: ${n || "ANONYMOUS"} / DONATED ${fmtRam(g)} TO SAM'S CLOUD` : `SUBJECT: ${n || "ANONYMOUS HOARDER"} / ${fmtRam(g)}`}</div>
              <div style={{ display: "flex", fontSize: (cert ? donorOf(t) : t.status).length > 22 ? 70 : 92, fontWeight: 800, lineHeight: 1.05, marginTop: 18 }}>{cert ? donorOf(t) : t.status}</div>
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
          <div style={{ display: "flex" }}>samsramraid.com</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
  if (!u.searchParams.get("dl")) return img;
  return new Response(img.body, { headers: { "content-type": "image/png", "content-disposition": 'attachment; filename="altman-warrant.png"' } });
}
