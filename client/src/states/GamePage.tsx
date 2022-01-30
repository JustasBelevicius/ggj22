import { Message, StartGameRequestPayload } from 'common/src/Message';
import { MessageType } from 'common/src/MessageType';
import React, { useContext } from 'react';
import Button from '../components/Button';
import { GameContext } from '../game/GameContext';
import { WebSocketContext } from '../WebSocketContext';

export function GamePage() {
    const { state } = useContext(GameContext);
    const ws = useContext(WebSocketContext);

    const handleStart = () => {
        if (!state.playerId || !state.roomId) {
            alert("Something broke, please refresh the page!");
            return;
        }
        const message: Message<StartGameRequestPayload> = {
            type: MessageType.START_GAME,
            payload: {
                player_id: state.playerId,
                room_id: state.roomId,
            }
        }
        ws?.send(JSON.stringify(message));
    }

    return (
        <div>
            <h1>ROOM CODE: {state.roomCode}</h1>
            {!!state.gm && <Button onClick={handleStart} title='Start' extraClass='full-width'/>}
        </div>
    );
}