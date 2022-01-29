import { Message, CreateRoomRequestPayload, CreateRoomResponsePayload, StatusResponsePayload } from '../../../common/src/Message';
import { MessageType } from '../../../common/src/MessageType';
import { WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { Client, Pool } from 'pg';
import { Status } from '../../../common/src/Status';

const roomCodes: string[] = [];

export default function handleCreateRoom(request: IncomingMessage, payload: CreateRoomRequestPayload, ws: WebSocket, db: Client) {
    db.query("REMOVE FROM room WHERE gm_id = $s").then(() => {
        let code: string;
        do {
            code = Math.random().toString(36).replace(/[^A-Za-z]+/g, '').slice(0, 6).toUpperCase();
        } while (roomCodes.includes(code));
        roomCodes.push(code);
        db.query("INSERT INTO room (code, gm_id) VALUES ($1, $2) RETURNING id, code, gm_id;", [code, payload.player_id]).then((value) => {
            console.log(roomCodes, value.rows);
            const message: Message<CreateRoomResponsePayload> = {
                type: MessageType.CREATE_ROOM,
                payload: {
                    id: value.rows[0].id,
                    code: value.rows[0].code,
                    gm_id: value.rows[0].gm_id
                }
            }
            ws.send(JSON.stringify(message));
        });
    }).catch((reason) => console.log(reason));
}