"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { profile, projects, skillClusters } from "@/data/portfolio";

/* ═══════════════════════════════════════════════════════════════
   SIMPLE PORTFOLIO — Single-page, video cards, light/dark mode
   ═══════════════════════════════════════════════════════════════ */

export function SimplePortfolio({ onExit }: { onExit: () => void }) {
  const [dark, setDark] = useState(true);
  const [formState, setFormState] = useState({
    name: "", email: "", message: "", sent: false, sending: false, error: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState(s => ({ ...s, sending: true, error: false }));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formState.name, email: formState.email, message: formState.message }),
      });
      if (res.ok) setFormState({ name: "", email: "", message: "", sent: true, sending: false, error: false });
      else setFormState(s => ({ ...s, sending: false, error: true }));
    } catch { setFormState(s => ({ ...s, sending: false, error: true })); }
  };

  /* ── theme tokens ─────────────────────────────────────────── */
  const t = dark ? {
    bg: "#08060f", surface: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)",
    text: "#ffffff", muted: "rgba(255,255,255,0.5)", faint: "rgba(255,255,255,0.2)",
    nav: "rgba(8,6,15,0.85)", card: "rgba(255,255,255,0.03)",
    input: "rgba(255,255,255,0.05)", inputBorder: "rgba(255,255,255,0.12)",
    scrollbar: "#a066ff33",
  } : {
    bg: "#f8f7ff", surface: "rgba(0,0,0,0.04)", border: "rgba(0,0,0,0.1)",
    text: "#0a0715", muted: "rgba(10,7,21,0.5)", faint: "rgba(10,7,21,0.2)",
    nav: "rgba(248,247,255,0.9)", card: "rgba(0,0,0,0.02)",
    input: "rgba(0,0,0,0.04)", inputBorder: "rgba(0,0,0,0.12)",
    scrollbar: "#a066ff55",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[9000] overflow-hidden"
      style={{ background: t.bg, fontFamily: "'Inter', system-ui, sans-serif", transition: "background 0.3s" }}
    >
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-8%] w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(160,102,255,0.10) 0%, transparent 70%)", transition: "all 0.3s" }} />
        <div className="absolute bottom-[-15%] right-[-8%] w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(88,216,255,0.07) 0%, transparent 70%)" }} />
        <div className="absolute top-[40%] right-[15%] w-[350px] h-[350px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(61,255,153,0.05) 0%, transparent 70%)" }} />
      </div>

      {/* ── NAV ──────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-10 h-14"
        style={{ background: t.nav, backdropFilter: "blur(20px)", borderBottom: `1px solid ${t.border}`, transition: "all 0.3s" }}>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black text-white"
            style={{ background: "linear-gradient(135deg, #a066ff, #58d8ff)" }}>SP</div>
          <span className="font-bold text-sm" style={{ color: t.text }}>Shivam Panjolia</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Dark/Light toggle */}
          <button onClick={() => setDark(d => !d)}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
            style={{ background: t.surface, border: `1px solid ${t.border}` }}
            title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <span className="text-base">{dark ? "☀️" : "🌑"}</span>
          </button>

          <button onClick={onExit}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-[11px] font-mono uppercase tracking-wider transition-all hover:scale-105"
            style={{ borderColor: "rgba(160,102,255,0.5)", color: "#a066ff", background: "rgba(160,102,255,0.08)" }}>
            <span>✦</span>
            <span className="hidden md:inline">Explore 3D</span>
          </button>
        </div>
      </nav>

      {/* ── SCROLLABLE CONTENT ───────────────────────────────── */}
      <div className="h-full overflow-y-auto pt-14"
        style={{ scrollbarWidth: "thin", scrollbarColor: `${t.scrollbar} transparent` }}>

        <HeroSection t={t} />
        <ProjectsSection t={t} dark={dark} />
        <SkillsSection t={t} />
        <ContactSection t={t} formState={formState} setFormState={setFormState} handleSubmit={handleSubmit} />

        {/* Footer */}
        <footer className="text-center py-10 border-t" style={{ borderColor: t.border }}>
          <p className="font-mono text-[11px]" style={{ color: t.muted }}>
            Made with <span style={{ color: "#a066ff" }}>✦</span> by Shivam Panjolia &nbsp;·&nbsp; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </motion.div>
  );
}

/* ── HERO ────────────────────────────────────────────────────── */
function HeroSection({ t }: { t: ReturnType<typeof makeTheme> }) {
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-28">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-14">
        {/* Text */}
        <div className="flex-1 order-2 md:order-1">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="font-mono text-[10px] tracking-[0.5em] uppercase mb-4"
            style={{ color: "#a066ff" }}>
            Backend · AI · Systems Engineer
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-black leading-[0.9] mb-6"
            style={{ fontSize: "clamp(3rem,7vw,5.5rem)", color: t.text, letterSpacing: "-0.03em" }}>
            Shivam
            <br />
            <span style={{ background: "linear-gradient(135deg, #a066ff, #58d8ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Panjolia
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-base leading-relaxed mb-8 max-w-lg"
            style={{ color: t.muted }}>
            {profile.subheadline}
          </motion.p>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="flex flex-wrap gap-3 mb-8">
            {[
              { label: "LeetCode", value: "250+", color: "#a066ff" },
              { label: "Projects", value: "6+", color: "#58d8ff" },
              { label: "Certifications", value: "3 + 30+", color: "#ff8c6b" },
              { label: "Paper", value: "Published", color: "#3dff99" },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-full px-4 py-1.5 border"
                style={{ borderColor: color + "40", background: color + "0f" }}>
                <span className="font-mono text-[9px] tracking-widest uppercase mr-1" style={{ color: t.muted }}>{label}</span>
                <span className="font-black text-sm" style={{ color }}>{value}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Links */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3">
            <a href={profile.github} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-bold transition-all hover:scale-105"
              style={{ borderColor: t.border, color: t.text, background: t.surface }}>
              ⬡ GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-bold transition-all hover:scale-105"
              style={{ borderColor: "#0ea5e940", color: "#0ea5e9", background: "#0ea5e908" }}>
              in LinkedIn
            </a>
            <a href="/CVG.docx" download
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black text-white transition-all hover:scale-105 hover:brightness-110"
              style={{ background: "linear-gradient(135deg, #a066ff, #58d8ff)" }}>
              ⬇ Download CV
            </a>
          </motion.div>
        </div>

        {/* Avatar */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}
          className="order-1 md:order-2 flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl"
              style={{ background: "linear-gradient(135deg, #a066ff40, #58d8ff20)", filter: "blur(20px)", transform: "scale(1.1)" }} />
            <div className="relative w-44 h-44 md:w-52 md:h-52 rounded-3xl overflow-hidden"
              style={{ border: "2px solid rgba(160,102,255,0.4)" }}>
              <img src="/profile.png" alt="Shivam Panjolia" className="w-full h-full object-cover" style={{ objectPosition: "top center" }} />
            </div>
            <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-black text-white"
              style={{ background: "linear-gradient(135deg, #a066ff, #58d8ff)" }}>✦</div>
          </div>
        </motion.div>
      </div>

      {/* Philosophy card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="mt-16 p-6 rounded-3xl border max-w-3xl"
        style={{ background: "rgba(160,102,255,0.06)", borderColor: "rgba(160,102,255,0.2)" }}>
        <p className="text-[10px] font-mono tracking-[0.4em] uppercase mb-2" style={{ color: "#a066ff" }}>Philosophy</p>
        <p className="font-black text-xl italic mb-2" style={{ color: t.text }}>&ldquo;{profile.headline}&rdquo;</p>
        <p className="text-sm leading-relaxed" style={{ color: t.muted }}>{profile.subheadline}</p>
      </motion.div>
    </section>
  );
}

/* ── PROJECTS ────────────────────────────────────────────────── */
function ProjectsSection({ t, dark }: { t: ReturnType<typeof makeTheme>; dark: boolean }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [selected, setSelected] = useState<typeof projects[0] | null>(null);

  return (
    <section ref={ref} className="max-w-6xl mx-auto px-6 md:px-12 py-16">
      <SectionHeader label="Selected Work" title="Projects" t={t} />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
        {projects.map((p, i) => (
          <motion.div key={p.slug}
            initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.07, duration: 0.45 }}>
            <ProjectCard p={p} t={t} dark={dark} onClick={() => setSelected(p)} />
          </motion.div>
        ))}
      </div>

      {/* Project detail modal */}
      <AnimatePresence>
        {selected && (
          <ProjectModal p={selected} t={t} dark={dark} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

function ProjectCard({ p, t, dark, onClick }: {
  p: typeof projects[0]; t: ReturnType<typeof makeTheme>; dark: boolean; onClick: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);
  const hasVideo = p.media?.type === "video";
  const hasImage = p.media?.type === "image";

  const handleEnter = () => {
    setHovered(true);
    if (videoRef.current && hasVideo) {
      videoRef.current.play().catch(() => {});
    }
  };
  const handleLeave = () => {
    setHovered(false);
    if (videoRef.current && hasVideo) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div onClick={onClick} onMouseEnter={handleEnter} onMouseLeave={handleLeave}
      className="group relative rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden"
      style={{
        background: t.card,
        borderColor: hovered ? p.planetColor + "60" : t.border,
        boxShadow: hovered ? `0 8px 40px ${p.planetColor}20` : "none",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}>

      {/* Media preview */}
      <div className="relative aspect-video bg-black/50 overflow-hidden"
        style={{ borderBottom: `1px solid ${t.border}` }}>
        {hasVideo && (
          <video ref={videoRef} src={p.media!.url} muted loop playsInline preload="none"
            className="w-full h-full object-cover transition-opacity duration-300"
            style={{ opacity: hovered ? 1 : 0.7 }} />
        )}
        {hasImage && (
          <img src={p.media!.url} alt={p.title}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: hovered ? "scale(1.05)" : "scale(1)" }} />
        )}
        {!p.media && (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: p.planetColor + "10" }}>
            <div className="text-4xl font-black opacity-20" style={{ color: p.planetColor }}>
              {p.title[0]}
            </div>
          </div>
        )}

        {/* Play indicator for videos */}
        {hasVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                background: hovered ? p.planetColor : "rgba(0,0,0,0.5)",
                opacity: hovered ? 0 : 1,
              }}>
              <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[10px] border-l-white ml-1" />
            </div>
          </div>
        )}

        {/* Year badge */}
        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-mono"
          style={{ background: "rgba(0,0,0,0.6)", color: "rgba(255,255,255,0.7)" }}>
          {p.year}
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.planetColor, boxShadow: `0 0 8px ${p.planetColor}` }} />
          <h3 className="font-black text-sm leading-tight" style={{ color: t.text }}>{p.title}</h3>
        </div>
        <p className="text-xs leading-relaxed mb-3" style={{ color: t.muted }}>{p.tagline}</p>
        <div className="flex flex-wrap gap-1.5">
          {p.stack.slice(0, 4).map(s => (
            <span key={s} className="px-2 py-0.5 rounded-full text-[9px] font-mono"
              style={{ color: p.planetColor, background: p.planetColor + "15", border: `1px solid ${p.planetColor}30` }}>
              {s}
            </span>
          ))}
          {p.stack.length > 4 && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono" style={{ color: t.muted }}>
              +{p.stack.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Hover CTA */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200"
        style={{ opacity: hovered ? 1 : 0, background: "rgba(0,0,0,0.02)" }}>
        <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold"
          style={{ background: p.planetColor, color: "#000" }}>
          View Details →
        </div>
      </div>
    </div>
  );
}

function ProjectModal({ p, t, dark, onClose }: {
  p: typeof projects[0]; t: ReturnType<typeof makeTheme>; dark: boolean; onClose: () => void;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(20px)" }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-3xl rounded-3xl overflow-hidden"
        style={{ background: dark ? "rgba(8,6,15,0.98)" : "#fff", border: `1px solid ${p.planetColor}40`, boxShadow: `0 0 80px ${p.planetColor}20` }}>

        {/* Video / Image header */}
        {p.media && (
          <div className="aspect-video relative overflow-hidden">
            {p.media.type === "video" ? (
              <video src={p.media.url} autoPlay loop muted playsInline
                className="w-full h-full object-cover" />
            ) : (
              <img src={p.media.url} alt={p.title} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.8))" }} />
            <div className="absolute bottom-4 left-5">
              <p className="font-mono text-[9px] uppercase tracking-widest text-white/50 mb-0.5">{p.year}</p>
              <h3 className="text-2xl font-black text-white">{p.title}</h3>
            </div>
            <button onClick={onClose}
              className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: "rgba(0,0,0,0.6)", color: "white" }}>✕</button>
          </div>
        )}

        <div className="p-6 max-h-[60vh] overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
          {!p.media && (
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: p.planetColor }}>{p.year}</p>
                <h3 className="text-2xl font-black" style={{ color: t.text }}>{p.title}</h3>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl transition-all hover:bg-white/10" style={{ color: t.muted }}>✕</button>
            </div>
          )}

          <p className="text-sm mb-5 italic" style={{ color: t.muted }}>{p.tagline}</p>

          <div className="space-y-4 mb-5">
            {[
              { label: "Problem", text: p.problem },
              { label: "Solution", text: p.build },
              { label: "Impact", text: p.impact },
            ].map(({ label, text }) => (
              <div key={label}>
                <p className="text-[10px] font-mono tracking-[0.3em] uppercase mb-1 border-l-2 pl-2"
                  style={{ color: p.planetColor, borderColor: p.planetColor }}>{label}</p>
                <p className="text-sm leading-relaxed" style={{ color: t.muted }}>{text}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {p.stack.map(s => (
              <span key={s} className="px-3 py-1 rounded-full text-[10px] font-mono border"
                style={{ borderColor: p.planetColor + "40", color: p.planetColor, background: p.planetColor + "0f" }}>
                {s}
              </span>
            ))}
          </div>

          <div className="flex gap-3">
            {p.links.demo && (
              <a href={p.links.demo} target="_blank"
                className="flex-1 flex justify-center items-center h-11 rounded-xl text-xs font-black uppercase tracking-widest text-black hover:brightness-110 transition-all"
                style={{ background: p.planetColor }}>▶ Live Demo</a>
            )}
            {p.links.repo && (
              <a href={p.links.repo} target="_blank"
                className="flex-1 flex justify-center items-center h-11 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all hover:bg-white/5"
                style={{ borderColor: t.border, color: t.text }}>⬡ GitHub</a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── SKILLS ──────────────────────────────────────────────────── */
const COMPETENCIES = [
  { skill: "Backend Systems (FastAPI · Django · gRPC)", pct: 92, color: "#a066ff" },
  { skill: "AI / ML (PyTorch · OpenCV · LangChain)", pct: 88, color: "#58d8ff" },
  { skill: "DevOps · Cloud (Docker · K8s · OCI)", pct: 80, color: "#ff8c6b" },
  { skill: "3D / Realtime (Three.js · WebGL · CUDA)", pct: 74, color: "#3dff99" },
  { skill: "Blockchain / Web3 (IPFS · Ethereum)", pct: 70, color: "#ff66aa" },
];

function SkillsSection({ t }: { t: ReturnType<typeof makeTheme> }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="max-w-6xl mx-auto px-6 md:px-12 py-16">
      <SectionHeader label="Expertise" title="Skills" t={t} />

      <div className="grid md:grid-cols-2 gap-10 mt-10">
        {/* Bars */}
        <div className="space-y-5">
          <p className="text-[10px] font-mono tracking-[0.4em] uppercase" style={{ color: t.muted }}>Core Competencies</p>
          {COMPETENCIES.map(({ skill, pct, color }, i) => (
            <div key={skill}>
              <div className="flex justify-between mb-1.5">
                <span className="text-sm" style={{ color: t.text }}>{skill}</span>
                <span className="text-xs font-mono font-bold" style={{ color }}>{pct}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: t.border }}>
                <motion.div className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${pct}%` } : { width: 0 }}
                  transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Cluster cards */}
        <div className="space-y-4">
          <p className="text-[10px] font-mono tracking-[0.4em] uppercase" style={{ color: t.muted }}>Skill Clusters</p>
          {skillClusters.map((cl, i) => (
            <motion.div key={cl.title}
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-2xl border"
              style={{ background: cl.planetColor + "07", borderColor: cl.planetColor + "25" }}>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-2 h-2 rounded-full" style={{ background: cl.planetColor }} />
                <p className="text-xs font-bold" style={{ color: cl.planetColor }}>{cl.title}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cl.skills.slice(0, 8).map(s => (
                  <span key={s} className="px-2 py-0.5 rounded text-[10px] font-mono"
                    style={{ background: cl.planetColor + "15", color: cl.planetColor }}>
                    {s}
                  </span>
                ))}
                {cl.skills.length > 8 && (
                  <span className="px-2 py-0.5 text-[10px] font-mono" style={{ color: t.muted }}>
                    +{cl.skills.length - 8} more
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CONTACT ─────────────────────────────────────────────────── */
function ContactSection({ t, formState, setFormState, handleSubmit }: {
  t: ReturnType<typeof makeTheme>;
  formState: { name: string; email: string; message: string; sent: boolean; sending: boolean; error: boolean };
  setFormState: React.Dispatch<React.SetStateAction<typeof formState>>;
  handleSubmit: (e: React.FormEvent) => void;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="max-w-6xl mx-auto px-6 md:px-12 py-16">
      <SectionHeader label="Get In Touch" title="Contact" t={t} />

      <div className="grid md:grid-cols-5 gap-10 mt-10">
        {/* Links */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          className="md:col-span-2 space-y-3">
          {[
            { icon: "⬡", label: "GitHub", value: "@LusmicSam", href: profile.github, color: "#ffffff" },
            { icon: "in", label: "LinkedIn", value: "shivam-panjolia", href: profile.linkedin, color: "#0ea5e9" },
            { icon: "@", label: "Email", value: profile.email, href: `mailto:${profile.email}`, color: "#a066ff" },
            { icon: "📞", label: "Phone", value: profile.phone, href: `tel:${profile.phone}`, color: "#3dff99" },
          ].map(({ icon, label, value, href, color }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-2xl border transition-all hover:scale-[1.02]"
              style={{ background: t.card, borderColor: t.border }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = color + "50")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = t.border)}>
              <span className="text-lg w-8 text-center font-bold" style={{ color }}>{icon}</span>
              <div className="min-w-0">
                <p className="text-xs font-bold" style={{ color: t.text }}>{label}</p>
                <p className="text-[10px] font-mono truncate" style={{ color: t.muted }}>{value}</p>
              </div>
            </a>
          ))}
          <a href="/CVG.docx" download
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest text-white hover:brightness-110 transition-all"
            style={{ background: "linear-gradient(135deg, #a066ff, #58d8ff)" }}>
            ⬇ Download CV
          </a>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.1 }} className="md:col-span-3">
          {formState.sent ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
              <div className="text-5xl">🛸</div>
              <p className="font-mono font-bold tracking-widest uppercase" style={{ color: "#3dff99" }}>Message Sent!</p>
              <button onClick={() => setFormState(s => ({ ...s, sent: false }))}
                className="text-xs font-mono transition-all hover:opacity-80" style={{ color: t.muted }}>
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {(["name", "email"] as const).map(field => (
                  <div key={field}>
                    <label className="text-[10px] font-mono tracking-widest uppercase block mb-1.5" style={{ color: t.muted }}>
                      {field}
                    </label>
                    <input required
                      value={formState[field]}
                      onChange={e => setFormState(s => ({ ...s, [field]: e.target.value }))}
                      type={field === "email" ? "email" : "text"}
                      placeholder={field === "email" ? "your@email.com" : "Your name"}
                      className="w-full px-4 py-3 rounded-xl border text-sm font-mono placeholder-opacity-30 outline-none transition-all"
                      style={{
                        background: t.input, borderColor: t.inputBorder,
                        color: t.text, caretColor: "#a066ff",
                      }}
                      onFocus={e => (e.currentTarget.style.borderColor = "#a066ff60")}
                      onBlur={e => (e.currentTarget.style.borderColor = t.inputBorder)} />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-[10px] font-mono tracking-widest uppercase block mb-1.5" style={{ color: t.muted }}>
                  Message
                </label>
                <textarea required rows={6}
                  value={formState.message}
                  onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                  placeholder="What's on your mind?"
                  className="w-full px-4 py-3 rounded-xl border text-sm font-mono resize-none outline-none transition-all"
                  style={{ background: t.input, borderColor: t.inputBorder, color: t.text, caretColor: "#a066ff" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#a066ff60")}
                  onBlur={e => (e.currentTarget.style.borderColor = t.inputBorder)}
                  disabled={formState.sending} />
              </div>
              {formState.error && (
                <p className="text-[10px] font-mono tracking-widest uppercase" style={{ color: "#ff4444" }}>
                  Failed to send. Try again.
                </p>
              )}
              <button type="submit" disabled={formState.sending}
                className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all hover:brightness-110"
                style={{
                  background: formState.sending ? "#444" : "linear-gradient(135deg, #a066ff, #58d8ff)",
                  cursor: formState.sending ? "wait" : "pointer",
                }}>
                {formState.sending ? "Sending..." : "Send Message →"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/* ── SHARED HELPERS ───────────────────────────────────────────── */
function SectionHeader({ label, title, t }: { label: string; title: string; t: ReturnType<typeof makeTheme> }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref}>
      <motion.p initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        className="font-mono text-[10px] tracking-[0.5em] uppercase mb-2" style={{ color: "#a066ff" }}>
        {label}
      </motion.p>
      <motion.h2 initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.05 }} className="text-4xl md:text-5xl font-black" style={{ color: t.text }}>
        {title}<span style={{ color: "#a066ff" }}>.</span>
      </motion.h2>
    </div>
  );
}

/* tiny helper so TypeScript is happy with the `t` type */
function makeTheme() {
  return {
    bg: "", surface: "", border: "", text: "", muted: "", faint: "",
    nav: "", card: "", input: "", inputBorder: "", scrollbar: "",
  };
}
