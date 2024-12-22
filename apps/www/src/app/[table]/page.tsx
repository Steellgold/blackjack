"use client";

import { useBlackjack } from "@/lib/hooks/use-blackjack";
import { getHandValue } from "@blackjack/game/utils";
import { useParams } from "next/navigation";

const TablePage = () => {
  const { table } = useParams();
  const {
    players,
    gameStatus
  } = useBlackjack();

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl">Table: {table}</h1>
        <p>Game Status: {gameStatus}</p>
      </div>

      <div className="flex flex-row gap-2">
        {players.map((player) => (
          <span className="flex flex-row gap-0.5 bg-gray-800 p-2 rounded-lg" key={player.id}>
            <span>{player.name}</span>
            <span className="text-xs">({getHandValue(player.cards)})</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TablePage;