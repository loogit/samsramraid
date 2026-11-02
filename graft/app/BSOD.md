# app/BSOD.tsx

- Phase · type · L4-L4 — type Phase = "idle" | "bios" | "memory_map" | "ecc_check" | "thermal_scan" | "firmware_handshake" | "dma_transfer" | "cloud_negotiation" | "finalizing" | "critical_failure" | "bsod" | "complete";
- BSOD · function · L136-L638 — function BSOD({ isVisible, onComplete }: { isVisible: boolean; onComplete: () => void })
- clearAllIntervals · function · L200-L203 — clearAllIntervals = ()
- runPhase · function · L205-L256 — runPhase = ()
- typeLine · function · L224-L233 — typeLine = ()
- tick · function · L237-L254 — tick = ()
- handleMemoryMapStuck · function · L258-L312 — handleMemoryMapStuck = ()
- showThinking · function · L285-L310 — showThinking = ()
- intenseFlash · function · L296-L307 — intenseFlash = ()
- runBSOD · function · L314-L344 — runBSOD = ()
- tick · function · L320-L342 — tick = ()
