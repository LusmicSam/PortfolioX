"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Project } from "@/data/portfolio";

export function HoverCard({ p, pos }: { p: Project; pos: [number, number] }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ duration: 0.18 }}
        style={{
          position: "fixed",
          left: pos[0] + 30,
          top: pos[1] - 40,
          pointerEvents: "none",
          zIndex: 100,
          maxWidth: 320,
        }}
        className="glass-card rounded-2xl border border-white/10 p-5 shadow-2xl backdrop-blur-xl bg-[#0a0715]/80"
      >
        <div className="mb-3 h-1 w-full rounded" style={{ background: p.planetColor, boxShadow: `0 0 16px ${p.planetColor}` }} />
        <h3 className="text-xl font-black text-white">{p.title}</h3>
        <p className="mt-2 text-sm text-slate-300 leading-relaxed">{p.tagline}</p>
        
        <div className="mt-4 flex flex-wrap gap-1.5">
          {p.stack.slice(0, 4).map((s) => (
            <span key={s} className="rounded-full px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider" style={{ background: `${p.planetColor}25`, color: p.planetColor, border: `1px solid ${p.planetColor}40` }}>
              {s}
            </span>
          ))}
        </div>
        
        <div className="mt-4 rounded-lg bg-black/40 p-3 border border-white/5 flex items-center justify-center gap-2 text-center pointer-events-auto cursor-pointer relative overflow-hidden group">
           <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
           <svg width="14" height="14" viewBox="0 0 24 24" fill={p.planetColor}><path d="M8 5v14l11-7z"/></svg>
           <span style={{ color: p.planetColor }} className="text-[10px] uppercase tracking-widest font-mono font-bold">Click Planet for Case Study</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function ProjectModal({ p, onClose }: { p: Project; onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(30px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-12 pointer-events-auto"
      onClick={onClose}
    >
      {/* Dark Overlay with Scanlines */}
      <div 
        className="absolute inset-0 bg-black/80 pointer-events-none mix-blend-multiply" 
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.8) 2px, rgba(0,0,0,0.8) 4px)"
        }}
      />

      <motion.div 
        initial={{ scale: 0.98, y: 40, opacity: 0, rotateX: 10 }}
        animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
        exit={{ scale: 0.98, y: 40, opacity: 0, rotateX: 10 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        className="relative w-full border max-w-5xl rounded-xl p-8 md:p-12 overflow-hidden shadow-2xl"
        style={{ 
          background: "rgba(5, 5, 12, 0.85)",
          borderColor: `${p.planetColor}40`,
          boxShadow: `0 0 100px ${p.planetColor}30, inset 0 0 50px rgba(0,0,0,0.9)`,
        }}
      >
        {/* Glow Top Accent Line */}
        <div 
          className="absolute top-0 left-0 right-0 h-[2px]" 
          style={{ background: `linear-gradient(90deg, transparent, ${p.planetColor}, transparent)` }} 
        />
        
        {/* Tech Corner Accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 opacity-50" style={{ borderColor: p.planetColor }} />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 opacity-50" style={{ borderColor: p.planetColor }} />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 opacity-50" style={{ borderColor: p.planetColor }} />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 opacity-50" style={{ borderColor: p.planetColor }} />

        <button onClick={onClose} className="absolute right-6 top-6 p-2 rounded-sm bg-white/5 hover:bg-white/20 transition-colors pointer-events-auto cursor-pointer group border border-white/10">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" className="group-hover:stroke-white" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <div className="flex justify-between items-end mb-4 border-b pb-4" style={{ borderColor: `${p.planetColor}20` }}>
          <div>
            <p className="text-[10px] font-mono tracking-[0.4em] uppercase mb-1" style={{ color: p.planetColor }}>
              ARCHIVE_ID: {p.year}_{p.stack[0].toUpperCase()}
            </p>
            <h2 className="text-4xl md:text-6xl font-black text-white" style={{ textShadow: `0 0 30px ${p.planetColor}80` }}>
              {p.title} <span className="animate-pulse" style={{ color: p.planetColor }}>_</span>
            </h2>
          </div>
          <p className="hidden md:block text-[10px] font-mono text-slate-500 tracking-widest uppercase">
            STATUS: <span style={{ color: p.planetColor }}>DECRYPTED</span>
          </p>
        </div>
        
        <div className="mt-8 grid md:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div>
              <h4 className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-slate-400 mb-3 border-l-2 pl-3" style={{ borderColor: p.planetColor }}>
                System Error / Problem
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">{p.problem}</p>
            </div>
            
            <div>
              <h4 className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-slate-400 mb-3 border-l-2 pl-3" style={{ borderColor: p.planetColor }}>
                Architecture / Build
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">{p.build}</p>
            </div>

            <div className="flex flex-wrap gap-2 pt-4">
              {p.stack.map(s => (
                <span key={s} className="px-3 py-1 font-mono text-[10px] uppercase tracking-widest border rounded bg-black/40" style={{ borderColor: `${p.planetColor}30`, color: p.planetColor }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col h-full">
            <div className="relative rounded-lg aspect-video bg-black flex items-center justify-center border overflow-hidden flex-grow" style={{ borderColor: `${p.planetColor}20` }}>
              {/* Media Content */}
              {p.media ? (
                <div className="absolute inset-0 z-0">
                  {p.media.type === "video" ? (
                    <video 
                      src={p.media.url} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      className="w-full h-full object-cover opacity-80"
                      onError={(e) => {
                        const target = e.target as HTMLVideoElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <img 
                      src={p.media.url} 
                      alt={p.title} 
                      className="w-full h-full object-cover opacity-80" 
                    />
                  )}
                  {/* Fallback for video errors */}
                  <div className="absolute inset-0 hidden flex-col items-center justify-center bg-black/60 z-10">
                    <p className="text-[10px] text-red-400 font-mono uppercase tracking-[0.2em] mb-2">[ DATA_CORRUPTION_DETECTED ]</p>
                    <p className="text-[11px] text-white/40 font-mono text-center px-4 italic">"Visual telemetry link failed. Re-routing to secondary data buffer..."</p>
                  </div>
                </div>
              ) : (
                <div className="relative z-20 flex flex-col items-center p-6 text-center">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed animate-[spin_10s_linear_infinite] mb-6 flex items-center justify-center" style={{ borderColor: `${p.planetColor}40` }}>
                    <div className="w-6 h-6 rounded-full border border-dotted animate-[spin_4s_linear_infinite_reverse]" style={{ borderColor: p.planetColor }} />
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono tracking-[0.3em] uppercase mb-2">Deploying Observational Hub...</p>
                  <p className="text-[14px] font-black tracking-[0.4em] uppercase" style={{ color: p.planetColor }}>COMING SOON</p>
                  <div className="mt-4 px-3 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-mono text-white/30">
                    STATUS: COLLECTING_TELEMETRY
                  </div>
                </div>
              )}

              {/* Holographic Overlays */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-0 opacity-[0.05] z-20 pointer-events-none" style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
              
              {/* Corner Scanning Brackets */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t border-l opacity-40" style={{ borderColor: p.planetColor }} />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r opacity-40" style={{ borderColor: p.planetColor }} />
            </div>

            <div className="mt-6 flex gap-4 pr-1">
              {p.links.demo && (
                <a href={p.links.demo} target="_blank" className="flex-1 flex justify-center items-center h-12 rounded-sm text-xs font-bold uppercase tracking-widest text-[#05050a] transition-all hover:brightness-125" style={{ backgroundColor: p.planetColor, boxShadow: `0 0 20px ${p.planetColor}40` }}>
                  Engage Live Demo
                </a>
              )}
              {p.links.repo && (
                <a href={p.links.repo} target="_blank" className="flex-1 flex justify-center items-center h-12 rounded-sm text-xs font-bold uppercase tracking-widest border border-white/20 text-white hover:bg-white/5 transition-colors">
                  Mount Codebase
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ArchitecturalModal({ title, type, onClose }: { title: string; type: string; onClose: () => void }) {
  const [formState, setFormState] = useState({ name: "", email: "", message: "", sent: false });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState(s => ({ ...s, sent: true }));
  };

  const content: Record<string, React.ReactNode> = {
    station: (
      <div className="grid md:grid-cols-3 gap-6 text-left">
        <div className="md:col-span-2 space-y-6">
          <div>
            <p className="text-[10px] font-mono tracking-[0.3em] text-[#a066ff] uppercase mb-2">Commander Profile</p>
            <h3 className="text-3xl font-black text-white mb-4">Shivam Panjolia</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Backend & AI systems engineer crafting products where <span className="text-[#a066ff] font-semibold">intelligence meets scale</span>. I design and ship full-stack platforms — from secure verification pipelines and real-time proctoring to distributed storage engines and edge AI runtimes.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Location", value: "Punjab, India 🇮🇳" },
              { label: "Role", value: "Backend · AI · Systems" },
              { label: "Research", value: "ICISESSC 2026 Published" },
              { label: "Languages", value: "Python · C++ · Java · SQL" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="text-[9px] font-mono tracking-[0.2em] text-[#a066ff] uppercase mb-1">{label}</p>
                <p className="text-sm font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-[10px] font-mono tracking-[0.3em] text-slate-400 uppercase mb-3">Core Competencies</p>
            {[
              { skill: "Backend Systems (FastAPI · Django · gRPC)", pct: 92 },
              { skill: "AI / ML (PyTorch · OpenCV · LangChain)", pct: 88 },
              { skill: "DevOps · Cloud (Docker · K8s · OCI)", pct: 80 },
              { skill: "3D / Realtime (Three.js · WebGL · CUDA)", pct: 74 },
            ].map(({ skill, pct }) => (
              <div key={skill} className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-slate-300">{skill}</span>
                  <span className="text-xs text-[#a066ff] font-mono">{pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg,#6b2fff,#a066ff)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-[#a066ff]/30 bg-[#a066ff]/10 p-5 text-center">
            <p className="text-4xl font-black text-[#a066ff]">250+</p>
            <p className="text-xs text-slate-400 font-mono mt-1 tracking-widest uppercase">LeetCode Solved</p>
          </div>
          <div className="rounded-xl border border-[#58d8ff]/30 bg-[#58d8ff]/10 p-5 text-center">
            <p className="text-4xl font-black text-[#58d8ff]">6+</p>
            <p className="text-xs text-slate-400 font-mono mt-1 tracking-widest uppercase">Production Projects</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-[9px] font-mono tracking-[0.25em] text-slate-400 uppercase mb-3">Currently Into</p>
            {["🔭 Deep Learning", "🎮 Voxel Engines", "🛰️ Distributed Sys", "📡 Edge AI"].map(i => (
              <p key={i} className="text-xs text-slate-300 mb-1.5">{i}</p>
            ))}
          </div>
          <div className="flex gap-3">
            <a href="https://github.com/LusmicSam" target="_blank" className="flex-1 text-center text-xs font-bold py-2.5 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors">GitHub</a>
            <a href="https://www.linkedin.com/in/shivam-panjolia" target="_blank" className="flex-1 text-center text-xs font-bold py-2.5 rounded-lg bg-[#0077b5] text-white hover:opacity-90 transition-opacity">LinkedIn</a>
          </div>
        </div>
      </div>
    ),

    blackhole: (
      <div className="flex flex-col items-center gap-8 text-center">
        <div>
          <p className="text-[10px] font-mono tracking-[0.4em] text-[#ff9944] uppercase mb-3">⬤ Event Horizon — Data Extraction</p>
          <h3 className="text-3xl font-black text-white mb-4">Résumé PDF</h3>
          <p className="text-sm text-slate-300 max-w-md leading-relaxed">
            All experience, skills, certifications and impact metrics — distilled into a single document. Pull it from the singularity.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
          {[
            { label: "Experience", value: "3+ yrs" },
            { label: "Certs", value: "OCI × 2" },
            { label: "Published", value: "1 paper" },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg border border-[#ff9944]/30 bg-[#ff9944]/10 p-4 text-center">
              <p className="text-2xl font-black text-[#ff9944]">{value}</p>
              <p className="text-[10px] text-slate-400 font-mono mt-1 tracking-widest uppercase">{label}</p>
            </div>
          ))}
        </div>
        <a
          href="/resume.pdf" download
          className="relative overflow-hidden group px-10 py-4 rounded-full font-black uppercase tracking-[0.25em] text-black text-sm"
          style={{ background: "linear-gradient(135deg,#ff9944,#ff5500)", boxShadow: "0 0 40px rgba(255,85,0,0.5)" }}
        >
          <span className="relative z-10">⬇ Download Résumé</span>
          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
        </a>
        <p className="text-[10px] font-mono text-slate-500 tracking-widest">PDF · Updated March 2025 · English</p>
      </div>
    ),

    radar: (
      <div className="grid md:grid-cols-5 gap-6 text-left w-full">
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="relative rounded-full border border-[#00ff44]/30 bg-[#001a00]/80" style={{ paddingTop: "100%" }}>
            <div className="absolute inset-0 rounded-full overflow-hidden">
              {[25, 50, 75].map((r) => (
                <div key={r} className="absolute rounded-full border border-[#00ff44]/20" style={{ top: `${50 - r / 2}%`, left: `${50 - r / 2}%`, width: `${r}%`, height: `${r}%` }} />
              ))}
              <div className="absolute top-1/2 left-1/2 w-1/2 h-[2px] origin-left -translate-y-1/2"
                style={{ background: "linear-gradient(90deg,#00ff44,transparent)", animation: "spin 3s linear infinite" }} />
              {["GitHub", "LinkedIn", "Email"].map((s, i) => (
                <div key={s} className="absolute w-2.5 h-2.5 rounded-full bg-[#00ff44]"
                  style={{ top: `${20 + i * 28}%`, left: `${25 + i * 20}%`, boxShadow: "0 0 10px #00ff44" }} />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {[
              { label: "Status", value: "ONLINE", color: "#00ff44" },
              { label: "Response", value: "< 24 HRS", color: "#00ff44" },
              { label: "Location", value: "Punjab, IN", color: "#58d8ff" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{label}</span>
                <span className="text-[10px] font-mono font-bold" style={{ color }}>{value}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            {[{ icon: "⬡", href: "https://github.com/LusmicSam", label: "GH" }, { icon: "in", href: "https://www.linkedin.com/in/shivam-panjolia", label: "LI" }, { icon: "@", href: "mailto:shivampanjolia8@gmail.com", label: "EM" }].map(({ icon, href }) => (
              <a key={href} href={href} target="_blank" className="flex-1 flex items-center justify-center h-10 rounded-lg border border-[#00ff44]/30 text-[#00ff44] text-sm font-mono hover:bg-[#00ff44]/10 transition-colors">{icon}</a>
            ))}
          </div>
        </div>
        <div className="md:col-span-3">
          <p className="text-[10px] font-mono tracking-[0.3em] text-[#00ff44] uppercase mb-4">_Transmission Interface</p>
          {formState.sent ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="text-5xl">🛸</div>
              <p className="text-[#00ff44] font-mono font-bold tracking-widest uppercase">Signal transmitted!</p>
              <p className="text-slate-400 text-sm">I'll respond within 24 hours.</p>
              <button onClick={() => setFormState(s => ({ ...s, sent: false }))} className="text-xs font-mono text-slate-500 hover:text-white transition-colors">Send another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-mono tracking-[0.25em] text-[#00ff44]/70 uppercase mb-1.5">Identification</label>
                  <input required value={formState.name} onChange={e => setFormState(s => ({ ...s, name: e.target.value }))}
                    type="text" placeholder="Your name..."
                    className="w-full bg-[#001a00]/80 border border-[#00ff44]/30 rounded-lg px-4 py-3 text-white text-sm font-mono placeholder-slate-600 focus:outline-none focus:border-[#00ff44] transition-colors" />
                </div>
                <div>
                  <label className="block text-[9px] font-mono tracking-[0.25em] text-[#00ff44]/70 uppercase mb-1.5">Comm Frequency</label>
                  <input required value={formState.email} onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
                    type="email" placeholder="your@email.com"
                    className="w-full bg-[#001a00]/80 border border-[#00ff44]/30 rounded-lg px-4 py-3 text-white text-sm font-mono placeholder-slate-600 focus:outline-none focus:border-[#00ff44] transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-mono tracking-[0.25em] text-[#00ff44]/70 uppercase mb-1.5">Transmission</label>
                <textarea required value={formState.message} onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                  rows={5} placeholder="Encode your message here..."
                  className="w-full bg-[#001a00]/80 border border-[#00ff44]/30 rounded-lg px-4 py-3 text-white text-sm font-mono placeholder-slate-600 focus:outline-none focus:border-[#00ff44] transition-colors resize-none" />
              </div>
              <button type="submit"
                className="w-full py-3.5 rounded-lg font-black uppercase tracking-[0.25em] text-sm text-black transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg,#00ff44,#00aa33)", boxShadow: "0 0 30px rgba(0,255,68,0.3)" }}
              >◈ Transmit Signal ◈</button>
            </form>
          )}
        </div>
      </div>
    ),

    moon: (
      <div className="text-center">
        <p className="text-[10px] font-mono tracking-[0.3em] text-[#66aaff] uppercase mb-4">Achievement Unlocked</p>
        <p className="text-lg text-slate-300">{title}</p>
      </div>
    ),
  };

  const accentColors: Record<string, string> = {
    station: "#a066ff", blackhole: "#ff9944", radar: "#00ff44", moon: "#66aaff",
  };
  const accent = accentColors[type] || "#a066ff";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 md:p-10 pointer-events-auto overflow-auto"
      style={{ backdropFilter: "blur(20px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 24 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        className="relative w-full max-w-5xl rounded-3xl p-8 md:p-12 overflow-hidden"
        style={{
          background: "rgba(8,6,18,0.96)",
          border: `1px solid ${accent}30`,
          boxShadow: `0 0 80px ${accent}25, inset 0 0 40px rgba(0,0,0,0.6)`,
        }}
      >
        {/* Glow top edge */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent}80, transparent)` }} />
        {/* Close */}
        <button onClick={onClose} className="absolute right-5 top-5 p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
        {content[type] || content.moon}
      </motion.div>
    </motion.div>
  );
}
