"use client";

import { BlackjackCard } from "@/lib/components/ui/blackjack/blackjack-card";
import { BlackjackView } from "../_components/blackjack.view";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/hooks/use-lang";
import { useBlackjack } from "@/lib/hooks/use-blackjack";
import { BlackjackButton } from "@/lib/components/ui/blackjack/blackjack-button";

export const WaitingPlayerChoices = () => {
  const { lang } = useLang();
  const { players, id, hit, stand } = useBlackjack();

  const player = players.find((p) => p.id == id);
  if (!player) return null;

  const isSelected = () => player.status == "HIT" || player.status == "STAND";
  const isBust = player.status == "BUST";

  const handleHit = async () => {
    try {
      await hit();
    } catch (error) {
      console.error("Error hitting:", error);
    }
  };

  const handleStand = async () => {
    try {
      await stand();
    } catch (error) {
      console.error("Error standing:", error);
    }
  }

  return (
    <BlackjackView>
      <BlackjackCard>
        <p className="text-center text-md bg-opacity-10 p-2 rounded-md bg-black text-white mb-2">
          {!isBust ? (
            <>{lang == "fr" ? "Que voulez-vous faire ?" : "Make your choice"}</>
          ) : (
            <>{lang == "fr" ? "Hors jeu !" : "Bust!"}</>
          )}
        </p>

        <div className="flex flex-row justify-center gap-1.5">
          {[0, 1].map((choice) => (
            <BlackjackButton
              className={cn(
                "relative group overflow-hidden",
                "w-24 h-20 flex justify-center items-center",
                "transition-all",
                "rounded cursor-pointer border-2",
                "font-semibold text-1xl",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "hover:bg-opacity-70", {
                  "bg-green-500 bg-opacity-30 border-2 border-green-500 text-white": choice == 0,
                  "bg-red-500 bg-opacity-30 border-2 border-red-500 text-white": choice == 1,

                  "hover:text-6xl": choice == 0 && lang == "en" && !isSelected(),
                  "hover:text-4xl": (choice == 1 && lang == "en" || choice == 0 && lang == "fr") && !isSelected(),
                  "hover:text-3xl": choice == 1 && lang == "fr" && !isSelected()
                }
              )}
              onClick={choice == 0 ? handleHit : handleStand}
              disabled={isSelected() || isBust}
              key={choice}
            >
              <div className={
                cn("flex flex-col -space-y-4 group-hover:-space-y-3 transition-all", {
                  "group-hover:rotate-12 group-hover:-rotate-12": choice == 0 && !isSelected(),
                  "group-hover:-rotate-12 group-hover:rotate-12": choice == 1 && !isSelected()
                })
              }>
                {Array.from({ length: 3 }).map((_, i) => (
                  <p className={cn({
                    "opacity-0": i % 2 == 0,
                    "group-hover:opacity-35": i % 2 == 0 && !isSelected(),
                    "group-hover:font-black": i % 2 == 1 && !isSelected()
                  })}>
                    {choice == 0 ? lang == "fr" ? "Tirer" : "Hit" : lang == "fr" ? "Rester" : "Stand"}
                  </p>
                ))}
              </div>
            </BlackjackButton>
          ))}
        </div>
      </BlackjackCard>
    </BlackjackView>
  )
}