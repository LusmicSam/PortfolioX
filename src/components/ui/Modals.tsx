"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Project, profile } from "@/data/portfolio";

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
        <div 
          className="absolute top-0 left-0 right-0 h-[2px]" 
          style={{ background: `linear-gradient(90deg, transparent, ${p.planetColor}, transparent)` }} 
        />
        
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

              <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-0 opacity-[0.05] z-20 pointer-events-none" style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
              
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

/* ─────────────────────────────────────────────────────────────────────────
   STATION ABOUT PANEL — multi-page About Me shown when docking space station
   ───────────────────────────────────────────────────────────────────────── */
const STATION_TABS = ["Identity", "Personality", "Skills", "Beyond Code", "Connect"] as const;
type StationTab = (typeof STATION_TABS)[number];

function StationAboutPanel() {
  const [tab, setTab] = useState<StationTab>("Identity");

  const competencies = [
    { skill: "Backend Systems (FastAPI · Django · gRPC)", pct: 92 },
    { skill: "AI / ML (PyTorch · OpenCV · LangChain)", pct: 88 },
    { skill: "DevOps · Cloud (Docker · K8s · OCI)", pct: 80 },
    { skill: "3D / Realtime (Three.js · WebGL · CUDA)", pct: 74 },
    { skill: "Blockchain / Web3 (IPFS · Ethereum · FastAPI)", pct: 70 },
  ];

  return (
    <div className="w-full text-left">
      <div className="flex items-center gap-4 mb-6">
        <div
          className="w-14 h-14 flex-shrink-0 rounded-2xl flex items-center justify-center text-xl font-black"
          style={{ background: "radial-gradient(circle at 35% 35%, #c084fc, #6b21a8)", boxShadow: "0 0 30px rgba(160,102,255,0.4)" }}
        >
          SP
        </div>
        <div>
          <p className="text-[9px] font-mono tracking-[0.4em] text-purple-400/70 uppercase">SYS://ORBITAL-STATION // GAMMA-01</p>
          <h2 className="text-2xl font-black text-white">{profile.name}</h2>
          <p className="text-xs font-mono text-purple-300/80">{profile.role} · {profile.location}</p>
        </div>
      </div>

      <div className="flex gap-1 mb-6 bg-white/5 rounded-xl p-1">
        {STATION_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 text-[10px] font-mono tracking-wider uppercase py-2 rounded-lg transition-all"
            style={
              tab === t
                ? { background: "rgba(160,102,255,0.25)", color: "#c084fc", border: "1px solid rgba(160,102,255,0.4)" }
                : { color: "rgba(255,255,255,0.35)", border: "1px solid transparent" }
            }
          >
            {t}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="overflow-y-auto pr-1"
          style={{ maxHeight: "380px" }}
        >
          {tab === "Identity" && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl relative overflow-hidden" style={{ background: "rgba(160,102,255,0.07)", border: "1px solid rgba(160,102,255,0.2)" }}>
                <span className="absolute top-3 right-4 text-4xl opacity-10">🔭</span>
                <p className="text-[9px] font-mono tracking-[0.4em] text-purple-400/60 uppercase mb-1">Core Philosophy</p>
                <p className="text-sm font-black text-white italic mb-2">&ldquo;In a sea of &lsquo;how&rsquo;, I am the one asking the &lsquo;Deep Why&rsquo;.&rdquo;</p>
                <p className="text-xs text-white/60 leading-relaxed">{profile.subheadline}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Location", value: "Punjab, India 🇮🇳" },
                  { label: "Status", value: "Open to Collaboration" },
                  { label: "Research", value: "ICISESSC 2026 · Published" },
                  { label: "Education", value: "B.Tech CS · LPU 2027" },
                ].map(({ label, value }) => (
                  <div key={label} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <p className="text-[8px] font-mono tracking-[0.3em] text-purple-400/60 uppercase mb-1">{label}</p>
                    <p className="text-xs font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[{ val: "250+", label: "LeetCode" }, { val: "20+", label: "Certifications" }, { val: "6+", label: "Prod Projects" }].map(({ val, label }) => (
                  <div key={label} className="text-center p-4 rounded-2xl" style={{ background: "rgba(160,102,255,0.08)", border: "1px solid rgba(160,102,255,0.2)" }}>
                    <p className="text-2xl font-black text-purple-300">{val}</p>
                    <p className="text-[9px] font-mono text-white/40 mt-1 uppercase tracking-widest">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "Personality" && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl" style={{ background: "rgba(160,102,255,0.08)", border: "1px solid rgba(160,102,255,0.25)" }}>
                <p className="text-[9px] font-mono tracking-[0.4em] text-purple-400/60 uppercase mb-2">MBTI Type</p>
                <div className="flex items-baseline gap-3 mb-3">
                  <p className="text-4xl font-black text-purple-300">{profile.mbti}</p>
                  <p className="text-xs text-white/50 font-mono">The Logician</p>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">{profile.mbtiDesc}</p>
              </div>
              <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="text-sm text-white/75 leading-relaxed">{profile.personality}</p>
              </div>
            </div>
          )}

          {tab === "Skills" && (
            <div className="space-y-5">
              <div className="space-y-3">
                {competencies.map(({ skill, pct }) => (
                  <div key={skill}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-white/70">{skill}</span>
                      <span className="text-xs text-purple-400 font-mono">{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <motion.div className="h-full bg-purple-500" initial={{ width: 0 }} animate={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {profile.softSkills.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">{s}</span>
                ))}
              </div>
            </div>
          )}

          {tab === "Beyond Code" && (
            <div className="grid grid-cols-2 gap-4">
              {profile.hobbies.map((h) => (
                <div key={h.name} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{h.icon}</span>
                    <p className="text-sm font-bold text-white">{h.name}</p>
                  </div>
                  <p className="text-[11px] text-white/50 leading-relaxed">{h.desc}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "Connect" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "⬡", label: "GitHub", sub: "@LusmicSam", href: profile.github, color: "#ffffff" },
                  { icon: "in", label: "LinkedIn", sub: "shivam-panjolia", href: profile.linkedin, color: "#0ea5e9" },
                  { icon: "@", label: "Email", sub: profile.email, href: `mailto:${profile.email}`, color: "#a066ff" },
                  { icon: "📞", label: "Phone", sub: profile.phone, href: `tel:${profile.phone}`, color: "#3dff99" },
                ].map(({ icon, label, sub, href, color }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/40 transition-all">
                    <span className="text-lg w-8 text-center" style={{ color }}>{icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white">{label}</p>
                      <p className="text-[10px] text-white/40 font-mono truncate">{sub}</p>
                    </div>
                  </a>
                ))}
              </div>
              <a href="/CVG.pdf" download className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-black bg-purple-500 hover:bg-purple-400 transition-all">
                <span>⬇</span> Download Résumé · PDF
              </a>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function ArchitecturalModal({ title, type, onClose }: { title: string; type: string; onClose: () => void }) {
  const [formState, setFormState] = useState({ name: "", email: "", message: "", sent: false, error: false, sending: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState(s => ({ ...s, sending: true, error: false }));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formState.name, email: formState.email, message: formState.message }),
      });
      if (res.ok) {
        setFormState({ name: "", email: "", message: "", sent: true, sending: false, error: false });
      } else {
        setFormState(s => ({ ...s, sending: false, error: true }));
      }
    } catch {
      setFormState(s => ({ ...s, sending: false, error: true }));
    }
  };

  const content: Record<string, React.ReactNode> = {
    station: <StationAboutPanel />,

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
          href="/CVG.pdf" download
          className="relative overflow-hidden group px-10 py-4 rounded-full font-black uppercase tracking-[0.25em] text-black text-sm"
          style={{ background: "linear-gradient(135deg,#ff9944,#ff5500)", boxShadow: "0 0 40px rgba(255,85,0,0.5)" }}
        >
          <span className="relative z-10">⬇ Download Résumé</span>
          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
        </a>
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
        </div>
        <div className="md:col-span-3">
          <p className="text-[10px] font-mono tracking-[0.3em] text-[#00ff44] uppercase mb-4">_Transmission Interface</p>
          {formState.sent ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="text-5xl">🛸</div>
              <p className="text-[#00ff44] font-mono font-bold tracking-widest uppercase">Signal transmitted!</p>
              <button onClick={() => setFormState(s => ({ ...s, sent: false }))} className="text-xs font-mono text-slate-500 hover:text-white transition-colors">Send another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required value={formState.name} onChange={e => setFormState(s => ({ ...s, name: e.target.value }))} type="text" placeholder="Name" className="bg-black/50 border border-white/10 p-3 rounded-lg text-white font-mono text-xs" />
                <input required value={formState.email} onChange={e => setFormState(s => ({ ...s, email: e.target.value }))} type="email" placeholder="Email" className="bg-black/50 border border-white/10 p-3 rounded-lg text-white font-mono text-xs" />
              </div>
              <textarea required value={formState.message} onChange={e => setFormState(s => ({ ...s, message: e.target.value }))} rows={4} placeholder="Message" className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-white font-mono text-xs resize-none" disabled={formState.sending} />
              {formState.error && <p className="text-[10px] text-red-500 font-mono tracking-widest uppercase">Transmission failed. Retry.</p>}
              <button type="submit" disabled={formState.sending} className="w-full py-3 rounded-lg font-black uppercase tracking-widest text-xs text-black transition-all" style={{ backgroundColor: formState.sending ? '#007722' : '#00ff44', cursor: formState.sending ? 'wait' : 'pointer', filter: formState.sending ? 'brightness(0.7)' : 'none' }}>
                {formState.sending ? 'Transmitting...' : 'Transmit Signal'}
              </button>
            </form>
          )}
        </div>
      </div>
    ),

    moon: (
      <div className="text-center p-8">
        <p className="text-[10px] font-mono tracking-[0.3em] text-[#66aaff] uppercase mb-4">Achievement Unlocked</p>
        <h3 className="text-2xl font-black text-white">{title}</h3>
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
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent}80, transparent)` }} />
        <button onClick={onClose} className="absolute right-5 top-5 p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
        {content[type] || content.moon}
      </motion.div>
    </motion.div>
  );
}
