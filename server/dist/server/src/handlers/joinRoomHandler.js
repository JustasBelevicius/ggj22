"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageType_1 = require("../../../common/src/MessageType");
const Status_1 = require("../../../common/src/Status");
function handleJoinRoom({ payload, ws, db }) {
    db.query("DELETE FROM match WHERE player_id = $1", [payload.player_id]);
    db.query("SELECT id FROM room WHERE code = $1", [payload.room]).then((v) => {
        if (v.rowCount <= 0) {
            const message = {
                type: MessageType_1.MessageType.STATUS,
                payload: {
                    status: Status_1.Status.ERROR,
                    message: "Invalid Room Code!"
                }
            };
            ws.send(JSON.stringify(message));
            return;
        }
        db.query("INSERT INTO match (player_id, room_id) VALUES ($1, $2) RETURNING room_id", [payload.player_id, v.rows[0].id]).then((value) => {
            const message = {
                type: MessageType_1.MessageType.JOIN_ROOM,
                payload: {
                    id: value.rows[0].room_id,
                    code: payload.room
                }
            };
            ws.send(JSON.stringify(message));
        });
    }).catch((reason) => console.log(reason));
}
exports.default = handleJoinRoom;
//# sourceMappingURL=joinRoomHandler.js.map