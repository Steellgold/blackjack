"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track 
      className={cn(
        "relative h-2 w-full grow overflow-hidden rounded-full",
        "bg-white/10 border border-white/30",
        "transition-colors duration-300 ease-in-out"
      )}
    >
      <SliderPrimitive.Range 
        className={cn(
          "absolute h-full backdrop-blur-3xl",
          "bg-white/20",
          "transition-colors duration-300 ease-in-out"
        )} 
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb 
      className={cn(
        "block h-5 w-5 rounded-full backdrop-blur-3xl",
        "bg-white/10 border border-white/30",
        "transition-colors duration-300 ease-in-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
        "hover:bg-white/20",
        "disabled:pointer-events-none disabled:opacity-50"
      )} 
    />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
