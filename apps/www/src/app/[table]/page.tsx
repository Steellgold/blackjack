"use client";

import { useBlackjack } from "@/lib/hooks/use-blackjack";
import { WaitingPlayers } from "./_views/waiting-players.view";
import { WaitingDistributes } from "./_views/waiting-distributes.view";

const TablePage = () => {
  const { gameStatus } = useBlackjack();

  if (gameStatus == "WAITING_FOR_PLAYERS") return <WaitingPlayers />;
  if (gameStatus == "WAITING_FOR_DISTRIBUTES") return <WaitingDistributes />;
  
  return <WaitingDistributes />;
};

export default TablePage;