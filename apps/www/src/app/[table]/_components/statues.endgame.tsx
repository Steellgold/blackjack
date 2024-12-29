"use client";

import { BlackjackCard } from "@/lib/components/ui/blackjack/blackjack-card";
import { useBlackjack } from "@/lib/hooks/use-blackjack";
import { useLang } from "@/lib/hooks/use-lang";
import type { ReactElement } from "react";

export const EndedGameStatues = (): ReactElement => {
  const { gameStatus, players, id } = useBlackjack();
  const { lang } = useLang();

  const player = players.find(player => player.id === id);
  if (!player) return <div className="bg-red-500">Player not found !</div>;

  if (gameStatus !== "WAITING_FOR_DEALER") return <></>;

  const bets: number = player.bets.reduce((acc, bet) => acc + bet, 0);

  if (["BUST", "LOSE"].includes(player.status)) {
    return (
      <BlackjackCard variant="destructive">
        <div className="text-center flex flex-col gap-1">
          {
            player.status === "BUST" &&
              <p>{lang === "fr" ? "Vous avez perdu, vous avez dépassé 21 points !" : "You lost, you've busted !"}</p>
          }
          
          {
            player.status === "LOSE" &&
              <p>
                {lang === "fr"
                  ? "Vous avez perdu, le croupier a un meilleur score !"
                  : "You lost, the dealer has a better score !"
                }
              </p>
          }

          <span className="text-sm">
            {lang === "fr" ? "Votre mise de " : "Your bet of "}
            <span className="font-bold">
              {bets}
              {lang === "fr" ? "€" : "$"}&nbsp;
            </span>
            {lang === "fr" ? "a été perdue." : "was lost."}
          </span>
        </div>
      </BlackjackCard>
    )
  } else if (["WIN", "BLACKJACK"].includes(player.status)) {
    return (
      <BlackjackCard variant="success">
        <div className="text-center flex flex-col gap-1">
          {
            player.status === "WIN" &&
              <p>
                {lang === "fr"
                  ? "Vous avez gagné, vous avez un meilleur score que le croupier !"
                  : "You won, you have a better score than the dealer !"
                }
              </p>
          }

          {
            player.status === "BLACKJACK" &&
              <p>
                {lang === "fr"
                  ? "Vous avez gagné, vous avez un blackjack !"
                  : "You won, you have a blackjack !"
                }
              </p>
          }

          <span className="text-sm">
            {lang === "fr" ? "Votre mise de " : "Your bet of "}
            <span className="font-bold">
              {bets}
              {lang === "fr" ? "€" : "$"}&nbsp;
            </span>

            {
              player.status === "BLACKJACK"
                ? lang === "fr"
                  ? "a été multipliée par 2.5 !"
                  : "was multiplied by 2.5 !"
                : lang === "fr"
                  ? "a été doublée !"
                  : "was doubled !"
            }
          </span>
        </div>
      </BlackjackCard>
    )
  } else if (player.status === "PUSH") {
    return (
      <BlackjackCard variant="warning">
        <div className="text-center flex flex-col gap-1">
          <p>
            {lang === "fr"
              ? "Égalité, vous avez le même score que le croupier !"
              : "Push, you have the same score as the dealer !"
            }
          </p>

          <span className="text-sm">
            {lang === "fr" ? "Votre mise de " : "Your bet of "}
            <span className="font-bold">
              {bets}
              {lang === "fr" ? "€" : "$"}&nbsp;
            </span>
            {lang === "fr" ? "vous est rendue." : "is returned to you."}
          </span>
        </div>
      </BlackjackCard>
    )
  }

  return (
    <p>Unknown status {player.status}</p>
  );
}