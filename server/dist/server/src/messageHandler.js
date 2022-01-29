"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MessageType_1 = require("../../common/src/MessageType");
const createRoomHandler_1 = __importDefault(require("./handlers/createRoomHandler"));
const joinRoomHandler_1 = __importDefault(require("./handlers/joinRoomHandler"));
const loginHandler_1 = __importDefault(require("./handlers/loginHandler"));
function handleMessage(request, message, ws, db) {
    const payload = message.payload;
    switch (message.type) {
        case MessageType_1.MessageType.LOGIN:
            (0, loginHandler_1.default)(request, message.payload, ws, db);
            break;
        case MessageType_1.MessageType.CREATE_ROOM:
            (0, createRoomHandler_1.default)(request, message.payload, ws, db);
            break;
        case MessageType_1.MessageType.JOIN_ROOM:
            (0, joinRoomHandler_1.default)(request, message.payload, ws, db);
            break;
        default:
            ws.send(JSON.stringify({
                type: MessageType_1.MessageType.STATUS,
                data: {
                    "status": 0,
                    "message": "Message type not valid"
                }
            }));
    }
}
exports.default = handleMessage;
//# sourceMappingURL=messageHandler.js.map