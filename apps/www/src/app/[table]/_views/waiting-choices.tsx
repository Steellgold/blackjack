"use client";

import { BlackjackCard } from "@/lib/components/ui/blackjack/blackjack-card";
import { BlackjackView } from "../_components/blackjack.view";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/hooks/use-lang";
import { useBlackjack } from "@/lib/hooks/use-blackjack";

export const WaitingPlayerChoices = () => {
  const { lang } = useLang();
  const { players, id } = useBlackjack();

  const player = players.find((p) => p.id == id);
  if (!player) return null;

  return (
    <BlackjackView>
      <BlackjackCard>
        <div className="flex flex-row justify-center gap-1.5">
          {[0, 1].map((choice) => (
            <div
              className={cn(
                "relative group overflow-hidden",
                "w-20 h-24 flex justify-center items-center",
                "transition-all",
                "rounded cursor-pointer",
                "font-semibold text-1xl",
                "hover:bg-opacity-70", {
                  "bg-green-500 bg-opacity-30 border-2 border-green-500 text-white": choice == 0,
                  "bg-red-500 bg-opacity-30 border-2 border-red-500 text-white": choice == 1,

                  "hover:text-7xl": choice == 0,
                  "hover:text-5xl": choice == 1
                }
              )}
              key={choice}
            >
              <div className={
                cn("flex flex-col -space-y-4 group-hover:-space-y-3 transition-all", {
                  "group-hover:rotate-12 group-hover:-rotate-12": choice == 0,
                  "group-hover:-rotate-12 group-hover:rotate-12": choice == 1,
                })
              }>
                {Array.from({ length: 3 }).map((_, i) => (
                  <p className={cn({
                    "opacity-0 group-hover:opacity-35": i % 2 == 0,
                    "group-hover:font-black": i % 2 == 1
                  })}>
                    {choice == 0 ? lang == "fr" ? "Tirer" : "Hit" : lang == "fr" ? "Rester" : "Stand"}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </BlackjackCard>
    </BlackjackView>
  )
}