"use client";

import { type Component } from "../../utils/component";
import { cn } from "@/lib/utils";
import type { DetailedHTMLProps, HTMLAttributes } from "react";

type BlackjackBadgeVariant = "default" | "success" | "destructive";

type BlackjackBadgeProps = DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> & {
  variant?: BlackjackBadgeVariant;
  size?: "number" | "default";

  blurred?: boolean;
};

export const BlackjackBadge: Component<BlackjackBadgeProps> = ({ 
  children, 
  className, 
  variant = "default",
  blurred = true,
  size = "default",
  ...props 
}) => {
  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold text-white",
        "backdrop-blur-sm transition-colors duration-300 ease-in-out",
        {
          "bg-white/10 border border-white/30": variant === "default",
          "bg-green-500/20 border border-green-500/30": variant === "success",
          "bg-red-500/20 border border-red-500/30": variant === "destructive",

          // Not blurred & bg color
          "backdrop-blur-0": !blurred,
          "bg-white": !blurred && variant === "default",
          "bg-green-500": !blurred && variant === "success",
          "bg-red-500": !blurred && variant === "destructive",

          // Size
          "text-xs px-1 py-0": size === "number",
        },
        className
      )} 
      {...props}
    >
      {children}
    </span>
  );
};