export interface Message<T extends MessagePayload> {
    type: string
    payload: T
}

export type MessagePayload = {}

export interface LoginRequestPayload {
    name: string
}

export interface LoginResponsePayload {
    id: number,
    name: string,
    address: string,
}

export interface CreateRoomRequestPayload {
    player_id: number;
}

export interface CreateRoomResponsePayload {
    id: number;
    code: string;
    gm_id: number;
}

export interface JoinRoomRequestPayload {
    room: string
}

export interface StatusResponsePayload {
    status: number,
    message?: string
}