"use client";

import { useTableTheme, TABLE_THEMES } from "@/lib/hooks/store/use-table-theme.store";
import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";
import type { Component } from "./utils/component";

export const ThemeWrapper: Component<PropsWithChildren> = ({ children }) => {
  const { theme } = useTableTheme();
  const currentTheme = TABLE_THEMES[theme];

  if (!currentTheme) {
    return <>Invalid theme</>;
  }

  return (
    <div className={cn(
      "absolute inset-0 transition-colors duration-300 ease-in-out",
      currentTheme.background,
      currentTheme.className
    )}>
      {children}
    </div>
  );
};