"use client";
import { motion } from "framer-motion";

export function Animate({
  children,
  initial = true,
  animateKey,
  className,
}: {
  children: React.ReactNode;
  initial?: boolean;
  animateKey: string;
  className?: string;
}) {
  return (
    <motion.div
      key={animateKey}
      initial={{ opacity: 0, x: initial ? 100 : 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ x: -200, opacity: 0 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
