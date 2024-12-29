"use client";

import { BlackjackCard, EmptyBlackjackCard } from "./blackjack-card";
import { BlackjackCard as UIBlackjackCard } from "./ui/blackjack/blackjack-card";
import { useState } from "react";
import { useBlackjack } from "../hooks/use-blackjack";

export const BlackjackDeck = () => {
  const { deck } = useBlackjack();
  const [isHover, setIsHover] = useState(false);

  return (
    <UIBlackjackCard className="hidden sm:block">
      <div
        className="relative w-24 h-36 rounded-md"
        onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
        {deck.length >= 1 ? deck.map((card, index) => (
          <div
            key={index}
            className="absolute transition-transform duration-300 ease-in-out"
            style={{
              transform: isHover ? `translateY(${index * - 3.5}px)` : `translateY(${index * - 1}px)`,
              zIndex: index,
            }}
          >
            <BlackjackCard rank={card.rank} suit={card.suit} isHidden isReloadCard={card.isReloadCard} />
          </div>
        )) : (
          <EmptyBlackjackCard />
        )}
      </div>

      <p className="absolute bottom-0 right-0 p-1 text-xs font-semibold text-gray-400">
        {deck.length}
      </p>
    </UIBlackjackCard>
  );
}