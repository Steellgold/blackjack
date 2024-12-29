import type { Server, Socket } from "socket.io";
import type { EventExecute } from "../manager/event.manager";
import { tables } from "../data";
import type { GameState } from "@blackjack/game/types";
import { drawCard, getHandValue } from "@blackjack/game/utils";
import { sleep } from "../utils";

export const name = "action";

type ActionType = "HIT" | "STAND";

type ActionData = {
  tableId: string;
  action: ActionType;
};

const checkAllPlayersChosen = (io: Server, table: GameState) => {
  const tableId = table.tableId;
  if (!tableId || !table.players || !table.deck || !table.cards) return;

  const allPlayersChosen = table.players.every(p => p.status !== "NOT_CHOSEN");
  if (allPlayersChosen) {
    const standingPlayers = table.players.filter(p => p.status === "STAND");
    const hittingPlayers = table.players.filter(p => p.status === "HIT");

    for (const player of hittingPlayers) {
      const card = drawCard(table.deck);
      if (!card) return; // No more cards (never happen but just in case)
      io.to(tableId).emit("deck-updated", table.deck);
      player.cards.push({ ...card, owner: "PLAYER", isHidden: false });
      io.to(tableId).emit("card-distributed", { card, recipient: player.id });

      const handValue = getHandValue(player.cards);
      if (handValue > 21) {
        player.status = "BUST";
      } else if (handValue === 21 && player.cards.length === 2) { // Blackjack
        player.status = "STAND";
      } else {
        player.status = "NOT_CHOSEN";
      }

      sleep(1000);
      io.to(tableId).emit("players-update", table.players);
    }

    io.to(tableId).emit("players-update", table.players);
    io.to(tableId).emit("game-status-changed", "WAITING_FOR_PLAYER_CHOICES");

    if (standingPlayers.length + table.players.filter(p => p.status === "BUST").length === table.players.length) {
      table.gameStatus = "WAITING_FOR_DEALER";
      io.to(tableId).emit("game-status-changed", table.gameStatus);

      const dealerHand = table.cards;
      if (dealerHand[1]) {
        dealerHand[1].isHidden = false;
      }

      sleep(1000);
      io.to(tableId).emit("cards-updated", {
        recipient: "DEALER",
        cards: dealerHand
      });

      let dealerHandValue = getHandValue(dealerHand);
      let canReset = false;

      if (dealerHandValue < 17) {
        while (dealerHandValue < 17) {
          const card = drawCard(table.deck);
          if (!card) return; // No more cards (never happen but just in case)
          io.to(tableId).emit("deck-updated", table.deck);
          dealerHand.push({ ...card, owner: "DEALER", isHidden: false });
          io.to(tableId).emit("card-distributed", { card, recipient: "DEALER" });
          sleep(1000, false);

          dealerHandValue = getHandValue(dealerHand);
          if (dealerHandValue >= 17) canReset = true;

          io.to(tableId).emit("cards-updated", {
            recipient: "DEALER",
            cards: dealerHand
          });
        }
      } else {
        canReset = true;
      }

      if (canReset) {
        if (dealerHandValue > 21) {
          table.players.forEach(player => {
            if (player.status === "BUST") return;
            player.status = "WIN";
            player.balance += player.bets.reduce((acc, curr) => acc + curr, 0) * 2;
          });

          io.to(tableId).emit("players-update", table.players);
        } else {
          table.players.forEach(player => {
            const bet = player.bets.reduce((acc, curr) => acc + curr, 0);

            if (player.status === "BUST") return;
            const playerHandValue = getHandValue(player.cards);
            if (playerHandValue === 21 && player.cards.length === 2) {
              player.status = "BLACKJACK";
              player.balance += bet * 2.5;
            } else if (playerHandValue > dealerHandValue) {
              player.status = "WIN";
              player.balance += bet * 2;
            } else if (playerHandValue < dealerHandValue) {
              player.status = "LOSE";
            } else {
              player.status = "PUSH";
              player.balance += bet;
            }
          });

          io.to(tableId).emit("players-update", table.players);
        }

        let timer = 5;
        io.to(tableId).emit("back-to-bets-timer", timer);

        const interval = setInterval(() => {
          timer -= 1;
          io.to(tableId).emit("back-to-bets-timer", timer);

          if (timer <= 0) {
            clearInterval(interval);

            // table.deck = [];
            table.cards = [];
            table.players.forEach(player => {
              player.cards = [];
              player.status = "NOT_BETTED";
              player.bets = [];
            });
            table.gameStatus = "WAITING_FOR_BETS";

            io.to(tableId).emit("deck-updated", table.deck);
            io.to(tableId).emit("cards-updated", { recipient: "DEALER", cards: table.cards });
            io.to(tableId).emit("players-update", table.players);

            table.bettingTimer = 10;
            io.to(tableId).emit("betting-timer", table.bettingTimer);
            io.to(tableId).emit("ended", table.tableId);

            io.to(tableId).emit("game-status-changed", table.gameStatus);
          }
        }, 1000);
      }
    }
  }
};

export const execute: EventExecute<ActionData> = async (io: Server, socket: Socket, data, callback) => {
  const { tableId, action } = data;
  
  if (!tableId || !action) {
    return callback({ success: false, error: "Invalid data" });
  }

  const table = tables.get(tableId);
  if (!table) {
    return callback({ success: false, error: "Table not found" });
  }

  if (table.gameStatus !== "WAITING_FOR_PLAYER_CHOICES") {
    return callback({ success: false, error: `Cannot ${action.toLowerCase()} at this time` });
  }

  const player = table.players.find(p => p.id === socket.id);
  if (!player) {
    return callback({ success: false, error: "Player not found" });
  }

  if (action === "STAND") {
    player.status = "STAND";
  } else {
    player.status = "HIT";
  }

  io.to(tableId).emit("players-update", table.players);
  checkAllPlayersChosen(io, table);

  return callback({ success: true });
};