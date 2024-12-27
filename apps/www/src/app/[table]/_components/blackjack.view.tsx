"use client";

import { BlackjackBets } from "@/lib/components/blackjack-bet";
import { BlackjackCardsStack } from "@/lib/components/blackjack-card";
import { BlackjackCard as UIBlackjackCard } from "@/lib/components/ui/blackjack/blackjack-card";
import type { Component } from "@/lib/components/utils/component";
import { useBlackjack } from "@/lib/hooks/use-blackjack";
import { getHandValue } from "@blackjack/game/utils";
import type { PropsWithChildren } from "react";
import OtherPlayersCardsCard from "./other-players-cards";

export const BlackjackView: Component<PropsWithChildren> = ({ children }) => {
  const { players, cards: dealerCards, id } = useBlackjack();

  const player = players.find(player => player.id === id);
  if (!player) return <div className="bg-red-500">Player not found !</div>;

  return (
    <div className="h-screen flex flex-col items-center justify-between p-3">
      <UIBlackjackCard variant={getHandValue(dealerCards) > 21 ? "destructive" : "default"}>
        <BlackjackCardsStack cards={dealerCards} playerId="DEALER" />
      </UIBlackjackCard>
      
      {children}
      
      <div className="flex flex-wrap gap-11">
        <UIBlackjackCard key={player.id} variant={getHandValue(player.cards) > 21 ? "destructive" : "default"}>
          <BlackjackCardsStack cards={player.cards} playerId={player.id} />
        </UIBlackjackCard>
      </div>

      <UIBlackjackCard className="absolute bottom-4 right-4 p-2">
        <BlackjackBets />
      </UIBlackjackCard>

      <OtherPlayersCardsCard />
    </div>
  )
}