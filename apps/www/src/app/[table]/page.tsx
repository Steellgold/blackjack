"use client";

import { usePlayerStore } from "@/lib/hooks/store/use-player.store";
import { useBlackjack } from "@/lib/hooks/use-blackjack";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const TablePage = () => {
  const { table } = useParams();
  const router = useRouter();
  const { playerName, id } = usePlayerStore();
  
  if (typeof table !== "string") return null;

  const { initializeSocket, players } = useBlackjack();

  useEffect(() => {
    if (playerName === "") {
      router.push('/');
      return;
    }
    
    initializeSocket(table, playerName, id);
  }, [playerName]);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl mb-4">Table: {table}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((player) => (
          <div key={player.id} className="p-4 border-2 border-gray-200">
            <h2 className="text-lg font-bold">{player.name}</h2>
            <p className="text-sm">ID: {player.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TablePage;