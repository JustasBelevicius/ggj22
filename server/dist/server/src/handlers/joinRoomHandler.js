"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function handleJoinRoom(request, payload, ws, db) {
    const data = payload;
    console.log("JOIN ROOM REQUEST", data.room);
}
exports.default = handleJoinRoom;
//# sourceMappingURL=joinRoomHandler.js.map