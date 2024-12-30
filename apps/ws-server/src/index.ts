import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import { Mysocket, payload } from "./interface";
import { handleJoin, handleLeave, handleMessage } from "./service";

export let sheets = new Map<string, Mysocket[]>();

const wss = new WebSocketServer({
  port: 8080,
});

wss.on("connection", async (ws: Mysocket) => {
  console.log("connected");

  ws.on("message", async (message) => {
    ws.send("working fine");

    const data = JSON.parse(message.toString());
    console.log(data);

    const wsData: payload = data;

    console.log(wsData.type, "type is here");

    switch (wsData.type) {
      case "join":
        handleJoin(ws);
        break;

      case "leave":
        console.log("inside leave");

        handleLeave(ws);
        break;

      case "work":
        console.log("inside the message");

        handleMessage(ws);

        break;
    }
  });
});
