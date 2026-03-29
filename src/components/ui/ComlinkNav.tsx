"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ComlinkNavProps {
  onWarp: (targetZ: number) => void;
  visible: boolean;
}

export function ComlinkNav({ onWarp, visible }: ComlinkNavProps) {
  const NODES = [
    { id: "home", label: "HOME", z: 0, color: "#ffffff" },
    { id: "projects", label: "PROJECTS", z: -1500, color: "#58d8ff" },
    { id: "skills", label: "SKILLS", z: -6000, color: "#a066ff" },
    { id: "about", label: "ABOUT", z: -28000, color: "#ff8c6b" },
    { id: "timeline", label: "TIMELINE", z: -29000, color: "#3dff99" },
    { id: "resume", label: "RÉSUMÉ", z: -29000, color: "#ffaa33" },
    { id: "contact", label: "CONTACT", z: -29000, color: "#ff4444" },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed top-6 right-6 z-50 pointer-events-auto"
        >
          <div className="flex bg-[#0a0715]/60 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-[0_0_30px_rgba(160,102,255,0.15)] gap-1.5">
            {NODES.map((n) => (
              <button
                key={n.id}
                onClick={() => onWarp(n.z)}
                className="group relative flex items-center justify-center px-3.5 py-1.5 rounded-full overflow-hidden transition-all duration-300 bg-white/5 hover:bg-white/10"
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{ background: `linear-gradient(45deg, ${n.color}, transparent)` }}
                />
                <span className="relative z-10 text-[9px] font-bold uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">
                  {n.label}
                </span>
                <div 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] rounded-full transition-all duration-300 group-hover:w-1/2"
                  style={{ backgroundColor: n.color, boxShadow: `0 0 10px ${n.color}` }}
                />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
