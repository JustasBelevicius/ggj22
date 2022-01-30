import { Message, CreateRoomRequestPayload, CreateRoomResponsePayload, StatusResponsePayload } from '../../../common/src/Message';
import { MessageType } from '../../../common/src/MessageType';
import { MessageHandlerProperties } from '../models/IMessageHandler';

const roomCodes: string[] = [];

export default function handleCreateRoom({payload, ws, db}: MessageHandlerProperties<CreateRoomRequestPayload>) {
    db.query("DELETE FROM room WHERE gm_id = $1", [payload.player_id]).then(() => {
        let code: string;
        do {
            code = Math.random().toString(36).replace(/[^A-Za-z]+/g, '').slice(0, 6).toUpperCase();
        } while (roomCodes.includes(code));
        roomCodes.push(code);
        db.query("INSERT INTO room (code, gm_id) VALUES ($1, $2) RETURNING id, code, gm_id;", [code, payload.player_id]).then((value) => {
            db.query("INSERT INTO match (player_id, room_id) VALUES ($1, $2) RETURNING room_id", [payload.player_id, value.rows[0].id]);
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