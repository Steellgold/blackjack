"use client";

import { BlackjackCardsStack } from "@/lib/components/blackjack-card"
import { BlackjackCard as UIBlackjackCard } from "@/lib/components/ui/blackjack/blackjack-card"
import { useBlackjack } from "@/lib/hooks/use-blackjack"
import { OtherPlayersCardsCard } from "../_components/other-players-cards"
import { getHandValue } from "@blackjack/game/utils"

export const WaitingDistributes = () => {
  const { players, cards: dealerCards, id } = useBlackjack();

  const player = players.find(player => player.id === id);
  if (!player) return <div className="bg-red-500">Player not found !</div>;

  return (
    <div className="h-screen flex flex-col items-center justify-between p-3">
      <UIBlackjackCard variant={getHandValue(dealerCards) > 21 ? "destructive" : "default"}>
        <BlackjackCardsStack cards={dealerCards} playerId="DEALER" />
      </UIBlackjackCard>
      
      <div className="flex flex-wrap gap-11">
        <UIBlackjackCard key={player.id} variant={getHandValue(player.cards) > 21 ? "destructive" : "default"}>
          <BlackjackCardsStack cards={player.cards} playerId={player.id} />
        </UIBlackjackCard>
      </div>

      <OtherPlayersCardsCard />
    </div>
  )
}