import { Mysocket } from "../interface";

export async function handleJoin(ws: Mysocket) {
  console.log("inside the handleJoin");
}

export async function handleLeave(ws: Mysocket) {
  console.log("isnide the handleleave");
}

export async function handleMessage(ws: Mysocket) {
  console.log("inside the handleMessage");
}
