"use client";

import React, { forwardRef } from "react";
import { motion } from "framer-motion";

interface CardProps {
  className?: string;
  hoverEffect?: boolean;
  glass?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", hoverEffect = false, glass = false, children, onClick }, ref) => {
    const cardStyles = `${
      glass 
        ? "glass-card" 
        : "bg-card border border-border text-card-foreground"
    } rounded-xl p-5 shadow-sm transition-all duration-300`;

    if (hoverEffect) {
      return (
        <motion.div
          ref={ref as any}
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={`${cardStyles} hover:shadow-md hover:border-primary/20 dark:hover:border-primary/35 ${className}`}
          onClick={onClick}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={`${cardStyles} ${className}`} onClick={onClick}>
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export { Card };
