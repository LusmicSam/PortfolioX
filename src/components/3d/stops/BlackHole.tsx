// import { useRef, useState, useMemo } from "react";
// import { useFrame } from "@react-three/fiber";
// import { Html } from "@react-three/drei";
// import * as THREE from "three";

// export function BlackHole({ data, scrollT, onClick }: { data: any, scrollT?: number, onClick: () => void }) {
//   const groupRef = useRef<THREE.Group>(null);
//   const diskMatRef = useRef<THREE.ShaderMaterial | null>(null);
//   const particlesRef = useRef<THREE.Points>(null);
//   const infoRef = useRef<HTMLDivElement>(null);

//   // Build accretion disk ShaderMaterial once
//   const diskMaterial = useMemo(() => {
//     const mat = new THREE.ShaderMaterial({
//       uniforms: { time: { value: 0 } },
//       vertexShader: `
//         varying vec2 vUv;
//         varying vec3 vPos;
//         void main() {
//           vUv = uv; vPos = position;
//           gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//         }`,
//       fragmentShader: `
//         uniform float time;
//         varying vec2 vUv;
//         varying vec3 vPos;
//         void main() {
//           float angle = atan(vPos.y, vPos.x);
//           float dist  = length(vPos.xy);
//           float swirl = sin(angle * 6.0 - time * 2.5 + dist * 0.08) * 0.5 + 0.5;
//           float bright = pow(1.0 - clamp((dist - 18.0) / 38.0, 0.0, 1.0), 2.5);
//           vec3 hot  = vec3(1.0, 0.9, 0.5);
//           vec3 mid  = vec3(1.0, 0.25, 0.0);
//           vec3 cool = vec3(0.1, 0.3, 0.9);
//           vec3 col  = mix(mix(hot, mid, dist / 56.0), cool, pow(dist / 56.0, 3.0));
//           col *= swirl * bright * 1.8;
//           gl_FragColor = vec4(col, swirl * bright * 0.85);
//         }`,
//       transparent: true,
//       side: THREE.DoubleSide,
//       blending: THREE.AdditiveBlending,
//       depthWrite: false,
//     });
//     diskMatRef.current = mat;
//     return mat;
//   }, []);

//   // Spiral-inward particle cloud
//   const [partPositions] = useState(() => {
//     const arr = new Float32Array(2400);
//     for (let i = 0; i < 800; i++) {
//       const angle = Math.random() * Math.PI * 2;
//       const r = 25 + Math.random() * 80;
//       arr[i * 3]     = Math.cos(angle) * r;
//       arr[i * 3 + 1] = (Math.random() - 0.5) * 18;
//       arr[i * 3 + 2] = Math.sin(angle) * r;
//     }
//     return arr;
//   });

//   const baseX = -25;

//   useFrame(({ clock }) => {
//     const t = clock.elapsedTime;
//     if (diskMatRef.current) diskMatRef.current.uniforms.time.value = t;

//     // Scroll Swoop Physics
//     const TOTAL_DISTANCE = 24000;
//     const rawZ = (scrollT || 0) * -TOTAL_DISTANCE;
//     const dist = Math.abs(rawZ - data.z);

//     if (groupRef.current) {
//       groupRef.current.rotation.y = t * 0.02;

//       if (dist < 800) {
//         let p = Math.max(0, 1 - (dist / 600)); 
//         const eased = p * p * (3 - 2 * p);
        
//         // PULL TOWARDS CAMERA
//         groupRef.current.position.z = data.z + eased * 240;
        
//         // DRIFT INWARDS (from X=-25 towards X=-12)
//         const targetX = -12;
//         groupRef.current.position.x = baseX + (targetX - baseX) * eased;
        
//         // Slight scale boost as it gets closer
//         const s = 1.0 + eased * 0.5;
//         groupRef.current.scale.set(s, s, s);
//       } else {
//         groupRef.current.position.z = data.z;
//         groupRef.current.position.x = baseX;
//         groupRef.current.scale.set(1, 1, 1);
//       }
//     }

//     // Spiral particles inward
//     if (particlesRef.current) {
//       const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;
//       for (let i = 0; i < 800; i++) {
//         const x = pos[i * 3], z = pos[i * 3 + 2];
//         const a = Math.atan2(z, x) + 0.018;
//         const r = Math.sqrt(x * x + z * z) - 0.35;
//         if (r < 14) {
//           const na = Math.random() * Math.PI * 2;
//           const nr = 60 + Math.random() * 40;
//           pos[i * 3] = Math.cos(na) * nr; pos[i * 3 + 2] = Math.sin(na) * nr;
//           pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
//         } else {
//           pos[i * 3] = Math.cos(a) * r; pos[i * 3 + 2] = Math.sin(a) * r;
//           pos[i * 3 + 1] *= 0.97;
//         }
//       }
//       particlesRef.current.geometry.attributes.position.needsUpdate = true;
//     }

//     // UI Panel Animation
//     if (infoRef.current) {
//       if (dist < 600) {
//         const progress = 1 - (dist / 600);
//         infoRef.current.style.opacity = progress.toString();
//         infoRef.current.style.pointerEvents = "auto";
//         const slideOffset = (1 - progress) * 80;
//         infoRef.current.style.transform = `translate(${slideOffset}px, -50%) scale(${0.8 + progress * 0.2})`;
//       } else {
//         infoRef.current.style.opacity = "0";
//         infoRef.current.style.pointerEvents = "none";
//       }
//     }
//   });

//   // Calculate info panel base width. We give it enough clearance from the 18 radius disk + particle cloud
//   const panelX = 35; 

//   return (
//     <group 
//       position={[baseX, 0, data.z]} 
//       onClick={(e) => { e.stopPropagation(); onClick(); }}
//       onPointerEnter={() => document.body.style.cursor = "pointer"}
//       onPointerLeave={() => document.body.style.cursor = "auto"}
//     >
//       <group ref={groupRef}>
//         {/* Singularity */}
//         <mesh><sphereGeometry args={[14, 64, 64]} /><meshBasicMaterial color="#000000" /></mesh>
        
//         {/* Photon sphere glow */}
//         <mesh><sphereGeometry args={[16, 32, 32]} /><meshBasicMaterial color="#ff8800" transparent opacity={0.12} blending={THREE.AdditiveBlending} side={THREE.BackSide} depthWrite={false} /></mesh>
        
//         {/* Accretion disk — GLSL */}
//         <mesh rotation-x={Math.PI * 0.42}>
//           <ringGeometry args={[18, 56, 96]} />
//           <primitive object={diskMaterial} attach="material" />
//         </mesh>
        
//         {/* Secondary disk (polar) */}
//         <mesh rotation-x={Math.PI * 0.12} rotation-z={0.6}>
//           <ringGeometry args={[18, 36, 64]} />
//           <primitive object={diskMaterial.clone()} attach="material" />
//         </mesh>
        
//         {/* Gravitational lens haze */}
//         <mesh><sphereGeometry args={[22, 32, 32]} /><meshBasicMaterial color="#220055" transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.BackSide} /></mesh>
        
//         {/* Infalling particles */}
//         <points ref={particlesRef}>
//           <bufferGeometry><bufferAttribute attach="attributes-position" args={[partPositions, 3]} /></bufferGeometry>
//           <pointsMaterial color="#ff9944" size={0.8} transparent opacity={0.75} blending={THREE.AdditiveBlending} sizeAttenuation depthWrite={false} />
//         </points>
        
//         <pointLight color="#ff5500" intensity={4} distance={200} decay={2} />

//         {/* Glassmorphic Auto-Reveal Detail Panel */}
//         <Html position={[panelX, 0, 0]}>
//           <div 
//             ref={infoRef} 
//             className="absolute top-1/2 flex flex-col justify-center transition-all duration-100 ease-linear pointer-events-none"
//             style={{ 
//               opacity: 0, 
//               width: "360px",
//               left: 0, 
//               textAlign: "left",
//             }}
//           >
//             {/* Connector Line */}
//             <div className="absolute top-1/2 h-[1px] bg-white/20 left-[-60px]" style={{ width: "50px" }} />

//             <p className="font-mono text-[10px] tracking-widest uppercase mb-1 text-[#ff8800]">
//               Event Horizon
//             </p>
//             <h3 className="text-4xl font-black text-white mb-2" style={{ textShadow: `0 0 30px #ff5500` }}>
//               RÉSUMÉ
//             </h3>
//             <p className="text-sm text-white/80 mb-4 leading-relaxed tracking-wide backdrop-blur-md bg-[#ff5500]/5 border border-[#ff5500]/20 p-4 rounded-lg shadow-[0_0_30px_rgba(255,85,0,0.15)]">
//               Cross the point of no return. Retrieve my full professional dossier, including skills, deeply technical project architectures, and work philosophy.
//             </p>
            
//             <div className="flex justify-start gap-3 mt-2">
//               <span className="px-3 py-1 bg-[#ff5500]/20 text-[#ff8800] border border-[#ff5500]/50 text-[10px] uppercase font-mono tracking-widest rounded shadow-[0_0_15px_rgba(255,85,0,0.5)]">
//                 Click to Extract
//               </span>
//             </div>
//           </div>
//         </Html>
//       </group>
//     </group>
//   );
// }
import { useRef, useState, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Float, Trail, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { TOTAL_DISTANCE } from "../config";

export function BlackHole({ data, scrollT = 0, onClick }: { data: any; scrollT?: number; onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const diskRef = useRef<THREE.Mesh>(null);
  const lensRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // ---- Enhanced accretion disk shader ----
  const diskMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        innerRadius: { value: 16.0 },
        outerRadius: { value: 58.0 },
        brightness: { value: 1.2 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float innerRadius;
        uniform float outerRadius;
        uniform float brightness;
        varying vec2 vUv;
        
        void main() {
          // Convert UV to polar coordinates centered at (0.5,0.5)
          vec2 pos = vUv * 2.0 - 1.0;
          float r = length(pos);
          float angle = atan(pos.y, pos.x);
          
          // Normalize radius to 0..1 range between inner and outer radii
          float radiusNorm = (r - innerRadius/outerRadius) / (1.0 - innerRadius/outerRadius);
          radiusNorm = clamp(radiusNorm, 0.0, 1.0);
          
          // Spiral pattern (multiple arms)
          float spiral1 = sin(angle * 6.0 - time * 2.5 + radiusNorm * 20.0);
          float spiral2 = cos(angle * 4.0 + time * 1.8 + radiusNorm * 15.0);
          float swirl = (spiral1 + spiral2) * 0.5 + 0.5;
          
          // Turbulence (fractal noise)
          float turbulence = sin(angle * 12.0 - time * 4.0) * cos(radiusNorm * 30.0 - time * 2.0);
          swirl += turbulence * 0.2;
          
          // Color gradient: hot inner (orange) to cooler outer (red/purple)
          vec3 colorInner = vec3(1.0, 0.6, 0.2);  // orange
          vec3 colorMid = vec3(1.0, 0.3, 0.1);   // red-orange
          vec3 colorOuter = vec3(0.8, 0.2, 0.4); // magenta
          vec3 color;
          if (radiusNorm < 0.5) {
            color = mix(colorInner, colorMid, radiusNorm * 2.0);
          } else {
            color = mix(colorMid, colorOuter, (radiusNorm - 0.5) * 2.0);
          }
          
          // Brightness falloff with radius and swirl
          float intensity = brightness * (1.0 - radiusNorm) * (0.6 + swirl * 0.5);
          intensity = clamp(intensity, 0.2, 1.2);
          
          // Optional: add Doppler shift effect (redshift outer edges)
          color = color * intensity;
          
          // Alpha: stronger near inner radius, modulated by swirl
          float alpha = (1.0 - radiusNorm) * (0.5 + swirl * 0.5);
          alpha = clamp(alpha, 0.1, 0.9);
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  // ---- Gravitational lensing shader ----
  const lensMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        strength: { value: 0.15 },
      },
      vertexShader: `
        varying vec3 vPosition;
        uniform float time;
        void main() {
          vec3 pos = position;
          // Simple distortion: push vertices outward based on sine waves
          float distort = sin(pos.x * 2.0 + time) * cos(pos.z * 2.0 + time) * 0.05;
          pos += normalize(pos) * distort;
          vPosition = pos;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec3 vPosition;
        void main() {
          float alpha = 0.08 + sin(vPosition.x * 5.0 + time) * 0.02;
          gl_FragColor = vec4(0.2, 0.1, 0.5, alpha);
        }
      `,
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  // ---- Particle system with orbital dynamics ----
  const particleCount = 1500;
  const particlePositions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 25 + Math.random() * 80;
      arr[i * 3] = Math.cos(angle) * r;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = Math.sin(angle) * r;
    }
    return arr;
  }, []);

  const particleVelocities = useMemo(() => {
    // Store angular velocity and radial speed for each particle
    const velocities = [];
    for (let i = 0; i < particleCount; i++) {
      velocities.push({
        angleSpeed: 0.02 + Math.random() * 0.03,
        radialSpeed: 0.15 + Math.random() * 0.25,
        radius: 25 + Math.random() * 80,
        angle: Math.random() * Math.PI * 2,
      });
    }
    return velocities;
  }, []);

  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime;
    // Update shader uniforms
    if (diskRef.current) {
      diskMaterial.uniforms.time.value = t;
    }
    if (lensRef.current) {
      lensMaterial.uniforms.time.value = t;
    }

    // Update particle positions with orbital motion
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const v = particleVelocities[i];
        // Update angle and radius
        v.angle += v.angleSpeed;
        v.radius -= v.radialSpeed;
        // If particle crosses event horizon, reset to outer edge
        if (v.radius < 14) {
          v.radius = 70 + Math.random() * 30;
          v.angle = Math.random() * Math.PI * 2;
          v.angleSpeed = 0.02 + Math.random() * 0.04;
          v.radialSpeed = 0.1 + Math.random() * 0.2;
        }
        // Compute new position
        const x = Math.cos(v.angle) * v.radius;
        const z = Math.sin(v.angle) * v.radius;
        // Add vertical oscillation
        const y = Math.sin(v.angle * 2) * 3;
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Scroll swoop physics
    const effectiveZ = camera.position.z - 600;
    const signedDist = effectiveZ - data.z; // positive = approaching, negative = passed
    const dist = Math.abs(signedDist);
    const baseX = data.x ?? 0;
    const baseY = data.y ?? 0;

    if (groupRef.current) {
      // Gentle rotation of entire group
      groupRef.current.rotation.y = t * 0.02;

      if (dist < 800) {
        let p = Math.max(0, 1 - dist / 600);
        const eased = p * p * (3 - 2 * p);
        // Pull towards camera
        groupRef.current.position.z = data.z + eased * 240;
        // Drift inward relative to the new baseX
        groupRef.current.position.x = baseX + (13) * eased; 
        groupRef.current.position.y = baseY;
        // Scale up slightly
        groupRef.current.scale.setScalar(1 + eased * 0.3);
      } else {
        groupRef.current.position.z = data.z;
        groupRef.current.position.x = baseX;
        groupRef.current.position.y = baseY;
        groupRef.current.scale.setScalar(1);
      }
    }

    // Animate info panel — approach at 280u, full at 150u, fade out 80u past
    if (infoRef.current) {
      let panelOpacity = 0;
      if (signedDist > 0 && signedDist < 280) {
        panelOpacity = signedDist < 150 ? 1.0 : Math.min(1, (280 - signedDist) / 130);
      } else if (signedDist <= 0 && signedDist > -80) {
        panelOpacity = (signedDist + 80) / 80;
      }
      infoRef.current.style.opacity = panelOpacity.toString();
      infoRef.current.style.pointerEvents = panelOpacity > 0.05 ? "auto" : "none";
      const slideOffset = (1 - panelOpacity) * 60;
      infoRef.current.style.transform = `translate(${slideOffset}px, -50%) scale(${0.9 + panelOpacity * 0.1})`;
    }
  });

  // Event horizon glow animation
  const horizonRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (horizonRef.current) {
      const intensity = 0.8 + Math.sin(clock.elapsedTime * 3) * 0.3;
      (horizonRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[-25, 0, data.z]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerEnter={() => {
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerLeave={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {/* Event Horizon - black sphere */}
      <mesh ref={horizonRef}>
        <sphereGeometry args={[14, 128, 128]} />
        <meshStandardMaterial color="#000000" emissive="#ff4400" emissiveIntensity={0.5} roughness={0.1} metalness={0.8} />
      </mesh>

      {/* Photon sphere - glowing shell */}
      <mesh>
        <sphereGeometry args={[15.5, 64, 64]} />
        <meshBasicMaterial color="#ff8844" transparent opacity={0.15} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
      </mesh>

      {/* Accretion disk (main) */}
      <mesh ref={diskRef} rotation-x={Math.PI * 0.45} rotation-z={0.2}>
        <ringGeometry args={[16, 60, 256]} />
        <primitive object={diskMaterial} attach="material" />
      </mesh>

      {/* Outer faint halo */}
      <mesh rotation-x={Math.PI * 0.5}>
        <ringGeometry args={[58, 85, 128]} />
        <meshBasicMaterial color="#ffaa88" transparent opacity={0.1} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Gravitational lens effect sphere */}
      <mesh ref={lensRef}>
        <sphereGeometry args={[28, 64, 64]} />
        <primitive object={lensMaterial} attach="material" />
      </mesh>

      {/* Particle system */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#ffaa66" size={0.5} transparent opacity={0.8} blending={THREE.AdditiveBlending} sizeAttenuation />
      </points>

      {/* Dynamic light */}
      <pointLight color="#ff6633" intensity={hovered ? 2.5 : 1.5} distance={200} decay={1.5} />

      {/* Decorative sparkles around event horizon */}
      <Sparkles count={300} scale={[30, 30, 30]} size={0.3} color="#ff8844" opacity={0.4} />

      {/* HTML Info Panel */}
      <Html position={[38, 0, 0]} zIndexRange={[20, 0]}>
        <div
          ref={infoRef}
          className="absolute top-1/2 left-0 flex flex-col transition-all duration-300 ease-out pointer-events-none"
          style={{ width: "360px", opacity: 0, textAlign: "left" }}
        >
          <div className="absolute top-1/2 left-[-60px] w-12 h-[1px] bg-gradient-to-r from-orange-500 to-transparent" />
          <div className="backdrop-blur-xl bg-black/40 rounded-2xl p-6 border border-orange-500/30 shadow-2xl">
            <p className="font-mono text-[10px] tracking-[0.2em] text-orange-400 mb-1">EVENT HORIZON</p>
            <h3 className="text-3xl font-black text-white mb-3" style={{ textShadow: "0 0 20px #ff8844" }}>
              RÉSUMÉ
            </h3>
            <p className="text-sm text-white/80 leading-relaxed mb-5">
              Beyond the point of no return lies my complete professional journey. 
              <br />
              <span className="text-orange-300">Full CV, project architectures, and technical philosophy</span> await.
            </p>
            <div className="flex justify-start gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 bg-orange-500/20 border border-orange-400 text-orange-400 text-xs font-mono tracking-widest rounded-lg backdrop-blur-sm shadow-[0_0_15px_rgba(255,85,0,0.5)]"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
              >
                EXTRACT DOSSIER
              </motion.button>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}