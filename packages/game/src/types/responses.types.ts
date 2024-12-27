import type { Card } from "./card.types";
import type { GameState } from "./game.types";

export type TableCreatedResponse = {
  tableId: string;
};

export type TableJoinedResponse = {
  tableId: string;
  state: GameState;
};

export type TableStartResponse = {
  tableId: string;
  deck: Card[];
};

export type TableJoinableResponse = {
  tableId: string;
};

export type TableBetResponse = {
  bets: number[];
};

export type EventResponse<R = unknown> = {
  success: boolean;
  error?: string;
  data?: R;
}