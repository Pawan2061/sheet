import { WebSocket } from "ws";
export interface Mysocket extends WebSocket {
  userId: string;
  spaceId: string;
}
