import type { Card, Rank, Suit } from "../types";

export const createDeck = (): Card[] => {
  const suits: Suit[] = ["Hearts", "Diamonds", "Clubs", "Spades"];
  const ranks: Rank[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

  const deck: Card[] = [];
  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      deck.push({ rank, suit });
    });
  });

  return shuffle(deck);
}

export const shuffle = (deck: Card[]): Card[] => {
  let currentIndex = deck.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    if (currentIndex > 0 && randomIndex >= 0) {
      [deck[currentIndex], deck[randomIndex]] = [deck[randomIndex], deck[currentIndex]];
    }
  }

  return deck;
};


export const handValue = (cards: Card[]): number => {
  const visibleCards = cards.filter((card) => !card.isHidden);
  const values = visibleCards.map((card) => card.rank);
  
  let sum = values.reduce((acc, value) => {
    if (value === "A") return acc + 11;
    if (["J", "Q", "K"].includes(value)) return acc + 10;
    return acc + Number(value);
  }, 0);

  let aceCount = values.filter((value) => value === "A").length;
  while (sum > 21 && aceCount > 0) {
    sum -= 10;
    aceCount--;
  }

  return sum;
}

function getValueFromRank(rank: string): number {
  if (rank === "J" || rank === "Q" || rank === "K") return 10;
  if (rank === "A") return 1;
  return parseInt(rank);
}

export function calculateHandValue(cards: Card[]): number {
  let value = 0;
  let aces = 0;

  for (const card of cards) {
    if (card.rank === "A") {
      aces += 1;
    } else {
      value += getValueFromRank(card.rank);
    }
  }

  for (let i = 0; i < aces; i++) {
    if (value + 11 <= 21) {
      value += 11;
    } else {
      value += 1;
    }
  }

  return value;
}
