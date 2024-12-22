"use client";

import { usePlayerStore } from "@/lib/hooks/store/use-player.store";
import { useBlackjack } from "@/lib/hooks/use-blackjack";
import { getHandValue } from "@blackjack/game/utils";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const TablePage = () => {
  const { table } = useParams();
  const router = useRouter();
  const { playerName } = usePlayerStore();

  if (typeof table !== "string") return null;

  const { bettingTimer, initializeSocket, players, tableId, gameStatus, startGame, addBet, removeBet, hit, stand } = useBlackjack();

  useEffect(() => {
    if (playerName === "") {
      router.push('/');
      return;
    }
    
    initializeSocket(table, playerName, true);
  }, [playerName]);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl">Table: {table}</h1>
        <p>Status: {gameStatus}</p>

        <button onClick={gameStatus == "WAITING_FOR_PLAYERS" ? startGame : () => console.log("Hey dont do that!")} className="bg-blue-500 text-white px-4 py-2 mt-4">Start Game</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((player) => (
          <div key={player.id} className="p-4 border-2 border-gray-200">
            <h2 className="text-lg font-bold">{player.name}</h2>
            <p className="text-sm">ID: {player.id}</p>
            <p>Hand: {getHandValue(player.cards)}</p>

            <div className="my-4 border border-white" />

            <div className="flex flex-wrap gap-4">
              {player.cards.map((card, index) => (
                <div key={index} className="border-2 border-gray-200">
                  <p>&nbsp;&nbsp;{card.rank}&nbsp;{card.suit} {card.owner === "DEALER" && card.isHidden ? "(Hidden)" : ""}&nbsp;</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="my-4 border border-white" />

      <pre>
        {JSON.stringify(players, null, 2)}
        {JSON.stringify(tableId, null, 2)}
        {JSON.stringify(gameStatus, null, 2)}
        {JSON.stringify(bettingTimer, null, 2)}
      </pre>

      {gameStatus === "WAITING_FOR_BETS" && (
        <div className="p-4">
          <p>Temps restant pour placer un pari: {bettingTimer}s</p>
          <p>Total: {players.reduce((acc, player) => acc + player.bets.reduce((acc, bet) => acc + bet, 0), 0)}</p>

          <button className="bg-blue-500 text-white px-4 py-2" onClick={() => addBet(5)}>Bet 5</button>
          <button className="bg-blue-500 text-white px-4 py-2" onClick={() => addBet(5000)}>Bet 5000</button>
          <button className="bg-blue-500 text-white px-4 py-2" onClick={() => removeBet()}>Undo</button>
        </div>
      )}

      {gameStatus === "WAITING_FOR_PLAYER_CHOICES" && (
        <div className="p-4">
          <p>Player Choices</p>
          <button className="bg-blue-500 text-white px-4 py-2" onClick={() => hit()}>Hit</button>
          <button className="bg-blue-500 text-white px-4 py-2" onClick={() => stand()}>Stand</button>
        </div>
      )}
    </div>
  );
};

export default TablePage;