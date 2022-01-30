"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageType_1 = require("../../../common/src/MessageType");
function handleLogin({ request, payload, ws, db, connections }) {
    const data = payload;
    db.query("INSERT INTO player (name, address) VALUES ($1, $2) RETURNING id, name, address", [data.name, request.socket.localAddress]).then((value) => {
        connections[value.rows[0].id] = ws;
        const message = {
            type: MessageType_1.MessageType.LOGIN,
            payload: value.rows[0]
        };
        ws.send(JSON.stringify(message));
    }).catch((reason) => console.log(reason));
}
exports.default = handleLogin;
//# sourceMappingURL=loginHandler.js.map