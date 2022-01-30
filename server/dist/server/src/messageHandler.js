"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MessageType_1 = require("../../common/src/MessageType");
const createRoomHandler_1 = __importDefault(require("./handlers/createRoomHandler"));
const joinRoomHandler_1 = __importDefault(require("./handlers/joinRoomHandler"));
const loginHandler_1 = __importDefault(require("./handlers/loginHandler"));
const startGameHandler_1 = __importDefault(require("./handlers/startGameHandler"));
const Status_1 = require("../../common/src/Status");
const reconnectHandler_1 = __importDefault(require("./handlers/reconnectHandler"));
const playCardHandler_1 = __importDefault(require("./handlers/playCardHandler"));
function handleMessage(request, message, ws, db, connections) {
    const payload = message.payload;
    const props = {
        request,
        ws,
        db,
        connections
    };
    switch (message.type) {
        case MessageType_1.MessageType.RECONNECT:
            (0, reconnectHandler_1.default)(Object.assign(Object.assign({}, props), { payload: payload }));
            break;
        case MessageType_1.MessageType.LOGIN:
            (0, loginHandler_1.default)(Object.assign(Object.assign({}, props), { payload: payload }));
            break;
        case MessageType_1.MessageType.CREATE_ROOM:
            (0, createRoomHandler_1.default)(Object.assign(Object.assign({}, props), { payload: payload }));
            break;
        case MessageType_1.MessageType.JOIN_ROOM:
            (0, joinRoomHandler_1.default)(Object.assign(Object.assign({}, props), { payload: payload }));
            break;
        case MessageType_1.MessageType.START_GAME:
            (0, startGameHandler_1.default)(Object.assign(Object.assign({}, props), { payload: payload }));
            break;
        case MessageType_1.MessageType.PLAY_CARD:
            (0, playCardHandler_1.default)(Object.assign(Object.assign({}, props), { payload: payload }));
            break;
        default:
            ws.send(JSON.stringify({
                type: MessageType_1.MessageType.STATUS,
                data: {
                    "status": Status_1.Status.ERROR,
                    "message": "Message type not valid"
                }
            }));
    }
}
exports.default = handleMessage;
//# sourceMappingURL=messageHandler.js.map