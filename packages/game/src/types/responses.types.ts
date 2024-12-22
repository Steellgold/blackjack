export type TableCreatedResponse = {
  tableId: string;
};

export type TableJoinedResponse = {
  tableId: string;
};

export type TableJoinableResponse = {
  tableId: string;
};

export type EventResponse<R = unknown> = {
  success: boolean;
  error?: string;
  data?: R;
}