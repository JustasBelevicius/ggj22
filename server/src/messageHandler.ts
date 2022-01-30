import { Message, LoginRequestPayload, MessagePayload, JoinRoomRequestPayload, CreateRoomRequestPayload, StartGameRequestPayload, ReconnectRequestPayload, PlayCardRequestPayload } from '../../common/src/Message';
import { MessageType } from '../../common/src/MessageType';
import { Client } from 'pg';
import { WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import handleCreateRoom from './handlers/createRoomHandler';
import handleJoinRoom from './handlers/joinRoomHandler';
import handleLogin from './handlers/loginHandler';
import handleStartGame from './handlers/startGameHandler';
import Connections from './models/Connections';
import { MessageHandlerProperties } from './models/IMessageHandler';
import { Status } from '../../common/src/Status';
import handleReconnect from './handlers/reconnectHandler';
import handlePlayCard from './handlers/playCardHandler';

export default function handleMessage(request: IncomingMessage, message: Message<MessagePayload>, ws: WebSocket, db: Client, connections: Connections) {
    const payload = message.payload;
    const props = {
        request,
        ws,
        db,
        connections
    }
    switch (message.type) {
        case MessageType.RECONNECT:
            handleReconnect({ ...props, payload: payload as unknown as ReconnectRequestPayload});
            break;
        case MessageType.LOGIN:
            handleLogin({ ...props, payload: payload as unknown as LoginRequestPayload });
            break;
        case MessageType.CREATE_ROOM:
            handleCreateRoom({ ...props, payload: payload as unknown as CreateRoomRequestPayload });
            break;
        case MessageType.JOIN_ROOM:
            handleJoinRoom({ ...props, payload: payload as unknown as JoinRoomRequestPayload });
            break;
        case MessageType.START_GAME:
            handleStartGame({ ...props, payload: payload as unknown as StartGameRequestPayload });
            break;
        case MessageType.PLAY_CARD:
            handlePlayCard({...props, payload: payload as unknown as PlayCardRequestPayload});
            break;
        default:
            ws.send(JSON.stringify({
                type: MessageType.STATUS,
                data: {
                    "status": Status.ERROR,
                    "message": "Message type not valid"
                }
            }));
    }
}