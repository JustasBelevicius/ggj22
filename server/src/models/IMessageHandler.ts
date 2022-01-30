import { Client } from "pg";
import { WebSocket } from "ws";
import { IncomingMessage } from "http";
import { MessagePayload } from "../../../common/src/Message";
import Connections from "./Connections";

export interface MessageHandlerProperties<T extends MessagePayload> {
    request: IncomingMessage;
    payload: T;
    ws: WebSocket;
    db: Client;
    connections: Connections
}

type IMessageHandler<T extends MessagePayload> = (props: MessageHandlerProperties<T>) => void;
export default IMessageHandler;