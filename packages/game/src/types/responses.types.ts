import type { Player } from "./game.types";

export type TableDataCreatedResponse = {
  tableId: string;
};

export type TablePlayersUpdateResponse = {
  players: Player[];
};

export type BettingTimerTickResponse = {
  timeLeft: number;
};

export type EventResponse<R = unknown> = {
  success: boolean;
  error?: string;
  data?: R;
}