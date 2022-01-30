"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cards_1 = __importDefault(require("../data/cards"));
const MessageType_1 = require("../../../common/src/MessageType");
const Status_1 = require("../../../common/src/Status");
function handlePlayCard({ request, payload, ws, db, connections }) {
    // Check if card exists
    const card = cards_1.default.find(c => c.id === payload.card);
    if (!card) {
        const message = {
            type: MessageType_1.MessageType.STATUS,
            payload: {
                status: Status_1.Status.ERROR,
                message: "Such card does not exist"
            }
        };
        ws.send(JSON.stringify(message));
        return;
    }
    db.query("SELECT state FROM room WHERE id=$1", [payload.room]).then((value) => {
        var _a, _b;
        const state = value.rows[0].state;
        // Check if player it's players turn
        if (state.playerTurn !== payload.caster) {
            const message = {
                type: MessageType_1.MessageType.STATUS,
                payload: {
                    status: Status_1.Status.ERROR,
                    message: "It's not your turn! Not nice!"
                }
            };
            ws.send(JSON.stringify(message));
            return;
        }
        // Check if caster is in game
        if (!state.players[payload.target] || payload.target === payload.caster) {
            const message = {
                type: MessageType_1.MessageType.STATUS,
                payload: {
                    status: Status_1.Status.ERROR,
                    message: "Where did you find that player?"
                }
            };
            ws.send(JSON.stringify(message));
            return;
        }
        // Check if player has card
        if (!((_b = (_a = state.players[payload.caster]) === null || _a === void 0 ? void 0 : _a.hand) === null || _b === void 0 ? void 0 : _b.includes(payload.card))) {
            const message = {
                type: MessageType_1.MessageType.STATUS,
                payload: {
                    status: Status_1.Status.ERROR,
                    message: "You don't have this card in your hand! Naughty!"
                }
            };
            ws.send(JSON.stringify(message));
            return;
        }
        // Play card
        const newState = card.effect(payload.caster, payload.target, state);
        const players = Object.values(newState.players).map(({ id, name, score }) => ({ id, name, score }));
        const playerIdSortedList = players.map(p => p.id).sort();
        const currentPlayerIndex = playerIdSortedList.indexOf(newState.playerTurn);
        const nextPlayerIndex = (currentPlayerIndex + 1) % playerIdSortedList.length;
        newState.playerTurn = playerIdSortedList[nextPlayerIndex];
        players.forEach(player => {
            const message = {
                type: MessageType_1.MessageType.PLAY_CARD,
                payload: {
                    players,
                    currentPlayer: newState.playerTurn,
                    hand: newState.players[player.id].hand
                }
            };
            connections[player.id].send(JSON.stringify(message));
        });
        db.query("UPDATE room SET state=$1 WHERE id=$2", [newState, payload.room]);
    });
}
exports.default = handlePlayCard;
//# sourceMappingURL=playCardHandler.js.map