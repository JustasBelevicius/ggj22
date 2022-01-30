import { Message, LoginRequestPayload, LoginResponsePayload } from '../../../common/src/Message';
import { MessageType } from '../../../common/src/MessageType';
import { MessageHandlerProperties } from '../models/IMessageHandler';

export default function handleLogin({request, payload, ws, db, connections}: MessageHandlerProperties<LoginRequestPayload>) {
    const data = payload as unknown as LoginRequestPayload;
    db.query("INSERT INTO player (name, address) VALUES ($1, $2) RETURNING id, name, address",
        [data.name, request.socket.localAddress]).then((value) => {
            connections[value.rows[0].id] = ws;
            const message: Message<LoginResponsePayload> = {
                type: MessageType.LOGIN,
                payload: value.rows[0]
            }
            ws.send(JSON.stringify(message));
        }).catch((reason) => console.log(reason));
}