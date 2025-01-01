import { sheets } from "..";
import { Mysocket } from "../interface";
import { findSheetAndUser } from "../utils";

export async function handleJoin(ws: Mysocket) {
  try {
    const { user, sheet } = await findSheetAndUser(ws.username, ws.sheetId);
    if (!sheets.has(ws.sheetId)) {
      sheets.set(ws.sheetId, []);
    }
    ws.sheetId = sheet.id;
    ws.username = user.username;
  } catch (error) {
    ws.send(JSON.stringify({ error: error }));
  }
}

export async function handleLeave(ws: Mysocket) {
  console.log("isnide the handleleave");
}

export async function handleMessage(ws: Mysocket) {
  ws.send(JSON.stringify("values"));
  console.log("inside the handleMessage");
}
