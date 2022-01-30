"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cards_1 = __importDefault(require("../data/cards"));
const MessageType_1 = require("../../../common/src/MessageType");
const Status_1 = require("../../../common/src/Status");
function handleStartGame({ request, payload, ws, db, connections }) {
    // Check if user is allowed
    db.query("SELECT code FROM room WHERE id=$1 AND gm_id=$2", [payload.room_id, payload.player_id]).then((value) => {
        if (value.rowCount <= 0) {
            const message = {
                type: MessageType_1.MessageType.STATUS,
                payload: {
                    status: Status_1.Status.ERROR,
                    message: "You are not the GM of this room"
                }
            };
            ws.send(JSON.stringify(message));
            return;
        }
        // Init game state
        const gameState = { players: {}, playerTurn: 0 };
        // Get all players
        db.query("SELECT p.id AS id, p.name AS name FROM match m INNER JOIN player p ON m.player_id = p.id WHERE room_id=$1", [payload.room_id]).then((result) => {
            result.rows.forEach((row) => {
                gameState.players[row.id] = {
                    id: row.id,
                    name: row.name,
                    score: 5,
                    hand: [1, 1, 1, 1, 1].map(() => Math.round(Math.random() * (cards_1.default.length - 1)))
                };
            });
            const players = Object.values(gameState.players).map(({ id, name, score }) => ({ id, name, score }));
            gameState.playerTurn = players.map(p => p.id).sort()[0];
            console.log("STARTED GAME", gameState);
            players.forEach(player => {
                const message = {
                    type: MessageType_1.MessageType.START_GAME,
                    payload: {
                        currentPlayer: gameState.playerTurn,
                        players,
                        hand: gameState.players[player.id].hand
                    }
                };
                connections[player.id].send(JSON.stringify(message));
            });
            db.query("UPDATE room SET state=$1 WHERE id=$2", [gameState, payload.room_id]);
        });
    });
}
exports.default = handleStartGame;
//# sourceMappingURL=startGameHandler.js.map