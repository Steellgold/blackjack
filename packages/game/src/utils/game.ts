import type { Card, Rank, Suit } from "@blackjack/game/types";

export const createDeck = (): Card[] => {
  const suits: Suit[] = ["Hearts", "Diamonds", "Clubs", "Spades"];
  const ranks: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

  const deck: Card[] = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({
        suit,
        rank,
        isHidden: false
      });
    }
  }

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = deck[i] as Card;
    deck[i] = deck[j] as Card;
    deck[j] = temp;
  }

  return deck;
};

export const drawCard = (deck: Card[]): Card | undefined => {
  return deck.pop();
};

export const shouldResetDeck = (deck: Card[]): boolean => {
  const resetThreshold = Math.floor(52 * 0.2); // ~10 cards
  return deck.length <= resetThreshold;
};

export const getCardValue = (card: Card): number => {
  if (card.rank === "A") return 11;
  if (["K", "Q", "J"].includes(card.rank)) return 10;
  return parseInt(card.rank);
};

export const getHandValue = (cards: Card[]): number => {
  let value = 0;
  let aces = 0;

  for (const card of cards) {
    if (card.rank === "A") {
      aces += 1;
      value += 11;
    } else if (["K", "Q", "J"].includes(card.rank)) {
      value += 10;
    } else {
      value += parseInt(card.rank);
    }
  }

  while (value > 21 && aces > 0) {
    value -= 10;
    aces -= 1;
  }

  return value;
};