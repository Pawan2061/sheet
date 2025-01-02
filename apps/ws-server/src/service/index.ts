import { sheets } from "..";
import { Mysocket, payload } from "../interface";

// export async function handleJoin(ws: Mysocket) {
//   try {
//     const { user, sheet } = await findSheetAndUser(ws.username, ws.sheetId);
//     if (!sheets.has(ws.sheetId)) {
//       sheets.set(ws.sheetId, []);
//     }
//     ws.sheetId = sheet.id;
//     ws.username = user.username;
//   } catch (error) {
//     ws.send(JSON.stringify({ error: error }));
//   }
// }

// export async function handleLeave(ws: Mysocket) {
//   console.log("isnide the handleleave");
// }

// export async function handleMessage(ws: Mysocket) {
//   ws.send(JSON.stringify("values"));
//   console.log("inside the handleMessage");
// }

export async function handleJoin(ws: Mysocket, payload: { sheetId: string }) {
  try {
    const { sheetId } = payload;
    ws.sheetId = sheetId;

    if (!sheets.has(sheetId)) {
      sheets.set(sheetId, []);
    }

    const sheetClients = sheets.get(sheetId);
    sheetClients?.push(ws);
    const currentContent = "";
    ws.send(
      JSON.stringify({
        type: "init",
        payload: { content: currentContent },
      })
    );
  } catch (error) {
    console.error("Error in handleJoin:", error);
    ws.send(
      JSON.stringify({
        type: "error",
        payload: { message: "Failed to join sheet" },
      })
    );
  }
}
export async function handleLeave(ws: Mysocket) {
  if (ws.sheetId) {
    const sheetClients = sheets.get(ws.sheetId);
    if (sheetClients) {
      sheets.set(
        ws.sheetId,
        sheetClients.filter((client) => client !== ws)
      );
    }
  }
}
export async function handleMessage(
  ws: Mysocket,
  payload: {
    sheetId: string;
    content?: string;
    user: {
      name: string;
    };
    cursor: number;
  }
) {
  if (!ws.sheetId) return;

  const sheetClients = sheets.get(ws.sheetId);
  if (!sheetClients) return;

  const message = JSON.stringify({
    type: "update",
    payload: {
      content: payload.content,
      user: payload.user,
      cursor: payload.cursor,
    },
  });

  sheetClients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
