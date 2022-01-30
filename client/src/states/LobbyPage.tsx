
import { MessageType } from "common/src/MessageType";
import { Message, JoinRoomRequestPayload, CreateRoomRequestPayload } from "common/src/Message";
import React, { ChangeEvent, useContext, useState } from "react"
import { WebSocketContext } from "../WebSocketContext";
import { GameContext } from "../game/GameContext";
import Button from "../components/Button";
import Input from "../components/Input";
import './LobbyPage.css';

export default function LobbyPage() {
    const [room, setRoom]= useState<string | undefined>(undefined);
    const ws = useContext(WebSocketContext);
    const gameContext = useContext(GameContext);
    const {state, dispatch} = gameContext;
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setRoom(event.target.value);
    }
    const handleJoin = () => {
        if (!room) {
            alert("Enter a room code!");
            return;
        }
        if (!state.playerId) {
            alert("Something broke, please refresh the page!");
            return;
        }
        const message: Message<JoinRoomRequestPayload> = {
            type: MessageType.JOIN_ROOM,
            payload: {
                room,
                player_id: state.playerId
            }
        }
        ws?.send(JSON.stringify(message));
    };
    const handleCreate = () => {
        if (!state.playerId) {
            alert("Something broke, please refresh the page!");
            return;
        }
        const message: Message<CreateRoomRequestPayload> = {
            type: MessageType.CREATE_ROOM,
            payload: {
                player_id: state.playerId
            }
        }
        ws?.send(JSON.stringify(message));
    };

    return <div>
        <Input extraClass="new-line" placeholder="Room Code" onChange={handleChange} onSubmit={handleJoin}/>
        <Button extraClass="new-line full-width" onClick={handleJoin} title="Join Room"/>
        <p className="or">or</p>
        <Button extraClass="new-line full-width" onClick={handleCreate} title="Create Room"/>
    </div>
}