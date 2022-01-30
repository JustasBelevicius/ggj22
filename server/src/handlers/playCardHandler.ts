import { MessageHandlerProperties } from "../models/IMessageHandler";
import { Message, PlayCardRequestPayload, PlayCardResponsePayload, StatusResponsePayload } from "../../../common/src/Message";
import cards from "../data/cards";
import { MessageType } from "../../../common/src/MessageType";
import { Status } from "../../../common/src/Status";
import GameState from "../models/GameState";

export default function handlePlayCard({ request, payload, ws, db, connections }: MessageHandlerProperties<PlayCardRequestPayload>) {
    // Check if card exists
    const card = cards.find(c => c.id === payload.card);
    if(!card) {
        const message: Message<StatusResponsePayload> = {
            type: MessageType.STATUS,
            payload: {
                status: Status.ERROR,
                message: "Such card does not exist"
            }
        }
        ws.send(JSON.stringify(message));
        return;
    }
    db.query("SELECT state FROM room WHERE id=$1", [payload.room]).then((value) => {
        const state: GameState = value.rows[0].state;
        // Check if player it's players turn
        if (state.playerTurn !== payload.caster) {
            const message: Message<StatusResponsePayload> = {
                type: MessageType.STATUS,
                payload: {
                    status: Status.ERROR,
                    message: "It's not your turn! Not nice!"
                }
            }
            ws.send(JSON.stringify(message));
            return;
        }
        // Check if caster is in game
        if (!state.players[payload.target] || payload.target === payload.caster) {
            const message: Message<StatusResponsePayload> = {
                type: MessageType.STATUS,
                payload: {
                    status: Status.ERROR,
                    message: "Where did you find that player?"
                }
            }
            ws.send(JSON.stringify(message));
            return;
        }
        // Check if player has card
        if (!state.players[payload.caster]?.hand?.includes(payload.card)) {
            const message: Message<StatusResponsePayload> = {
                type: MessageType.STATUS,
                payload: {
                    status: Status.ERROR,
                    message: "You don't have this card in your hand! Naughty!"
                }
            }
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
            const message: Message<PlayCardResponsePayload> = {
                type: MessageType.PLAY_CARD,
                payload: {
                    players,
                    currentPlayer: newState.playerTurn,
                    hand: newState.players[player.id].hand
                }
            }
            connections[player.id].send(JSON.stringify(message));
        });
        db.query("UPDATE room SET state=$1 WHERE id=$2", [newState, payload.room]);
    });
}
