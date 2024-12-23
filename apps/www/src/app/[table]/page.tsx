"use client";

import { BlackjackBadge } from "@/lib/components/ui/blackjack/blackjack-badge";
import { BlackjackButton } from "@/lib/components/ui/blackjack/blackjack-button";
import { BlackjackCard } from "@/lib/components/ui/blackjack/blackjack-card";
import { useBlackjack } from "@/lib/hooks/use-blackjack";
import { useLang } from "@/lib/hooks/use-lang";
import { getHandValue } from "@blackjack/game/utils";
import { dylan } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { Copy } from "lucide-react";
import { useParams } from "next/navigation";

const TablePage = () => {
  const { table } = useParams();
  const { lang } = useLang();
  const {
    players,
    baseBalance,
    expectedPlayers,
    gameStatus
  } = useBlackjack();

  if (gameStatus == "WAITING_FOR_PLAYERS") {
    return (
      <div className="flex flex-col items-center gap-1.5 max-w-xl mx-auto w-full p-3">
        <BlackjackCard className="flex flex-col sm:flex-row justify-between items-left gap-3 sm:gap-1 p-3 w-full">
          <div className="flex flex-col sm:w-7/12 gap-0.5">
            <h1 className="text-lg">{lang === "fr" ? "En attente de joueurs" : "Waiting for players"}</h1>
            <span className="text-xs">
              {lang === "fr" ? (
                <>En attente de <BlackjackBadge>{expectedPlayers - players.length}</BlackjackBadge> joueurs pour commencer la partie, chaque joueur commence avec <BlackjackBadge>{baseBalance}€</BlackjackBadge> en jetons.</>
              ) : (
                <>Waiting for <BlackjackBadge>{expectedPlayers - players.length}</BlackjackBadge> players to start the game, each player starts with <BlackjackBadge>{baseBalance}€</BlackjackBadge> in chips.</>
              )}
            </span>
          </div>

          <div className="flex items-center justify-end gap-1">
            <div className="flex sm:flex-col justify-end gap-1">
              <BlackjackButton size="small">
                {lang === "fr" ? "Commencer la partie" : "Start the game"}
              </BlackjackButton>

              <BlackjackButton size="small" className="flex items-center gap-1.5">
                <Copy className="w-4 h-4" />
                {lang === "fr" ? "Copier le code" : "Copy code"}
              </BlackjackButton>
            </div>
          </div>
        </BlackjackCard>

        <BlackjackCard className="flex flex-col sm:flex-row justify-between items-left gap-3 sm:gap-1 p-3 w-full">
          {players.map((player) => (
            <BlackjackCard key={player.id} className="flex flex-col items-center gap-3">
              <img src={createAvatar(dylan, { seed: player.name || "Joueur" }).toDataUri()} alt="Avatar" className="rounded-md w-16 h-16" />
              <span className="font-bold">{player.name}</span>
            </BlackjackCard>
          ))}
        </BlackjackCard>

        <div className="justify-center">
          <BlackjackButton size="small" variant="destructive">
            {lang === "fr" ? "Annuler la partie" : "Cancel game"}
          </BlackjackButton>
        </div>
      </div>
    );
  }
};

export default TablePage;