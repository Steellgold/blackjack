"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/lib/components/ui/dialog";
import { useLang } from "@/lib/hooks/use-lang";
import { BlackjackButton } from "@/lib/components/ui/blackjack/blackjack-button";
import { Palette } from "lucide-react";
import { TABLE_THEMES, useTableTheme } from "../hooks/store/use-table-theme.store";
import { cn } from '../utils';
import { useState } from 'react';

export const TableThemeDialog = () => {
  const { lang } = useLang();
  const { theme, setTheme } = useTableTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <BlackjackButton size="small">
          <Palette className="h-4 w-4" />
        </BlackjackButton>
      </DialogTrigger>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {lang === "fr" ? "Thème de la table" : "Table Theme"}
          </DialogTitle>
          <DialogDescription>
            {lang === "fr" ? "Choisissez un thème pour la table" : "Choose a theme for the table"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-2 mt-4 w-full">
          {Object.values(TABLE_THEMES).map((tableTheme, index, array) => (
            <button
              key={tableTheme.name}
              onClick={() => {
                setTheme(tableTheme.name);
                setIsOpen(false);
              }}
              className={cn(
                "transition-all duration-200 rounded-lg overflow-hidden",
                {
                  "border-2 border-white/60": theme === tableTheme.name,
                  "opacity-80": theme !== tableTheme.name,
                  "col-span-2": Object.values(TABLE_THEMES).length === 1 ||
                  (index === Object.values(TABLE_THEMES).length - 1 && 
                   Object.values(TABLE_THEMES).length % 2 !== 0)
                }
              )}
            >
              <div className={cn(
                "w-full rounded-lg p-4",
                tableTheme.background,
                tableTheme.className
              )}>
                <div className="text-white space-y-2">
                  <h3 className="font-bold">
                    {tableTheme.label[lang as "fr" | "en"]}
                  </h3>
                  <p className="text-xs opacity-80">
                    {tableTheme.description?.[lang as "fr" | "en"]}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};