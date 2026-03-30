"use client";

import React, { useRef, useState, useMemo, Suspense, Component, ErrorInfo, ReactNode } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, Float, Sparkles, useGLTF, useProgress } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { profile } from "@/data/portfolio";

/* ─────────────────────────────────────────────────────────────────────────
   HELPER: REAL-TIME LOADING HUD
   ───────────────────────────────────────────────────────────────────────── */
function ModelLoadingRing() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-6 rounded-full border border-cyan-500/20 bg-black/40 backdrop-blur-md">
        <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin mb-4" />
        <p className="text-[10px] font-mono text-cyan-400 tracking-[0.3em] uppercase animate-pulse">
          Downloading Assets... {Math.round(progress)}%
        </p>
      </div>
    </Html>
  );
}

// Error Boundary to handle missing model 404s
class ModelErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error) {
    console.warn("Model loading failed, falling back to procedural:", error);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// Procedural fallback if the model isn't downloaded yet
function ProceduralStation() {
  return (
    <group>
      <mesh rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[4.5, 4.5, 60, 32]} />
        <meshStandardMaterial color="#2a3a4a" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh>
        <sphereGeometry args={[8, 32, 32]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </mesh>
      <pointLight color="#00ffff" intensity={2} distance={50} />
    </group>
  );
}

function StationModel({ hovered }: { hovered: boolean }) {
  const { scene } = useGLTF("/space_station-compressed.glb");
  const modelRef = useRef<THREE.Group>(null);

  // Traverse to improve materials once loaded
  useMemo(() => {
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        if (obj.material) {
          obj.material.metalness = Math.max(obj.material.metalness || 0, 0.85);
          obj.material.roughness = Math.min(obj.material.roughness || 1, 0.15);
          if (obj.material.emissiveIntensity) obj.material.emissiveIntensity = 2.5;
        }
      }
    });
  }, [scene]);

  useFrame(({ clock }) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.0025;
    }
  });

  return (
    <group ref={modelRef}>
      <primitive 
        object={scene} 
        scale={105} 
        rotation={[Math.PI / 2, 0, Math.PI / 2]} 
      />
    </group>
  );
}

export function SpaceStation({ 
  data, 
  scrollT = 0, 
  onClick 
}: { 
  data: any, 
  scrollT?: number, 
  onClick: () => void 
}) {
  const groupRef = useRef<THREE.Group>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const { mouse } = useThree();

  const baseX = 45;
  const baseY = 5;

  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime;
    const effectiveZ = camera.position.z - 600;
    const dist = effectiveZ - data.z;
    const absDist = Math.abs(dist);

    if (groupRef.current) {
      if (absDist < 1000) {
        let p = Math.max(0, 1 - (absDist / 800)); 
        const eased = p * p * (3 - 2 * p);
        
        groupRef.current.position.z = data.z + eased * 240;
        const targetX = 22;
        groupRef.current.position.x = baseX + (targetX - baseX) * eased;
        
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.y * 0.18, 0.1);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, -mouse.x * 0.22, 0.1);
        groupRef.current.position.y = baseY + Math.sin(t * 0.4) * 2.5;
      } else {
        groupRef.current.position.z = data.z;
        groupRef.current.position.x = baseX;
        groupRef.current.rotation.x = 0;
        groupRef.current.rotation.y = 0;
      }
    }

    if (infoRef.current) {
      let panelOpacity = 0;
      if (dist > 0 && dist < 400) {
        panelOpacity = dist < 120 ? 1.0 : Math.min(1, (400 - dist) / 280);
      } else if (dist <= 0 && dist > -150) {
        panelOpacity = (dist + 150) / 150;
      }
      infoRef.current.style.opacity = panelOpacity.toString();
      infoRef.current.style.pointerEvents = panelOpacity > 0.1 ? "auto" : "none";
      const slide = (1 - panelOpacity) * -80;
      infoRef.current.style.transform = `translate(${slide}px, -50%) scale(${0.85 + panelOpacity * 0.15})`;
    }
  });

  return (
    <group 
      ref={groupRef}
      position={[baseX, baseY, data.z]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerEnter={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerLeave={() => { setHovered(false); document.body.style.cursor = "auto"; }}
    >
      <Float speed={2.5} rotationIntensity={0.4} floatIntensity={1.2}>
        <ModelErrorBoundary fallback={<ProceduralStation />}>
          <Suspense fallback={<ModelLoadingRing />}>
            <StationModel hovered={hovered} />
          </Suspense>
        </ModelErrorBoundary>
      </Float>

      <Sparkles count={800} scale={[140, 100, 140]} size={0.4} color="#a066ff" opacity={0.3} />

      <Html position={[-45, 0, 0]} zIndexRange={[50, 0]}>
        <div
          ref={infoRef}
          className="absolute top-1/2 flex flex-col justify-center transition-all duration-500 ease-out pointer-events-none"
          style={{ width: "450px", opacity: 0, textAlign: "right" }}
        >
          <div className="absolute top-1/2 right-[-60px] w-20 h-[1px] bg-gradient-to-l from-purple-400 to-transparent shadow-[0_0_20px_rgba(168,85,247,0.5)]" />
          <div className="backdrop-blur-3xl bg-black/60 rounded-[3rem] p-12 border border-purple-500/30 shadow-[0_0_100px_rgba(160,102,255,0.15)] relative overflow-hidden">
             
             {/* Corner Accents */}
             <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-purple-500/40 rounded-tl-3xl" />
             <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-purple-500/40 rounded-br-3xl" />

            <p className="font-mono text-[10px] tracking-[0.5em] text-purple-400 mb-4 uppercase flex items-center justify-end gap-3 font-black">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-[ping_2s_infinite]" />
              {profile.mbti} // DATA_ARCHITECT
            </p>
            <h3 className="text-6xl font-black text-white mb-6 leading-[0.85] tracking-tighter uppercase italic">
              LOGICIAN&rsquo;S <br/><span className="text-[#a066ff] not-italic">QUARTERS</span>
            </h3>
            <p className="text-[13px] text-white/70 leading-relaxed mb-10 font-medium">
              You&rsquo;ve navigated my projects. Now, step into the core architecture of my philosophy. 
              <br/><br/>
              Explore my <span className="text-purple-400 font-bold uppercase tracking-widest">Identity Sink</span> — where technical rigor meets personal narrative.
            </p>
            <div className="flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(160,102,255,0.4)", backgroundColor: "rgba(160,102,255,0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-purple-500/10 border border-purple-400/60 text-purple-400 text-[11px] font-mono tracking-[0.4em] rounded-[1.5rem] transition-all uppercase font-black"
                onClick={(e) => { e.stopPropagation(); onClick(); }}
              >
                DOCK & BRIDGE
              </motion.button>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}