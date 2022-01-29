"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageType_1 = require("../../../common/src/MessageType");
const roomCodes = [];
function handleCreateRoom(request, payload, ws, db) {
    db.query("REMOVE FROM room WHERE gm_id = $s").then(() => {
        let code;
        do {
            code = Math.random().toString(36).replace(/[^A-Za-z]+/g, '').slice(0, 6).toUpperCase();
        } while (roomCodes.includes(code));
        roomCodes.push(code);
        db.query("INSERT INTO room (code, gm_id) VALUES ($1, $2) RETURNING id, code, gm_id;", [code, payload.player_id]).then((value) => {
            console.log(roomCodes, value.rows);
            const message = {
                type: MessageType_1.MessageType.CREATE_ROOM,
                payload: {
                    id: value.rows[0].id,
                    code: value.rows[0].code,
                    gm_id: value.rows[0].gm_id
                }
            };
            ws.send(JSON.stringify(message));
        });
    }).catch((reason) => console.log(reason));
}
exports.default = handleCreateRoom;
//# sourceMappingURL=createRoomHandler.js.map