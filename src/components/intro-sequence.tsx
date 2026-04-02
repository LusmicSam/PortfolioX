"use client";

import { useEffect, useRef, useState } from "react";

// ────────────────────────────────────────────────
// INTRO SEQUENCE
// Phase 1: Big Bang video (0 – 9 s) with HUD overlay
// Phase 2: White flash (≈0.4 s)
// Phase 3: White loading screen with bio + progress bar
// Phase 4: Fade out → main portfolio revealed
// ────────────────────────────────────────────────

interface IntroSequenceProps {
  onComplete: () => void;
  onSimple: () => void;
}

// Typing animation hook
function useTypedText(text: string, startDelay = 0, speed = 45) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    const delay = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(delay);
  }, [text, startDelay, speed]);

  return { displayed, done };
}

// Individual progress messages shown during loading
const LOAD_STEPS = [
  { label: "Compiling stellar cartography…",    pct: 12 },
  { label: "Calibrating warp drive…",           pct: 28 },
  { label: "Loading planetary textures…",       pct: 44 },
  { label: "Initialising gravity wells…",       pct: 61 },
  { label: "Mapping asteroid trajectories…",    pct: 75 },
  { label: "Deploying deep-space AI…",          pct: 88 },
  { label: "Universe ready. Entering orbit…",   pct: 100 },
];

export function IntroSequence({ onComplete, onSimple }: IntroSequenceProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Phase states
  const [phase, setPhase] = useState<"video" | "flash" | "loading" | "choice" | "done">("video");

  // Video-phase UI
  const [showHud, setShowHud] = useState(false);
  const [showInitLine, setShowInitLine] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);

  // Loading-phase UI
  const [loadPct, setLoadPct] = useState(0);
  const [loadStep, setLoadStep] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  // Typing texts
  const line1 = useTypedText("SYS > CREATING UNIVERSE v2.0", 800, 40);
  const line2 = useTypedText("SYS > INITIATING BIG BANG SEQUENCE…", 2400, 35);
  const line3 = useTypedText("SYS > PROCESSING QUANTUM FOAM…", 4200, 32);

  // ── Video Phase ──────────────────────────────
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = true;

    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    let t3: ReturnType<typeof setTimeout>;
    let stallTimer: ReturnType<typeof setTimeout>;
    let skipped = false;

    // If video fails to load (e.g. big-bang.webm is missing), skip immediately
    const skipToFlash = () => {
      if (skipped) return;
      skipped = true;
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(stallTimer);
      setPhase("flash");
    };
    vid.addEventListener("error", skipToFlash);

    // Also skip if video stalls for >2s with no playback data
    stallTimer = setTimeout(() => {
      if (vid.readyState < 2) skipToFlash();
    }, 2000);

    vid.play().catch(() => skipToFlash());

    // Show HUD lines after 0.5 s
    t1 = setTimeout(() => setShowHud(true), 500);

    // At 8 s → show final init line + glitch
    t2 = setTimeout(() => {
      setShowInitLine(true);
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 600);
    }, 8000);

    // At 9 s → stop video, trigger white flash
    t3 = setTimeout(() => {
      vid.pause();
      setPhase("flash");
    }, 9000);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(stallTimer);
      vid.removeEventListener("error", skipToFlash);
    };
  }, []);

  // ── Flash → Loading Phase ────────────────────
  useEffect(() => {
    if (phase !== "flash") return;
    const t = setTimeout(() => setPhase("loading"), 420);
    return () => clearTimeout(t);
  }, [phase]);

  // ── Loading Phase: animate bar ────────────────
  useEffect(() => {
    if (phase !== "loading") return;
    let step = 0;

    const advance = () => {
      if (step >= LOAD_STEPS.length) return;
      const { pct } = LOAD_STEPS[step];
      setLoadStep(step);
      // Animate percentage
      let current = step === 0 ? 0 : LOAD_STEPS[step - 1].pct;
      const target = pct;
      const tick = setInterval(() => {
        current += 1;
        setLoadPct(current);
        if (current >= target) {
          clearInterval(tick);
          step++;
          if (step < LOAD_STEPS.length) {
            setTimeout(advance, 220 + Math.random() * 180);
          } else {
            // All done → show choice screen
            setTimeout(() => setPhase("choice"), 400);
          }
        }
      }, 14);
    };

    advance();
  }, [phase, onComplete]);

  const handleChoose3D = () => {
    setFadeOut(true);
    setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 600);
  };

  const handleChooseSimple = () => {
    setFadeOut(true);
    setTimeout(() => {
      setPhase("done");
      onSimple();
    }, 600);
  };

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden"
      style={{
        transition: fadeOut ? "opacity 0.7s ease" : undefined,
        opacity: fadeOut ? 0 : 1,
      }}
    >
      {/* ═══ WHITE FLASH ═══ */}
      {phase === "flash" && (
        <div className="absolute inset-0 bg-white" style={{ animation: "flashIn 0.4s ease forwards" }} />
      )}

      {/* ═══ VIDEO PHASE ═══ */}
      {(phase === "video" || phase === "flash") && (
        <div
          className="absolute inset-0"
          style={{
            background: "#000",
            animation: phase === "flash" ? "flashOut 0.4s ease forwards" : undefined,
          }}
        >
          {/* Big Bang Video */}
          <video
            ref={videoRef}
            src="/big-bang.webm"
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.85) saturate(1.2)" }}
          />

          {/* Scanline overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "repeating-linear-gradient(0deg,rgba(0,0,0,0.08) 0px,rgba(0,0,0,0.08) 1px,transparent 1px,transparent 3px)",
              mixBlendMode: "multiply",
            }}
          />

          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)" }}
          />

          {/* Glitch overlay */}
          {glitchActive && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "rgba(160,102,255,0.12)",
                animation: "glitch 0.12s steps(4) infinite",
                mixBlendMode: "screen",
              }}
            />
          )}

          {/* ── HUD Corner brackets ── */}
          {showHud && (
            <>
              {/* top-left */}
              <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-[#a066ff]/70" />
              {/* top-right */}
              <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-[#a066ff]/70" />
              {/* bottom-left */}
              <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-[#a066ff]/70" />
              {/* bottom-right */}
              <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-[#a066ff]/70" />

              {/* Typing lines — top-left */}
              <div className="absolute top-10 left-20 font-mono space-y-2" style={{ fontSize: "0.65rem", letterSpacing: "0.12em" }}>
                <p className="text-[#a066ff]">
                  {line1.displayed}
                  {!line1.done && <span className="animate-pulse">▌</span>}
                </p>
                {line1.done && (
                  <p className="text-[#58d8ff]">
                    {line2.displayed}
                    {!line2.done && <span className="animate-pulse">▌</span>}
                  </p>
                )}
                {line2.done && (
                  <p className="text-[#ff8c6b]">
                    {line3.displayed}
                    {!line3.done && <span className="animate-pulse">▌</span>}
                  </p>
                )}
              </div>

              {/* Top-right: clock + coords */}
              <LiveHudStats />

              {/* Bottom progress label */}
              <VideoProgressBar />

              {/* Final init line */}
              {showInitLine && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                  style={{ animation: "fadeInUp 0.5s ease forwards" }}
                >
                  <p
                    className="font-mono text-center text-white"
                    style={{
                      fontSize: "clamp(1rem,3vw,2.2rem)",
                      fontWeight: 900,
                      letterSpacing: "0.3em",
                      textShadow: "0 0 40px #a066ff, 0 0 80px rgba(160,102,255,0.5)",
                    }}
                  >
                    INITIALISING SHIVAM&apos;S PORTFOLIO
                  </p>
                  <p
                    className="font-mono text-[#58d8ff] mt-3"
                    style={{ fontSize: "clamp(0.6rem,1.2vw,0.85rem)", letterSpacing: "0.5em" }}
                  >
                    UNIVERSE v2.0 &nbsp;·&nbsp; QUANTUM CORE ONLINE &nbsp;·&nbsp; ALL SYSTEMS GO
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ═══ CHOICE PHASE ═══ */}
      {phase === "choice" && (
        <div
          className="absolute inset-0 bg-white flex flex-col"
          style={{ animation: "fadeInWhite 0.3s ease forwards" }}
        >
          {/* Top bar */}
          <div className="w-full h-1" style={{ background: `linear-gradient(90deg,#a066ff,#58d8ff)` }} />

          <div className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto flex-1 px-8 py-12 gap-12">
            {/* ── LEFT: bio ── */}
            <div className="flex flex-col justify-center flex-1 gap-6">
              <div>
                <p className="font-mono text-[10px] tracking-[0.5em] uppercase mb-2" style={{ color: "#a066ff" }}>
                  Orbital ID — COMMANDER
                </p>
                <h1 className="font-black leading-none" style={{ fontSize: "clamp(2.5rem,6vw,5rem)", color: "#0a0715", letterSpacing: "-0.02em" }}>
                  Shivam
                  <br />
                  <span style={{ color: "#a066ff" }}>Panjolia</span>
                </h1>
                <p className="font-mono mt-4" style={{ color: "#555", fontSize: "clamp(0.75rem,1.5vw,1rem)", letterSpacing: "0.12em" }}>
                  Backend &nbsp;·&nbsp; AI &nbsp;·&nbsp; Systems Engineer
                </p>
              </div>
              <p style={{ color: "#333", fontSize: "clamp(0.85rem,1.5vw,1.1rem)", lineHeight: 1.7, maxWidth: 480 }}>
                I build reliable systems where{" "}
                <span className="font-bold" style={{ color: "#a066ff" }}>intelligence meets scale</span>
                &nbsp;— from secure verification pipelines and edge AI runtimes to distributed storage
                engines and immersive 3D portfolios.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "LeetCode", value: "250+", color: "#a066ff" },
                  { label: "Projects", value: "6+", color: "#58d8ff" },
                  { label: "Paper", value: "ICISESSC 2026", color: "#ff8c6b" },
                  { label: "Certs", value: "OCI × 2", color: "#3dff99" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded-full px-4 py-1.5 border" style={{ borderColor: color + "40", background: color + "0f" }}>
                    <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#888" }}>{label}&nbsp;</span>
                    <span className="font-black text-sm" style={{ color }}>{value}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {["Python", "C++", "PyTorch", "FastAPI", "Docker", "Three.js", "LangChain", "gRPC"].map((t) => (
                  <span key={t} className="rounded px-2.5 py-1 font-mono text-[10px] tracking-widest" style={{ background: "#f0eeff", color: "#6b2fff" }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* ── RIGHT: choice ── */}
            <div className="flex flex-col justify-center gap-5 lg:w-80" style={{ borderLeft: "1px solid #e5e5e5", paddingLeft: "3rem" }}>
              <div>
                <p className="font-mono text-[10px] tracking-[0.4em] uppercase mb-2" style={{ color: "#a066ff" }}>
                  Universe Ready
                </p>
                <p className="text-2xl font-black" style={{ color: "#0a0715" }}>How would you like to explore?</p>
                <p className="text-sm mt-2" style={{ color: "#888" }}>Choose your experience mode.</p>
              </div>

              {/* Option A — Simple */}
              <button
                onClick={handleChooseSimple}
                className="group relative overflow-hidden flex flex-col items-start gap-1.5 w-full text-left px-5 py-5 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg"
                style={{ borderColor: "#a066ff40", background: "#f8f5ff" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#a066ff"; e.currentTarget.style.background = "#ede8ff"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#a066ff40"; e.currentTarget.style.background = "#f8f5ff"; }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">📄</span>
                  <span className="font-black text-base" style={{ color: "#0a0715" }}>Simple Portfolio</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#666" }}>
                  Fast, clean, no 3D. Browse projects, skills and contact — instantly.
                </p>
                <span className="text-[10px] font-mono uppercase tracking-widest mt-1" style={{ color: "#a066ff" }}>Recommended for slow devices →</span>
              </button>

              {/* Option B — 3D */}
              <button
                onClick={handleChoose3D}
                className="group relative overflow-hidden flex flex-col items-start gap-1.5 w-full text-left px-5 py-5 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl"
                style={{ borderColor: "transparent", background: "linear-gradient(135deg, #a066ff, #58d8ff)" }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚀</span>
                  <span className="font-black text-base text-white">Explore the Universe</span>
                </div>
                <p className="text-xs text-white/80 leading-relaxed">
                  The full immersive 3D cosmic journey — planets, wormholes, black holes and more.
                </p>
                <span className="text-[10px] font-mono uppercase tracking-widest mt-1 text-white/60">Requires GPU · WebGL →</span>
              </button>

              <p className="font-mono italic text-center" style={{ fontSize: "0.62rem", color: "#bbb", letterSpacing: "0.05em" }}>
                &ldquo;The universe is under no obligation to make sense to you.&rdquo;
                <br /><span style={{ color: "#a066ff" }}>— Neil deGrasse Tyson</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ═══ LOADING PHASE ═══ */}
      {phase === "loading" && (
        <div
          className="absolute inset-0 bg-white flex flex-col"
          style={{ animation: "fadeInWhite 0.3s ease forwards" }}
        >
          {/* Top bar */}
          <div className="w-full h-1" style={{ background: `linear-gradient(90deg,#a066ff,#58d8ff)` }} />

          <div className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto flex-1 px-8 py-12 gap-12">
            {/* ── LEFT: bio ── */}
            <div className="flex flex-col justify-center flex-1 gap-6">
              {/* Name + role */}
              <div>
                <p
                  className="font-mono text-[10px] tracking-[0.5em] uppercase mb-2"
                  style={{ color: "#a066ff" }}
                >
                  Orbital ID &mdash; COMMANDER
                </p>
                <h1
                  className="font-black leading-none"
                  style={{
                    fontSize: "clamp(2.5rem,6vw,5rem)",
                    color: "#0a0715",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Shivam
                  <br />
                  <span style={{ color: "#a066ff" }}>Panjolia</span>
                </h1>
                <p
                  className="font-mono mt-4"
                  style={{ color: "#555", fontSize: "clamp(0.75rem,1.5vw,1rem)", letterSpacing: "0.12em" }}
                >
                  Backend &nbsp;·&nbsp; AI &nbsp;·&nbsp; Systems Engineer
                </p>
              </div>

              {/* One-liner */}
              <p style={{ color: "#333", fontSize: "clamp(0.85rem,1.5vw,1.1rem)", lineHeight: 1.7, maxWidth: 480 }}>
                I build reliable systems where{" "}
                <span className="font-bold" style={{ color: "#a066ff" }}>intelligence meets scale</span>
                &nbsp;— from secure verification pipelines and edge AI runtimes to distributed storage
                engines and immersive 3D portfolios.
              </p>

              {/* Stat pills */}
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "LeetCode", value: "250+", color: "#a066ff" },
                  { label: "Projects", value: "6+", color: "#58d8ff" },
                  { label: "Paper", value: "ICISESSC 2026", color: "#ff8c6b" },
                  { label: "Certs", value: "OCI × 2", color: "#3dff99" },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    className="rounded-full px-4 py-1.5 border"
                    style={{ borderColor: color + "40", background: color + "0f" }}
                  >
                    <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#888" }}>
                      {label}&nbsp;
                    </span>
                    <span className="font-black text-sm" style={{ color }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tech tags */}
              <div className="flex flex-wrap gap-2">
                {["Python", "C++", "PyTorch", "FastAPI", "Docker", "Three.js", "LangChain", "gRPC"].map((t) => (
                  <span
                    key={t}
                    className="rounded px-2.5 py-1 font-mono text-[10px] tracking-widest"
                    style={{ background: "#f0eeff", color: "#6b2fff" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* ── RIGHT: loading progress ── */}
            <div
              className="flex flex-col justify-center gap-6 lg:w-80"
              style={{ borderLeft: "1px solid #e5e5e5", paddingLeft: "3rem" }}
            >
              <div>
                <p
                  className="font-mono text-[10px] tracking-[0.4em] uppercase mb-5"
                  style={{ color: "#a066ff" }}
                >
                  Loading Universe
                </p>

                {/* Percentage */}
                <div className="flex items-end gap-2 mb-3">
                  <span
                    className="font-black leading-none tabular-nums"
                    style={{ fontSize: "4rem", color: "#0a0715" }}
                  >
                    {loadPct}
                  </span>
                  <span className="font-black text-2xl mb-2" style={{ color: "#a066ff" }}>%</span>
                </div>

                {/* Progress bar */}
                <div className="rounded-full overflow-hidden" style={{ height: 6, background: "#ede9fa" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${loadPct}%`,
                      background: "linear-gradient(90deg,#a066ff,#58d8ff)",
                      transition: "width 0.12s linear",
                      boxShadow: "0 0 12px rgba(160,102,255,0.5)",
                    }}
                  />
                </div>

                {/* Step label */}
                <p className="font-mono mt-3" style={{ fontSize: "0.7rem", color: "#999", letterSpacing: "0.08em" }}>
                  {LOAD_STEPS[loadStep]?.label}
                </p>
              </div>

              {/* Mini checklist */}
              <div className="space-y-2">
                {LOAD_STEPS.slice(0, 5).map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: i <= loadStep ? "#a066ff" : "transparent",
                        border: `1.5px solid ${i <= loadStep ? "#a066ff" : "#ddd"}`,
                        transition: "all 0.3s",
                      }}
                    >
                      {i < loadStep && (
                        <svg width="8" height="8" viewBox="0 0 8 8">
                          <path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                        </svg>
                      )}
                    </div>
                    <span
                      className="font-mono text-[10px] tracking-widest uppercase"
                      style={{ color: i <= loadStep ? "#0a0715" : "#ccc", transition: "color 0.3s" }}
                    >
                      {s.label.split("…")[0]}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom quote */}
              <p className="font-mono italic" style={{ fontSize: "0.65rem", color: "#bbb", letterSpacing: "0.05em", marginTop: "auto" }}>
                &ldquo;The universe is under no obligation to make sense to you.&rdquo;
                <br />
                <span style={{ color: "#a066ff" }}>— Neil deGrasse Tyson</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Global keyframes ── */}
      <style>{`
        @keyframes flashIn {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes fadeInWhite {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes fadeInUp {
          0%   { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes glitch {
          0%   { transform: translate(0); }
          25%  { transform: translate(-4px, 2px); }
          50%  { transform: translate(4px, -2px); }
          75%  { transform: translate(-2px, -4px); }
          100% { transform: translate(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ── Helper: live HUD stats (top-right corner of video) ──
function LiveHudStats() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="absolute top-10 right-20 font-mono text-right space-y-1"
      style={{ fontSize: "0.62rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.55)" }}
    >
      <p>UTC {time}</p>
      <p>SECTOR: ALPHA-7</p>
      <p>UNIVERSE: v2.0</p>
      <p style={{ color: "#a066ff" }}>STATUS: ONLINE</p>
    </div>
  );
}

// ── Helper: bottom video progress bar ──
function VideoProgressBar() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const DURATION = 9000;
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      setPct(Math.min(100, Math.round((elapsed / DURATION) * 100)));
      if (elapsed >= DURATION) clearInterval(id);
    }, 80);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-80 space-y-2">
      <div className="flex justify-between font-mono" style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.15em" }}>
        <span>CREATING UNIVERSE</span>
        <span>{pct}%</span>
      </div>
      <div className="rounded-full overflow-hidden" style={{ height: 3, background: "rgba(255,255,255,0.12)" }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg,#a066ff,#58d8ff)",
            boxShadow: "0 0 8px rgba(160,102,255,0.8)",
            transition: "width 0.1s linear",
          }}
        />
      </div>
    </div>
  );
}
