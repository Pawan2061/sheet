import { WebSocket } from "ws";

export interface payload {
  type: PayloadType;
  payload: {};
}
export interface Mysocket extends WebSocket {
  username: string;
  sheetId: string;
}
enum PayloadType {
  join = "join",
  leave = "leave",
  update = "update",
}
