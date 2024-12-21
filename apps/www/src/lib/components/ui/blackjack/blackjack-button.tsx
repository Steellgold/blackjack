"use client";

import { cn } from "@/lib/utils";
import type { Component } from "../../utils/component";
import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type BlackjackButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  size?: "default" | "icon" | "small";
  variant?: "default" | "destructive" | "success";
}

export const BlackjackButton: Component<BlackjackButtonProps> = ({ children, className, size = "default", variant = "default", ...props }) => {
  return (
    <button className={cn(
      "bg-white bg-opacity-10 text-white rounded-md flex flex-row items-center group border border-white border-opacity-20",
      "hover:bg-opacity-30 hover:border-opacity-40",
      "transition-colors duration-300 ease-in-out",

      "disabled:bg-opacity-10 disabled:border-opacity-20 disabled:text-opacity-50 disabled:cursor-not-allowed",
      className, {
        "px-3 py-1": size === "default",
        "px-2 py-1 text-sm": size === "small",
        "px-0.5 py-0.5": size === "icon",

        "bg-red-500 border-red-500": variant === "destructive",
        "bg-green-500 border-green-500": variant === "success",
        "bg-opacity-30 border-opacity-40 hover:bg-opacity-40 hover:border-opacity-50": variant !== "default",
      }
    )} {...props}>
      {children}
    </button>
  )
}