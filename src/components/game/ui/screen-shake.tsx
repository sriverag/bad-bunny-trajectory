"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface ScreenShakeProps {
  trigger: boolean;
  children: React.ReactNode;
  className?: string;
}

export function ScreenShake({ trigger, children, className }: ScreenShakeProps) {
  const [shaking, setShaking] = useState(false);
  const prevTrigger = useRef(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  useEffect(() => {
    if (trigger && !prevTrigger.current) {
      setShaking(true);
      const timer = setTimeout(() => setShaking(false), 400);
      return () => clearTimeout(timer);
    }
    prevTrigger.current = trigger;
  }, [trigger]);

  useEffect(() => {
    if (!trigger) {
      prevTrigger.current = false;
    }
  }, [trigger]);

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      animate={
        shaking
          ? { x: [0, -6, 6, -4, 4, 0] }
          : { x: 0 }
      }
      transition={shaking ? { duration: 0.4, ease: "easeOut" } : undefined}
    >
      {children}
    </motion.div>
  );
}
