// import { useRef, useMemo } from "react";
// import { useFrame } from "@react-three/fiber";
// import { Html, Billboard } from "@react-three/drei";
// import * as THREE from "three";
// export type CommitEntry = { name: string; size: number };

// export function WormholeTimeline({ data, scrollT, commits, onClick }: { data: any, scrollT: number, commits: CommitEntry[], onClick: () => void }) {
//   const groupRef = useRef<THREE.Group>(null);
//   const tunnelRef = useRef<THREE.Mesh>(null);
//   const dataParticlesRef = useRef<THREE.Points>(null);
//   const labelRef = useRef<HTMLDivElement>(null);

//   const tunnelCurve = useMemo(() => {
//     return new THREE.CatmullRomCurve3([
//       new THREE.Vector3(0, 0, 0),
//       new THREE.Vector3(15, 20, -500),
//       new THREE.Vector3(-15, -15, -1200),
//       new THREE.Vector3(20, 10, -2200),
//       new THREE.Vector3(0, 0, -3500)
//     ]);
//   }, []);

//   const dataGeo = useMemo(() => {
//     const geo = new THREE.BufferGeometry();
//     if (commits.length === 0) {
//       // Dummy data if API fails or loading
//       const positions = new Float32Array(300);
//       for (let i = 0; i < 100; i++) {
//         positions[i * 3] = (Math.random() - 0.5) * 40;
//         positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
//         positions[i * 3 + 2] = -Math.random() * 150;
//       }
//       geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
//       return geo;
//     }
//     const positions = new Float32Array(commits.length * 3);
//     commits.forEach((c, i) => {
//       const angle = (i / commits.length) * Math.PI * 16;
//       const radius = 8 + (Math.random() * 6);
//       positions[i * 3] = Math.cos(angle) * radius;
//       positions[i * 3 + 1] = Math.sin(angle) * radius;
//       positions[i * 3 + 2] = -(i / commits.length) * 3500;
//     });
//     geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
//     return geo;
//   }, [commits]);

//   useFrame(({ clock, camera }) => {
//     const t = clock.elapsedTime;
//     if (tunnelRef.current) {
//       // @ts-ignore
//       tunnelRef.current.material.uniforms.time.value = t;
//     }
//     if (dataParticlesRef.current) {
//       dataParticlesRef.current.rotation.z = t * 0.1;
//       const positions = dataParticlesRef.current.geometry.attributes.position.array as Float32Array;
//       for (let i = 0; i < positions.length / 3; i++) {
//         positions[i * 3 + 2] += 0.5;
//         if (positions[i * 3 + 2] > 20) positions[i * 3 + 2] -= 170;
//       }
//       dataParticlesRef.current.geometry.attributes.position.needsUpdate = true;
//     }

//     const TOTAL_DISTANCE = 24000;
//     const rawZ = scrollT * -TOTAL_DISTANCE;
//     const distToFront = rawZ - data.z;

//     if (labelRef.current) {
//       if (Math.abs(distToFront) < 800 && Math.abs(distToFront) > 50) {
//         labelRef.current.style.opacity = "1"; labelRef.current.style.display = "flex";
//       } else {
//         labelRef.current.style.opacity = "0"; labelRef.current.style.display = "none";
//       }
//     }

//     // Cinematic Wormhole Physics & Extended Tunnel Ride
//     if (groupRef.current) {
//       // Are we anywhere near the massive tunnel?
//       if (rawZ < data.z + 1400 && rawZ > data.z - 4000) {
//         groupRef.current.visible = true;

//         // Ambient twisting of the timeline
//         groupRef.current.rotation.z = t * 0.05;
//         groupRef.current.rotation.x = Math.sin(t * 0.8) * 0.05;
//         groupRef.current.rotation.y = Math.cos(t * 0.5) * 0.05;

//         // Frontal approach effect
//         if (distToFront > 0 && distToFront < 1200) {
//           let p = Math.max(0, 1 - (distToFront / 1200)); 
//           const eased = p * p * (3 - 2 * p);
          
//           groupRef.current.position.z = data.z + eased * 350;
//           groupRef.current.position.y = Math.sin(p * Math.PI) * 25; 
//           groupRef.current.position.x = Math.cos(p * Math.PI) * -15;
//         } else {
//           // Inside the tunnel (distToFront <= 0) - lock positions to let the camera fly straight through the geometry
//           groupRef.current.position.z = data.z;
//           groupRef.current.position.x = 0;
//           groupRef.current.position.y = 0;
//         }
//       } else {
//         groupRef.current.visible = false;
//       }
//     }
//   });

//   const tunnelMat = useMemo(() => new THREE.ShaderMaterial({
//     uniforms: { time: { value: 0 } },
//     vertexShader: `
//       varying vec2 vUv;
//       void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
//     `,
//     fragmentShader: `
//       uniform float time;
//       varying vec2 vUv;
//       void main() {
//         float wave = sin(vUv.x * 20.0 + time * 5.0) * sin(vUv.y * 20.0 - time * 3.0);
//         gl_FragColor = vec4(0.1, max(0.2, wave * 0.8), 0.6, 0.4 + wave * 0.2);
//       }
//     `,
//     wireframe: true,
//     transparent: true,
//     side: THREE.BackSide,
//   }), []);

//   return (
//     <group ref={groupRef} position={[0, 0, data.z]}
//       onClick={(e) => { e.stopPropagation(); onClick(); }}
//       onPointerEnter={() => document.body.style.cursor = "pointer"}
//       onPointerLeave={() => document.body.style.cursor = "auto"}
//     >
//       <mesh ref={tunnelRef}>
//         <tubeGeometry args={[tunnelCurve, 64, 12, 16, false]} />
//         <primitive object={tunnelMat} attach="material" />
//       </mesh>
//       <points ref={dataParticlesRef}>
//         <primitive object={dataGeo} attach="geometry" />
//         <pointsMaterial color="#00ffff" size={1.2} transparent opacity={0.8} blending={THREE.AdditiveBlending} />
//       </points>

//       <Billboard position={[-25, 20, 0]}>
//         <Html center style={{ pointerEvents: "none" }} zIndexRange={[100,0]}>
//           <div ref={labelRef} className="flex flex-col items-center" style={{ opacity: 0, transition: "opacity 0.4s" }}>
//             <div style={{
//               background: "rgba(0,15,30,0.8)", backdropFilter: "blur(12px)",
//               border: "1px solid rgba(0,255,255,0.4)", borderRadius: 12,
//               padding: "16px 24px", minWidth: 240, textAlign: "center",
//               boxShadow: "0 0 30px rgba(0,255,255,0.15)"
//             }}>
//               <p style={{ color: "#00ffff", fontSize: 9, letterSpacing: "0.2em", fontFamily: "monospace", marginBottom: 6 }}>SYS://GIT-WORMHOLE</p>
//               <p style={{ color: "white", fontSize: 16, fontWeight: 900, letterSpacing: "0.15em" }}>GITHUB TIMELINE</p>
//               <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 4, fontFamily: "monospace" }}>{commits.length} REPOSITORIES INDEXED</p>
//             </div>
//             <div style={{ width: 1, height: 32, background: "rgba(0,255,255,0.5)", marginTop: 4 }} />
//           </div>
//         </Html>
//       </Billboard>

//       {/* Dynamic GitHub Repo Nodes */}
//       {commits.slice(0, 15).map((repo, i) => {
//         const isCyan = i % 2 === 0;
//         const color = isCyan ? "#00ffff" : "#a066ff";
//         const angle = (i / 15) * Math.PI * 10; // Intensive tight spiral
//         const zOff = -(i * 200) - 100; // Spread heavily deep into the tunnel (-100 to -3100)
//         const radius = 5 + Math.sin(i * 1.5) * 4;
        
//         const x = Math.cos(angle) * radius;
//         const y = Math.sin(angle) * radius;

//         return (
//           <group key={repo.name} position={[x, y, zOff]}>
//             <mesh>
//               <sphereGeometry args={[0.6, 16, 16]} />
//               <meshBasicMaterial color={color} />
//             </mesh>
//             <Billboard position={[2, 0, 0]}>
//               <Html center style={{ pointerEvents: "none" }} zIndexRange={[100,0]}>
//                  <div 
//                    className="px-2 py-1 rounded-sm backdrop-blur-md transition-opacity" 
//                    style={{ background: "rgba(0,5,15,0.6)", border: `1px solid ${color}40` }}
//                  >
//                    <p className="text-[10px] font-mono whitespace-nowrap" style={{ color: "white" }}>{repo.name}</p>
//                  </div>
//               </Html>
//             </Billboard>
//           </group>
//         );
//       })}
//     </group>
//   );
// }

///NEW 
import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Billboard, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { TOTAL_DISTANCE } from "../config";

export type CommitEntry = { name: string; size: number; html_url?: string; description?: string };

const getCommitColor = (size: number) => {
  const normalized = Math.min(1, Math.log10(size + 1) / 5);
  const hue = 180 + normalized * 100;
  return new THREE.Color(`hsl(${hue}, 100%, 60%)`);
};

const vortexShader = {
  uniforms: {
    time: { value: 0 },
    glowColor: { value: new THREE.Color(0x00ffff) },
    accentColor: { value: new THREE.Color(0xa066ff) },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 glowColor;
    uniform vec3 accentColor;
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      float r = length(vUv - 0.5) * 2.0;
      float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
      
      float swirl = sin(angle * 8.0 + r * 15.0 - time * 12.0);
      float noise = sin(vUv.x * 50.0 + time) * cos(vUv.y * 50.0 - time);
      
      float mask = 1.0 - smoothstep(0.4, 0.5, r);
      float core = 1.0 - smoothstep(0.0, 0.2, r);
      
      vec3 color = mix(glowColor, accentColor, swirl * 0.5 + 0.5);
      color += noise * 0.1;
      
      float alpha = mask * (0.8 + swirl * 0.2);
      alpha *= (1.0 - core);
      
      gl_FragColor = vec4(color, alpha);
    }
  `,
  transparent: true,
  side: THREE.DoubleSide,
};

export function WormholeTimeline({
  data,
  scrollT,
  commits,
  onClick,
}: {
  data: any;
  scrollT: number;
  commits: CommitEntry[];
  onClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const vortexRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const PORTAL_DEPTH = 800;

  const commitInstances = useMemo(() => {
    if (!commits.length) return [];
    return commits.map((commit, i) => {
      const angle = (i / commits.length) * Math.PI * 2;
      const spiralFactor = i / commits.length;
      
      const radius = 35 + Math.sin(i * 1.5) * 15;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = -(spiralFactor * PORTAL_DEPTH) - 50; 
      
      const logSize = Math.log10(commit.size + 1);
      const size = Math.min(6, 0.5 + logSize * 1.2); 
      const color = getCommitColor(commit.size);

      return {
        position: new THREE.Vector3(x, y, z),
        size,
        color,
        commit,
        index: i,
      };
    });
  }, [commits]);

  const particleCount = 1500;
  const particlePositions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 20 + Math.random() * 80;
      arr[i * 3] = Math.cos(angle) * radius;
      arr[i * 3 + 1] = Math.sin(angle) * radius;
      arr[i * 3 + 2] = -Math.random() * PORTAL_DEPTH;
    }
    return arr;
  }, []);

  const particleGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    return geom;
  }, [particlePositions]);

  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime;

    if (vortexRef.current) {
      // @ts-ignore
      vortexRef.current.material.uniforms.time.value = t;
      vortexRef.current.rotation.z = -t * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.1;
      ringRef.current.rotation.x = Math.sin(t * 0.5) * 0.1;
    }

    if (particlesRef.current) {
      const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const x = pos[i * 3];
        const y = pos[i * 3 + 1];
        const angle = Math.atan2(y, x) + 0.02;
        const radius = Math.sqrt(x * x + y * y) * 0.995;
        
        pos[i * 3] = Math.cos(angle) * radius;
        pos[i * 3 + 1] = Math.sin(angle) * radius;
        pos[i * 3 + 2] += 2;
        
        if (pos[i * 3 + 2] > 50 || radius < 5) {
          const newAngle = Math.random() * Math.PI * 2;
          const newRadius = 60 + Math.random() * 40;
          pos[i * 3] = Math.cos(newAngle) * newRadius;
          pos[i * 3 + 1] = Math.sin(newAngle) * newRadius;
          pos[i * 3 + 2] = -PORTAL_DEPTH;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Use -75 offset to match updated CameraRig formula (smoothZ + 75)
    const effectiveZ = camera.position.z - 75;
    const distToFront = effectiveZ - data.z;

    if (groupRef.current) {
      const inRange = effectiveZ < data.z + 1500 && effectiveZ > data.z - 2500;
      groupRef.current.visible = inRange;

      if (inRange) {
        const baseX = data.x || 0;
        const baseY = data.y || 0;
        
        groupRef.current.position.x = baseX + Math.sin(t * 0.5) * 5;
        groupRef.current.position.y = baseY + Math.cos(t * 0.8) * 5;

        if (distToFront > 0 && distToFront < 1000) {
          let p = 1 - distToFront / 1000;
          const eased = p * p * (3 - 2 * p);
          groupRef.current.position.z = data.z + eased * 400;
        } else {
          groupRef.current.position.z = data.z;
        }
      }
    }

    if (labelRef.current) {
      const isNear = Math.abs(distToFront) < 800;
      labelRef.current.style.opacity = isNear ? "1" : "0";
      labelRef.current.style.display = isNear ? "flex" : "none";
    }
  });

  return (
    <group
      ref={groupRef}
      position={[data.x || 0, 0, data.z]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerEnter={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerLeave={() => { setHovered(false); document.body.style.cursor = "auto"; }}
    >
      <mesh ref={ringRef}>
        <torusGeometry args={[50, 2, 16, 100]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} metalness={1} roughness={0} />
      </mesh>

      <mesh ref={vortexRef} position={[0, 0, -2]}>
        <circleGeometry args={[48, 64]} />
        <shaderMaterial args={[vortexShader]} transparent side={THREE.DoubleSide} />
      </mesh>

      <points ref={particlesRef}>
        <primitive object={particleGeometry} attach="geometry" />
        <pointsMaterial color="#a066ff" size={0.4} transparent opacity={0.5} blending={THREE.AdditiveBlending} />
      </points>

      {commitInstances.map((instance) => (
        <CommitNode
          key={instance.commit.name}
          position={instance.position}
          size={instance.size}
          color={instance.color}
          commit={instance.commit}
          index={instance.index}
        />
      ))}

      <Billboard position={[0, 65, 0]}>
        <Html center style={{ pointerEvents: "none" }} zIndexRange={[100, 0]}>
          <div ref={labelRef} className="flex flex-col items-center transition-opacity duration-500" style={{ opacity: 0 }}>
            <div className="bg-black/60 backdrop-blur-xl border border-cyan-500/50 rounded-2xl px-8 py-5 text-center shadow-[0_0_50px_rgba(0,255,255,0.2)]">
              <p className="text-[10px] font-mono tracking-[0.5em] text-cyan-400 mb-2 uppercase">Multiverse Gateway</p>
              <h4 className="text-white text-3xl font-black tracking-tighter uppercase">{commits.length} REPOS FOUND</h4>
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent my-3" />
              <p className="text-xs text-cyan-200/50 font-mono tracking-widest uppercase italic">Initializing Timeline Stream...</p>
            </div>
            <div className="w-[1px] h-12 bg-gradient-to-b from-cyan-500/50 to-transparent mt-2" />
          </div>
        </Html>
      </Billboard>
      <Sparkles count={300} scale={[50, 50, 200]} size={0.5} color="#00ffff" opacity={0.4} />
    </group>
  );
}

// Individual commit node with hover details
function CommitNode({
  position,
  size,
  color,
  commit,
  index,
}: {
  position: THREE.Vector3;
  size: number;
  color: THREE.Color;
  commit: CommitEntry;
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);

  useFrame(({ camera }) => {
    if (meshRef.current && hovered) {
      // subtle pulse
      meshRef.current.scale.setScalar(1 + Math.sin(Date.now() * 0.005) * 0.1);
    } else if (meshRef.current && !hovered) {
      meshRef.current.scale.setScalar(1);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.8 : 0.2}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
      {/* Glow effect */}
      <mesh scale={[1.5, 1.5, 1.5]}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Billboard label */}
      <Billboard position={[size + 1, 0, 0]}>
        <Html center style={{ pointerEvents: "none" }}>
          <div
            className="px-2 py-1 rounded-md text-xs font-mono whitespace-nowrap backdrop-blur-sm transition-opacity"
            style={{
              background: "rgba(0, 0, 0, 0.6)",
              border: `1px solid ${color.getStyle()}`,
              opacity: hovered ? 1 : 0,
              pointerEvents: "none",
            }}
          >
            {commit.name}
          </div>
        </Html>
      </Billboard>

      {/* Expanded detail panel */}
      <AnimatePresence>
        {open && (
          <Billboard position={[0, size + 1.5, 0]}>
            <Html center style={{ pointerEvents: "auto" }} zIndexRange={[200, 0]}>
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                transition={{ type: "spring", damping: 20 }}
                className="w-56 p-3 rounded-xl shadow-2xl"
                style={{
                  background: "rgba(8, 12, 20, 0.95)",
                  backdropFilter: "blur(12px)",
                  border: `1px solid ${color.getStyle()}80`,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-12 h-[2px]" style={{ background: color.getStyle() }} />
                <p className="text-[8px] font-mono tracking-wider text-slate-400 mb-1">REPOSITORY</p>
                <p className="text-sm font-bold text-white mb-1">{commit.name}</p>
                {commit.description && (
                  <p className="text-xs text-white/60 mb-2 leading-relaxed">{commit.description}</p>
                )}
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-white/50">Commits</span>
                  <span className="font-mono font-bold" style={{ color: color.getStyle() }}>{commit.size}</span>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full mb-3 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${Math.min(100, (commit.size / 300) * 100)}%`, background: color.getStyle() }}
                  />
                </div>
                {commit.html_url && (
                  <a
                    href={commit.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all hover:opacity-80"
                    style={{ background: `${color.getStyle()}20`, border: `1px solid ${color.getStyle()}60`, color: color.getStyle() }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    ⬡ View on GitHub
                  </a>
                )}
              </motion.div>
            </Html>
          </Billboard>
        )}
      </AnimatePresence>
    </group>
  );
}