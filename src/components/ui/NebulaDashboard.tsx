"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { profile } from "@/data/portfolio";

interface NebulaDashboardProps {
  onWarp: (targetZ: number) => void;
  visible: boolean;
}

export function NebulaDashboard({ onWarp, visible }: NebulaDashboardProps) {
  if (!visible) return null;

  const NAV_SECTIONS = [
    { label: "Projects", z: -1500, color: "#58d8ff", icon: "◆" },
    { label: "Skills", z: -6000, color: "#a066ff", icon: "◇" },
    { label: "About Me", z: -28000, color: "#ff8c6b", icon: "●" },
    { label: "Timeline", z: -29000, color: "#3dff99", icon: "◎" },
    { label: "Résumé", z: -29000, color: "#ffaa33", icon: "▣" },
    { label: "Contact", z: -29000, color: "#ff4444", icon: "◈" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-40 flex items-center justify-center p-6 md:p-12 pointer-events-none"
    >
      {/* Animated Nebula Background Layers — lighter so THREE.js stars show through */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0], opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[80%] h-[80%] rounded-full bg-[radial-gradient(circle,rgba(160,102,255,0.5)_0%,transparent_70%)] blur-[60px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -15, 10, 0], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] -right-[10%] w-[90%] h-[90%] rounded-full bg-[radial-gradient(circle,rgba(88,216,255,0.4)_0%,transparent_70%)] blur-[60px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] left-[20%] w-[70%] h-[70%] rounded-full bg-[radial-gradient(circle,rgba(255,107,0,0.35)_0%,transparent_70%)] blur-[50px]"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[60%] rounded-full bg-[radial-gradient(ellipse,rgba(255,0,128,0.25)_0%,transparent_60%)] blur-[70px]"
        />
      </div>

      {/* Deep dimming overlay — reduced so THREE.js stars bleed through */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none z-10" />

      {/* Main Glassmorphism Panel */}
      <motion.div
        initial={{ y: 50, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-50 w-full max-w-5xl bg-[#0a0715]/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-12 shadow-[0_0_80px_rgba(160,102,255,0.15)] pointer-events-auto"
      >
        {/* Left Side: Profile & Intro */}
        <div className="flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-2 border-[#a066ff]/50 mb-6 shadow-[0_0_40px_rgba(160,102,255,0.3)]">
            <Image
              src="/profile.png"
              alt="Shivam Panjolia"
              fill
              className="object-cover object-top"
              style={{ objectPosition: "center 15%" }}
              priority
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-1">
            Shivam <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a066ff] to-[#58d8ff]">Panjolia</span>
          </h1>
          <p className="text-white/50 font-medium tracking-wide text-sm md:text-base mb-4">
            {profile.role}
          </p>
          <p className="text-white/60 max-w-md text-sm leading-relaxed mb-6">
            {profile.headline} My work spans software engineering, artificial intelligence, and creative systems — built on C++, Python, blockchain architectures, and ML frameworks.
          </p>

          {/* Quick Highlights */}
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.highlights.slice(0, 3).map((h, i) => (
              <span key={i} className="text-[10px] font-mono px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-white/50 tracking-wide">
                {h}
              </span>
            ))}
          </div>

          {/* Education & Socials */}
          <div className="flex items-center gap-4 text-white/30 text-xs">
            <span>{profile.education?.[0]?.institution}</span>
            <span>·</span>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-[#58d8ff] transition-colors">
              GitHub ↗
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#58d8ff] transition-colors">
              LinkedIn ↗
            </a>
          </div>
        </div>

        {/* Right Side: Navigation */}
        <div className="flex-1 flex flex-col justify-center gap-4">
          <p className="font-mono text-[10px] text-white/40 tracking-[0.3em] uppercase mb-2">
            Jump to Section
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {NAV_SECTIONS.map((node, idx) => (
              <motion.button
                key={node.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + idx * 0.08, duration: 0.4 }}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onWarp(node.z)}
                className="group relative flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5 overflow-hidden transition-colors"
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, ${node.color}, transparent)` }}
                />
                <span className="relative z-10 text-lg" style={{ color: node.color }}>
                  {node.icon}
                </span>
                <span className="relative z-10 font-bold text-white/90 group-hover:text-white transition-colors text-sm">
                  {node.label}
                </span>
              </motion.button>
            ))}
          </div>

          <p className="text-white/20 text-[9px] font-mono tracking-widest uppercase mt-2 text-center">
            or scroll to explore
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
