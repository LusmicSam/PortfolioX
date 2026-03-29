// import { useRef } from "react";
// import { useFrame } from "@react-three/fiber";
// import { Html } from "@react-three/drei";
// import * as THREE from "three";

// export function SpaceStation({ 
//   data, 
//   scrollT = 0, 
//   onClick 
// }: { 
//   data: any, 
//   scrollT?: number, 
//   onClick: () => void 
// }) {
//   const groupRef = useRef<THREE.Group>(null);
//   const coreRef = useRef<THREE.Mesh>(null);
//   const ringARef = useRef<THREE.Mesh>(null);
//   const ringBRef = useRef<THREE.Mesh>(null);
//   const infoRef = useRef<HTMLDivElement>(null);

//   const baseX = 35; // Default station position
//   const baseY = 5;

//   useFrame(({ clock }) => {
//     const t = clock.elapsedTime;
    
//     // Idle animations
//     if (ringARef.current) ringARef.current.rotation.z = t * 0.12;
//     if (ringBRef.current) ringBRef.current.rotation.z = -t * 0.07;
//     if (coreRef.current) coreRef.current.rotation.y = t * 0.04;

//     // Scroll Swoop Physics
//     const TOTAL_DISTANCE = 24000;
//     const rawZ = scrollT * -TOTAL_DISTANCE;
//     const dist = rawZ - data.z;
//     const absDist = Math.abs(dist);

//     if (groupRef.current) {
//       if (absDist < 800) {
//         let p = Math.max(0, 1 - (absDist / 600)); 
//         const eased = p * p * (3 - 2 * p);
        
//         // PULL TOWARDS CAMERA
//         groupRef.current.position.z = data.z + eased * 240;
        
//         // DRIFT INWARDS (from X=35 down to X=15)
//         const targetX = 15;
//         groupRef.current.position.x = baseX + (targetX - baseX) * eased;
//       } else {
//         groupRef.current.position.z = data.z;
//         groupRef.current.position.x = baseX;
//       }
//     }

//     // UI Panel Animation
//     if (infoRef.current) {
//       if (absDist < 600) {
//         const progress = 1 - (absDist / 600);
//         infoRef.current.style.opacity = progress.toString();
//         infoRef.current.style.pointerEvents = "auto";
//         // Slide out gracefully
//         const slideOffset = (1 - progress) * -80;
//         infoRef.current.style.transform = `translate(${slideOffset}px, -50%) scale(${0.8 + progress * 0.2})`;
//       } else {
//         infoRef.current.style.opacity = "0";
//         infoRef.current.style.pointerEvents = "none";
//       }
//     }
//   });

//   const windowCount = 12;
//   const windows = Array.from({ length: windowCount }, (_, i) => {
//     const a = (i / windowCount) * Math.PI * 2;
//     return [Math.cos(a) * 26, Math.sin(a) * 26, 0] as [number, number, number];
//   });

//   return (
//     <group 
//       ref={groupRef}
//       position={[baseX, baseY, data.z]}
//       onClick={(e) => { e.stopPropagation(); onClick(); }}
//       onPointerEnter={() => document.body.style.cursor = "pointer"}
//       onPointerLeave={() => document.body.style.cursor = "auto"}
//     >
//       {/* Central spine */}
//       <mesh rotation-z={Math.PI / 2}>
//         <cylinderGeometry args={[3.5, 3.5, 60, 16]} />
//         <meshStandardMaterial color="#3a4a5a" metalness={0.9} roughness={0.3} />
//       </mesh>
      
//       {/* Glowing Energy Core */}
//       <mesh position={[0, 0, 0]}>
//          <sphereGeometry args={[6, 32, 32]} />
//          <meshBasicMaterial color="#58d8ff" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
//       </mesh>

//       {/* Detail rings along spine */}
//       {[-20, -10, 0, 10, 20].map((x, i) => (
//         <mesh key={i} position={[x, 0, 0]} rotation-x={Math.PI / 2}>
//           <torusGeometry args={[4.5, 0.6, 8, 24]} />
//           <meshStandardMaterial color="#58d8ff" emissive="#58d8ff" emissiveIntensity={0.5} metalness={0.8} />
//         </mesh>
//       ))}

//       {/* Habitat ring A */}
//       <mesh ref={ringARef}>
//         <torusGeometry args={[26, 3, 10, 48]} />
//         <meshStandardMaterial color="#2a2f3a" metalness={0.8} roughness={0.4} />
//       </mesh>

//       {/* Spokes A */}
//       {[0, 60, 120, 180, 240, 300].map((deg, i) => (
//         <mesh key={i} rotation-z={deg * Math.PI / 180}>
//           <cylinderGeometry args={[0.5, 0.5, 26, 6]} />
//           <meshStandardMaterial color="#2a3a4a" metalness={0.8} />
//         </mesh>
//       ))}

//       {/* Glowing porthole windows on ring */}
//       {windows.map(([wx, wy], i) => (
//         <mesh key={i} position={[wx, wy, 0]}>
//           <sphereGeometry args={[1.2, 8, 8]} />
//           <meshBasicMaterial color={i % 3 === 0 ? "#a066ff" : i % 3 === 1 ? "#58d8ff" : "#ffffff"}
//             transparent opacity={0.9} blending={THREE.AdditiveBlending} />
//         </mesh>
//       ))}

//       {/* Secondary ring B */}
//       <mesh ref={ringBRef} position={[15, 0, 0]}>
//         <torusGeometry args={[18, 2.5, 8, 36]} />
//         <meshStandardMaterial color="#1f2533" metalness={0.9} roughness={0.2} />
//       </mesh>

//       {/* Solar panel arrays */}
//       {[1, -1].map((side, i) => (
//         <group key={i} position={[0, side * 42, 0]}>
//           <mesh>
//             <cylinderGeometry args={[0.8, 0.8, 20, 8]} />
//             <meshStandardMaterial color="#2a3a4a" metalness={0.9} />
//           </mesh>
//           {[-1, 0, 1].map((offset, j) => (
//             <mesh key={j} position={[offset * 16, 0, 0]}>
//               <boxGeometry args={[14, 0.4, 7]} />
//               <meshStandardMaterial color="#000" metalness={1} roughness={0.1}
//                 emissive="#001a35" emissiveIntensity={0.8} />
//             </mesh>
//           ))}
//         </group>
//       ))}

//       {/* Docking bay */}
//       <mesh ref={coreRef} position={[-32, 0, 0]} rotation-z={Math.PI / 2}>
//         <sphereGeometry args={[10, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
//         <meshStandardMaterial color="#1a2530" metalness={0.85} roughness={0.2} />
//       </mesh>
//       <mesh position={[-32, 0, 0]} rotation-x={Math.PI / 2}>
//         <torusGeometry args={[6, 0.6, 8, 24]} />
//         <meshBasicMaterial color="#58d8ff" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
//       </mesh>

//       {/* Lighting */}
//       <pointLight color="#a066ff" intensity={5} distance={200} />
//       <pointLight color="#58d8ff" intensity={3} distance={150} position={[-30, 0, 0]} />

//       {/* Glassmorphic Auto-Reveal Detail Panel */}
//       <Html position={[-35, 0, 0]}>
//         <div 
//           ref={infoRef} 
//           className="absolute top-1/2 flex flex-col justify-center transition-all duration-100 ease-linear pointer-events-none"
//           style={{ 
//             opacity: 0, 
//             width: "360px",
//             right: 0, 
//             textAlign: "right",
//           }}
//         >
//           {/* Connector Line */}
//           <div className="absolute top-1/2 h-[1px] bg-white/30 right-[-45px]" style={{ width: "35px" }} />

//           <p className="font-mono text-[10px] tracking-widest uppercase mb-1 text-[#58d8ff]">
//             Orbital Station Alpha
//           </p>
//           <h3 className="text-4xl font-black text-white mb-2" style={{ textShadow: `0 0 20px #a066ff` }}>
//             ABOUT ME
//           </h3>
//           <p className="text-sm text-white/80 mb-4 leading-relaxed tracking-wide backdrop-blur-md bg-white/5 border border-white/10 p-4 rounded-lg shadow-[0_0_30px_rgba(160,102,255,0.15)]">
//             I'm a UI/UX Engineer and Creative Technologist merging 3D experiences with high-performance web architecture. I build digital cosmos instead of typical boring grids. 
//           </p>
          
//           <div className="flex justify-end gap-3 mt-2">
//             <span className="px-3 py-1 bg-[#a066ff]/20 text-[#a066ff] border border-[#a066ff]/50 text-[10px] uppercase font-mono tracking-widest rounded shadow-[0_0_10px_rgba(160,102,255,0.4)]">
//               Click to Dock
//             </span>
//           </div>
//         </div>
//       </Html>
//     </group>
//   );
// }
// // --- SPACE STATION MODEL INTEGRATION ---
import React, { useRef, useState, useMemo, Suspense, Component, ErrorInfo, ReactNode } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, Float, Sparkles, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { TOTAL_DISTANCE } from "../config";

// Error Boundary to handle missing model 404s
class ModelErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
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
    </group>
  );
}

function StationModel({ hovered }: { hovered: boolean }) {
  const { scene } = useGLTF("/space_station.glb");
  const modelRef = useRef<THREE.Group>(null);

  // Traverse to improve materials once loaded
  useMemo(() => {
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        if (obj.material) {
          obj.material.metalness = Math.max(obj.material.metalness || 0, 0.8);
          obj.material.roughness = Math.min(obj.material.roughness || 1, 0.2);
          if (obj.material.emissiveIntensity) obj.material.emissiveIntensity = 2;
        }
      }
    });
  }, [scene]);

  useFrame(({ clock }) => {
    if (modelRef.current) {
      // Very slight local spin
      modelRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={modelRef}>
      {/* Horizontal Orientation: '-' style */}
      <primitive 
        object={scene} 
        scale={100} 
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

  // Station base position (right side)
  const baseX = 45;
  const baseY = 5;

  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime;
    
    // Scroll swoop physics
    const effectiveZ = camera.position.z - 600;
    const dist = effectiveZ - data.z;
    const absDist = Math.abs(dist);

    if (groupRef.current) {
      if (absDist < 1000) {
        let p = Math.max(0, 1 - (absDist / 800)); 
        const eased = p * p * (3 - 2 * p);
        
        // Pull towards camera and center slightly
        groupRef.current.position.z = data.z + eased * 240;
        const targetX = 22;
        groupRef.current.position.x = baseX + (targetX - baseX) * eased;
        
        // Interactive tilt based on mouse position
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.y * 0.15, 0.1);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, -mouse.x * 0.2, 0.1);
        
        // Constant idle sway
        groupRef.current.position.y = baseY + Math.sin(t * 0.5) * 2;
      } else {
        groupRef.current.position.z = data.z;
        groupRef.current.position.x = baseX;
        groupRef.current.rotation.x = 0;
        groupRef.current.rotation.y = 0;
      }
    }

    // UI Panel Logic
    if (infoRef.current) {
      let panelOpacity = 0;
      if (dist > 0 && dist < 350) {
        panelOpacity = dist < 120 ? 1.0 : Math.min(1, (350 - dist) / 230);
      } else if (dist <= 0 && dist > -120) {
        panelOpacity = (dist + 120) / 120;
      }
      infoRef.current.style.opacity = panelOpacity.toString();
      infoRef.current.style.pointerEvents = panelOpacity > 0.1 ? "auto" : "none";
      const slide = (1 - panelOpacity) * -60;
      infoRef.current.style.transform = `translate(${slide}px, -50%) scale(${0.9 + panelOpacity * 0.1})`;
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
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
        <ModelErrorBoundary fallback={<ProceduralStation />}>
          <Suspense fallback={<ProceduralStation />}>
            <StationModel hovered={hovered} />
          </Suspense>
        </ModelErrorBoundary>
      </Float>

      <Sparkles count={500} scale={[120, 80, 120]} size={0.3} color="#00ffff" opacity={0.2} />

      {/* Glassmorphic INFO HUD */}
      <Html position={[-45, 0, 0]} zIndexRange={[50, 0]}>
        <div
          ref={infoRef}
          className="absolute top-1/2 flex flex-col justify-center transition-all duration-300 ease-out pointer-events-none"
          style={{ width: "400px", opacity: 0, textAlign: "right" }}
        >
          <div className="absolute top-1/2 right-[-50px] w-14 h-[1px] bg-gradient-to-l from-cyan-400 to-transparent shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
          <div className="backdrop-blur-3xl bg-black/50 rounded-[2.5rem] p-10 border border-cyan-500/30 shadow-[0_0_80px_rgba(0,180,255,0.1)]">
            <p className="font-mono text-[10px] tracking-[0.4em] text-cyan-400 mb-3 uppercase flex items-center justify-end gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              ORBITAL STATION // GAMMA-01
            </p>
            <h3 className="text-5xl font-black text-white mb-4 leading-[0.9] tracking-tighter uppercase italic">
              MISSION <br/><span className="text-cyan-500 not-italic">CONTROL</span>
            </h3>
            <p className="text-sm text-white/60 leading-relaxed mb-8 font-medium">
              You've cleared the project sectors. Engaging docking sequences for primary base operations. 
              <br/><br/>
              Access the <span className="text-cyan-400 font-bold">Singularity Portal</span> to bridge between archives and real-world comms.
            </p>
            <div className="flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(0,255,255,0.4)", backgroundColor: "rgba(0,255,255,0.15)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-cyan-500/10 border border-cyan-400/60 text-cyan-400 text-xs font-mono tracking-[0.3em] rounded-2xl transition-all uppercase"
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