"use client";

import { useBlackjack } from "@/lib/hooks/use-blackjack";
import { WaitingPlayers } from "./_views/waiting-players.view";
import { WaitingDistributes } from "./_views/waiting-distributes.view";
import { WaitingBetting } from "./_views/waiting-betting";

const TablePage = () => {
  const { gameStatus } = useBlackjack();

  if (gameStatus == "WAITING_FOR_PLAYERS") return <WaitingPlayers />;
  if (gameStatus == "WAITING_FOR_BETS") return <WaitingBetting />;
  if (gameStatus == "WAITING_FOR_DISTRIBUTES") return <WaitingDistributes />;
  
  return <p>Unknown game status: {gameStatus}</p>;
};

export default TablePage;