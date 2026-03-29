"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { profile, skillClusters, projects, milestones } from "@/data/portfolio";

/* ================================================================
   FULL PORTFOLIO PANEL — renders when clicking the Sun
   A complete portrait of Shivam: About · Skills · Projects
   Timeline · Contact — all inside a sleek space-themed modal.
   ================================================================ */

const TABS = ["About", "Skills", "Projects", "Timeline", "Contact"] as const;
type Tab = (typeof TABS)[number];

const SKILL_COLORS = ["#58d8ff", "#a066ff", "#ff8c6b", "#3dff99"];
const MILESTONE_COLORS: Record<string, string> = {
  research: "#a066ff",
  certification: "#58d8ff",
  career: "#3dff99",
  leadership: "#ff8c6b",
};

/* ── Tiny sub-components ─────────────────────────────────────── */
function Pill({
  label,
  color = "rgba(255,255,255,0.08)",
  textColor = "rgba(255,255,255,0.6)",
  border = "rgba(255,255,255,0.12)",
}: {
  label: string;
  color?: string;
  textColor?: string;
  border?: string;
}) {
  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-[9px] font-mono whitespace-nowrap"
      style={{ background: color, color: textColor, border: `1px solid ${border}` }}
    >
      {label}
    </span>
  );
}

/* ── ABOUT TAB ──────────────────────────────────────────────── */
function AboutTab() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="flex items-start gap-5">
        <div className="relative flex-shrink-0">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black"
            style={{
              background: "radial-gradient(circle at 35% 35%, #ffdd88, #ff8830)",
              boxShadow: "0 0 40px rgba(255,160,50,0.35)",
            }}
          >
            SP
          </div>
        </div>
        <div>
          <p className="text-[9px] font-mono tracking-[0.5em] text-orange-400/70 uppercase mb-0.5">
            SYS://STELLAR-PROFILE
          </p>
          <h1 className="text-2xl font-black text-white">{profile.name}</h1>
          <p className="text-sm font-mono text-orange-300/80 mt-0.5">{profile.role}</p>
          <p className="text-xs text-white/40 mt-0.5">📍 {profile.location}</p>
          <div className="flex gap-3 mt-3">
            <a href={profile.github} target="_blank" rel="noopener noreferrer"
              className="text-[9px] font-mono text-white/50 hover:text-white transition-colors">
              ⬡ GitHub ↗
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
              className="text-[9px] font-mono text-blue-400/70 hover:text-blue-300 transition-colors">
              ⬡ LinkedIn ↗
            </a>
            <a href={`mailto:${profile.email}`}
              className="text-[9px] font-mono text-white/50 hover:text-white transition-colors">
              ⬡ Email ↗
            </a>
          </div>
        </div>
      </div>

      {/* Headline */}
      <div
        className="p-4 rounded-2xl"
        style={{ background: "rgba(255,160,70,0.06)", border: "1px solid rgba(255,160,70,0.15)" }}
      >
        <p className="text-sm text-white/90 leading-relaxed font-medium">{profile.headline}</p>
        <p className="text-xs text-white/50 leading-relaxed mt-1">{profile.subheadline}</p>
      </div>

      {/* Education */}
      <div>
        <p className="text-[9px] font-mono tracking-[0.4em] text-white/30 uppercase mb-3">Education</p>
        {profile.education.map((e) => (
          <div key={e.institution} className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400/60 mt-1.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">{e.institution}</p>
              <p className="text-xs text-white/50">{(e as { degree?: string }).degree} &nbsp;·&nbsp; {e.period}</p>
            </div>
          </div>
        ))}
      </div>

      {/* MBTI + Personality */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className="p-4 rounded-2xl"
          style={{ background: "rgba(160,102,255,0.07)", border: "1px solid rgba(160,102,255,0.2)" }}
        >
          <p className="text-[9px] font-mono tracking-[0.4em] text-purple-400/70 uppercase mb-2">MBTI</p>
          <p className="text-2xl font-black text-purple-300" style={{ textShadow: "0 0 20px rgba(160,102,255,0.5)" }}>
            {profile.mbti}
          </p>
          <p className="text-[10px] text-white/40 mt-1 leading-relaxed">{profile.mbtiDesc}</p>
        </div>
        <div
          className="p-4 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-[9px] font-mono tracking-[0.4em] text-white/30 uppercase mb-2">Communication</p>
          <p className="text-[10px] text-white/60 leading-relaxed">{profile.communication}</p>
        </div>
      </div>

      {/* Personality */}
      <div>
        <p className="text-[9px] font-mono tracking-[0.4em] text-white/30 uppercase mb-2">Personality</p>
        <p className="text-xs text-white/60 leading-relaxed">{profile.personality}</p>
      </div>

      {/* Soft Skills */}
      <div>
        <p className="text-[9px] font-mono tracking-[0.4em] text-white/30 uppercase mb-2">Soft Skills</p>
        <div className="flex flex-wrap gap-1.5">
          {profile.softSkills.map((s) => (
            <Pill key={s} label={s} color="rgba(255,160,70,0.08)" textColor="#ffcc88" border="rgba(255,160,70,0.2)" />
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div>
        <p className="text-[9px] font-mono tracking-[0.4em] text-white/30 uppercase mb-2">Key Highlights</p>
        <div className="flex flex-wrap gap-1.5">
          {profile.highlights.map((h) => (
            <Pill key={h} label={h} />
          ))}
        </div>
      </div>

      {/* Hobbies */}
      <div>
        <p className="text-[9px] font-mono tracking-[0.4em] text-white/30 uppercase mb-3">Beyond The Code</p>
        <div className="grid grid-cols-2 gap-3">
          {profile.hobbies.map((h) => (
            <div
              key={h.name}
              className="p-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">{h.icon}</span>
                <p className="text-xs font-semibold text-white">{h.name}</p>
              </div>
              <p className="text-[10px] text-white/45 leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── SKILLS TAB ─────────────────────────────────────────────── */
function SkillsTab() {
  return (
    <div className="space-y-6">
      {skillClusters.map((cluster, i) => {
        const color = SKILL_COLORS[i];
        return (
          <div key={cluster.title}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
              <p className="text-xs font-bold font-mono" style={{ color }}>{cluster.title}</p>
              <span className="text-[9px] font-mono text-white/20 ml-auto">{cluster.skills.length} skills</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {cluster.skills.map((s) => (
                <Pill
                  key={s}
                  label={s}
                  color={`${color}10`}
                  textColor="rgba(255,255,255,0.75)"
                  border={`${color}35`}
                />
              ))}
            </div>
            {i < skillClusters.length - 1 && (
              <div className="mt-6 h-px bg-white/5" />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── PROJECTS TAB ───────────────────────────────────────────── */
function ProjectsTab() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="space-y-3">
      {projects.map((p) => (
        <motion.div
          key={p.slug}
          layout
          className="rounded-2xl overflow-hidden cursor-pointer"
          style={{
            background: `${p.planetColor}08`,
            border: `1px solid ${p.planetColor}${expanded === p.slug ? "50" : "20"}`,
          }}
          onClick={() => setExpanded(expanded === p.slug ? null : p.slug)}
        >
          <div className="p-4 flex items-start gap-3">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5"
              style={{ background: p.planetColor, boxShadow: `0 0 8px ${p.planetColor}` }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-white">{p.title}</p>
                <span className="text-[9px] font-mono flex-shrink-0" style={{ color: p.planetColor }}>
                  {p.year} {expanded === p.slug ? "▲" : "▼"}
                </span>
              </div>
              <p className="text-[10px] text-white/50 mt-0.5">{p.tagline}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {p.stack.slice(0, 5).map((t) => (
                  <Pill key={t} label={t} color={`${p.planetColor}12`} textColor={p.planetColor} border={`${p.planetColor}30`} />
                ))}
              </div>
            </div>
          </div>
          <AnimatePresence>
            {expanded === p.slug && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-2 border-t border-white/5 pt-3">
                  <div>
                    <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-0.5">Problem</p>
                    <p className="text-[10px] text-white/60 leading-relaxed">{p.problem}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-0.5">Build</p>
                    <p className="text-[10px] text-white/60 leading-relaxed">{p.build}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-0.5">Impact</p>
                    <p className="text-[10px] text-white/60 leading-relaxed">{p.impact}</p>
                  </div>
                  <div className="flex gap-2 pt-1">
                    {p.links.demo && (
                      <a href={p.links.demo} target="_blank" rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-widest"
                        style={{ background: `${p.planetColor}18`, border: `1px solid ${p.planetColor}40`, color: p.planetColor }}
                        onClick={(e) => e.stopPropagation()}>
                        ◉ Live Demo
                      </a>
                    )}
                    {p.links.repo && (
                      <a href={p.links.repo} target="_blank" rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-widest text-white/50 hover:text-white transition-colors"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                        onClick={(e) => e.stopPropagation()}>
                        ⬡ Repo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

/* ── TIMELINE TAB ───────────────────────────────────────────── */
function TimelineTab() {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-3.5 top-0 bottom-0 w-px bg-white/10" />
      <div className="space-y-6">
        {milestones.map((m, i) => {
          const color = MILESTONE_COLORS[m.category] ?? "#ffffff";
          return (
            <div key={i} className="flex gap-5">
              <div className="relative flex-shrink-0 mt-1">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center z-10 relative"
                  style={{ background: `${color}20`, border: `2px solid ${color}`, boxShadow: `0 0 12px ${color}40` }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                </div>
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p
                    className="text-[9px] font-mono uppercase tracking-widest font-bold"
                    style={{ color }}
                  >
                    {m.category}
                  </p>
                  <p className="text-[9px] font-mono text-white/25 ml-auto">{m.date}</p>
                </div>
                <p className="text-sm font-semibold text-white">{m.title}</p>
                <p className="text-[10px] text-white/50 mt-0.5 leading-relaxed">{m.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── CONTACT TAB ────────────────────────────────────────────── */
function ContactTab() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "white",
    fontSize: "12px",
    padding: "10px 14px",
    width: "100%",
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
  };

  return (
    <div className="space-y-6">
      {/* Contact info */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Email", value: profile.email, href: `mailto:${profile.email}`, color: "#ff8c6b" },
          { label: "Phone", value: profile.phone, href: `tel:${profile.phone}`, color: "#3dff99" },
          { label: "GitHub", value: "LusmicSam", href: profile.github, color: "#58d8ff" },
          { label: "LinkedIn", value: "shivam-panjolia", href: profile.linkedin, color: "#a066ff" },
        ].map((c) => (
          <a
            key={c.label}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl flex items-center gap-3 transition-all hover:scale-[1.02]"
            style={{ background: `${c.color}08`, border: `1px solid ${c.color}25` }}
          >
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.color }} />
            <div>
              <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">{c.label}</p>
              <p className="text-[10px] font-mono text-white/80 truncate" style={{ maxWidth: 120 }}>{c.value}</p>
            </div>
          </a>
        ))}
      </div>

      {/* Contact form */}
      <div
        className="p-5 rounded-2xl"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <p className="text-[9px] font-mono tracking-[0.4em] text-white/30 uppercase mb-4">Send a Message</p>

        {status === "sent" ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <div className="text-3xl mb-3">✓</div>
            <p className="text-sm font-semibold text-green-400">Message sent!</p>
            <p className="text-xs text-white/40 mt-1">I&apos;ll get back to you soon.</p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-4 text-[9px] font-mono text-white/30 hover:text-white underline underline-offset-4"
            >
              Send another
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] font-mono text-white/30 uppercase tracking-widest block mb-1">Name</label>
                <input
                  style={inputStyle}
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  onFocus={(e) => (e.target.style.borderColor = "rgba(255,160,70,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
              <div>
                <label className="text-[9px] font-mono text-white/30 uppercase tracking-widest block mb-1">Email</label>
                <input
                  style={inputStyle}
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  onFocus={(e) => (e.target.style.borderColor = "rgba(255,160,70,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
            </div>
            <div>
              <label className="text-[9px] font-mono text-white/30 uppercase tracking-widest block mb-1">Message</label>
              <textarea
                style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
                placeholder="What's on your mind..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                onFocus={(e) => ((e.target as HTMLTextAreaElement).style.borderColor = "rgba(255,160,70,0.5)")}
                onBlur={(e) => ((e.target as HTMLTextAreaElement).style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>
            {status === "error" && (
              <p className="text-[10px] text-red-400 font-mono">Failed to send. Please try again or email directly.</p>
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full py-2.5 rounded-xl text-[10px] font-mono uppercase tracking-widest font-bold transition-all"
              style={{
                background: status === "sending"
                  ? "rgba(255,160,70,0.1)"
                  : "linear-gradient(135deg, rgba(255,160,70,0.25), rgba(255,100,30,0.15))",
                border: "1px solid rgba(255,160,70,0.4)",
                color: status === "sending" ? "rgba(255,160,70,0.5)" : "#ffcc88",
                cursor: status === "sending" ? "wait" : "pointer",
              }}
            >
              {status === "sending" ? "Transmitting..." : "⬡ Transmit Message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ── MAIN PANEL ─────────────────────────────────────────────── */
export function SunPortfolioPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("About");

  return (
    <AnimatePresence>
      <motion.div
        key="sun-portfolio"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ background: "rgba(4,2,12,0.88)", backdropFilter: "blur(24px)" }}
        onClick={onClose}
      >
        {/* Ambient radial */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className="w-[700px] h-[700px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,160,70,0.08) 0%, transparent 65%)" }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative w-full max-w-3xl flex flex-col rounded-3xl overflow-hidden"
          style={{
            height: "min(88vh, 680px)",
            background: "rgba(8,5,20,0.97)",
            border: "1px solid rgba(255,160,70,0.18)",
            boxShadow: "0 0 100px rgba(255,140,50,0.12), 0 32px 64px rgba(0,0,0,0.6)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Top bar ────────────────────────────────────────── */}
          <div
            className="flex items-center gap-1 px-4 pt-3 pb-0 flex-shrink-0"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-4 py-2.5 text-[10px] font-mono uppercase tracking-[0.3em] font-bold rounded-t-xl transition-all relative"
                style={{
                  background: tab === t ? "rgba(255,160,70,0.1)" : "transparent",
                  color: tab === t ? "#ffcc88" : "rgba(255,255,255,0.3)",
                  borderBottom: tab === t ? "2px solid #ffaa44" : "2px solid transparent",
                }}
              >
                {t}
              </button>
            ))}

            <div className="ml-auto flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-[8px] font-mono text-white/20 tracking-widest">LIVE</span>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/8 transition-all text-xs font-mono"
              >
                ✕
              </button>
            </div>
          </div>

          {/* ── Scrollable content ─────────────────────────────── */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {tab === "About" && <AboutTab />}
                {tab === "Skills" && <SkillsTab />}
                {tab === "Projects" && <ProjectsTab />}
                {tab === "Timeline" && <TimelineTab />}
                {tab === "Contact" && <ContactTab />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Footer ─────────────────────────────────────────── */}
          <div
            className="px-6 py-3 flex items-center justify-between flex-shrink-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <p className="text-[8px] font-mono text-white/15 tracking-widest">
              {profile.education[0]?.institution} · {profile.education[0]?.period}
            </p>
            <p className="text-[8px] font-mono text-orange-400/30 tracking-widest">
              {profile.mbti} · {profile.role.split("·")[0].trim()}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
