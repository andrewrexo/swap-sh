import * as React from "react";

import { cn } from "@/lib/utils";
import { Card } from "./card";
import { Label } from "./label";
import { AnimatePresence, useAnimationControls, motion } from "framer-motion";

export interface InputProps extends React.InputHTMLAttributes<HTMLDivElement> {}

const LabeledInput = React.forwardRef<
  HTMLDivElement,
  InputProps & {
    children: React.ReactNode;
    inputKey: string;
    type: string;
    handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
>(({ children, className, inputKey, type, handleChange, ...props }, ref) => {
  const inputRef = React.useRef();

  return (
    <Card
      ref={ref}
      className={`relative flex flex-col h-10 w-full rounded-md border border-input bg-background px-3 ring-offset-background file:border-0 file:bg-transparent  placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
    >
      <AnimatePresence>
        <motion.div
          key={inputKey}
          initial={{ opacity: 0.75, x: -14, y: -20 }}
          exit={{ opacity: 0 }}
          className={`absolute pointer-events-none`}
        >
          <p className={`text-muted-foreground`}>{children}</p>
        </motion.div>
      </AnimatePresence>
      <input
        type={type}
        className={cn("h-full bg-transparent focus:border-none focus:outline-none text-sm", className)}
        {...props}
        ref={inputRef}
      />
    </Card>
  );
});

LabeledInput.displayName = "Input";

export { LabeledInput };
