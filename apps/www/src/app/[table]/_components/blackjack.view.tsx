"use client";

import { BlackjackBets } from "@/lib/components/blackjack-bet";
import { BlackjackCardsStack } from "@/lib/components/blackjack-card";
import { BlackjackCard as UIBlackjackCard } from "@/lib/components/ui/blackjack/blackjack-card";
import type { Component } from "@/lib/components/utils/component";
import { useBlackjack } from "@/lib/hooks/use-blackjack";
import { getHandValue } from "@blackjack/game/utils";
import type { PropsWithChildren } from "react";
import OtherPlayersCardsCard from "./other-players-cards";
import { cn } from "@/lib/utils";
import { BlackjackBadge } from "@/lib/components/ui/blackjack/blackjack-badge";

export const BlackjackView: Component<PropsWithChildren> = ({ children }) => {
  const { players, cards: dealerCards, id } = useBlackjack();

  const player = players.find(player => player.id === id);
  if (!player) return <div className="bg-red-500">Player not found !</div>;

  const dealerHandValue = getHandValue(dealerCards);
  const playerHandValue = getHandValue(player.cards);

  return (
    <div className="h-screen flex flex-col items-center justify-between p-3">
      <div className="flex flex-col gap-0.5">
        <UIBlackjackCard variant={dealerHandValue > 21 ? "destructive" : "default"} connected={dealerHandValue > 0 ? "to-bottom" : false}>
          <BlackjackCardsStack cards={dealerCards} playerId="DEALER" />
        </UIBlackjackCard>

        {dealerHandValue > 0 && (
          <UIBlackjackCard className="py-1 text-center" connected="to-top" variant={dealerHandValue > 21 ? "destructive" : "default"}>
            Total: <span className="font-bold">{dealerHandValue}</span>
          </UIBlackjackCard>
        )}
      </div>
      
      {children}
      
      <div className="flex flex-wrap gap-11">
        <div className="flex flex-col gap-0.5">
          {playerHandValue > 0 && (
            <UIBlackjackCard className="py-1 text-center" connected="to-bottom" variant={playerHandValue > 21 ? "destructive" : "default"}>
              Total: <span className="font-bold">{playerHandValue}</span>
            </UIBlackjackCard>
          )}

          <UIBlackjackCard key={player.id} variant={playerHandValue > 21 ? "destructive" : "default"} connected={playerHandValue > 0 ? "to-top" : false}>
            <BlackjackCardsStack cards={player.cards} playerId={player.id} />
          </UIBlackjackCard>
        </div>
      </div>

      <UIBlackjackCard className="absolute bottom-4 right-4 p-2">
        <BlackjackBets />
      </UIBlackjackCard>

      <OtherPlayersCardsCard />
    </div>
  )
}