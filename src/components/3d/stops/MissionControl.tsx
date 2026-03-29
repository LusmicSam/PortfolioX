import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Text, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { TOTAL_DISTANCE } from "../config";

export interface MissionControlProps {
  data: {
    z: number;
    [key: string]: any;
  };
  scrollT?: number;
  onClick: () => void;
}

// Helper for LED status
export interface LedProps {
  color: string;
  position: [number, number, number];
  size?: number;
  blink?: boolean;
}

const Led = ({ color, position, size = 0.5, blink = false }: LedProps) => {
  const ledRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ledRef.current && blink) {
      const material = ledRef.current.material as THREE.MeshStandardMaterial;
      const intensity = 0.6 + Math.sin(clock.elapsedTime * 5) * 0.4;
      material.emissiveIntensity = intensity;
    }
  });
  return (
    <mesh ref={ledRef} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
    </mesh>
  );
};

export function MissionControl({
  data,
  scrollT = 0,
  onClick,
}: MissionControlProps) {
  const groupRef = useRef<THREE.Group>(null);
  const radarArmRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Animated uniforms for screen shader
  const screenMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        glowColor: { value: new THREE.Color(0x00ff44) },
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
        uniform vec3 glowColor;
        varying vec2 vUv;
        void main() {
          vec2 pos = vUv * 2.0 - 1.0;
          float grid = sin(pos.x * 20.0) * sin(pos.y * 15.0);
          float scanline = sin(pos.y * 400.0 + time * 10.0) * 0.5;
          float noise = fract(sin(pos.x * 100.0 + pos.y * 100.0 + time) * 43758.5453);
          vec3 color = glowColor * (0.5 + grid * 0.5 + scanline + noise * 0.2);
          gl_FragColor = vec4(color, 0.8);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, []);

  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime;

    // Animate radar arm rotation
    if (radarArmRef.current) {
      radarArmRef.current.rotation.z = t * 0.8;
    }

    // Update screen shader time
    if (screenRef.current) {
      (screenRef.current.material as THREE.ShaderMaterial).uniforms.time.value = t;
    }

    // Scroll swoop physics
    const effectiveZ = camera.position.z - 600;
    const signedDist = effectiveZ - data.z; // positive = approaching, negative = passed
    const dist = Math.abs(signedDist);

    if (groupRef.current) {
      const baseX = data.x ?? 0;
      const baseY = data.y ?? 0;
      if (dist < 800) {
        const p = Math.max(0, 1 - dist / 600);
        const eased = p * p * (3 - 2 * p);
        // Pull towards camera
        groupRef.current.position.z = data.z + eased * 240;
        // Drift to side relative to baseX
        groupRef.current.position.x = baseX - 15 * eased;
        groupRef.current.position.y = baseY;
        // Scale up slightly for emphasis
        groupRef.current.scale.setScalar(1 + eased * 0.1);
      } else {
        groupRef.current.position.z = data.z;
        groupRef.current.position.x = baseX;
        groupRef.current.position.y = baseY;
        groupRef.current.scale.setScalar(1);
      }
    }

    // Info panel — appears at 280u ahead, full at 150u, fades out 80u after passing
    if (infoRef.current) {
      let panelOpacity = 0;
      if (signedDist > 0 && signedDist < 280) {
        panelOpacity = signedDist < 150 ? 1.0 : Math.min(1, (280 - signedDist) / 130);
      } else if (signedDist <= 0 && signedDist > -80) {
        panelOpacity = (signedDist + 80) / 80;
      }
      infoRef.current.style.opacity = panelOpacity.toString();
      infoRef.current.style.pointerEvents = panelOpacity > 0.05 ? "auto" : "none";
      infoRef.current.style.transform = `translate(${(1 - panelOpacity) * -50}px, -50%) scale(${0.92 + panelOpacity * 0.08})`;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[data.x || 0, 0, data.z]}
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
      {/* Base Platform */}
      <mesh position={[0, -15, 0]} receiveShadow>
        <cylinderGeometry args={[40, 45, 4, 64]} />
        <meshStandardMaterial color="#0a0e1a" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Console Desk */}
      <group position={[0, -8, 0]} rotation-x={-Math.PI / 12}>
        {/* Main Desk Surface */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[70, 2, 35]} />
          <meshStandardMaterial color="#151e2a" metalness={0.7} roughness={0.4} />
        </mesh>

        {/* Control Panels */}
        <mesh position={[0, 2, 10]} rotation-x={Math.PI / 12}>
          <boxGeometry args={[60, 4, 8]} />
          <meshStandardMaterial color="#1a2a3a" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Screen Housing */}
        <mesh position={[0, 6, 8]}>
          <boxGeometry args={[64, 30, 4]} />
          <meshStandardMaterial color="#0f1722" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Main Screen */}
        <mesh ref={screenRef} position={[0, 6, 8.1]} rotation-y={0}>
          <planeGeometry args={[58, 26]} />
          <primitive object={screenMaterial} attach="material" />
        </mesh>

        {/* Additional Small Screens */}
        {[-22, 0, 22].map((x, i) => (
          <mesh key={i} position={[x, 2, 12]} rotation-x={0.2}>
            <planeGeometry args={[14, 8]} />
            <meshStandardMaterial color="#001100" emissive="#00aa44" emissiveIntensity={0.3} />
          </mesh>
        ))}
      </group>

      {/* Radar Dish Assembly */}
      <group ref={radarArmRef} position={[0, 12, -12]}>
        {/* Rotating Arm */}
        <mesh rotation-z={0}>
          <boxGeometry args={[2, 12, 2]} />
          <meshStandardMaterial color="#3a5a7a" metalness={0.9} />
        </mesh>
        {/* Dish */}
        <mesh position={[0, 8, 0]} rotation-x={-Math.PI / 4}>
          <sphereGeometry args={[6, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#5a7a9a" metalness={0.85} roughness={0.2} wireframe />
        </mesh>
        {/* Signal Emitters */}
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <mesh position={[0, 9, -1]}>
            <coneGeometry args={[1, 3, 16]} />
            <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.5} />
          </mesh>
        </Float>
        {/* Ring Pulses */}
        {[2, 3, 4].map((r, i) => (
          <mesh key={i} position={[0, 9, -2]} rotation-x={Math.PI / 2}>
            <torusGeometry args={[r, 0.2, 32, 64]} />
            <meshBasicMaterial color="#00ff88" transparent opacity={0.4 - i * 0.1} blending={THREE.AdditiveBlending} />
          </mesh>
        ))}
        <pointLight color="#00ff88" intensity={1.5} distance={60} />
      </group>

      {/* Radar Sweep Ring */}
      <mesh position={[0, 6, 11]}>
        <ringGeometry args={[10, 12, 128]} />
        <meshBasicMaterial color="#00ff44" transparent opacity={0.2} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[0, 6, 11]}>
        <ringGeometry args={[18, 20, 128]} />
        <meshBasicMaterial color="#00ff44" transparent opacity={0.15} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Status LEDs */}
      <Led color="#ff3333" position={[-28, -3, 18]} blink />
      <Led color="#ffff44" position={[-24, -3, 18]} blink />
      <Led color="#44ff44" position={[-20, -3, 18]} />

      {/* Buttons */}
      {[...Array(6)].map((_, i) => (
        <mesh key={i} position={[-18 + i * 8, -2, 12]} rotation-x={0}>
          <cylinderGeometry args={[1.2, 1.2, 0.8, 24]} />
          <meshStandardMaterial color="#ddd" metalness={0.4} emissive="#aaa" emissiveIntensity={0.2} />
        </mesh>
      ))}

      {/* Ambient Lighting */}
      <pointLight position={[0, 15, 15]} intensity={0.8} color="#88aaff" />
      <pointLight position={[0, -5, -10]} intensity={0.5} color="#ffaa88" />
      <ambientLight intensity={0.3} />

      {/* Decorative Particles */}
      <Sparkles count={300} scale={[60, 30, 40]} size={0.3} color="#44aaff" opacity={0.3} />

      {/* Holographic Info Panel */}
      <Html position={[28, 0, 0]} zIndexRange={[20, 0]}>
        <div
          ref={infoRef}
          className="absolute top-1/2 right-0 flex flex-col justify-center transition-all duration-300 ease-out pointer-events-none"
          style={{ width: "360px", opacity: 0, textAlign: "right" }}
        >
          <div className="absolute top-1/2 right-[-45px] w-10 h-[1px] bg-gradient-to-l from-cyan-400 to-transparent" />
          <div className="backdrop-blur-xl bg-black/40 rounded-2xl p-6 border border-cyan-500/30 shadow-2xl">
            <p className="font-mono text-[10px] tracking-[0.2em] text-cyan-400 mb-1">SYSTEM // MISSION CONTROL</p>
            <h3 className="text-3xl font-black text-white mb-3" style={{ textShadow: "0 0 20px cyan" }}>
              COMMS READY
            </h3>
            <p className="text-sm text-white/80 leading-relaxed mb-5">
              All systems nominal. Radar active. Signal integrity: <span className="text-cyan-400 font-mono">98.7%</span>.
              Direct link established. Awaiting your command.
            </p>
            <div className="flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 bg-cyan-500/20 border border-cyan-400 text-cyan-400 text-xs font-mono tracking-widest rounded-lg backdrop-blur-sm shadow-[0_0_15px_rgba(0,255,255,0.3)]"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
              >
                INITIALIZE CONTACT
              </motion.button>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}