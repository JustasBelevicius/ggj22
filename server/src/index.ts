'use strict';

import express from 'express';
import { Server, WebSocket } from 'ws';
import pg from 'pg';
import { Message, MessagePayload } from "../../common/src/Message";
import handleMessage from './messageHandler';

const PG_STRING = process.env.DATABASE || "postgres://llisrnjpdesecw:df3b4f1395828a70777b2a2954eb297b206bfa672038d535f2a017484d1978b5@ec2-34-247-151-118.eu-west-1.compute.amazonaws.com:5432/dek446v3vgvqun";
const db = new pg.Client({
  connectionString: PG_STRING,
  ssl: {
    rejectUnauthorized: false
  }
});
db.connect().then(() => {
  db.query("TRUNCATE TABLE player RESTART IDENTITY CASCADE;");
  db.query("TRUNCATE TABLE room RESTART IDENTITY CASCADE;");
  db.query("TRUNCATE TABLE match RESTART IDENTITY CASCADE;");
});
const PORT = process.env.PORT || 3001;
const server = express()
  .use((req, res) => res.send("OK"))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

wss.on('connection', (ws: WebSocket, request) => {
  console.log("Client connected!");
  ws.on('close', () => console.log('Client disconnected!'));
  ws.on('message', (data) => {
    const message: Message<MessagePayload> = JSON.parse(data.toString());
    handleMessage(request, message, ws, db);
  });
});
