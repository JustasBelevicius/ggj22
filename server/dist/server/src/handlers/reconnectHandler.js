"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageType_1 = require("../../../common/src/MessageType");
const Status_1 = require("../../../common/src/Status");
// Not safe
function handleReconnect({ request, payload, ws, db, connections }) {
    const data = payload;
    connections[data.id] = ws;
    const message = {
        type: MessageType_1.MessageType.STATUS,
        payload: {
            status: Status_1.Status.OK,
            message: "Reconnected!"
        }
    };
    ws.send(JSON.stringify(message));
}
exports.default = handleReconnect;
//# sourceMappingURL=reconnectHandler.js.map