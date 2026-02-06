"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const defaultVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
};

const defaultTransition = {
  type: "spring" as const,
  stiffness: 260,
  damping: 20,
};

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={defaultVariants}
      transition={defaultTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface PageTransitionWrapperProps {
  children: ReactNode;
  className?: string;
}

export function PageTransitionWrapper({
  children,
  className,
}: PageTransitionWrapperProps) {
  return (
    <AnimatePresence mode="wait">
      <PageTransition className={className}>{children}</PageTransition>
    </AnimatePresence>
  );
}
