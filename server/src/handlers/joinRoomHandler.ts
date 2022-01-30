import {Message, JoinRoomRequestPayload, JoinRoomResponsePayload, StatusResponsePayload} from '../../../common/src/Message';
import { MessageType } from '../../../common/src/MessageType';
import { Status } from '../../../common/src/Status';
import { MessageHandlerProperties } from '../models/IMessageHandler';

export default function handleJoinRoom({payload, ws, db}: MessageHandlerProperties<JoinRoomRequestPayload>) {
    db.query("DELETE FROM match WHERE player_id = $1", [payload.player_id]);
    db.query("SELECT id FROM room WHERE code = $1", [payload.room]).then((v) => {
        if (v.rowCount <= 0) {
            const message: Message<StatusResponsePayload> = {
                type: MessageType.STATUS,
                payload: {
                    status: Status.ERROR,
                    message: "Invalid Room Code!"
                }
            };
            ws.send(JSON.stringify(message));
            return;
        }
        db.query("INSERT INTO match (player_id, room_id) VALUES ($1, $2) RETURNING room_id", [payload.player_id, v.rows[0].id]).then((value) => {
            const message: Message<JoinRoomResponsePayload> = {
                type: MessageType.JOIN_ROOM,
                payload: {
                    id: value.rows[0].room_id,
                    code: payload.room
                }
            }
            ws.send(JSON.stringify(message));
        });
    }).catch((reason) => console.log(reason));
}