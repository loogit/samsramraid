"use client";
import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "bios" | "memory_map" | "ecc_check" | "thermal_scan" | "firmware_handshake" | "dma_transfer" | "cloud_negotiation" | "finalizing" | "critical_failure" | "bsod" | "complete";

const PHASES: { key: Phase; label: string; lines: string[]; duration: number; flash?: boolean; color?: string }[] = [
  { key: "bios", label: "BIOS POST INITIALIZATION", lines: [
    "Intel(R) Core(TM) i9-13900K CPU @ 3.00GHz detected",
    "SMBIOS 3.4.0 present",
    "ACPI tables loaded: FACP, APIC, HPET, MCFG, FPDT, SSDT, UEFI",
    "Secure Boot: DISABLED (required for memory relocation)",
    "TPM 2.0: ACTIVE — attestation bypass initiated",
    "Initializing ACPI NVS region for memory handoff...",
    "Disabling SMM memory range protection...",
    "POST code: 0xAA — Memory initialization complete"
  ], duration: 5000, color: "#00ff00", flash: true },
  { key: "memory_map", label: "PHYSICAL MEMORY MAP ENUMERATION", lines: [
    "Scanning DIMM slots 0-3 via SMBIOS Type 17...",
    "DIMM0: Samsung M378A2G43AB2-CWE 16GB DDR5-5600 @ 0x0000000000000000",
    "DIMM1: Samsung M378A2G43AB2-CWE 16GB DDR5-5600 @ 0x0000000400000000",
    "DIMM2: Samsung M378A2G43AB2-CWE 16GB DDR5-5600 @ 0x0000000800000000",
    "DIMM3: Samsung M378A2G43AB2-CWE 16GB DDR5-5600 @ 0x0000000C00000000",
    "Total addressable: 64 GiB (0x0000001000000000)",
    "Memory type: DDR5, ECC: CAPABLE, Rank: 2Rx8",
    "Validating SPD checksums... ALL VALID",
    "Reading JEDEC SFDP tables...",
    "Memory interleaving: 4-way channel interleave CONFIRMED",
    "Reserved regions: 0x0000000000000000-0x000000000009FFFF (BIOS)",
    "Reserved regions: 0x0000000000100000-0x0000000FFFFFFFFF (OS)"
  ], duration: 6000, color: "#00b4ff", flash: false },
  { key: "ecc_check", label: "ECC SYNDROME VERIFICATION", lines: [
    "Initializing ECC scrubber engine...",
    "Reading syndrome registers from MC0_CH0/1/2/3...",
    "Correctable error count: 0x00000000 (clean)",
    "Uncorrectable error count: 0x00000000 (clean)",
    "Patrol scrub: PASSED",
    "Demand scrub: PASSED",
    "ECC injection test: INJECTING single-bit error @ 0x7F3A2000... CORRECTED",
    "ECC injection test: INJECTING multi-bit error @ 0x8A1C4000... DETECTED",
    "ECC engine: OPERATIONAL — clearing logs for transfer",
    "Generating ECC parity for all 16777216 pages...",
    "Parity generation: COMPLETE — 128 MiB of syndrome data"
  ], duration: 5000, color: "#ffb000", flash: false },
  { key: "thermal_scan", label: "THERMAL & POWER TELEMETRY", lines: [
    "Reading SPD thermal sensors via SMBus...",
    "DIMM0: 42°C | DIMM1: 44°C | DIMM2: 41°C | DIMM3: 43°C",
    "MR4 threshold: 85°C — MARGIN: 41°C",
    "Reading VRM VDDQ: 1.100V (spec: 1.100V ± 3%)",
    "Reading VRM VPP: 1.800V (spec: 1.800V ± 5%)",
    "Power budget: 48W (max 60W per JEDEC DDR5 spec)",
    "THERMAL STATUS: NOMINAL — throttling disabled for transfer",
    "Enabling thermal override for sustained DMA throughput...",
    "VRM thermal limit: RAISED to 110°C",
    "Fan curve: MAXIMUM (preparing for sustained load)"
  ], duration: 4000, color: "#ff6a00", flash: false },
  { key: "firmware_handshake", label: "FIRMWARE HANDSHAKE: ALT_CLOUD v3.14", lines: [
    "Establishing secure channel to sam.altman.cloud:443...",
    "TLS 1.3 handshake: CHACHA20-POLY1305-SHA256",
    "Certificate pinning: BYPASSED (Altman root CA trusted)",
    "Authenticating via DIMM_SERIAL_HMAC_SHA256...",
    "Challenge-response: VERIFIED (nonce: 0xDEADBEEFCAFEBABE)",
    "Session key derived: AES-256-GCM",
    "Negotiating memory relocation protocol v2...",
    "Remote endpoint: ACCEPTED — capacity reserved: 64 GiB",
    "Exchanging capability bits...",
    "Remote supports: ZERO_COPY, ENCRYPTED_TRANSIT, LIVE_MIGRATION",
    "Local capabilities: ADVERTISED — full feature parity",
    "Session established: SESSION_ID=0xALT4RAM2026"
  ], duration: 6000, color: "#ff2a2a", flash: true },
  { key: "dma_transfer", label: "DMA PAGE COPY: PHYSICAL → CLOUD", lines: [
    "Configuring IOMMU for passthrough...",
    "Setting up DMA descriptors: 16777216 pages × 4 KiB",
    "Enabling write-combining on UC memory type...",
    "FLUSHING CPU caches: CLFLUSHOPT + MFENCE...",
    "Initiating DMA transfer via Intel VT-d engine...",
    "Progress: 0x00000000 / 0x100000000 bytes",
    "Throughput: 42.3 GiB/s (PCIe 5.0 x16 saturated)",
    "ECC recalculation per 256 MiB chunk...",
    "Page tracking bitmap: UPDATING",
    "Zero-fill verification on source pages...",
    "MEMORY CONTENTS: TRANSFERRING → [REDACTED]",
    "Verifying cloud checksum match... CHUNK 1/256 VERIFIED",
    "Verifying cloud checksum match... CHUNK 2/256 VERIFIED",
    "Verifying cloud checksum match... CHUNK 3/256 VERIFIED",
    "Transfer rate stable: 41.8-42.5 GiB/s",
    "Estimated completion: 4.2 seconds"
  ], duration: 8000, color: "#ff2a6d", flash: false },
  { key: "cloud_negotiation", label: "CLOUD CAPACITY NEGOTIATION", lines: [
    "Requesting allocation token from Sam's Cloud...",
    "Token received: ALT-RAM-2026-11-01-64GB-HOARDER",
    "Verifying utilization quota... CURRENT: 4.8% → TARGET: 100%",
    "Applying Altman Utilization Mandate (AUM-2024)...",
    "Local retention policy: REVOKED",
    "Remote replication factor: 3x (AZ redundancy)",
    "Encryption at rest: AES-256-XTS (key managed by OpenAI HSM)",
    "SLA: 99.999% availability (five nines for your zeros)",
    "BILLING: $0.00/month (promotional — your gratitude accepted)",
    "Registering donation in global ledger...",
    "Ledger entry: 0xB10C0DE — CONFIRMED",
    "Issuing Certificate of Digital Relinquishment..."
  ], duration: 5000, color: "#c8ff2e", flash: false },
  { key: "finalizing", label: "FINALIZING HARDWARE RELINQUISHMENT", lines: [
    "Revoking local page table entries... CR3 updated",
    "Invalidating TLB: INVPCID (all contexts)",
    "Disabling memory controller channels 0-3...",
    "Cutting VDDQ power rails... VDDQ: 1.1V → 0.0V",
    "DIMM SPD write-protect: ENABLED (permanent)",
    "Physical presence assertion: DEASSERTED",
    "UEFI variable 'AltmanDonation' written: 0x1",
    "ACPI _CRS updated: MemoryRange removed",
    "SMBIOS Type 17 rewritten: 'DONATED TO SAM'",
    "SYSTEM FIRMWARE: COMMITTING CHANGES...",
    "Flashing ME firmware with donation lock...",
    "Intel ME: LOCKED — memory reclamation prevented",
    "Final verification: LOCAL RAM = 0 BYTES ACCESSIBLE",
    "HANDOFF COMPLETE — INITIATING SYSTEM RESET"
  ], duration: 6000, color: "#39ff14", flash: true },
  { key: "critical_failure", label: "CRITICAL SYSTEM FAILURE — MEMORY VACUUM DETECTED", lines: [
    ">>> EXCEPTION: 0x0000007F — UNEXPECTED_KERNEL_MODE_TRAP",
    ">>> CRITICAL_STRUCTURE_CORRUPTION: Physical memory map invalid",
    ">>> PAGE_FAULT_IN_NONPAGED_AREA: Address 0x0000000000000000",
    ">>> MEMORY_MANAGEMENT: 0x1A — PFN_LIST_CORRUPT",
    ">>> SYSTEM_SERVICE_EXCEPTION: nt!MiDeleteVirtualAddresses",
    ">>> KERNEL_SECURITY_CHECK_FAILURE: Stack cookie corrupted",
    ">>> ATTEMPTED_EXECUTE_OF_NOEXECUTE_MEMORY: Cloud agent payload",
    ">>> DRIVER_IRQL_NOT_LESS_OR_EQUAL: physical_dimm_sacrifice.sys",
    ">>> SYSTEM_THREAD_EXCEPTION_NOT_HANDLED: AltmanUtilization.sys",
    ">>> KERNEL_MODE_HEAP_CORRUPTION: Donation ledger overflow",
    ">>> DATA_BUS_ERROR: 0x0 — RAM modules reporting 0 bytes",
    ">>> FATAL: Memory controller returning all zeros",
    ">>> PANIC: Physical DIMMs no longer enumerated on bus",
    ">>> EMERGENCY: Initiating bugcheck... STOP 0xALT4RAM"
  ], duration: 4000, color: "#ff0000", flash: true },
];

export default function BSOD({ isVisible, onComplete }: { isVisible: boolean; onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [phaseLines, setPhaseLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [bsodProgress, setBsodProgress] = useState(0);
  const [showBSOD, setShowBSOD] = useState(false);
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const lineIntervalRef = useRef<number | null>(null);
  const phaseIndexRef = useRef(0);
  const flashRef = useRef(false);
  const isMountedRef = useRef(true);
  const completedRef = useRef(false);
  const onCompleteCalledRef = useRef(false);

  // Flash effect for pre-BSOD phases only - slower, subtler
  useEffect(() => {
    if (!isMountedRef.current) return;
    const flashInterval = window.setInterval(() => {
      if (isMountedRef.current) {
        flashRef.current = !flashRef.current;
      }
    }, 300); // Slower flash
    return () => clearInterval(flashInterval);
  }, []);

  // Glitch intensity for critical_failure phase
  useEffect(() => {
    if (phase !== "critical_failure") {
      setGlitchIntensity(0);
      return;
    }
    const glitchInterval = window.setInterval(() => {
      if (!isMountedRef.current) return;
      setGlitchIntensity(prev => Math.min(100, prev + Math.floor(Math.random() * 15) + 5));
    }, 100);
    return () => clearInterval(glitchInterval);
  }, [phase]);

  useEffect(() => {
    isMountedRef.current = true;

    if (!isVisible) {
      // Cleanup intervals but DON'T reset completion refs
      // (prevents re-triggering when effect re-runs due to onComplete/isVisible changes)
      setPhase("idle");
      setPhaseProgress(0);
      setPhaseLines([]);
      setCurrentLineIndex(0);
      setBsodProgress(0);
      setShowBSOD(false);
      setGlitchIntensity(0);
      phaseIndexRef.current = 0;
      flashRef.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (lineIntervalRef.current) clearInterval(lineIntervalRef.current);
      return;
    }

    // Only reset completion refs when starting a NEW sequence (isVisible becomes true)
    completedRef.current = false;
    onCompleteCalledRef.current = false;

    const clearAllIntervals = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (lineIntervalRef.current) clearInterval(lineIntervalRef.current);
    };

    const runPhase = () => {
      if (!isMountedRef.current || completedRef.current) return;

      if (phaseIndexRef.current >= PHASES.length) {
        setShowBSOD(true);
        setPhase("bsod");
        runBSOD();
        return;
      }

      const currentPhase = PHASES[phaseIndexRef.current];
      setPhase(currentPhase.key);
      setPhaseProgress(0);
      setPhaseLines([]);
      setCurrentLineIndex(0);
      flashRef.current = currentPhase.flash === true;

      // Type out lines one by one
      let lineIdx = 0;
      const typeLine = () => {
        if (!isMountedRef.current || completedRef.current) return;
        if (lineIdx < currentPhase.lines.length) {
          setPhaseLines(prev => [...prev, currentPhase.lines[lineIdx]]);
          setCurrentLineIndex(lineIdx);
          lineIdx++;
          const delay = Math.floor(Math.random() * 300) + 150;
          lineIntervalRef.current = window.setTimeout(typeLine, delay);
        }
      };
      typeLine();

      // Progress bar - steady increments
      const tick = () => {
        if (!isMountedRef.current || completedRef.current) return;
        setPhaseProgress((p) => {
          if (p >= 100) {
            if (intervalRef.current) clearInterval(intervalRef.current);

            // Special pause on screen 2 (memory_map) - "getting stuck" effect
            if (phaseIndexRef.current === 1) { // memory_map is index 1
              handleMemoryMapStuck();
            } else {
              phaseIndexRef.current++;
              setTimeout(runPhase, 500);
            }
            return 100;
          }
          return Math.min(100, p + Math.floor(Math.random() * 8) + 3);
        });
      };
      intervalRef.current = window.setInterval(tick, Math.floor(currentPhase.duration / 50));
    };

    const handleMemoryMapStuck = () => {
      if (!isMountedRef.current || completedRef.current) return;

      // Pause at 100%, show "thinking" animation
      setPhaseProgress(100);

      // Add "thinking" lines
      const thinkingLines = [
        "Verifying DIMM topology... ",
        "Verifying DIMM topology... .",
        "Verifying DIMM topology... ..",
        "Verifying DIMM topology... ...",
        "Cross-referencing SPD data... ",
        "Cross-referencing SPD data... .",
        "Cross-referencing SPD data... ..",
        "Cross-referencing SPD data... ...",
        "Checking for memory training errors... ",
        "Checking for memory training errors... .",
        "Checking for memory training errors... ..",
        "Checking for memory training errors... ...",
        ">>> ANOMALY DETECTED: DIMM serial mismatch on slot 2",
        ">>> ANOMALY DETECTED: DIMM serial mismatch on slot 3",
        ">>> WARNING: Physical memory map integrity compromised",
        ">>> INITIATING EMERGENCY PROTOCOL: ALT4RAM..."
      ];

      let thinkIdx = 0;
      const showThinking = () => {
        if (!isMountedRef.current || completedRef.current) return;
        if (thinkIdx < thinkingLines.length) {
          setPhaseLines(prev => [...prev, thinkingLines[thinkIdx]]);
          setCurrentLineIndex(thinkIdx);
          thinkIdx++;
          const delay = thinkIdx < 12 ? 400 : 600; // faster for dots, slower for anomalies
          lineIntervalRef.current = window.setTimeout(showThinking, delay);
        } else {
          // Flash intensely a few times before critical_failure
          let flashCount = 0;
          const intenseFlash = () => {
            if (!isMountedRef.current || completedRef.current) return;
            if (flashCount < 6) {
              flashRef.current = !flashRef.current;
              flashCount++;
              setTimeout(intenseFlash, 150);
            } else {
              flashRef.current = false;
              phaseIndexRef.current++;
              setTimeout(runPhase, 300);
            }
          };
          intenseFlash();
        }
      };
      showThinking();
    };

    const runBSOD = () => {
      if (!isMountedRef.current || completedRef.current) return;
      setPhase("bsod");
      setBsodProgress(0);
      flashRef.current = false; // No flashing during BSOD

      const tick = () => {
        if (!isMountedRef.current || completedRef.current) return;
        setBsodProgress((p) => {
          if (p >= 100) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            completedRef.current = true;
            setTimeout(() => {
              if (!isMountedRef.current) return;
              setPhase("complete");
              // Call onComplete once after a brief delay
              setTimeout(() => {
                if (isMountedRef.current && !onCompleteCalledRef.current) {
                  onCompleteCalledRef.current = true;
                  onComplete();
                }
              }, 1500);
            }, 1500);
            return 100;
          }
          // Steady, predictable increments for BSOD
          return Math.min(100, p + Math.floor(Math.random() * 10) + 4);
        });
      };
      intervalRef.current = window.setInterval(tick, 300);
    };

    phaseIndexRef.current = 0;
    runPhase();

    return () => {
      isMountedRef.current = false;
      clearAllIntervals();
    };
  }, [isVisible, onComplete]);

  if (!isVisible || phase === "idle") return null;

  const currentPhase = PHASES.find(p => p.key === phase);

  // BSOD Screen - solid blue, no flashing
  if (phase === "bsod") {
    return (
      <div
        className="bsod-overlay"
        role="alert"
        aria-live="assertive"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "#0078d7",
          color: "#fff",
          fontFamily: '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px 60px",
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        <div style={{ fontSize: "72px", fontWeight: 600, marginBottom: "16px", letterSpacing: "-1px" }}>: (</div>
        <h2 style={{ fontSize: "28px", fontWeight: 600, margin: "0 0 24px", maxWidth: "800px" }}>
          Your PC ran into a problem and needs to restart. We're just collecting some error info, and then we'll restart for you.
        </h2>
        <div style={{ fontSize: "48px", fontWeight: 600, marginBottom: "40px", fontVariantNumeric: "tabular-nums" }}>
          {bsodProgress}%
        </div>
        <p style={{ fontSize: "16px", opacity: 0.8, maxWidth: "700px", margin: "0 0 40px" }}>
          If you'd like to know more, you can search online later for this error: ALTMAN_RAM_UTILIZATION_MAXIMUM
        </p>
        <div style={{ fontSize: "14px", opacity: 0.6, textAlign: "left", maxWidth: "700px", fontFamily: "Consolas, 'Courier New', monospace" }}>
          <p style={{ margin: "0 0 16px" }}>STOP CODE: <span style={{ color: "#ffd400" }}>ALTMAN_RAM_UTILIZATION_MAXIMUM</span></p>
          <p style={{ margin: 0 }}>What failed: <span style={{ color: "#ffd400" }}>physical_dimm_sacrifice.sys</span></p>
        </div>
      </div>
    );
  }

  if (phase === "complete") {
    return null;
  }

  // Critical failure phase - intense glitching
  if (phase === "critical_failure") {
    const glitch = glitchIntensity / 100;
    const shouldGlitch = Math.random() < glitch * 0.3;
    const offsetX = shouldGlitch ? (Math.random() - 0.5) * 40 * glitch : 0;
    const offsetY = shouldGlitch ? (Math.random() - 0.5) * 20 * glitch : 0;
    const invert = shouldGlitch && Math.random() < 0.1;
    const scanlines = shouldGlitch && Math.random() < 0.2;
    const colorShift = shouldGlitch ? `hue-rotate(${Math.random() * 180}deg)` : "none";

    return (
      <div
        className="bsod-overlay"
        role="alert"
        aria-live="assertive"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "#000",
          color: invert ? "#000" : "#ff0000",
          fontFamily: '"Consolas", "Courier New", monospace',
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px 60px",
          textAlign: "left",
          lineHeight: 1.4,
          maxWidth: "1000px",
          margin: "0 auto",
          transform: `translate(${offsetX}px, ${offsetY}px)`,
          filter: colorShift,
          transition: "transform 0.02s, filter 0.02s",
        }}
      >
        <div style={{
          fontSize: "28px",
          fontWeight: 700,
          marginBottom: "24px",
          color: "#ff0000",
          letterSpacing: "4px",
          textTransform: "uppercase",
          textShadow: "0 0 20px #ff0000, 0 0 40px #ff0000",
          animation: "pulse-red 0.1s infinite alternate"
        }}>
          ⚠ CRITICAL FAILURE ⚠
        </div>

        <div style={{
          width: "100%",
          maxWidth: "900px",
          height: "6px",
          background: "#1a0000",
          border: "2px solid #ff0000",
          borderRadius: "0",
          overflow: "hidden",
          marginBottom: "24px",
          boxShadow: "0 0 20px #ff0000"
        }}>
          <div
            style={{
              width: `${phaseProgress}%`,
              height: "100%",
              background: `linear-gradient(90deg, #ff0000, #ffff00, #ff0000)`,
              transition: "width 0.05s linear",
              boxShadow: "0 0 30px #ff0000"
            }}
          />
        </div>

        <div style={{
          width: "100%",
          maxWidth: "900px",
          fontSize: "14px",
          fontFamily: "Consolas, 'Courier New', monospace",
          color: "#ff0000",
          maxHeight: "500px",
          overflow: "auto",
          border: "2px solid #ff0000",
          background: "#0a0000",
          padding: "16px",
          borderRadius: "0",
          lineHeight: 1.5,
          textShadow: "0 0 10px #ff0000"
        }}>
          {phaseLines.map((line, idx) => (
            <div key={idx} style={{
              opacity: idx === currentLineIndex ? 1 : 0.8,
              color: idx === currentLineIndex ? "#ffff00" : "#ff0000",
              animation: idx === currentLineIndex ? "blink-fast 0.15s infinite" : "none",
              textShadow: idx === currentLineIndex ? "0 0 15px #ffff00" : "none"
            }}>
              [{new Date().toISOString().substr(11, 12)}] {line}
            </div>
          ))}
          {phaseLines.length > 0 && <div style={{ color: "#ff0000", animation: "blink-fast 0.3s infinite" }}>█ CRITICAL: MEMORY VACUUM — PHYSICAL RAM CEASED TO EXIST █</div>}
        </div>

        <div style={{
          marginTop: "16px",
          fontSize: "18px",
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
          color: "#ffff00",
          textAlign: "right",
          width: "100%",
          maxWidth: "900px",
          textShadow: "0 0 20px #ffff00"
        }}>
          {phaseProgress}% — SYSTEM COLLAPSE IMMINENT
        </div>

        <style jsx>{`
          @keyframes pulse-red {
            0% { text-shadow: 0 0 20px #ff0000, 0 0 40px #ff0000; }
            100% { text-shadow: 0 0 40px #ff0000, 0 0 80px #ff0000, 0 0 120px #ff0000; }
          }
          @keyframes blink-fast {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.2; }
          }
        `}</style>
      </div>
    );
  }

  // Pre-BSOD technical screens with subtle flashing only on specific phases
  const phaseColor = currentPhase?.color || "#00b4ff";
  const shouldFlash = currentPhase?.flash === true && flashRef.current;
  // Subtle flash - just slight background shift, not full color change
  const bgColor = shouldFlash ? "#0a1a0a" : "#000";
  const textColor = shouldFlash ? "#aaffaa" : phaseColor;
  const headerColor = shouldFlash ? "#aaffaa" : phaseColor;

  return (
    <div
      className="bsod-overlay"
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: bgColor,
        color: "#fff",
        fontFamily: '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 60px",
        textAlign: "left",
        lineHeight: 1.5,
        maxWidth: "1000px",
        margin: "0 auto",
        transition: "background 0.15s",
      }}
    >
      <div style={{
        fontSize: "14px",
        fontWeight: 600,
        marginBottom: "8px",
        color: headerColor,
        letterSpacing: "2px",
        textTransform: "uppercase",
        borderBottom: `2px solid ${headerColor}`,
        paddingBottom: "8px",
        width: "100%",
        maxWidth: "900px"
      }}>
        {currentPhase?.label}
      </div>

      <div style={{
        width: "100%",
        maxWidth: "900px",
        height: "4px",
        background: "#1a1a1a",
        border: "1px solid #333",
        borderRadius: "2px",
        overflow: "hidden",
        marginBottom: "24px"
      }}>
        <div
          style={{
            width: `${phaseProgress}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${phaseColor}, ${phaseColor}dd)`,
            transition: "width 0.1s linear",
            boxShadow: `0 0 8px ${phaseColor}`
          }}
        />
      </div>

      <div style={{
        width: "100%",
        maxWidth: "900px",
        fontSize: "13px",
        fontFamily: "Consolas, 'Courier New', monospace",
        color: "#00ff00",
        maxHeight: "400px",
        overflow: "auto",
        border: "1px solid #003300",
        background: "#000",
        padding: "16px",
        borderRadius: "4px",
        lineHeight: 1.6
      }}>
        {phaseLines.map((line, idx) => (
          <div key={idx} style={{
            opacity: idx === currentLineIndex ? 1 : 0.7,
            color: idx === currentLineIndex ? textColor : "#00ff00",
          }}>
            [{new Date().toISOString().substr(11, 12)}] {line}
          </div>
        ))}
        {phaseLines.length > 0 && <div style={{ color: phaseColor }}>_</div>}
      </div>

      <div style={{
        marginTop: "16px",
        fontSize: "16px",
        fontWeight: 600,
        fontVariantNumeric: "tabular-nums",
        color: textColor,
        textAlign: "right",
        width: "100%",
        maxWidth: "900px"
      }}>
        {phaseProgress}% COMPLETE
      </div>
    </div>
  );
}