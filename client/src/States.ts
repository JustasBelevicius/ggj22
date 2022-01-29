import LobbyPage from "./states/LobbyPage";
import LoginPage from "./states/LoginPage";

const _state = {
    LOGIN: "LOGIN",
    LOBBY: "LOBBY",
}

const states: {[key: string]: () => JSX.Element} = {
    [_state.LOGIN]: LoginPage,
    [_state.LOBBY]: LobbyPage
}

export const State = _state;
export default states;