import { useRef, useState, useMemo, useCallback, Suspense } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Html,
  Billboard,
  Environment,
  PerspectiveCamera,
  Sparkles,
  Float,
  Trail,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
} from "@react-three/postprocessing";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Project, skillClusters } from "@/data/portfolio";
import { TOTAL_DISTANCE } from "../config";

// ── Icon imports ────────────────────────────────────────────
import {
  FaPython, FaJava, FaDocker, FaLinux, FaGitAlt,
  FaReact, FaNodeJs, FaCode, FaDatabase,
} from "react-icons/fa";
import {
  SiCplusplus, SiC, SiPostgresql, SiMongodb, SiPytorch,
  SiTensorflow, SiScikitlearn, SiOpencv, SiKubernetes,
  SiRedis, SiFastapi, SiDjango, SiNextdotjs, SiThreedotjs,
  SiGraphql,
} from "react-icons/si";
import { MdApi } from "react-icons/md";
import { BsFileEarmarkCode } from "react-icons/bs";

const IconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Python: FaPython, "C++": SiCplusplus, Java: FaJava, C: SiC,
  SQL: FaCode, PostgreSQL: SiPostgresql, MongoDB: SiMongodb,
  PyTorch: SiPytorch, TensorFlow: SiTensorflow, "Scikit-learn": SiScikitlearn,
  OpenCV: SiOpencv, LangChain: BsFileEarmarkCode, RAG: BsFileEarmarkCode,
  CNNs: BsFileEarmarkCode, Docker: FaDocker, Kubernetes: SiKubernetes,
  "Oracle Cloud": FaDatabase, Linux: FaLinux, Git: FaGitAlt,
  Redis: SiRedis, gRPC: FaCode, FastAPI: SiFastapi, Django: SiDjango,
  React: FaReact, "Next.js": SiNextdotjs, "Node.js": FaNodeJs,
  "Three.js": SiThreedotjs, REST: MdApi, GraphQL: SiGraphql,
};

// Pre-allocated vectors — prevent GC inside useFrame
const _moonCheckPos = new THREE.Vector3();
const _zoneWorldCenter = new THREE.Vector3();

/* ================================================================
   1. CENTRAL STAR
   ================================================================ */
export function CentralStar({
  z,
  commitData = [],
  onClick,
}: {
  z: number;
  commitData?: { size?: number }[];
  onClick?: () => void;
}) {
  const starRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.PointLight>(null);

  const totalCommits = useMemo(
    () => commitData.reduce((acc, c) => acc + (c.size || 0), 0),
    [commitData],
  );

  const activity = Math.max(0.3, Math.min(1, totalCommits / 150));
  const activityScale = 1 + activity * 0.4;
  const emissiveFactor = 0.8 + activity * 1.5;
  const flareSpeed = 1 + activity * 2;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (starRef.current) starRef.current.rotation.y = t * 0.1 * flareSpeed;
    if (glowRef.current)
      glowRef.current.scale.setScalar(
        activityScale + Math.sin(t * 2 * flareSpeed) * 0.05,
      );
    if (pulseRef.current) {
      pulseRef.current.intensity =
        emissiveFactor * 1.2 +
        Math.sin(t * 3 * flareSpeed) * 0.3 * activityScale;
    }
  });

  return (
    <group position={[0, 0, z]}>
      <mesh
        ref={starRef}
        onClick={onClick}
        onPointerEnter={() => onClick && (document.body.style.cursor = 'pointer')}
        onPointerLeave={() => (document.body.style.cursor = 'auto')}
      >
        <sphereGeometry args={[80 * activityScale, 48, 48]} />
        <meshStandardMaterial
          color="#ffaa66"
          emissive="#ff6622"
          emissiveIntensity={emissiveFactor}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      <Sparkles
        count={50 + Math.floor(activity * 150)}
        scale={160 * activityScale}
        size={2 + activity * 4}
        speed={0.5 + activity * 1.5}
        color="#ffcc66"
        opacity={0.4 + activity * 0.4}
      />

      <mesh ref={glowRef}>
        <sphereGeometry args={[140, 24, 24]} />
        <meshBasicMaterial
          color="#ff8844"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      <pointLight
        ref={pulseRef}
        color="#ffaa66"
        intensity={1.8}
        distance={5000}
        decay={1.5}
      />

      <Billboard>
        <Html center>
          <div className="relative w-32 h-32 pointer-events-none">
            <div className="absolute inset-0 rounded-full bg-orange-400/20 blur-2xl animate-pulse" />
          </div>
        </Html>
      </Billboard>
    </group>
  );
}

/* ================================================================
   2. PROJECT PLANET
   ================================================================ */
function createPlanetTexture(baseColor: string) {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const rgb = new THREE.Color(baseColor);
  const r = rgb.r * 255,
    g = rgb.g * 255,
    b = rgb.b * 255;

  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, `rgba(${r},${g},${b},1)`);
  grad.addColorStop(1, `rgba(${r * 0.7},${g * 0.7},${b * 0.7},1)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 3 + 1, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r + 50},${g + 50},${b + 50},${Math.random() * 0.3})`;
    ctx.fill();
  }

  for (let i = 0; i < 30; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.lineWidth = 8 + Math.random() * 12;
    ctx.strokeStyle = `rgba(255,255,255,${Math.random() * 0.05})`;
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
}

export interface ProjectPlanetProps {
  data: { z: number; item: Project; detail?: string | null };
  scrollT: number;
  onHover: (p: Project, pos: [number, number]) => void;
  onLeave: () => void;
  onClick: (p: Project) => void;
}

export function ProjectPlanet({
  data,
  scrollT,
  onHover,
  onLeave,
  onClick,
}: ProjectPlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const stage1Ref = useRef<HTMLDivElement>(null);
  const stage2Ref = useRef<HTMLDivElement>(null);
  const stage3Ref = useRef<HTMLDivElement>(null);

  const project = data.item;
  const isRight = project.title.length % 2 === 0;
  const xOffset = isRight ? 65 : -65;
  const yOffset = (project.title.length % 5) - 2;
  const radius = project.planetSize * 15;

  const texture = useMemo(
    () => createPlanetTexture(project.planetColor),
    [project.planetColor],
  );
  const [hovered, setHovered] = useState(false);

  const setStageOpacity = (
    ref: React.RefObject<HTMLDivElement | null>,
    opacity: number,
  ) => {
    if (ref.current) {
      const clamped = Math.max(0, Math.min(1, opacity));
      ref.current.style.opacity = String(clamped);
      ref.current.style.pointerEvents = clamped > 0.1 ? "auto" : "none";
    }
  };

  useFrame(({ clock }) => {
    const rawZ = scrollT * -TOTAL_DISTANCE;
    const dist = rawZ - data.z;
    const absDist = Math.abs(dist);

    if (planetRef.current) {
      if (absDist < 700) {
        planetRef.current.rotation.y = dist * 0.004;
        planetRef.current.rotation.x = Math.sin(dist * 0.008) * 0.15;
      } else {
        planetRef.current.rotation.y += 0.002;
      }
      if (data.detail === "gas") {
        planetRef.current.scale.setScalar(
          1 + Math.sin(clock.elapsedTime * 2.4) * 0.015,
        );
      }
    }

    // Planet stays at data.z — camera movement IS the approach animation.
    // (The old swoop moved the group PAST the camera, hiding the Html side panel)
    if (groupRef.current) {
      groupRef.current.position.z = data.z;
      groupRef.current.position.x = xOffset;
    }

    // Stage 1: name label appears 400→50u  (min was 80, camera docks at 75 → was invisible!)
    let s1 = 0;
    if (absDist < 400 && absDist > 50) {
      s1 = absDist > 340 ? Math.min(1, (400 - absDist) / 60) : 1;
    }
    setStageOpacity(stage1Ref, s1);

    // Stage 2: tagline+stack 200→20u
    let s2 = 0;
    if (absDist < 200 && absDist > 20) {
      s2 = absDist > 150 ? Math.min(1, (200 - absDist) / 50) : 1;
    }
    setStageOpacity(stage2Ref, s2);

    // Stage 3: CTA 100→10u
    let s3 = 0;
    if (absDist < 100 && absDist > 10) {
      s3 = absDist > 75 ? Math.min(1, (100 - absDist) / 25) : 1;
    }
    setStageOpacity(stage3Ref, s3);
  });

  const panelSide = isRight
    ? { right: 0, textAlign: "right" as const }
    : { left: 0, textAlign: "left" as const };
  const htmlOffset: [number, number, number] = [
    isRight ? -(radius + 18) : radius + 18,
    0,
    0,
  ];

  return (
    <group ref={groupRef} position={[xOffset, yOffset, data.z]}>
      <pointLight
        color={project.planetColor}
        intensity={1.5}
        distance={300}
        decay={2}
      />

      <mesh
        ref={planetRef}
        onPointerEnter={() => {
          setHovered(true);
          onHover(project, [xOffset, yOffset]);
        }}
        onPointerLeave={() => {
          setHovered(false);
          onLeave();
        }}
        onClick={() => onClick(project)}
      >
        <sphereGeometry args={[radius, 48, 48]} />
        <meshStandardMaterial
          map={texture}
          color={project.planetColor}
          emissive={project.planetColor}
          emissiveIntensity={hovered ? 0.9 : 0.25}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[radius * 1.12, 32, 32]} />
        <meshBasicMaterial
          color={project.planetColor}
          transparent
          opacity={hovered ? 0.35 : 0.12}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Ring system */}
      {data.detail === "ring" && (
        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
          <ringGeometry args={[radius * 1.3, radius * 2.0, 64]} />
          <meshStandardMaterial
            color={project.planetColor}
            emissive={project.planetColor}
            emissiveIntensity={0.2}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Ice double ring */}
      {data.detail === "ice" && (
        <>
          <mesh rotation={[Math.PI / 2.5, 0.3, 0]}>
            <ringGeometry args={[radius * 1.25, radius * 1.7, 128]} />
            <meshStandardMaterial
              color="#aaddff"
              emissive="#aaddff"
              emissiveIntensity={0.15}
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2.8, 0.6, 0]}>
            <ringGeometry args={[radius * 1.85, radius * 2.3, 128]} />
            <meshStandardMaterial
              color="#ddeeff"
              emissive="#ddeeff"
              emissiveIntensity={0.08}
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      )}

      {/* Trail */}
      <Trail
        width={0.5}
        length={30}
        decay={0.95}
        interval={1}
        color={project.planetColor}
        attenuation={(w) => w}
      >
        <mesh visible={false} />
      </Trail>

      {/* Stage labels */}
      <Html position={htmlOffset} zIndexRange={[30, 0]}>
        <div
          className="absolute top-1/2"
          style={{ width: "300px", ...panelSide }}
        >
          {/* STAGE 1 */}
          <div
            ref={stage1Ref}
            className="absolute top-0 -translate-y-1/2 w-full pointer-events-none select-none transition-opacity duration-500"
            style={{ opacity: 0 }}
          >
            <div
              className="absolute top-1/2 h-px bg-white/20"
              style={{
                [isRight ? "right" : "left"]: "-44px",
                width: "36px",
              }}
            />
            <p
              className="font-mono text-[9px] tracking-[0.3em] uppercase mb-1"
              style={{ color: project.planetColor }}
            >
              PROJECT · {project.year}
            </p>
            <h3
              className="text-2xl font-black text-white leading-tight"
              style={{
                textShadow: `0 0 20px ${project.planetColor}80`,
              }}
            >
              {project.title}
            </h3>
          </div>

          {/* Layout for Stages 2 & 3 */}
          <div className="absolute top-0 pt-10 w-full flex flex-col gap-4">
            {/* STAGE 2 */}
            <div
              ref={stage2Ref}
              className="select-none transition-opacity duration-400"
              style={{ opacity: 0, pointerEvents: "none" }}
            >
              <div
                className="px-3 py-2.5 rounded-xl"
                style={{
                  background: "rgba(5,5,15,0.7)",
                  border: `1px solid ${project.planetColor}25`,
                  backdropFilter: "blur(8px)",
                }}
              >
                <p className="text-[11px] text-white/70 leading-relaxed mb-2">
                  {project.tagline}
                </p>
                <div
                  className={`flex flex-wrap gap-1.5 ${isRight ? "justify-end" : "justify-start"}`}
                >
                  {project.stack.slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-full text-[9px] font-mono"
                      style={{
                        color: project.planetColor,
                        background: `${project.planetColor}18`,
                        border: `1px solid ${project.planetColor}40`,
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* STAGE 3 */}
            <div
              ref={stage3Ref}
              className="select-none transition-opacity duration-300 cursor-pointer"
              style={{ opacity: 0 }}
              onClick={() => onClick(project)}
            >
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-mono uppercase tracking-widest hover:bg-white/10 transition-all ${isRight ? "ml-auto" : ""}`}
                style={{
                  borderColor: `${project.planetColor}60`,
                  color: project.planetColor,
                  boxShadow: `0 0 24px ${project.planetColor}40`,
                  background: `${project.planetColor}10`,
                }}
              >
                <span>◉</span> View Details
              </div>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}

/* ================================================================
   3. ACHIEVEMENT MOON
   ================================================================ */
export interface AchievementMoonProps {
  data: {
    z: number;
    title: string;
    desc: string;
    color?: string;
    position?: [number, number, number];
  };
  onClick: () => void;
}

export function AchievementMoon({ data, onClick }: AchievementMoonProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const color = data.color || "#ffffff";

  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.5;
      meshRef.current.position.y = Math.sin(t * 1.5) * 2;

      if (labelRef.current) {
        meshRef.current.getWorldPosition(_moonCheckPos);
        const dist = camera.position.distanceTo(_moonCheckPos);
        if (dist < 600 && dist > 40) {
          const opacity = Math.min(1, (600 - dist) / 150);
          labelRef.current.style.opacity = String(opacity);
          labelRef.current.style.display = "flex";
          labelRef.current.style.transform = `scale(${Math.max(0.8, 1 - dist / 900)})`;
        } else {
          labelRef.current.style.opacity = "0";
          labelRef.current.style.display = "none";
        }
      }
    }
    if (glowRef.current) {
      // Gentle pulse on glow — moons breathe slowly
      const s = 1 + Math.sin(t * 0.8) * 0.04;
      glowRef.current.scale.setScalar(s);
    }
  });

  const categoryLabel = data.title.includes("Certif")
    ? "CERTIFICATION"
    : data.title.includes("Research") || data.title.includes("Publication")
      ? "RESEARCH"
      : data.title.includes("Vice") ||
        data.title.includes("VP") ||
        data.title.includes("Career")
        ? "CAREER"
        : "ACHIEVEMENT";

  return (
    <group position={data.position || [0, 0, data.z]}>
      {/* Subtle ambient light — moons are dim, not self-illuminated */}
      <pointLight color={color} intensity={0.4} distance={120} decay={2} />
      <ambientLight intensity={0.08} />

      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Core moon body — icosahedron = lumpy, cratered feel */}
        <mesh ref={meshRef} onClick={onClick}>
          {/* detail=1 gives 20 faces — rough, asteroid-like */}
          <icosahedronGeometry args={[8, 1]} />
          <meshStandardMaterial
            color={`hsl(220, 10%, 55%)`}   // grey-silver base
            emissive={color}
            emissiveIntensity={0.04}         // near-zero: not self-lit like planets
            roughness={0.92}                 // very rocky
            metalness={0.05}                 // stone not metal
          />
        </mesh>

        {/* Crater 1 */}
        <mesh position={[4, 2, 6]}>
          <sphereGeometry args={[2.5, 8, 8]} />
          <meshStandardMaterial color="#1a1822" roughness={1} metalness={0} />
        </mesh>
        {/* Crater 2 */}
        <mesh position={[-5, -1, 5]}>
          <sphereGeometry args={[1.8, 8, 8]} />
          <meshStandardMaterial color="#1a1822" roughness={1} metalness={0} />
        </mesh>
        {/* Crater 3 */}
        <mesh position={[1, 5, 5]}>
          <sphereGeometry args={[1.2, 8, 8]} />
          <meshStandardMaterial color="#1a1822" roughness={1} metalness={0} />
        </mesh>

        {/* Thin tilted orbit ring — unique to moons, not on planets */}
        <mesh ref={haloRef} rotation={[Math.PI / 3, 0.4, 0]}>
          <ringGeometry args={[11, 12.5, 64]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Very faint glow — much dimmer than planets */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[10.5, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.04}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
          />
        </mesh>
      </Float>

      <Billboard position={[0, 18, 0]}>
        <Html center style={{ pointerEvents: "none" }}>
          <div
            ref={labelRef}
            className="flex flex-col items-center pointer-events-none select-none"
            style={{ opacity: 0 }}
          >
            <div
              className="px-2.5 py-0.5 rounded-full mb-1.5 text-[8px] font-mono tracking-[0.4em] uppercase font-bold"
              style={{
                color,
                background: `${color}18`,
                border: `1px solid ${color}40`,
              }}
            >
              {categoryLabel}
            </div>
            <div
              className="px-3 py-1.5 rounded-xl text-center"
              style={{
                background: "rgba(5,5,15,0.8)",
                border: `1px solid ${color}30`,
                backdropFilter: "blur(8px)",
              }}
            >
              <h4
                className="text-[11px] font-bold text-white whitespace-nowrap"
                style={{ textShadow: `0 0 10px ${color}80` }}
              >
                {data.title === "Career" || data.title === "Achievement"
                  ? data.desc
                  : data.title}
              </h4>
              {data.title !== "Achievement" && data.title !== "Career" && (
                <p className="text-[9px] text-white/50 mt-0.5 whitespace-nowrap">
                  {data.desc}
                </p>
              )}
            </div>
          </div>
        </Html>
      </Billboard>
    </group>
  );
}

/* ================================================================
   4. ASTEROID BELT — Skill Cluster Zones
   ================================================================ */

// ── Zone layout config (one per skillClusters entry) ──────────
const CLUSTER_ZONE_CONFIG: Array<{
  pos: [number, number, number];
  radius: number;
  color: string;
  icon: string;
}> = [
    { pos: [-120, 20, -80], radius: 60, color: "#58d8ff", icon: "</>" },
    { pos: [100, -10, 40], radius: 55, color: "#a066ff", icon: "🧠" },
    { pos: [-80, 30, 120], radius: 50, color: "#ff8c6b", icon: "⚙️" },
    { pos: [130, -20, -40], radius: 55, color: "#3dff99", icon: "🌐" },
  ];

function AsteroidRock({
  offset,
  color,
  size,
}: {
  offset: [number, number, number];
  color: string;
  size: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  // Stable per-instance values via useRef (not Math.random in render)
  const cfg = useRef({
    speed: 0.1 + Math.random() * 0.2,
    phase: Math.random() * Math.PI * 2,
  }).current;

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.elapsedTime * cfg.speed * 0.7;
      meshRef.current.rotation.y = clock.elapsedTime * cfg.speed;
      meshRef.current.position.y =
        offset[1] + Math.sin(clock.elapsedTime * 0.4 + cfg.phase) * 2.5;
    }
  });

  return (
    <mesh ref={meshRef} position={offset}>
      <dodecahedronGeometry args={[size, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        roughness={0.7}
        metalness={0.3}
      />
    </mesh>
  );
}

// Belt formation: 4 color groups, each occupying a quadrant of the ring
export const BELT_COLORS = [
  "#58d8ff", // Languages & Mobile
  "#a066ff", // AI & ML
  "#ff8c6b", // Systems, DevOps & Cloud
  "#3dff99", // Web, DBs & Web3
];

function AsteroidRing({
  groupIndex,
  cluster,
  onZoneClick,
}: {
  groupIndex: number;
  cluster: (typeof skillClusters)[number];
  onZoneClick: (cluster: (typeof skillClusters)[number]) => void;
}) {
  const ROCKS_PER_GROUP = 18;
  const color = BELT_COLORS[groupIndex % BELT_COLORS.length];

  // Each group occupies a quarter of the ring (90 degrees)
  const startAngle = (groupIndex / 4) * Math.PI * 2;
  const spanAngle = (Math.PI * 2) / 4;

  const rocks = useMemo(() => {
    return Array.from({ length: ROCKS_PER_GROUP }, (_, i) => {
      const t = i / ROCKS_PER_GROUP;
      // Spread rocks within the arc, leave small gap between groups
      const angle = startAngle + t * spanAngle * 0.85 + spanAngle * 0.075;
      const r = 80 + (Math.random() * 40 - 20); // belt inner=80, outer=120
      const ySpread = (Math.random() - 0.5) * 20;
      return {
        pos: [
          Math.cos(angle) * r,
          ySpread,
          Math.sin(angle) * r,
        ] as [number, number, number],
        size: 1.2 + Math.random() * 2.4,
        rotSpeed: 0.08 + Math.random() * 0.18,
        phase: Math.random() * Math.PI * 2,
      };
    });
  }, [startAngle, spanAngle]);

  return (
    <>
      {rocks.map((rock, i) => (
        <AsteroidRockClickable
          key={i}
          pos={rock.pos}
          size={rock.size}
          color={color}
          rotSpeed={rock.rotSpeed}
          phase={rock.phase}
          onClick={() => onZoneClick(cluster)}
        />
      ))}
    </>
  );
}

function AsteroidRockClickable({
  pos, size, color, rotSpeed, phase, onClick,
}: {
  pos: [number, number, number];
  size: number;
  color: string;
  rotSpeed: number;
  phase: number;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hov, setHov] = useState(false);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime;
    meshRef.current.rotation.x = t * rotSpeed * 0.7;
    meshRef.current.rotation.y = t * rotSpeed;
    // Subtle float
    meshRef.current.position.y = pos[1] + Math.sin(t * 0.4 + phase) * 1.5;
  });

  return (
    <mesh
      ref={meshRef}
      position={pos}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerEnter={() => { setHov(true); document.body.style.cursor = 'pointer'; }}
      onPointerLeave={() => { setHov(false); document.body.style.cursor = 'auto'; }}
    >
      <dodecahedronGeometry args={[size, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={hov ? 0.6 : 0.15}
        roughness={0.75}
        metalness={0.2}
      />
    </mesh>
  );
}

export function SkillZoneModal({
  cluster,
  color,
  icon,
  onClose,
}: {
  cluster: (typeof skillClusters)[number];
  color: string;
  icon: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      key="skill-modal"
      initial={{ opacity: 0, scale: 0.85, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: "spring", damping: 22, stiffness: 200 }}
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ pointerEvents: "auto" }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" />

      <motion.div
        className="relative max-w-lg w-full mx-6 rounded-3xl p-8 border overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(5,5,20,0.98), rgba(10,10,30,0.95))",
          borderColor: `${color}40`,
          boxShadow: `0 0 80px ${color}25, inset 0 0 60px rgba(0,0,0,0.5)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{ background: color }}
        />

        <div className="flex items-center gap-4 mb-6">
          <span
            className="text-4xl"
            style={{ filter: `drop-shadow(0 0 12px ${color})` }}
          >
            {icon}
          </span>
          <div>
            <p
              className="text-[10px] font-mono tracking-[0.5em] uppercase mb-1"
              style={{ color }}
            >
              Skill Domain
            </p>
            <h3
              className="text-2xl font-black text-white uppercase tracking-wider"
              style={{ textShadow: `0 0 20px ${color}60` }}
            >
              {cluster.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="ml-auto w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            ✕
          </button>
        </div>

        <div
          className="h-px w-full mb-6"
          style={{
            background: `linear-gradient(to right, ${color}60, transparent)`,
          }}
        />

        <div className="flex flex-wrap gap-2">
          {cluster.skills.map((skill, i) => {
            const Icon = IconMap[skill] || FaCode;
            return (
              <motion.div
                key={skill}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{
                  background: `${color}12`,
                  border: `1px solid ${color}35`,
                  boxShadow: `0 0 10px ${color}15`,
                }}
              >
                <Icon size={14} color={color} />
                <span
                  className="text-[11px] font-mono font-semibold tracking-wider"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  {skill}
                </span>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <p className="text-[9px] font-mono text-white/25 tracking-widest uppercase">
            {cluster.skills.length} skills indexed
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Single MainAsteroidBelt export ──────────────────────────
export function MainAsteroidBelt({
  z,
  onZoneClick,
}: {
  z: number;
  onZoneClick: (cluster: (typeof skillClusters)[number], colorIdx: number) => void;
}) {
  return (
    <group position={[0, 0, z]}>
      {skillClusters.map((cluster, i) => (
        <AsteroidRing
          key={cluster.title}
          groupIndex={i}
          cluster={cluster}
          onZoneClick={(cl) => onZoneClick(cl, i)}
        />
      ))}
    </group>
  );
}

/* ================================================================
   5. STARFIELD
   ================================================================ */
export function Starfield() {
  const pointsRef = useRef<THREE.Points>(null);
  // Camera starts at z=1200, travels toward z≈-30000 (negative Z direction).
  // OLD bug: stars were at z = -2000 to +26000 → 89% were BEHIND the camera.
  // FIX: spread stars from z=1500 down to z=-31000 so they are always in front.
  const starCount = 12000;

  const { positions, colors } = useMemo(() => {
    const posArr = new Float32Array(starCount * 3);
    const colArr = new Float32Array(starCount * 3);
    const palettes = [
      new THREE.Color("#ffffff"),
      new THREE.Color("#ffe9c4"),
      new THREE.Color("#d4e1ff"),
      new THREE.Color("#c4d4ff"),
      new THREE.Color("#ffd6e0"),
    ];

    for (let i = 0; i < starCount; i++) {
      posArr[i * 3]     = (Math.random() - 0.5) * 10000;   // x: ±5000
      posArr[i * 3 + 1] = (Math.random() - 0.5) * 10000;   // y: ±5000
      // z: 1500 → -31000  (covers the full forward camera journey)
      posArr[i * 3 + 2] = 1500 - Math.random() * 32500;

      const c = palettes[Math.floor(Math.random() * palettes.length)];
      colArr[i * 3]     = c.r;
      colArr[i * 3 + 1] = c.g;
      colArr[i * 3 + 2] = c.b;
    }
    return { positions: posArr, colors: colArr };
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current)
      pointsRef.current.rotation.y = clock.elapsedTime * 0.0005;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={2.2}
        transparent
        opacity={1.0}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ================================================================
   6. SPACE SCENE — pure scene graph, NO camera controls
      (CameraRig is rendered as a sibling by the parent component)
   ================================================================ */
export interface SpaceSceneProps {
  scrollT: number;
  projects: Project[];
  onProjectClick: (p: Project) => void;
}

export function SpaceScene({
  scrollT,
  projects,
  onProjectClick,
}: SpaceSceneProps) {
  return (
    <>
      {/*
        Camera setup only — position will be overridden by CameraRig on
        frame 1.  fov/near/far are kept as the canonical values.
      */}
      <PerspectiveCamera
        makeDefault
        position={[0, 15, 1200]}
        fov={75}
        near={1}
        far={50000}
      />

      <Environment preset="night" background={false} />

      {/* Ambient + directional fill */}
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[50, 100, 50]}
        intensity={1.2}
        castShadow
      />
      <pointLight position={[-30, 20, 100]} intensity={0.5} color="#4488ff" />
      <pointLight position={[30, -20, 150]} intensity={0.5} color="#ff8844" />

      <Starfield />

      <CentralStar z={-200} />

      {projects.map((proj, idx) => (
        <ProjectPlanet
          key={proj.slug}
          data={{
            z: -100 + idx * 300,
            item: proj,
            detail: idx % 3 === 0 ? "ring" : idx % 3 === 1 ? "ice" : "gas",
          }}
          scrollT={scrollT}
          onHover={() => { }}
          onLeave={() => { }}
          onClick={() => onProjectClick(proj)}
        />
      ))}

      <MainAsteroidBelt z={-50} onZoneClick={() => { }} />

      <Sparkles
        count={500}
        scale={[500, 500, 500]}
        size={2}
        color="#ffaa88"
        opacity={0.3}
      />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          height={300}
        />
        <ChromaticAberration
          offset={new THREE.Vector2(0.002, 0.002)}
        />
      </EffectComposer>
    </>
  );
}