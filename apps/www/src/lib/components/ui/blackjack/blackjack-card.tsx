"use client";

import { cn } from "@/lib/utils";
import React, { type PropsWithChildren } from "react";
import type { Component } from "../../utils/component";

export type BlackjackCardVariant = "default" | "destructive" | "success" | "warning";

type BlackjackCardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: BlackjackCardVariant;
  blurredMax?: boolean;

  connected?: false | "to-top" | "to-bottom";
}

export const BlackjackCard: Component<BlackjackCardProps> = ({
  children,
  className,
  variant = "default",
  blurredMax = false,
  connected = false,
  ...props }) => {
  return (
    <div className={cn(
      "bg-white bg-opacity-10 border p-3 border-white border-opacity-20",
      "transition-colors duration-300 ease-in-out",
      className, {
        "bg-red-500 border-red-600 bg-opacity-25": variant === "destructive",
        "bg-green-500 border-green-300": variant === "success",
        "bg-yellow-500 border-yellow-300": variant === "warning",

        "rounded-md": !connected,
        "rounded-t-md": connected === "to-bottom",
        "rounded-b-md": connected === "to-top",

        "backdrop-blur-3xl": blurredMax
      }
    )} {...props}>
      {children}
    </div>
  )
}