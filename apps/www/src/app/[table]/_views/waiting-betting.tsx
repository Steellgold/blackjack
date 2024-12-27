"use client";

import { BlackjackBet, BlackjackBets } from "@/lib/components/blackjack-bet";
import { BlackjackCardsStack } from "@/lib/components/blackjack-card"
import { BlackjackCard as UIBlackjackCard } from "@/lib/components/ui/blackjack/blackjack-card"
import { useBlackjack } from "@/lib/hooks/use-blackjack"

export const WaitingBetting = () => {
  const { players, id, bettingTimer } = useBlackjack();

  const player = players.find(player => player.id === id);
  if (!player) return <div className="bg-red-500">Player not found !</div>;

  return (
    <div className="h-screen flex flex-col items-center justify-between p-3">
      <UIBlackjackCard>
        <BlackjackCardsStack cards={[]} playerId="DEALER" />
      </UIBlackjackCard>

      <BlackjackBet />
      
      <div className="flex flex-wrap gap-11">
        <UIBlackjackCard>
          <BlackjackCardsStack cards={[]} playerId="" />
        </UIBlackjackCard>
      </div>

      {/* <OtherPlayersCardsCard /> */}
      {/* TODO: OtherPlayersBetting */}
    </div>
  )
}