"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { IntroSequence } from "@/components/intro-sequence";
import { NebulaDashboard } from "@/components/ui/NebulaDashboard";
import { ComlinkNav } from "@/components/ui/ComlinkNav";
import { SimplePortfolio } from "@/components/ui/SimplePortfolio";
import { TOTAL_DISTANCE } from "@/components/3d/config";

const SolarSystemCanvas = dynamic(
  () => import("@/components/3d/SolarSystemCanvas").then((m) => ({ default: m.SolarSystemCanvas })),
  { ssr: false }
);

export type CommitEntry = { name: string; size: number; html_url?: string; description?: string };

export default function HomePage() {
  const [commitData, setCommitData] = useState<CommitEntry[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [introComplete, setIntroComplete] = useState(false);
  const [showSimple, setShowSimple] = useState(false);
  const [isWarping, setIsWarping] = useState(false);
  const [targetX, setTargetX] = useState(0);
  const [cameraPos, setCameraPos] = useState({ x: 0, y: 0, z: 0 });

  // Smooth scroll target
  const targetPRef = useRef(0);
  const currentPRef = useRef(0);
  const isWarpingRef = useRef(false);

  // We want EXACT 1:1 mapping of scroll pixels to Z coordinates.
  // We'll set the scroll height to TOTAL_DISTANCE + window height, 
  // so maxScroll is exactly TOTAL_DISTANCE.
  const [scrollHeight, setScrollHeight] = useState(TOTAL_DISTANCE + 1000);
  // Keep a ref so the scroll closure always reads the LATEST scrollHeight
  // without needing to restart the rAF loop on every resize.
  const scrollHeightRef = useRef(TOTAL_DISTANCE + 1000);

  useEffect(() => {
    const updateScrollHeight = () => {
      const h = TOTAL_DISTANCE + window.innerHeight;
      setScrollHeight(h);
      scrollHeightRef.current = h;
    };
    updateScrollHeight();
    window.addEventListener("resize", updateScrollHeight);
    return () => window.removeEventListener("resize", updateScrollHeight);
  }, []);

  useEffect(() => {
    fetch("/api/github")
      .then((r) => r.json())
      .then((data: { title: string; commitCount?: number; html_url?: string; description?: string }[]) => {
        if (Array.isArray(data))
          setCommitData(data.map((d) => ({
            name: d.title,
            size: d.commitCount ?? 10,
            html_url: d.html_url,
            description: d.description,
          })));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!introComplete) return;
    
    let frame: number;

    const onScroll = () => {
      if (isWarpingRef.current) return;
      // Use scrollHeightRef for the CURRENT height — avoids stale closure bug
      const maxScroll = scrollHeightRef.current - window.innerHeight;
      targetPRef.current = Math.max(0, Math.min(1, window.scrollY / maxScroll));
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    const loop = () => {
      // Tighter lerp for normal scrolling so it follows the user's sudden stop on trackpad better
      const ease = isWarpingRef.current ? 0.04 : 0.18;
      currentPRef.current += (targetPRef.current - currentPRef.current) * ease;
      
      if (Math.abs(currentPRef.current - targetPRef.current) < 0.0001) {
        currentPRef.current = targetPRef.current;
        if (isWarpingRef.current) {
          isWarpingRef.current = false;
          setIsWarping(false);
        }
      }
      
      // Throttle React re-renders: only update if moved more than 0.0002 (prevents re-render every rAF)
      const prev = scrollProgress;
      if (Math.abs(currentPRef.current - prev) > 0.0002 || Math.abs(currentPRef.current - targetPRef.current) < 0.00005) {
        setScrollProgress(currentPRef.current);
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [introComplete]);

  // Handle Warp jumps from the Nebula Dashboard
  const handleWarp = (targetZ: number, x: number = 0) => {
    // targetZ is negative, so targetRatio is math.abs(targetZ) / TOTAL_DISTANCE
    const targetRatio = Math.abs(targetZ) / TOTAL_DISTANCE;
    const maxScroll = scrollHeight - window.innerHeight;
    
    // Set target
    targetPRef.current = targetRatio;
    setTargetX(x);
    isWarpingRef.current = true;
    setIsWarping(true);

    // Also update native scroll position so the user's scrollbar matches the jump
    window.scrollTo({
      top: targetRatio * maxScroll,
      behavior: "auto" // Jump instantly in native, but our rAF smooths it in 3D
    });
  };

  return (
    <>
      {/* ── Intro sequence (video + loading) ── */}
      {!introComplete && !showSimple && (
        <IntroSequence
          onComplete={() => setIntroComplete(true)}
          onSimple={() => setShowSimple(true)}
        />
      )}

      {/* ── Simple Portfolio Mode ── */}
      <AnimatePresence>
        {showSimple && (
          <SimplePortfolio onExit={() => { setShowSimple(false); setIntroComplete(true); }} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {introComplete && scrollProgress < 0.0001 && (
          <NebulaDashboard 
            visible={true} 
            onWarp={handleWarp} 
          />
        )}
      </AnimatePresence>
      
      {/* ── Comlink Persistent Navigation ── */}
      <ComlinkNav
        visible={introComplete && scrollProgress >= 0.0001}
        onWarp={handleWarp}
      />

      {/* ── Main 3D Portfolio ── */}
      <div
        className="fixed inset-0 z-0 bg-[#0a0715] overflow-hidden hide-scrollbar"
        style={{
          opacity: introComplete ? 1 : 0,
          transition: "opacity 0.8s ease",
          pointerEvents: introComplete ? "auto" : "none",
        }}
      >
        <SolarSystemCanvas 
          scrollT={scrollProgress} 
          commitData={commitData} 
          isWarping={isWarping} 
          targetX={targetX}
          setCameraPos={setCameraPos}
        />
      </div>

      {/* Very long container to force native scrollbar */}
      <div
        className="relative z-10 w-full"
        style={{
          height: `${scrollHeight}px`,
          pointerEvents: "none",
          opacity: introComplete ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      >
        {/* Scroll hint disappears when scrolling down */}
        <div
          className="fixed bottom-10 right-10 flex flex-col items-center gap-2 pointer-events-none transition-opacity duration-1000"
          style={{
            opacity: introComplete && scrollProgress < 0.02 ? 1 : 0,
            textShadow: "0 0 20px rgba(160, 102, 255, 0.8)",
          }}
        >
          <div className="h-10 w-[1px] bg-gradient-to-b from-transparent to-[#a066ff] animate-pulse mb-2" />
          <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#a066ff]">
            Scroll to Explore
          </p>
        </div>

        {/* Right side scroll progress bar */}
        <div className="fixed right-6 top-1/2 -translate-y-1/2 h-[400px] w-0.5 rounded-full bg-white/10 hidden md:block">
          <div
            className="absolute top-0 w-full rounded-full transition-all duration-100"
            style={{
              height: `${scrollProgress * 100}%`,
              background: "linear-gradient(to bottom, #a066ff, #58d8ff)",
              boxShadow: "0 0 16px rgba(160, 102, 255, 0.6)",
            }}
          />
        </div>

        {/* Debug overlay removed for production */}
      </div>
    </>
  );
}
