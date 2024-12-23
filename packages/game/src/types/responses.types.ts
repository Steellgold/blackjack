import type { GameState } from "./game.types";

export type TableCreatedResponse = {
  tableId: string;
};

export type TableJoinedResponse = {
  tableId: string;
  state: GameState;
};

export type TableJoinableResponse = {
  tableId: string;
};

export type EventResponse<R = unknown> = {
  success: boolean;
  error?: string;
  data?: R;
}