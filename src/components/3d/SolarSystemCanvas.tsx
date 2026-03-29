
"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Billboard, Environment } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

import { Project } from "@/data/portfolio";
import { JOURNEY, TOTAL_DISTANCE, JourneyStop } from "./config";
import { CameraRig } from "./CameraRig";
import {
  CentralStar,
  ProjectPlanet,
  AchievementMoon,
  MainAsteroidBelt,
  SkillZoneModal,
  BELT_COLORS,
  Starfield,
} from "./stops/PlanetsAndMoons";
import { skillClusters } from "@/data/portfolio";
import { SpaceStation } from "./stops/SpaceStation";
import { BlackHole } from "./stops/BlackHole";
import { MissionControl } from "./stops/MissionControl";
import { WormholeTimeline, CommitEntry } from "./stops/WormholeTimeline";
import { HoverCard, ProjectModal, ArchitecturalModal } from "../ui/Modals";
import { SunPortfolioPanel } from "../ui/SunPortfolioPanel";

/* ================================================================
   Scene background — forces the WebGL clear color to #0a0715 on
   EVERY frame at priority -100 (before the EffectComposer runs) so
   postprocessing v3 never composites on top of a white buffer.
   ================================================================ */
const SCENE_BG = new THREE.Color("#0a0715");

function SceneBackground() {
  const { scene, gl } = useThree();
  scene.background = SCENE_BG;
  // Reset clear color every frame with very high negative priority
  // so it always runs BEFORE the EffectComposer's render passes.
  useFrame(() => {
    scene.background = SCENE_BG;
    gl.setClearColor(SCENE_BG, 1);
  }, -100);
  return null;
}

/* ================================================================
   End-of-journey void card
   ================================================================ */
function TheVoid({ z }: { z: number }) {
  const labelRef = useRef<HTMLDivElement>(null);

  useFrame(({ camera }) => {
    if (!labelRef.current) return;
    // z is in world space; camera.position.z is also world space
    const dist = Math.abs(camera.position.z - z);
    // Only appear when very close (300u) so it doesn't bleed into the wormhole/hub zone
    labelRef.current.style.opacity = String(
      Math.max(0, Math.min(1, 1 - dist / 300)),
    );
  });

  return (
    <group position={[0, 0, z]}>
      <Billboard>
        <Html center style={{ pointerEvents: "none" }}>
          <div ref={labelRef} style={{ opacity: 0 }}>
            <div
              className="flex flex-col items-center text-center px-10 py-8 rounded-3xl"
              style={{
                background: "rgba(10,7,21,0.7)",
                border: "1px solid rgba(160,102,255,0.25)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 0 80px rgba(160,102,255,0.1)",
                minWidth: 320,
              }}
            >
              <div className="w-2 h-2 rounded-full bg-[#a066ff] animate-[ping_2s_infinite] mb-6" />
              <p className="text-2xl font-black text-white tracking-[0.1em] uppercase mb-2">
                You&rsquo;ve reached the end
              </p>
              <p className="text-sm font-mono text-[#a066ff] mb-4">
                of Shivam&rsquo;s Universe... for now.
              </p>
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4" />
              <p className="text-xs text-white/30 font-mono">
                Made with ☕ &amp; Three.js &nbsp;·&nbsp;{" "}
                {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </Html>
      </Billboard>
    </group>
  );
}

/* ================================================================
   Warp dust speed particles
   ================================================================ */
function WarpDust({
  scrollT,
  isWarping,
}: {
  scrollT: number;
  isWarping: boolean;
}) {
  const count = 2000;
  const pointsRef = useRef<THREE.Points>(null);
  const lastScrollT = useRef(scrollT);
  const scrollSpeed = useRef(0);

  // Single memo: create AND populate arrays together
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 400;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 400;
      // Spawn near initial camera z (1200) spread behind
      pos[i * 3 + 2] = 1200 - Math.random() * 2000;
      vel[i] = (Math.random() + 0.5) * 4;
    }

    return { positions: pos, velocities: vel };
  }, []);

  useFrame(({ camera }) => {
    if (!pointsRef.current) return;

    const deltaS = Math.abs(scrollT - lastScrollT.current);
    scrollSpeed.current += (deltaS * 800 - scrollSpeed.current) * 0.1;
    lastScrollT.current = scrollT;

    const warpBoost = isWarping ? 8.0 : 0;
    const effectiveSpeed = 0.2 + scrollSpeed.current + warpBoost;

    // Skip update when barely moving and not warping
    if (effectiveSpeed < 0.5 && !isWarping) return;

    const pos = pointsRef.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 2] += velocities[i] * effectiveSpeed;

      // Respawn behind camera when particle passes it
      if (pos[i * 3 + 2] > camera.position.z + 100) {
        pos[i * 3] = camera.position.x + (Math.random() - 0.5) * 600;
        pos[i * 3 + 1] = camera.position.y + (Math.random() - 0.5) * 600;
        pos[i * 3 + 2] = camera.position.z - 800 - Math.random() * 800;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    (pointsRef.current.material as THREE.PointsMaterial).size = Math.min(
      2 + effectiveSpeed * 0.5,
      30,
    );
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#cfa6fa"
        size={2}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ================================================================
   Dynamic post-processing — reacts to warp state
   ================================================================ */
function DynamicEffects({ isWarping }: { isWarping: boolean }) {
  const bloomIntensity = isWarping ? 1.5 : 0.8;

  // Pre-compute Vector2 only when isWarping changes (avoid per-render alloc)
  const caOffset = useMemo<[number, number]>(
    () => {
      const v = isWarping ? 0.003 : 0.001;
      return [v, v];
    },
    [isWarping],
  );

  return (
    <EffectComposer>
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        height={512}
      />
      <ChromaticAberration
        offset={caOffset}
        blendFunction={BlendFunction.NORMAL}
      />
      <Noise opacity={0.012} />
      <Vignette offset={0.05} darkness={0.8} />
    </EffectComposer>
  );
}

/* ================================================================
   Type guards for HUD state
   ================================================================ */
type HudState =
  | (JourneyStop & { dist?: number })
  | { approaching: JourneyStop | null; dist: number }
  | null;

const isNearStop = (h: HudState): h is JourneyStop & { dist?: number } =>
  !!h && "type" in h;

const isApproaching = (
  h: HudState,
): h is { approaching: JourneyStop | null; dist: number } =>
  !!h && "approaching" in h;

/* ================================================================
   MAIN EXPORT
   ================================================================ */
export function SolarSystemCanvas({
  scrollT = 0,
  commitData = [],
  isWarping = false,
  setCameraPos,
}: {
  scrollT?: number;
  commitData?: CommitEntry[];
  isWarping?: boolean;
  setCameraPos?: (pos: { x: number; y: number; z: number }) => void;
}) {
  // ── State ──────────────────────────────────────────────────
  const [hovered, setHovered] = useState<Project | null>(null);
  const [hoverPos, setHoverPos] = useState<[number, number]>([0, 0]);
  const [hudInfo, setHudInfo] = useState<HudState>(null);
  const [introAlpha, setIntroAlpha] = useState(1);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedArch, setSelectedArch] = useState<{
    title: string;
    type: string;
    x?: number;
  } | null>(null);
  const [activeBranchX, setActiveBranchX] = useState(0);
  const [selectedSkillCluster, setSelectedSkillCluster] = useState<{
    cluster: typeof skillClusters[number];
    color: string;
    icon: string;
  } | null>(null);

  // Zone icons map (matches CLUSTER_ZONE_CONFIG order)
  const ZONE_ICONS = ["</>", "🧠", "⚙️", "🌐"];
  const ZONE_COLORS = ["#58d8ff", "#a066ff", "#ff8c6b", "#3dff99"];
  const handleAsteroidClick = useCallback(
    (cluster: typeof skillClusters[number], idx: number) => {
      setSelectedSkillCluster({
        cluster,
        color: ZONE_COLORS[idx] ?? BELT_COLORS[idx],
        icon: ZONE_ICONS[idx] ?? "✦",
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // ── Sync branch X when entering hub zone ───────────────────
  useEffect(() => {
    const stop = isNearStop(hudInfo)
      ? hudInfo
      : isApproaching(hudInfo)
        ? hudInfo.approaching
        : null;

    if (
      stop &&
      (stop.type === "wormhole" ||
        stop.type === "blackhole" ||
        stop.type === "radar")
    ) {
      setActiveBranchX(stop.x || 0);
    } else if (scrollT < 0.85) {
      setActiveBranchX(0);
    }
  }, [hudInfo, scrollT]);

  const inHubZone = scrollT >= 0.85 && scrollT <= 0.97;

  // ── Arrow key navigation in hub ────────────────────────────
  useEffect(() => {
    if (!inHubZone) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setActiveBranchX((prev) =>
          prev === 0 ? -450 : prev === 450 ? 0 : prev,
        );
      } else if (e.key === "ArrowRight") {
        setActiveBranchX((prev) =>
          prev === 0 ? 450 : prev === -450 ? 0 : prev,
        );
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [inHubZone]);

  // ── Body class when modal open ─────────────────────────────
  useEffect(() => {
    const isOpen = !!(selectedProject || selectedArch);
    document.body.classList.toggle("modal-open", isOpen);
    return () => document.body.classList.remove("modal-open");
  }, [selectedProject, selectedArch]);

  // ── Derived HUD state ──────────────────────────────────────
  const nearStop: (JourneyStop & { dist?: number }) | null = isNearStop(hudInfo)
    ? hudInfo
    : null;

  let approachingStop: JourneyStop | null = null;
  // Show approach teaser when 500-1000u away (matches CameraRig thresholds exactly)
  if (!nearStop && isApproaching(hudInfo) && hudInfo.dist >= 500 && hudInfo.dist <= 1000) {
    approachingStop = hudInfo.approaching;
  }

  // ── Stable callbacks to avoid re-renders in 3D children ────
  const handleHover = useCallback(
    (p: Project, pos: [number, number]) => {
      setHovered(p);
      setHoverPos(pos);
    },
    [],
  );
  const handleLeave = useCallback(() => setHovered(null), []);
  const handleProjectClick = useCallback(
    (p: Project) => setSelectedProject(p),
    [],
  );

  return (
    <div className="relative h-full w-full bg-[#0a0715]">
      <Canvas
        camera={{
          // smoothZ initial = 1125, offset = +75 → camera.z = 1200
          position: [0, 15, 1200],
          fov: 75,
          near: 1,
          far: 50000,
        }}
        style={{ background: "#0a0715" }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(SCENE_BG, 1);
          scene.background = SCENE_BG;
        }}
      >
        {/* Force dark background on the THREE.js scene */}
        <SceneBackground />

        {/* ── Lighting & environment ────────────────────────── */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[1, 1, 1]}
          intensity={0.6}
          color="#c4a8ff"
        />
        {/* Environment removed: Drei v10 Environment can override scene.background to null */}

        {/* Fog: far enough to not clip nearby objects */}
        <fog attach="fog" args={["#0a0715", 3000, 20000]} />

        {/*
         * CameraRig FIRST — its useFrame updates camera position
         * before any other component's useFrame reads it.
         */}
        <CameraRig
          scrollT={scrollT}
          isWarping={isWarping}
          setHudInfo={setHudInfo}
          setIntroAlpha={setIntroAlpha}
          setCameraPos={setCameraPos}
          targetX={activeBranchX}
        />

        {/* Background & particles */}
        <Starfield />
        <WarpDust scrollT={scrollT} isWarping={isWarping} />

        {/* ── Journey stops (distance-culled) ───────────────── */}
        {JOURNEY.map((stop, i) => {
          // Approximate camera Z for culling
          // Corrected camera Z: smoothZ + 75 (updated formula, was +600)
          const cameraZ = scrollT * -TOTAL_DISTANCE + 75;
          const stopDist = Math.abs(cameraZ - stop.z);

          // Always render sun & void; cull others beyond 4000u
          if (
            stop.type !== "sun" &&
            stop.type !== "void" &&
            stopDist > 4000
          ) {
            return null;
          }

          // Moon positioning: alternate sides near camera path
          let moonPos: [number, number, number] = [0, 0, stop.z];
          if (stop.type === "moon") {
            const side = i % 2 === 0 ? 1 : -1;
            moonPos = [side * 32, 8, stop.z];
          }

          switch (stop.type) {
            case "sun":
              return (
                <CentralStar
                  key={i}
                  z={stop.z}
                  commitData={commitData}
                  onClick={() => setSelectedArch({ title: stop.title, type: "sun" })}
                />
              );

            case "moon":
              return (
                <AchievementMoon
                  key={i}
                  data={{ ...stop, position: moonPos }}
                  onClick={() =>
                    setSelectedArch({ title: stop.title, type: "moon" })
                  }
                />
              );

            case "project":
              if (!stop.item) return null;
              return (
                <ProjectPlanet
                  key={i}
                  data={{
                    z: stop.z,
                    item: stop.item,
                    detail: stop.detail || null,
                  }}
                  scrollT={scrollT}
                  onHover={handleHover}
                  onLeave={handleLeave}
                  onClick={handleProjectClick}
                />
              );

            case "asteroids":
              return (
                <MainAsteroidBelt
                  key={i}
                  z={stop.z}
                  onZoneClick={handleAsteroidClick}
                />
              );

            case "station":
              return (
                <SpaceStation
                  key={i}
                  data={stop}
                  scrollT={scrollT}
                  onClick={() =>
                    setSelectedArch({ title: stop.title, type: "station" })
                  }
                />
              );

            case "blackhole":
              return (
                <BlackHole
                  key={i}
                  data={stop}
                  scrollT={scrollT}
                  onClick={() => {
                    setActiveBranchX(stop.x || 0);
                    setSelectedArch({
                      title: stop.title,
                      type: stop.type,
                    });
                  }}
                />
              );

            case "radar":
              return (
                <MissionControl
                  key={i}
                  data={stop}
                  scrollT={scrollT}
                  onClick={() => {
                    setActiveBranchX(stop.x || 0);
                    setSelectedArch({
                      title: stop.title,
                      type: stop.type,
                    });
                  }}
                />
              );

            case "wormhole":
              return (
                <WormholeTimeline
                  key={i}
                  data={stop}
                  scrollT={scrollT}
                  commits={commitData}
                  onClick={() => {
                    setActiveBranchX(stop.x || 0);
                    setSelectedArch({
                      title: stop.title,
                      type: stop.type,
                    });
                  }}
                />
              );

            case "void":
              return <TheVoid key={i} z={stop.z} />;

            default:
              return null;
          }
        })}

        {/* Post-processing — must be last child */}
        <DynamicEffects isWarping={isWarping} />
      </Canvas>

      {/* ═══════════════════════════════════════════════════════
          DOM OVERLAYS (outside Canvas)
          ═══════════════════════════════════════════════════════ */}

      {/* ── Bottom HUD — proximity-gated ──────────────────── */}
      <AnimatePresence mode="wait">
        {nearStop ? (
          <motion.div
            key={`near-${nearStop.title}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center w-full max-w-2xl px-6 text-center pointer-events-none"
            style={{ zIndex: 40 }}
          >
            {nearStop.type === "sun" ? (
              /* ── SUN HUD: system metrics ─────────────────── */
              <div className="flex flex-col items-center">
                <div className="mb-4 flex items-center gap-4 bg-orange-500/10 border border-orange-500/20 px-6 py-2 rounded-xl backdrop-blur-xl">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-[ping_2s_infinite]" />
                  <span className="text-xs font-mono font-black tracking-[0.5em] text-orange-500 uppercase">
                    Profile Overview
                  </span>
                </div>

                <h2
                  className="text-4xl md:text-5xl font-black uppercase tracking-[0.2em] text-white mb-6"
                  style={{ textShadow: "0 0 50px rgba(255,160,50,0.4)" }}
                >
                  {nearStop.title}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
                  {nearStop.desc.split("|").map((stat, idx) => {
                    const [label, val] = stat.split(":");
                    return (
                      <div
                        key={idx}
                        className="flex flex-col items-start p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md"
                      >
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">
                          {label?.trim()}
                        </span>
                        <span className="text-sm font-bold text-white tracking-wider">
                          {val?.trim()}
                        </span>
                        <div className="w-full h-1 bg-white/10 mt-3 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "85%" }}
                            transition={{
                              delay: 0.5 + idx * 0.2,
                              duration: 1.5,
                            }}
                            className="h-full bg-gradient-to-r from-orange-500 to-yellow-400"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* ── STANDARD STOP HUD ───────────────────────── */
              <>
                <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: nearStop.color || "#a066ff" }}
                  />
                  <span
                    className="text-[9px] font-mono tracking-[0.35em] uppercase"
                    style={{ color: nearStop.color || "#a066ff" }}
                  >
                    {nearStop.type === "project"
                      ? "PROJECT"
                      : nearStop.type === "moon"
                        ? "ACHIEVEMENT"
                        : nearStop.type === "asteroids"
                          ? "SKILLS"
                          : nearStop.type === "station"
                            ? "ABOUT"
                            : nearStop.type === "blackhole"
                              ? "RÉSUMÉ"
                              : nearStop.type === "radar"
                                ? "CONTACT"
                                : nearStop.type === "wormhole"
                                  ? "GITHUB"
                                  : nearStop.type.toUpperCase()}
                  </span>
                </div>
                <h2
                  className="text-3xl md:text-4xl font-black uppercase tracking-[0.15em] text-white"
                  style={{
                    textShadow: `0 0 40px ${nearStop.color || "rgba(160,102,255,0.6)"}, 0 0 10px rgba(255,255,255,0.4)`,
                  }}
                >
                  {nearStop.title}
                </h2>
                <p
                  className="mt-3 text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase"
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    textShadow: "0 0 20px rgba(0,0,0,1)",
                  }}
                >
                  {nearStop.desc}
                </p>
              </>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Approaching banner removed per user request */}

      {/* ── Branch navigation hub ─────────────────────────── */}
      <AnimatePresence>
        {inHubZone && (
          <motion.div
            key="branch-hub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-3 pointer-events-none"
          >
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 border border-white/10 backdrop-blur-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a066ff] animate-pulse" />
              <span className="text-[9px] font-mono tracking-[0.5em] uppercase text-white/50">
                Navigate Paths
              </span>
            </div>

            <div className="flex items-center gap-3 pointer-events-auto">
              <span className="text-white/30 text-xs font-mono">←</span>

              {/* GitHub Timeline */}
              <button
                onClick={() => setActiveBranchX(-450)}
                className={`flex flex-col items-center gap-1 px-5 py-3 rounded-2xl border transition-all duration-300 ${activeBranchX === -450
                    ? "bg-cyan-500/20 border-cyan-400/60 shadow-[0_0_30px_rgba(34,211,238,0.3)]"
                    : "bg-black/40 border-white/10 hover:border-cyan-500/30 hover:bg-cyan-900/10"
                  }`}
                style={{ backdropFilter: "blur(16px)" }}
              >
                <span
                  className={`text-[11px] font-bold tracking-widest ${activeBranchX === -450 ? "text-cyan-400" : "text-white/50"
                    }`}
                >
                  GITHUB
                </span>
                <span className="text-[8px] font-mono text-white/25">
                  TIMELINE
                </span>
              </button>

              {/* Contact */}
              <button
                onClick={() => setActiveBranchX(0)}
                className={`flex flex-col items-center gap-1 px-5 py-3 rounded-2xl border transition-all duration-300 ${activeBranchX === 0
                    ? "bg-green-500/20 border-green-400/60 shadow-[0_0_30px_rgba(74,222,128,0.3)]"
                    : "bg-black/40 border-white/10 hover:border-green-500/30 hover:bg-green-900/10"
                  }`}
                style={{ backdropFilter: "blur(16px)" }}
              >
                <span
                  className={`text-[11px] font-bold tracking-widest ${activeBranchX === 0 ? "text-green-400" : "text-white/50"
                    }`}
                >
                  CONTACT
                </span>
                <span className="text-[8px] font-mono text-white/25">
                  CENTER
                </span>
              </button>

              {/* Résumé */}
              <button
                onClick={() => setActiveBranchX(450)}
                className={`flex flex-col items-center gap-1 px-5 py-3 rounded-2xl border transition-all duration-300 ${activeBranchX === 450
                    ? "bg-purple-500/20 border-purple-400/60 shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                    : "bg-black/40 border-white/10 hover:border-purple-500/30 hover:bg-purple-900/10"
                  }`}
                style={{ backdropFilter: "blur(16px)" }}
              >
                <span
                  className={`text-[11px] font-bold tracking-widest ${activeBranchX === 450 ? "text-purple-400" : "text-white/50"
                    }`}
                >
                  RÉSUMÉ
                </span>
                <span className="text-[8px] font-mono text-white/25">
                  PROFILE
                </span>
              </button>

              <span className="text-white/30 text-xs font-mono">→</span>
            </div>

            <span className="text-[8px] font-mono text-white/20 tracking-widest">
              USE ← → ARROW KEYS OR CLICK
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modals ────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            p={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
        {selectedArch && selectedArch.type === "sun" && (
          <SunPortfolioPanel onClose={() => setSelectedArch(null)} />
        )}
        {selectedArch && selectedArch.type !== "sun" && (
          <ArchitecturalModal
            title={selectedArch.title}
            type={selectedArch.type}
            onClose={() => setSelectedArch(null)}
          />
        )}
        {selectedSkillCluster && (
          <SkillZoneModal
            key={selectedSkillCluster.cluster.title}
            cluster={selectedSkillCluster.cluster}
            color={selectedSkillCluster.color}
            icon={selectedSkillCluster.icon}
            onClose={() => setSelectedSkillCluster(null)}
          />
        )}
      </AnimatePresence>

      {/* Suppress 3D Html overlays when any modal is open */}
      <style>{`
        .three-html-root { transition: opacity 0.2s ease; }
        body.modal-open .three-html-root { opacity: 0 !important; pointer-events: none !important; }
        body.modal-open canvas { filter: brightness(0.3) blur(2px); transition: filter 0.3s ease; }
        canvas { transition: filter 0.3s ease; }
      `}</style>
    </div>
  );
}