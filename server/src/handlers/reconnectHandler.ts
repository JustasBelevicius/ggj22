import { Message, LoginRequestPayload, LoginResponsePayload, ReconnectRequestPayload, StatusResponsePayload } from '../../../common/src/Message';
import { MessageType } from '../../../common/src/MessageType';
import { Status } from '../../../common/src/Status';
import { MessageHandlerProperties } from '../models/IMessageHandler';

// Not safe
export default function handleReconnect({request, payload, ws, db, connections}: MessageHandlerProperties<ReconnectRequestPayload>) {
    const data = payload as unknown as ReconnectRequestPayload;
    connections[data.id] = ws;
    const message: Message<StatusResponsePayload> = {
        type: MessageType.STATUS,
        payload: {
            status: Status.OK,
            message: "Reconnected!"
        }
    }
    ws.send(JSON.stringify(message));
}