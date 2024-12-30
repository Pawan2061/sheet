import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import { Mysocket } from "./interface";
import { handleJoin, handleLeave, handleMessage } from "./service";

let spaces = new Map<string, Mysocket[]>();

const wss = new WebSocketServer({
  port: 8080,
});

wss.on("connection", async (ws: Mysocket) => {
  console.log("connected");

  ws.on("message", async (message) => {
    ws.send("working fine");

    const data = JSON.parse(message.toString());
    console.log(data);

    const { type } = data;
    console.log(type, "type is here");

    switch (type) {
      case "join":
        console.log("inside the join");

        handleJoin(ws);
        break;

      case "leave":
        console.log("inside leave");

        handleLeave(ws);
        break;

      case "message":
        console.log("inside the message");

        handleMessage(ws);

        break;
    }
  });
});
