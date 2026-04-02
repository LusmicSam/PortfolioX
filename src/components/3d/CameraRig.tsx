// // CameraRig — cinematic rig with hard gravity-well stops at project planets
// "use client";
// import { useFrame, useThree } from "@react-three/fiber";
// import { useRef } from "react";
// import * as THREE from "three";
// import { JOURNEY, TOTAL_DISTANCE } from "./config";

// interface CameraRigProps {
//   scrollT: number;
//   isWarping: boolean;
//   setHudInfo: (info: any) => void;
//   setIntroAlpha: (a: number) => void;
//   setCameraPos?: (pos: { x: number; y: number; z: number }) => void;
//   targetX?: number;
// }

// const _stopPos = new THREE.Vector3();
// const _cameraPos = new THREE.Vector3();

// // ─── Planet force-stop config ─────────────────────────────────
// // Camera is clamped within this many units of a forceStop planet
// const HARD_STOP_RADIUS = 120;   // units: camera clamps inside here
// // Gravity well starts pulling from this distance
// const GRAVITY_RADIUS = 800;

// export function CameraRig({
//   scrollT,
//   isWarping,
//   setHudInfo,
//   setIntroAlpha,
//   setCameraPos,
//   targetX = 0,
// }: CameraRigProps) {
//   const { camera } = useThree();

//   const smoothZ = useRef(600);
//   const smoothX = useRef(0);
//   const lookX = useRef(0);
//   const lookZ = useRef(600 - 800);
//   const fovRef = useRef((camera as THREE.PerspectiveCamera).fov || 75);
//   const stopFovRef = useRef(75);

//   const lastScrollT = useRef(scrollT);
//   const velocity = useRef(0);
//   const stillTimer = useRef(0);

//   useFrame(({ clock }, delta) => {
//     const t = clock.elapsedTime;

//     // ─── 1. VELOCITY ─────────────────────────────────────────
//     const rawDelta = (scrollT - lastScrollT.current) * TOTAL_DISTANCE;
//     velocity.current = THREE.MathUtils.lerp(velocity.current, rawDelta, 0.15);
//     lastScrollT.current = scrollT;
//     const speed = Math.abs(velocity.current);

//     if (speed < 2) {
//       stillTimer.current = Math.min(stillTimer.current + delta, 2.0);
//     } else {
//       stillTimer.current = Math.max(0, stillTimer.current - delta * 3);
//     }

//     // ─── 2. RAW Z ────────────────────────────────────────────
//     let rawZ = -scrollT * TOTAL_DISTANCE;
//     let finalZ = rawZ;

//     if (!isWarping) {
//       for (const stop of JOURNEY) {
//         const snapZ = stop.z;
//         const d = rawZ - snapZ;
//         const absDist = Math.abs(d);

//         if (stop.forceStop && stop.type === "project") {
//           // HARD STOP: camera is clamped within HARD_STOP_RADIUS
//           if (absDist < HARD_STOP_RADIUS) {
//             finalZ = snapZ;
//             break; // Stop processing — camera is locked
//           }
//           // STRONG gravity well outside hard stop
//           if (absDist < GRAVITY_RADIUS) {
//             const factor = Math.pow(absDist / GRAVITY_RADIUS, 3); // cubic — stronger pull
//             finalZ = snapZ + Math.sign(d) * Math.abs(d) * factor;
//           }
//         } else {
//           // Soft gravity for non-force-stops (moons, station, etc.)
//           if (absDist < 500) {
//             const factor = Math.pow(absDist / 500, 4);
//             finalZ = snapZ + Math.sign(d) * Math.abs(d) * factor;
//           }
//         }
//       }
//     }

//     // ─── 3. SMOOTH Z ─────────────────────────────────────────
//     const lerpFactor = isWarping ? 0.25 : 0.07;
//     smoothZ.current = THREE.MathUtils.lerp(smoothZ.current, finalZ, lerpFactor);

//     // ─── 4. SMOOTH X ─────────────────────────────────────────
//     smoothX.current = THREE.MathUtils.lerp(
//       smoothX.current,
//       targetX,
//       isWarping ? 0.04 : 0.025
//     );

//     // ─── 5. Y POSITION ───────────────────────────────────────
//     const introProgress = Math.min(1, scrollT / 0.04);
//     const baseY = 5 + (15 - 5) * (1 - introProgress);
//     const bobStrength = stillTimer.current / 2.0;
//     const bob = Math.sin(t * 0.4) * 0.5 * bobStrength;

//     // ─── 6. TRAVEL SWAY ──────────────────────────────────────
//     let swayX = 0,
//       swayY = 0;
//     if (!isWarping) {
//       const speedFactor = Math.min(1, speed / 300);
//       swayX = Math.sin(t * 0.25) * 1.5 * speedFactor;
//       swayY = Math.cos(t * 0.18) * 1.0 * speedFactor;
//     } else {
//       swayX = (Math.sin(t * 20) * 0.5 + Math.sin(t * 37) * 0.3) * 2;
//       swayY = (Math.cos(t * 23) * 0.5 + Math.cos(t * 41) * 0.3) * 2;
//     }

//     camera.position.set(
//       smoothX.current + swayX,
//       baseY + swayY + bob,
//       smoothZ.current + 600
//     );

//     // ─── 7. LOOK-AHEAD ───────────────────────────────────────
//     const LOOK_AHEAD = 800;
//     const targetLookX = smoothX.current;
//     const targetLookZ = smoothZ.current + 600 - LOOK_AHEAD;
//     lookX.current = THREE.MathUtils.lerp(lookX.current, targetLookX, 0.05);
//     lookZ.current = THREE.MathUtils.lerp(lookZ.current, targetLookZ, 0.06);
//     camera.lookAt(lookX.current, 0, lookZ.current);

//     // ─── 8. FOV ──────────────────────────────────────────────
//     let targetFOV = isWarping ? 110 : 75;
//     let nearestStopDist = Infinity;
//     for (const stop of JOURNEY) {
//       _stopPos.set(stop.x || 0, 0, stop.z);
//       const d = camera.position.distanceTo(_stopPos);
//       if (d < nearestStopDist) nearestStopDist = d;
//     }
//     if (!isWarping && nearestStopDist < 400) {
//       const pullT = Math.max(0, 1 - nearestStopDist / 400);
//       targetFOV = THREE.MathUtils.lerp(75, 65, pullT);
//     }
//     stopFovRef.current = THREE.MathUtils.lerp(stopFovRef.current, targetFOV, 0.05);
//     fovRef.current = THREE.MathUtils.lerp(fovRef.current, stopFovRef.current, 0.1);
//     (camera as THREE.PerspectiveCamera).fov = fovRef.current;
//     (camera as THREE.PerspectiveCamera).updateProjectionMatrix();

//     camera.rotation.z = isWarping ? Math.sin(t * 10) * 0.03 : 0;

//     // ─── 9. HUD PROXIMITY ────────────────────────────────────
//     const focusZ = smoothZ.current;
//     let activeInfo: (typeof JOURNEY)[number] | null = null;
//     let minDist = Infinity;
//     let nearestStop: (typeof JOURNEY)[number] | null = null;

//     for (const stop of JOURNEY) {
//       const dist = Math.abs(focusZ - stop.z);
//       if (dist < minDist) {
//         minDist = dist;
//         nearestStop = stop;
//       }
//     }

//     // ── Bottom HUD handoff ────────────────────────────────────
//     // For project/moon/station: bottom HUD shows 1500→700u (far approach ONLY).
//     // At <700u the 3D side panel in ProjectPlanet/Moon takes over — no double text.
//     // For non-stop types (sun, asteroids, wormhole, etc.): show on close approach.
//     if (nearestStop) {
//       const type = nearestStop.type;
//       if (type === "project") {
//         // Far approach only — side panel owns the <700u zone
//         if (minDist <= 1500 && minDist > 700) {
//           activeInfo = nearestStop;
//         }
//       } else if (type === "station" || type === "moon") {
//         // These have smaller side panels, allow slightly closer bottom HUD
//         if (minDist <= 1000 && minDist > 350) {
//           activeInfo = nearestStop;
//         }
//       } else {
//         // Sun, asteroids, wormhole, blackhole, radar, void — show when close
//         if (minDist <= 500) {
//           activeInfo = nearestStop;
//         }
//       }
//     }

//     // Far approach label: show stop name 2000→800u away
//     let approachingStop: (typeof JOURNEY)[number] | null = null;
//     if (!activeInfo && nearestStop && minDist > 800 && minDist <= 2000) {
//       approachingStop = nearestStop;
//     }

//     if (activeInfo) {
//       const s = activeInfo;
//       setHudInfo({
//         type: s.type,
//         title: s.title,
//         desc: s.desc,
//         color: s.color,
//         x: s.x,
//         y: s.y,
//         z: s.z,
//         dist: minDist,
//       });
//     } else {
//       setHudInfo({ approaching: approachingStop, dist: minDist });
//     }

//     setIntroAlpha(0);
//     if (setCameraPos) {
//       _cameraPos.copy(camera.position);
//       setCameraPos({ x: _cameraPos.x, y: _cameraPos.y, z: _cameraPos.z });
//     }
//   });

//   return null;
// }
"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { JOURNEY, TOTAL_DISTANCE } from "./config";

interface CameraRigProps {
  scrollT: number;
  isWarping: boolean;
  setHudInfo: (info: any) => void;
  setIntroAlpha: (a: number) => void;
  setCameraPos?: (pos: { x: number; y: number; z: number }) => void;
  targetX?: number;
}

// Pre-allocated vectors
const _stopPos = new THREE.Vector3();
const _cameraPos = new THREE.Vector3();

// ── Force-stop tunables ──────────────────────────────────────
const HARD_STOP_RADIUS = 95;   // locks camera ~95u from planet (camera.z = planet.z + 75)
// Larger gravity radius = deceleration starts from further, feels like space coasting
const GRAVITY_RADIUS = 1400;
const SOFT_GRAVITY_RADIUS = 500; // kept for reference but no longer used for gravity

export function CameraRig({
  scrollT,
  isWarping,
  setHudInfo,
  setIntroAlpha,
  setCameraPos,
  targetX = 0,
}: CameraRigProps) {
  const { camera } = useThree();

  // smoothZ starts at 1125 so camera.z = smoothZ + 75 = 1200 (= canvas initial position)
  const smoothZ = useRef(1125);
  const smoothX = useRef(0);
  const lookX = useRef(0);
  // lookZ starts so camera looks 800u ahead: 1125 + 75 - 800 = 400
  const lookZ = useRef(400);
  const fovRef = useRef((camera as THREE.PerspectiveCamera).fov || 75);
  const stopFovRef = useRef(75);

  const lastScrollT = useRef(scrollT);
  const velocity = useRef(0);
  const stillTimer = useRef(0);

  // Throttling refs
  const hudStateRef = useRef<string | null>(null);
  const introAlphaRef = useRef<number | null>(null);
  const camPosRef = useRef<string | null>(null);
  const lastFovRef = useRef<number>((camera as THREE.PerspectiveCamera).fov || 75);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;

    // ─── 1. Velocity ─────────────────────────────────────────
    const rawDelta = (scrollT - lastScrollT.current) * TOTAL_DISTANCE;
    velocity.current = THREE.MathUtils.lerp(velocity.current, rawDelta, 0.15);
    lastScrollT.current = scrollT;
    const speed = Math.abs(velocity.current);

    if (speed < 2) {
      stillTimer.current = Math.min(stillTimer.current + delta, 2.0);
    } else {
      stillTimer.current = Math.max(0, stillTimer.current - delta * 3);
    }

    // ─── 2. Raw & Final Z ────────────────────────────────────
    const rawZ = -scrollT * TOTAL_DISTANCE;
    let finalZ = rawZ;

    if (!isWarping) {
      // Find the single nearest stop within any gravity well
      let nearestStop: (typeof JOURNEY)[number] | null = null;
      let nearestDist = Infinity;

      for (const stop of JOURNEY) {
        const d = Math.abs(rawZ - stop.z);
        const isForce = stop.forceStop && stop.type === "project";
        const wellRadius = isForce ? GRAVITY_RADIUS : SOFT_GRAVITY_RADIUS;

        if (d < wellRadius && d < nearestDist) {
          nearestDist = d;
          nearestStop = stop;
        }
      }

      // Apply only the nearest stop's gravity
      if (nearestStop) {
        const displacement = rawZ - nearestStop.z;          // signed
        const absDist = Math.abs(displacement);
        const isForce =
          nearestStop.forceStop && nearestStop.type === "project";

        if (isForce) {
          if (absDist < HARD_STOP_RADIUS) {
            // Full lock — camera cannot pass
            finalZ = nearestStop.z;
          } else {
            // Quadratic ease-in deceleration: smooth coast-to-stop
            // t=1 at gravity edge (no pull), t=0 at hard stop (full pull)
            const t = (absDist - HARD_STOP_RADIUS) / (GRAVITY_RADIUS - HARD_STOP_RADIUS);
            const factor = t * t;
            const pullDist = HARD_STOP_RADIUS + (absDist - HARD_STOP_RADIUS) * factor;
            finalZ = nearestStop.z + Math.sign(displacement) * pullDist;
          }
        }
        // Non-force stops (moons, stations): NO gravity — passthrough only.
        // The old quartic soft gravity caused the camera to REVERSE direction
        // when rawZ crossed past non-force stops, creating nauseating oscillation.
      }
    }

    // ─── 3. Smooth Z ─────────────────────────────────────────
    const lerpFactor = isWarping ? 0.25 : 0.07;
    smoothZ.current = THREE.MathUtils.lerp(
      smoothZ.current,
      finalZ,
      lerpFactor,
    );

    // ─── 4. Smooth X ─────────────────────────────────────────
    smoothX.current = THREE.MathUtils.lerp(
      smoothX.current,
      targetX,
      isWarping ? 0.04 : 0.025,
    );

    // ─── 5. Y position ───────────────────────────────────────
    const introProgress = Math.min(1, scrollT / 0.04);
    const baseY = 5 + (15 - 5) * (1 - introProgress);
    const bobStrength = stillTimer.current / 2.0;
    const bob = Math.sin(t * 0.4) * 0.5 * bobStrength;

    // ─── 6. Travel sway ──────────────────────────────────────
    let swayX = 0;
    let swayY = 0;
    if (!isWarping) {
      const speedFactor = Math.min(1, speed / 300);
      swayX = Math.sin(t * 0.25) * 1.5 * speedFactor;
      swayY = Math.cos(t * 0.18) * 1.0 * speedFactor;
    } else {
      swayX =
        (Math.sin(t * 20) * 0.5 + Math.sin(t * 37) * 0.3) * 2;
      swayY =
        (Math.cos(t * 23) * 0.5 + Math.cos(t * 41) * 0.3) * 2;
    }

    camera.position.set(
      smoothX.current + swayX,
      baseY + swayY + bob,
      // +75 offset: camera docks 75u from planet center → camZ = planet.z + 75
      // e.g. planet 1 at z=-3100 → camZ = -3025 ✓
      smoothZ.current + 75,
    );

    // ─── 7. Look-ahead ───────────────────────────────────────
    const LOOK_AHEAD = 800;
    const targetLookX = smoothX.current;
    const targetLookZ = smoothZ.current + 75 - LOOK_AHEAD;
    lookX.current = THREE.MathUtils.lerp(lookX.current, targetLookX, 0.05);
    lookZ.current = THREE.MathUtils.lerp(lookZ.current, targetLookZ, 0.06);
    camera.lookAt(lookX.current, 0, lookZ.current);

    // ─── 8. FOV ──────────────────────────────────────────────
    let targetFOV = isWarping ? 110 : 75;
    let nearestStopDist = Infinity;

    for (const stop of JOURNEY) {
      _stopPos.set(stop.x || 0, 0, stop.z);
      const d = camera.position.distanceTo(_stopPos);
      if (d < nearestStopDist) nearestStopDist = d;
    }

    if (!isWarping && nearestStopDist < 400) {
      const pullT = Math.max(0, 1 - nearestStopDist / 400);
      targetFOV = THREE.MathUtils.lerp(75, 65, pullT);
    }

    stopFovRef.current = THREE.MathUtils.lerp(
      stopFovRef.current,
      targetFOV,
      0.05,
    );
    fovRef.current = THREE.MathUtils.lerp(
      fovRef.current,
      stopFovRef.current,
      0.1,
    );
    const newFov = fovRef.current;
    if (Math.abs(newFov - lastFovRef.current) > 0.01) {
      (camera as THREE.PerspectiveCamera).fov = newFov;
      (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
      lastFovRef.current = newFov;
    }

    camera.rotation.z = isWarping ? Math.sin(t * 10) * 0.03 : 0;

    // --- 9. HUD proximity info ---
    const focusZ = smoothZ.current;
    let activeInfo: (typeof JOURNEY)[number] | null = null;
    let minDist = Infinity;
    let closestStop: (typeof JOURNEY)[number] | null = null;

    for (const stop of JOURNEY) {
      const dist = Math.abs(focusZ - stop.z);
      if (dist < minDist) {
        minDist = dist;
        closestStop = stop;
      }
    }

    if (closestStop) {
      const type = closestStop.type;
      if (type === "project") {
        // Only show HUD when APPROACHING (focusZ is still on positive side of stop).
        // Without this guard: quadratic gravity keeps smoothZ near planet even after
        // scrolling past it, putting minDist in the 100-500 range from BEHIND.
        const isApproachSide = focusZ > closestStop.z - HARD_STOP_RADIUS;
        if (minDist <= 500 && minDist > 100 && isApproachSide) activeInfo = closestStop;
      } else if (type === "station" || type === "moon") {
        const isApproachSide = focusZ > closestStop.z - HARD_STOP_RADIUS;
        if (minDist <= 350 && minDist > 80 && isApproachSide) activeInfo = closestStop;
      } else {
        if (minDist <= 300) activeInfo = closestStop;
      }
    }

    let approachingStop: (typeof JOURNEY)[number] | null = null;
    // Far approach banner: 500→1000u (was 800→2000) — tighter range
    if (!activeInfo && closestStop && minDist > 500 && minDist <= 1000) {
      approachingStop = closestStop;
    }

    // Prepare new HUD state
    const newHudState = activeInfo
      ? {
          type: activeInfo.type,
          title: activeInfo.title,
          desc: activeInfo.desc,
          color: activeInfo.color,
          x: activeInfo.x,
          y: activeInfo.y,
          z: activeInfo.z,
          dist: Math.round(minDist), // Round to avoid tiny floating diffs
        }
      : {
          approaching: approachingStop,
          dist: Math.round(minDist),
        };

    // Lightweight key compare instead of full JSON.stringify
    const newHudKey = activeInfo
      ? `near:${activeInfo.type}:${activeInfo.title}:${Math.round(minDist / 50)}`
      : `approach:${approachingStop?.title ?? "null"}:${Math.round(minDist / 50)}`;
    if (hudStateRef.current !== newHudKey) {
      hudStateRef.current = newHudKey;
      setHudInfo(newHudState);
    }

    // Intro alpha never needs to be called 60fps if it's already 0
    if (introAlphaRef.current !== 0) {
      introAlphaRef.current = 0;
      setIntroAlpha(0);
    }

    // Camera pos throttled integer updates
    if (setCameraPos) {
      _cameraPos.copy(camera.position);
      const cx = Math.round(_cameraPos.x);
      const cy = Math.round(_cameraPos.y);
      const cz = Math.round(_cameraPos.z);
      
      const posStr = `${cx},${cy},${cz}`;
      if (camPosRef.current !== posStr) {
        camPosRef.current = posStr;
        setCameraPos({ x: cx, y: cy, z: cz });
      }
    }
  });

  return null;
}