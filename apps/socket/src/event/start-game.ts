import type { Server, Socket } from "socket.io";
import type { EventExecute } from "../manager/event.manager";
import { tables } from "../data";
import type { GameState } from "@blackjack/game/types";
import { createDeck, getHandValue } from "@blackjack/game/utils";

type StartGameProps = {
  tableId: string;
}

export const name = "start-game";

export const dealInitialCards = async (table: GameState, io: Server) => {
  if (!table.tableId) return table;
  const deck = createDeck();

  // First round of cards (for players with status BETTED) and with 500ms delay between each card for a better UX
  for (const player of table.players.filter(p => p.status === "BETTED")) {
    const card = deck.pop();
    if (card) {
      card.owner = "PLAYER";
      player.cards.push(card);
      io.to(table.tableId).emit("players-update", { data: { players: table.players } });
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // First dealer card with 500ms delay
  const firstDealerCard = deck.pop();
  if (firstDealerCard) {
    firstDealerCard.owner = "DEALER";
    table.dealerCards.push(firstDealerCard);
    io.to(table.tableId).emit("dealer-cards-update", { data: { dealerCards: table.dealerCards } });
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Second round of cards (for players with status BETTED) (also with 500ms delay)
  for (const player of table.players.filter(p => p.status === "BETTED")) {
    const card = deck.pop();
    if (card) {
      card.owner = "PLAYER";
      player.cards.push(card);
      io.to(table.tableId).emit("players-update", { data: { players: table.players } });
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Second dealer card (hidden)
  const secondDealerCard = deck.pop();
  if (secondDealerCard) {
    secondDealerCard.owner = "DEALER";
    secondDealerCard.isHidden = true;
    table.dealerCards.push(secondDealerCard);
    io.to(table.tableId).emit("dealer-cards-update", { data: { dealerCards: table.dealerCards } });
  }

  table.deck = deck;
  return table;
};

export const execute: EventExecute<StartGameProps> = async (io: Server, socket: Socket, data, callback) => {
  const { tableId } = data;
  const table = tables.get(tableId);

  if (!table) {
    callback({ success: false, error: "Table not found" });
    return;
  }

  table.gameStatus = "WAITING_FOR_BETS";
  table.players.forEach((player) => {
    player.status = "BETTING";
  });

  io.to(tableId).emit("game-status-update", { gameStatus: table.gameStatus });
  io.to(tableId).emit("players-update", { players: table.players });

  let timeLeft = 10;

  io.to(tableId).emit("betting-timer", { timeLeft });

  const timerInterval = setInterval(() => {
    timeLeft--;
    io.to(tableId).emit("betting-timer", { data: { timeLeft } });
  }, 1000);

  setTimeout(async () => { // Note: on ajoute async ici
    clearInterval(timerInterval);
  
    const currentTable = tables.get(tableId);
    if (!currentTable) return;
  
    const playersWhoBet = currentTable.players.filter(player => 
      player.status === "BETTED" && player.bets.length > 0
    );
  
    if (playersWhoBet.length === 0) {
      currentTable.gameStatus = "WAITING_FOR_PLAYERS";
      currentTable.players.forEach(player => {
        player.status = "WAITING";
      });
      
      io.to(tableId).emit("game-status-update", { data: { gameStatus: currentTable.gameStatus } });
      io.to(tableId).emit("players-update", { data: { players: currentTable.players } });
    } else {
      currentTable.gameStatus = "WAITING_FOR_DISTRIBUTES";
      currentTable.players.forEach(player => {
        if (player.status !== "BETTED") {
          player.status = "NOT_BETTED";
        }
      });
  
      io.to(tableId).emit("game-status-update", { data: { gameStatus: currentTable.gameStatus } });
      io.to(tableId).emit("players-update", { data: { players: currentTable.players } });
  
      await dealInitialCards(currentTable, io);
  
      currentTable.gameStatus = "WAITING_FOR_PLAYER_CHOICES";
      
      for (const player of currentTable.players) {
        if (player.status === "BETTED") {
          const handValue = getHandValue(player.cards);
          if (handValue === 21) {
            player.status = "BLACKJACK";
          }
        }
      }
  
      io.to(tableId).emit("game-status-update", { data: { gameStatus: currentTable.gameStatus } });
      io.to(tableId).emit("players-update", { data: { players: currentTable.players } });
    }
  }, 10000);  

  return callback({ success: true, data: { table: table } });
};