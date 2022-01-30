import Player from "./Player";

export interface Message<T extends MessagePayload> {
    type: string
    payload: T
}

export type MessagePayload = {}

export interface ReconnectRequestPayload extends MessagePayload {
    id: number;
}

export interface LoginRequestPayload extends MessagePayload {
    name: string
}

export interface LoginResponsePayload extends MessagePayload {
    id: number,
    name: string,
    address: string,
}

export interface CreateRoomRequestPayload extends MessagePayload {
    player_id: number;
}

export interface CreateRoomResponsePayload extends MessagePayload {
    id: number;
    code: string;
    gm_id: number;
}

export interface JoinRoomRequestPayload extends MessagePayload {
    room: string;
    player_id: number;
}

export interface JoinRoomResponsePayload extends MessagePayload {
    id: number;
    code: string;
}

export interface StatusResponsePayload extends MessagePayload {
    status: number;
    message?: string;
}

export interface StartGameRequestPayload extends MessagePayload {
    player_id: number;
    room_id: number;
}

export interface StartGameResponsePayload extends MessagePayload {
    players: Player[]
    hand: number[];
    currentPlayer: number;
}

export interface DrawCardRequestPayload extends MessagePayload {
    player_id: number;
    count: number;
}

export interface DrawCardResponsePayload extends MessagePayload {
    hand: number[];
}

export interface PlayCardRequestPayload extends MessagePayload {
    room: number,
    caster: number,
    target: number,
    card: number,
}

export interface PlayCardResponsePayload extends MessagePayload {
    players: Player[]
    hand: number[];
    currentPlayer: number;
}
