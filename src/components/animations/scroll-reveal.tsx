"use client";

import { motion } from "framer-motion";
import { useIntersection } from "@/hooks/use-intersection";
import { cn } from "@/lib/utils";
import { Children } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: boolean;
  staggerDelay?: number;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  stagger = false,
  staggerDelay = 0.1,
}: ScrollRevealProps) {
  const { ref, isVisible } = useIntersection({ threshold: 0.1, once: true });

  if (stagger) {
    const childArray = Children.toArray(children);

    return (
      <div ref={ref} className={cn(className)}>
        {childArray.map((child, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={
              isVisible
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 20 }
            }
            transition={{
              duration: 0.5,
              delay: delay + index * staggerDelay,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
          >
            {child}
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={
        isVisible
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 20 }
      }
      transition={{
        duration: 0.5,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
