
// import { MessageType } from "common/src/MessageType";
// import { Message, LoginRequestPayload } from "common/src/Message";
import React, { ChangeEvent, useContext, useState } from "react"
// import { WebSocketContext } from "../WebSocketContext";

export default function LobbyPage() {
    return <div>
        <input type="text" placeholder="Room Code"/>
        <button>Join Room</button>
        <span>or</span>
        <button>Create Room</button>
    </div>
}