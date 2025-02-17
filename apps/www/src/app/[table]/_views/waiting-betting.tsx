"use client";

import { BlackjackBet } from "@/lib/components/blackjack-bet";
import { BlackjackView } from "../_components/blackjack.view";

export const WaitingBetting = () => {
  return (
    <BlackjackView>
      <BlackjackBet />
    </BlackjackView>
  )
}