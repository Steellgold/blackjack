"use client";

import { BlackjackBadge } from "@/lib/components/ui/blackjack/blackjack-badge";
import { BlackjackButton } from "@/lib/components/ui/blackjack/blackjack-button";
import { BlackjackCard } from "@/lib/components/ui/blackjack/blackjack-card";
import { useBlackjack } from "@/lib/hooks/use-blackjack";
import { useLang } from "@/lib/hooks/use-lang";
import { dylan } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { Copy } from "lucide-react";

export const WaitingPlayers = () => {
  const { lang } = useLang();

  const {
    tableId,
    players,
    baseBalance,
    expectedPlayers,
    id,
    startGame
  } = useBlackjack();

  if (!tableId) return null;

  return (
    <div className="flex flex-col items-center gap-1.5 max-w-xl mx-auto w-full p-3">
      <BlackjackCard className="flex flex-col sm:flex-row justify-between items-left gap-3 sm:gap-1 p-3 w-full">
        <div className="flex flex-col sm:w-7/12 gap-0.5">
          {expectedPlayers == players.length ? (
            <>
              {players[0]?.id === id ? (
                <>
                  <h1 className="text-lg">{lang === "fr" ? "Commencer la partie" : "Start the game"}</h1>
                  <span className="text-xs">
                    {lang === "fr" ? (
                      <>Vous êtes le responsable de la partie, vous pouvez commencer la partie en un clic.</>
                    ) : (
                      <>You are the game host, you can start the game with a single click.</>
                    )}
                  </span>
                </>
              ) : (
                <>
                  <h1 className="text-lg">{lang === "fr" ? "La partie va commencer" : "The game is about to start"}</h1>
                  <span className="text-xs">
                    {lang === "fr" ? (
                      <>La partie va commencer dans un instant, chaque joueur commence avec <BlackjackBadge>{baseBalance}€</BlackjackBadge> en jetons.</>
                    ) : (
                      <>The game will start in a moment, each player starts with <BlackjackBadge>{baseBalance}€</BlackjackBadge> in chips.</>
                    )}
                  </span>
                </>
              )}
            </>
          ) : (
            <>
              <h1 className="text-lg">{lang === "fr" ? "En attente de joueurs" : "Waiting for players"}</h1>
              <span className="text-xs">
                {lang === "fr" ? (
                  <>En attente de <BlackjackBadge>{expectedPlayers - players.length}</BlackjackBadge> joueurs pour commencer la partie, chaque joueur commence avec <BlackjackBadge>{baseBalance}€</BlackjackBadge> en jetons.</>
                ) : (
                  <>Waiting for <BlackjackBadge>{expectedPlayers - players.length}</BlackjackBadge> players to start the game, each player starts with <BlackjackBadge>{baseBalance}€</BlackjackBadge> in chips.</>
                )}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-1">
          <div className="flex sm:flex-col justify-end gap-1">
            <BlackjackButton
              size="small"
              disabled={
                players[0]?.id !== id
                // || players.length !== expectedPlayers
              }
              onClick={() => startGame(tableId)}
            >
              {lang === "fr" ? "Commencer la partie" : "Start the game"}
            </BlackjackButton>

            <BlackjackButton size="small" className="flex items-center gap-1.5">
              <Copy className="w-4 h-4" />
              {lang === "fr" ? "Copier le code" : "Copy code"}
            </BlackjackButton>
          </div>
        </div>
      </BlackjackCard>

      <BlackjackCard className="flex flex-wrap sm:flex-row justify-center items-left gap-1.5 sm:gap-1.5 p-3 w-full">
        {players.map((player) => (
          <BlackjackCard key={player.id} className="flex flex-col items-center gap-3">
            <img src={createAvatar(dylan, { seed: player.name || "Joueur" }).toDataUri()} alt="Avatar" className="rounded-md w-14 h-14 sm:w-16 sm:h-16" />
            <span className="font-bold">{player.name}</span>
          </BlackjackCard>
        ))}
        {Array.from({ length: expectedPlayers - players.length }).map((_, i) => (
          <BlackjackCard key={i} className="flex flex-col items-center gap-3 border-dashed">
            <div className="flex w-14 h-14 sm:w-16 sm:h-16 bg-gray-200/10 justify-center items-center rounded-md" />
            <span className="bg-gray-200/10 w-14 sm:w-16 h-4 rounded-md mt-0.5"></span>
          </BlackjackCard>
        ))}
      </BlackjackCard>
    </div>
  )
};