
import { MessageType } from "common/src/MessageType";
import { Message, LoginRequestPayload } from "common/src/Message";
import React, { ChangeEvent, useContext, useState } from "react"
import { WebSocketContext } from "../WebSocketContext";

export default function IndexPage() {
    const [name, setName] = useState<string | undefined>();
    const ws = useContext(WebSocketContext);
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }

    const clickHandler = () => {
        if (!name) {
            alert('Choose a name!');
            return;
        }
        const message: Message<LoginRequestPayload> = {
            type: MessageType.LOGIN,
            payload: {
                name
            }
        };
        ws?.send(JSON.stringify(message));
    }

    return <div>
        <input type="text" placeholder="User Name" onChange={handleChange}/>
        <button onClick={clickHandler}>Enter</button>
    </div>
}