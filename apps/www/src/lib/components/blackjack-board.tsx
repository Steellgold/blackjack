"use client";

import { BlackjackCardsStack } from "./blackjack-card";
import { BlackjackStarting } from "./blackjack-balance";
import { BlackjackBet, BlackjackBets } from "./blackjack-bet";
import { BlackjackChoice } from "./blackjack-choice";
import { BlackjackDeck } from "./blackjack-deck";
import { BlackjackResult } from "./blackjack-result";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";
import { BlackjackButtons } from "./blackjack-menu";
import { useLang } from "@/lib/hooks/use-lang";
import type { ReactElement } from "react";
import { useBlackjack } from "../hooks/use-blackjack";
import { BlackjackCard } from "./ui/blackjack/blackjack-card";
import { handValue } from "../blackjack.utils";

export const BlackjackBoard = (): ReactElement => {
  const { gameStatus, croupierCards, playerCards, balance } = useBlackjack();
  const { lang } = useLang();
  const isMobile = useMediaQuery("(max-width: 640px)");

  if (gameStatus === "BALANCE_START") return <BlackjackStarting />

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-green-900 dark:bg-green-950 relative">
      <div className="z-[2]">
        <BlackjackButtons />
        
        {/* DEALER */}
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 flex flex-col gap-1.5">
          <BlackjackCard>
            <BlackjackCardsStack cards={croupierCards} />
          </BlackjackCard>

          <BlackjackCard className="flex justify-center py-2 flex-row items-center gap-2">
            <span>Total: {handValue(croupierCards)}</span>
            {handValue(croupierCards) > 21 && (
              <>
                <span>&bull;</span>
                <span className="font-bold text-red-500">BUST</span>
              </>
            )}
          </BlackjackCard>
        </div>

        <BlackjackResult />

        {/* PLAYER */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex flex-col gap-1.5">
          <BlackjackCard className="flex justify-center py-2 flex-row items-center gap-2">
            <span>Total: {handValue(playerCards)}</span>
            {handValue(playerCards) > 21 && (
              <>
                <span>&bull;</span>
                <span className="font-bold text-red-500">BUST</span>
              </>
            )}
          </BlackjackCard>

          <BlackjackCard>
            <BlackjackCardsStack cards={playerCards} />
          </BlackjackCard>
        </div>

        {/* BUTTONS */}
        <BlackjackBet />
        <BlackjackChoice />
        <BlackjackDeck />

        {/* BETS */}
        <div className={cn("absolute bottom-5 flex flex-col gap-1.5", {
          "right-5": !isMobile,
          "left-8": isMobile,
        })}>
          <BlackjackCard
            className={`text-center flex justify-center items-center gap-2`}
            style={{
              fontSize: `${Math.max(15 - balance.toString().length, 6)}px`,
            }}
          >
            <span>{balance}{lang === "fr" ? "€" : "$"}</span>
            {/* <BlackjackButton
              disabled={gameStatus !== "BETTING" || (bet !== 0 && balance < bet) || balance >= 500}
              size="icon"
              onClick={() => {
                setBalance(balance + 100);
              }
            }>
              <Plus size={16} />
            </BlackjackButton> */}
          </BlackjackCard>


          <BlackjackCard>
            <BlackjackBets />
          </BlackjackCard>
        </div>
      </div>

      <div className="absolute inset-0 [background-image:radial-gradient(circle,_rgba(255,255,255,0.1)_100%,_transparent_0%)] opacity-10 z-[1]"></div>
    </div>
  )
}