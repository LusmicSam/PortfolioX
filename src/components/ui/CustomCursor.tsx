"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [hidden, setHidden] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springX = useSpring(mouseX, { stiffness: 500, damping: 28, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 28, mass: 0.5 });

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);
    const handleMouseOver = (e: MouseEvent) => {
      if (e.target instanceof Element) {
        const style = window.getComputedStyle(e.target);
        if (style.cursor === "pointer" || e.target.closest("button") || e.target.closest("a")) {
          setIsPointer(true);
          return;
        }
      }
      setIsPointer(document.body.style.cursor === "pointer");
    };
    const handleMouseLeave = () => setHidden(true);
    const handleMouseEnter = () => setHidden(false);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });

    const observer = new MutationObserver(() => {
      setIsPointer(document.body.style.cursor === "pointer");
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      observer.disconnect();
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY]);

  // Render nothing on server — prevents React hydration mismatch
  if (!mounted) return null;

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>

      {/* Primary dot — instant follow */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-[#00ffff] rounded-full pointer-events-none z-[99999] mix-blend-exclusion"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: hidden ? 0 : 1,
        }}
      />

      {/* Outer ghost ring — lagging spring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-[#c4a8ff] pointer-events-none z-[99998]"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: hidden ? 0 : 0.6,
          justifyContent: "center",
          backgroundColor: isPointer ? "rgba(0,255,255,0.1)" : "transparent",
          border: isPointer
            ? "1px solid rgba(0,255,255,0.4)"
            : "1px solid rgba(160,102,255,0.3)",
          boxShadow: isPointer
            ? "0 0 16px rgba(0,255,255,0.3)"
            : "0 0 10px rgba(160,102,255,0.2)",
        }}
        animate={{
          scale: clicked ? 0.8 : isPointer ? 1.6 : 1,
        }}
        transition={{ type: "tween", duration: 0.15 }}
      />
    </>
  );
}
