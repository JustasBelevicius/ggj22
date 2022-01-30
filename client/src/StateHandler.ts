import { MessageType } from 'common/src/MessageType';
import { CreateRoomResponsePayload, JoinRoomResponsePayload, LoginResponsePayload, Message, MessagePayload, PlayCardResponsePayload, StartGameResponsePayload, StatusResponsePayload } from 'common/src/Message';
import { useCallback, useContext, useEffect } from 'react';
import { State } from './States';
import { WebSocketContext } from './WebSocketContext';
import { GameContext } from './game/GameContext';

export default function StateHandler({ changeState }: { changeState: (state: string) => void }) {
    const ws = useContext(WebSocketContext);
    const { dispatch } = useContext(GameContext);

    const handleMessage = useCallback((message: Message<MessagePayload>): string | undefined => {
        let payload;
        switch (message.type) {
            case MessageType.STATUS:
                payload = message.payload as StatusResponsePayload;
                alert(payload.message);
                return undefined;
            case MessageType.LOGIN:
                payload = message.payload as LoginResponsePayload;
                dispatch?.({
                    playerId: payload.id,
                    playerName: payload.name
                });
                return State.LOBBY;
            case MessageType.CREATE_ROOM:
                payload = message.payload as CreateRoomResponsePayload;
                dispatch?.({
                    gm: true,
                    roomCode: payload.code,
                    roomId: payload.id
                })
                return State.GAME;
            case MessageType.JOIN_ROOM:
                payload = message.payload as JoinRoomResponsePayload;
                dispatch?.({
                    roomId: payload.id,
                    roomCode: payload.code
                });
                return State.GAME;
                case MessageType.START_GAME:
                    payload = message.payload as StartGameResponsePayload;
                    dispatch?.({
                        hand: payload.hand,
                        players: payload.players,
                        currentPlayer: payload.currentPlayer
                    })
                    return State.MATCH;
                case MessageType.PLAY_CARD:
                    payload = message.payload as PlayCardResponsePayload;
                    dispatch?.({
                        hand: payload.hand,
                        players: payload.players,
                        currentPlayer: payload.currentPlayer
                    })
                    return State.MATCH;
            default:
                return State.LOGIN;
        }
    }, [dispatch]);

    useEffect(() => {
        const listener = (ev: MessageEvent<any>) => {
            const message: Message<MessagePayload> = JSON.parse(ev.data);
            const nextState = handleMessage(message);
            if (!!nextState) {
                changeState(nextState);
            }
        };
        ws?.addEventListener("message", listener);

        return () => ws?.removeEventListener("message", listener);
    }, [ws, changeState, handleMessage]);
    return null;
}