import { BlackjackBets } from "@/lib/components/blackjack-bet";
import { BlackjackCardsStack } from "@/lib/components/blackjack-card";
import { BlackjackCard as UIBlackjackCard } from "@/lib/components/ui/blackjack/blackjack-card";
import type { Component } from "@/lib/components/utils/component";
import { useBlackjack } from "@/lib/hooks/use-blackjack";
import { getHandValue } from "@blackjack/game/utils";
import type { PropsWithChildren } from "react";
import OtherPlayersCardsCard from "./other-players-cards";
import { BlackjackDeck } from "@/lib/components/blackjack-deck";
import { useLang } from "@/lib/hooks/use-lang";
import { EndedGameStatues } from "./statues.endgame";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "usehooks-ts";
import { ChatComponent } from "@/lib/components/chat";

export const BlackjackView: Component<PropsWithChildren> = ({ children }) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { players, cards: dealerCards, id, deck, gameStatus, baseBalance } = useBlackjack();
  const { lang } = useLang();

  const player = players.find(player => player.id === id);
  if (!player) return <div className="bg-red-500">Player not found !</div>;

  const dealerHandValue = getHandValue(dealerCards);
  const playerHandValue = getHandValue(player.cards);

  return (
    <div className={cn("h-screen flex flex-col items-center justify-between", {
      "p-3": !isMobile,
      "p-3 max-h-screen": isMobile
    })}>
      <div className="flex flex-col gap-0.5">
        <UIBlackjackCard 
          variant={dealerHandValue > 21 ? "destructive" : "default"} 
          connected={dealerHandValue > 0 ? "to-bottom" : false}
          className={cn({
            "p-2": isMobile,
            "p-4": !isMobile
          })}
        >
          <BlackjackCardsStack cards={dealerCards} playerId="DEALER" />
        </UIBlackjackCard>

        {dealerHandValue > 0 && (
          <UIBlackjackCard 
            className={cn("text-center", {
              "py-0.5 text-sm": isMobile,
              "py-1": !isMobile
            })} 
            connected="to-top" 
            variant={dealerHandValue > 21 ? "destructive" : "default"}
          >
            Total: <span className="font-bold">{dealerHandValue}</span>
          </UIBlackjackCard>
        )}
      </div>

      <EndedGameStatues />

      {children}
      
      <div className={cn("flex flex-wrap", {
        "gap-2": isMobile,
        "gap-11": !isMobile
      })}>
        <div className="flex flex-col gap-0.5">
          {playerHandValue > 0 && (
            <UIBlackjackCard 
              className={cn("text-center", {
                "py-0.5 text-sm": isMobile,
                "py-1": !isMobile
              })}
              connected="to-bottom" 
              variant={playerHandValue > 21 ? "destructive" : "default"}
            >
              Total: <span className="font-bold">{playerHandValue}</span>
            </UIBlackjackCard>
          )}

          <UIBlackjackCard 
            key={player.id} 
            variant={playerHandValue > 21 ? "destructive" : "default"} 
            connected={playerHandValue > 0 ? "to-top" : false}
            className={cn({
              "p-2": isMobile,
              "p-4": !isMobile
            })}
          >
            <BlackjackCardsStack cards={player.cards} playerId={player.id} />
          </UIBlackjackCard>
        </div>
      </div>

      <div className={cn("absolute bottom-0 flex flex-row", {
        "left-0 p-3 gap-0.5": isMobile,
        "right-0 p-3 gap-1.5": !isMobile
      })}>
        <div className="flex flex-col justify-end gap-1">
          <UIBlackjackCard>
            <p className="text-center">{player.balance}{lang == "fr" ? "€" : "$"}</p>
          </UIBlackjackCard>
          <UIBlackjackCard>
            <BlackjackBets />
          </UIBlackjackCard>
        </div>

        <BlackjackDeck />
      </div>

      <ChatComponent />
      <OtherPlayersCardsCard />
    </div>
  );
}

export default BlackjackView;