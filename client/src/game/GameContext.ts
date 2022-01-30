import Player from 'common/src/Player';
import React, { Dispatch, Reducer } from 'react';

export interface Game {
    gm?: boolean,
    playerId?: number,
    playerName?: string,
    roomId?: number,
    roomCode?: string,
    hand?: number[],
    players?: Player[],
    currentPlayer?: number,
};

export type Action = Partial<Game>

export const gameReducer: Reducer<Game, Action> = (state, action) => {
    return {...state, ...action};
}

export const GameContext = React.createContext<{state: Game, dispatch?: Dispatch<Action>}>({state: {}});