import { projects, profile, type Project } from "@/data/portfolio";

// Total scrollable distance — 1 scroll px ≈ 1 Z unit
export const TOTAL_DISTANCE = 30000;

export type StopType = 
  | "sun" 
  | "project" 
  | "moon" 
  | "asteroids" 
  | "station" 
  | "wormhole" 
  | "blackhole" 
  | "radar" 
  | "void";

export interface JourneyStop {
  z: number;               // Z-coordinate along the flight path (negative = forward)
  x?: number;              // Optional X-offset from center
  y?: number;              // Optional Y-offset from center
  type: StopType;
  title: string;
  desc: string;
  item?: Project;
  detail?: string;
  color?: string;
  forceStop?: boolean;     // If true, camera hard-stops here
}

// ─────────────────────────────────────────────────────────────
//  JOURNEY — exact Z positions from handwritten notes
//  Pattern for each planet:
//    approach text fades in ~2000u ahead  →  force-stop at planet  →  moon 1700u after
//    spacing between planet stops: ~3900u
// ─────────────────────────────────────────────────────────────
export const JOURNEY: JourneyStop[] = (([
  // ── 0. SUN (Profile Overview) ──────────────────────────────
  {
    z: -600,
    type: "sun",
    title: profile.name,
    desc: "Languages: C++, Python, Java | Experience: 4+ Years | Certifications: OCI Cloud & ML",
  },

  // ── 1. PLANET 1: Voxel Engine ──────────────────────────────
  // Text appears at z=-1100 (2000u before planet), disappears at z=-2600, force-stop at -3100
  {
    z: -3100,
    type: "project",
    item: projects[0],
    detail: "inner",
    title: projects[0]?.title || "",
    desc: projects[0]?.tagline || "",
    forceStop: true,
  },

  // ── 2. MOON 1: Career  (1700u after Planet 1) ──────────────
  {
    z: -4800,
    type: "moon",
    title: "Career",
    desc: "Production Startup Engineer (Since June 2025)",
    color: "#66aaff",
  },

  // ── 3. PLANET 2: AKG-RAG  (3900u after Planet 1) ───────────
  // Text appears at z=-5100, force-stop at -7000
  {
    z: -7000,
    type: "project",
    item: projects[1],
    detail: "earth",
    title: projects[1]?.title || "",
    desc: projects[1]?.tagline || "",
    forceStop: true,
  },

  // ── 4. SKILL ASTEROID BELT (1500u after Planet 2) ───────────
  {
    z: -8500,
    type: "asteroids",
    title: "Technical Skills",
    desc: "Domain knowledge clustering — click a region to explore",
  },

  // ── 5. PLANET 3: Pashudrishti (2500u after belt) ────────────
  {
    z: -11000,
    type: "project",
    item: projects[2],
    detail: "gas",
    title: projects[2]?.title || "",
    desc: projects[2]?.tagline || "",
    forceStop: true,
  },

  // ── 6. MOON 2: Achievement (1800u after Planet 3) ───────────
  {
    z: -12800,
    type: "moon",
    title: "Achievement",
    desc: "250+ LeetCode Algorithms Solved · Contest Rating 1536",
    color: "#ff8c66",
  },

  // ── 7. PLANET 4: ChainGuard (2200u after Moon 2) ────────────
  {
    z: -15000,
    type: "project",
    item: projects[3],
    detail: "ring",
    title: projects[3]?.title || "",
    desc: projects[3]?.tagline || "",
    forceStop: true,
  },

  // ── 8. PLANET 5: Medical AI (3900u after Planet 4) ──────────
  {
    z: -18900,
    type: "project",
    item: projects[4],
    detail: "ice",
    title: projects[4]?.title || "",
    desc: projects[4]?.tagline || "",
    forceStop: true,
  },

  // ── 9. MOON 3: Certification (1700u after Planet 5) ─────────
  {
    z: -20600,
    type: "moon",
    title: "Certification",
    desc: "OCI DevOps Professional & AI Foundation Associate",
    color: "#a066ff",
  },

  // ── 10. PLANET 6: Startup Portals (3300u after Moon 3) ──────
  {
    z: -23900,
    type: "project",
    item: projects[5],
    detail: "deep",
    title: projects[5]?.title || "",
    desc: projects[5]?.tagline || "",
    forceStop: true,
  },

  // ── 11. MOON 4: VP Club (1700u after Planet 6) ──────────────
  {
    z: -25600,
    type: "moon",
    title: "Vice-President, Dynamic Vertos Club",
    desc: "Leading student initiatives & technical workshops at LPU",
    color: "#ffaa00",
  },

  // ── 12. SPACE STATION: About Me ─────────────────────────────
  {
    z: -27200,
    type: "station",
    title: "About Me",
    desc: "Background & Education",
  },

  // ── 13. FINAL HUB — three branching paths at same Z ─────────
  {
    z: -29000,
    x: -450,
    type: "wormhole",
    title: "GitHub Timeline",
    desc: "Commit history and contributions.",
  },
  {
    z: -29000,
    x: 0,
    type: "radar",
    title: "Contact",
    desc: "Get in touch — let's build something together.",
  },
  {
    z: -29000,
    x: 450,
    type: "blackhole",
    title: "Résumé",
    desc: "Download résumé and professional profile.",
  },

  // ── 14. THE VOID ─────────────────────────────────────────────
  {
    z: -30000,
    type: "void",
    title: "Edge of Universe",
    desc: "You have reached the end... for now.",
  },
] as JourneyStop[])).filter(stop =>
  stop.type === "sun" ||
  stop.type === "asteroids" ||
  stop.type === "moon" ||
  stop.type === "station" ||
  stop.type === "blackhole" ||
  stop.type === "radar" ||
  stop.type === "wormhole" ||
  stop.type === "void" ||
  (stop.type === "project" && stop.item)
);