import {Message, LoginRequestPayload, MessagePayload, JoinRoomRequestPayload, CreateRoomRequestPayload} from '../../common/src/Message';
import {MessageType} from '../../common/src/MessageType';
import { Client, Pool } from 'pg';
import { WebSocket } from 'ws';
import {IncomingMessage} from 'http';
import handleCreateRoom from './handlers/createRoomHandler';
import handleJoinRoom from './handlers/joinRoomHandler';
import handleLogin from './handlers/loginHandler';

export default function handleMessage(request: IncomingMessage, message: Message<MessagePayload>, ws: WebSocket, db: Client) {
    const payload = message.payload;
    switch(message.type) {
        case MessageType.LOGIN:
            handleLogin(request, message.payload as unknown as LoginRequestPayload, ws, db);
            break;
        case MessageType.CREATE_ROOM:
            handleCreateRoom(request, message.payload as unknown as CreateRoomRequestPayload, ws, db);
            break;
        case MessageType.JOIN_ROOM:
            handleJoinRoom(request, message.payload as unknown as JoinRoomRequestPayload, ws, db);
            break;
        default:
            ws.send(JSON.stringify({
                type: MessageType.STATUS,
                data: {
                    "status": 0,
                    "message": "Message type not valid"
                }
            }));
    }
}