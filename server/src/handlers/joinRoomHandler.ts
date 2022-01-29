import {Message, JoinRoomRequestPayload} from '../../../common/src/Message';
import { WebSocket } from 'ws';
import {IncomingMessage} from 'http';
import { Client, Pool } from 'pg';

export default function handleJoinRoom(request: IncomingMessage, payload: JoinRoomRequestPayload, ws: WebSocket, db: Client) {
    const data = payload as unknown as JoinRoomRequestPayload;
    console.log("JOIN ROOM REQUEST", data.room);
}