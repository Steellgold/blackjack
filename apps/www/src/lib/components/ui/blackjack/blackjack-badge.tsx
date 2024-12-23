"use client";

import type { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";
import type { Component } from "../../utils/component";
import { cn } from "@/lib/utils";

type BlackjackBadgeProps = DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;

export const BlackjackBadge: Component<BlackjackBadgeProps> = ({ children, className, ...props }) => {
  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold text-white",
        "bg-white/10 border border-white/30 backdrop-blur-sm",
        "transition-colors duration-300 ease-in-out",
        className
      )} 
      {...props}
    >
      {children}
    </span>
  );
};