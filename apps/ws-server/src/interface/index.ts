import { WebSocket } from "ws";

export interface payload {
  type: PayloadType;
  payload: {};
}
export interface Mysocket extends WebSocket {
  userId: string;
  sheetId: string;
}
enum PayloadType {
  join = "join",
  leave = "leave",
  work = "work",
}
