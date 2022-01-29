import { Message, LoginRequestPayload, LoginResponsePayload } from '../../../common/src/Message';
import { MessageType } from '../../../common/src/MessageType';
import { WebSocket } from 'ws';
import {IncomingMessage} from 'http';
import { Client, Pool } from 'pg';

export default function handleLogin(request: IncomingMessage, payload: LoginRequestPayload, ws: WebSocket, pg: Client) {
    const data = payload as unknown as LoginRequestPayload;
    pg.query("INSERT INTO player (name, address) VALUES ($1, $2) RETURNING id, name, address",
        [data.name, request.socket.localAddress]).then((value) => {
            const message: Message<LoginResponsePayload> = {
                type: MessageType.JOIN_ROOM,
                payload: value.rows[0]
            }
            ws.send(JSON.stringify(message));
        }).catch((reason) => console.log(reason));
}