import { GamePage } from "./states/GamePage";
import LobbyPage from "./states/LobbyPage";
import LoginPage from "./states/LoginPage";
import { MatchPage } from "./states/MatchPage";

const _state = {
    LOGIN: "LOGIN",
    LOBBY: "LOBBY",
    GAME: "GAME",
    MATCH: "MATCH",
}

const states: {[key: string]: () => JSX.Element | null} = {
    [_state.LOGIN]: LoginPage,
    [_state.LOBBY]: LobbyPage,
    [_state.GAME]: GamePage,
    [_state.MATCH]: MatchPage,
}

export const State = _state;
export default states;