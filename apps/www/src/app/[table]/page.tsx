"use client";

import { useBlackjack } from "@/lib/hooks/use-blackjack";
import { WaitingPlayers } from "./_views/waiting-players.view";
import { WaitingBetting } from "./_views/waiting-betting";
import { WaitingPlayerChoices } from "./_views/waiting-choices";
import { BlackjackView } from "./_components/blackjack.view";

const TablePage = () => {
  const { gameStatus } = useBlackjack();

  if (gameStatus == "WAITING_FOR_PLAYERS") return <WaitingPlayers />;
  if (gameStatus == "WAITING_FOR_BETS") return <WaitingBetting />;
  if (gameStatus == "WAITING_FOR_DISTRIBUTES") return <BlackjackView />;
  if (gameStatus == "WAITING_FOR_PLAYER_CHOICES") return <WaitingPlayerChoices />;
  
  return <p>Unknown game status: {gameStatus}</p>;
};

export default TablePage;