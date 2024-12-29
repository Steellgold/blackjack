"use client";

import { cn } from "@/lib/utils";
import { Undo } from "lucide-react";
import { useState } from "react";
import { BlackjackCard } from "./ui/blackjack/blackjack-card";
import { useLang } from "../hooks/use-lang";
import { useBlackjack } from "../hooks/use-blackjack";
import { BlackjackButton } from "./ui/blackjack/blackjack-button";
import { chips, type ChipValue } from "@blackjack/game/types";
import type { Component } from "./utils/component";
import { toast } from "sonner";

export const BlackjackBet = () => {
  const { bettingTimer, removeBet, players, id } = useBlackjack();
  const { lang } = useLang();
  const [removeError, setRemoveError] = useState(false);

  const player = players.find(player => player.id === id);
  if (!player) return <p className="bg-red-500 p-3">Player not found</p>;

  const handleRemoveBet = async () => {
    try {
      await removeBet();
      setRemoveError(false);
    } catch (error) {
      setRemoveError(true);
      console.error("Error removing bet:", error);
    }
  };

  return (
    <div>
      <BlackjackCard className="flex flex-col items-center gap-2">
        <div className="flex items-center flex-col sm:flex-row gap-0.5 sm:gap-1.5">
          <span className="text-lg">
            {lang === "fr" ? "Choix des mises" : "Betting"}
          </span>

          <span className="hidden sm:block">&bull;</span>

          <span>
            {lang == "fr" ? `${bettingTimer}s pour miser` : `${bettingTimer}s to bet`}
          </span>
        </div>

        <div className={cn(
          "grid grid-cols-4 gap-2",
          "sm:flex sm:items-center sm:gap-1.5"
        )}>
          <BlackjackButton
            className={cn(
              "w-10 h-10 rounded-full", {
                "ring-2 ring-red-500": removeError
              }
            )}
            onClick={handleRemoveBet}
            disabled={player.bets.length === 0}
          >
            <Undo size={16} />
          </BlackjackButton>

          {chips.map((value) => (
            <div style={{ transform: "rotate(-10deg)" }} key={value}>
              <BlackjackChip value={value} key={value} mini />
            </div>
          ))}
        </div>
      </BlackjackCard>
    </div>
  );
};

type BlackjackChipProps = {
  value: ChipValue;
  mini?: boolean;
  empiled?: boolean;
};

export const BlackjackChip: Component<BlackjackChipProps> = ({ value, empiled, mini }) => {
  const { addBet, players, id } = useBlackjack();
  const [isError, setIsError] = useState(false);

  const player = players.find(player => player.id === id);
  if (!player) return <p className="bg-red-500 p-3">Player not found</p>;

  const handleBet = async () => {
    if (empiled) return;
    if (value > player.balance) return;
    
    try {
      await addBet(value);
      setIsError(false);
    } catch (error) {
      setIsError(true);
      toast.error("Error adding bet, please try again");
      console.error("Error adding bet:", error);
    }
  };

  return (
    <div
      className={cn(
        "rounded-full shadow-md flex items-center justify-center select-none",
        "border-dashed border-opacity-90",
        "transition-colors duration-300 ease-in-out cursor-pointer",
        {
          // Colors
          "bg-gray-500 text-white border-gray-300": value === 1,
          "bg-pink-500 text-white border-pink-300": value === 2,
          "bg-red-500 text-white border-red-300": value === 5,
          "bg-blue-500 text-white border-blue-300": value === 10,
          "bg-green-500 text-white border-green-300": value === 25,
          "bg-black text-white border-gray-300": value === 100,
          "bg-yellow-500 text-white border-yellow-300": value === 500,
          "bg-purple-500 text-white border-purple-300": value === 1000,

          // Sizes & Opacity
          "opacity-50": player.balance < value && !empiled,
          "w-10 h-10 border-4": mini,
          "w-10 h-10 sm:w-14 sm:h-14 border-[6px]": !mini,

          "ring-2 ring-red-500": isError,
        }
      )}
      onClick={handleBet}
    >
      {!empiled && (
        <span className={cn("font-semibold", {
          "text-base": value > 5,
          "text-lg": value <= 5,
          "text-xs": value === 100
        })}>{value}</span>
      )}

      {empiled && (
        <span className="text-sm font-bold">
          {player.bets.reduce((acc, bet) => acc + bet, 0)}
        </span>
      )}
    </div>
  );
};

export const BlackjackBets = () => {
  const { players, id } = useBlackjack();
  const [isHover, setIsHover] = useState(false);

  const player = players.find(player => player.id === id);
  if (!player) return <p className="bg-red-500 p-3">Player not found</p>;

  return (
    <div
      className={cn(
        "relative w-10 h-10 group",
        "sm:w-14 sm:h-14"
      )}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {player.bets.length >= 1 ? player.bets.map((value, index) => (
        <div
          key={index}
          className="absolute transition-transform duration-300 ease-in-out"
          style={{
            transform: isHover ? `translateY(${index * -5}px)` : `translateY(0px)`,
            zIndex: index
          }}
        >
          <BlackjackChip value={value as ChipValue} empiled mini={false} />
        </div>
      )) : (
        <div>
          <div className={cn(
            "w-10 h-10 rounded-full border-4 border-dashed border-gray-300/10 flex items-center justify-center",
            "sm:w-14 sm:h-14"
          )}>
            <span className="text-xs opacity-10 select-none">0</span>
          </div>
        </div>
      )}
    </div>
  );
};