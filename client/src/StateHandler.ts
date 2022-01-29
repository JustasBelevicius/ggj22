import { MessageType } from 'common/src/MessageType';
import { Message, MessagePayload } from 'common/src/Message';
import { useCallback, useContext, useEffect } from 'react';
import { State } from './States';
import { WebSocketContext } from './WebSocketContext';

export default function StateHandler({changeState}: {changeState: (state: string) => void}) {
    const ws = useContext(WebSocketContext);
    useEffect(() => {
        const listener = (ev: MessageEvent<any>) => {
          const message: Message<MessagePayload> = JSON.parse(ev.data);
          changeState(handleMessage(message));
        };
        ws?.addEventListener("message", listener);
    
        return () => ws?.removeEventListener("message", listener);
      }, [ws]);

    const handleMessage = useCallback((message: Message<MessagePayload>): string => {
        switch(message.type) {
            case MessageType.JOIN_ROOM:
                return State.LOBBY;
            default:
                return State.LOGIN;
        }
    }, []);
    return null;
}