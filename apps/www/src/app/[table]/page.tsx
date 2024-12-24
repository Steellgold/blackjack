"use client";

import { BlackjackBadge } from "@/lib/components/ui/blackjack/blackjack-badge";
import { BlackjackButton } from "@/lib/components/ui/blackjack/blackjack-button";
import { BlackjackCard } from "@/lib/components/ui/blackjack/blackjack-card";
import { useBlackjack } from "@/lib/hooks/use-blackjack";
import { useLang } from "@/lib/hooks/use-lang";
import { dylan } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { Copy } from "lucide-react";
import { useParams } from "next/navigation";
import { WaitingPlayers } from "./_views/waiting-players.view";
import { WaitingDistributes } from "./_views/waiting-distributes.view";

const TablePage = () => {
  const { table } = useParams();
  if (typeof table !== "string") return <></>;

  const { lang } = useLang();
  const {
    players,
    baseBalance,
    expectedPlayers,
    gameStatus,
    cards: dealerCards,
    deck,
    id,
    startGame
  } = useBlackjack();

  if (gameStatus == "WAITING_FOR_PLAYERS") return <WaitingPlayers />;
  if (gameStatus == "WAITING_FOR_DISTRIBUTES") return <WaitingDistributes />;
  return <WaitingDistributes />;

  return (
    <p>Game status: {gameStatus}</p>
  )
};

export default TablePage;