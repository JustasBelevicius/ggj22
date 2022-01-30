import ServerPlayer from "./Player";

export default interface GameState {
    players: {[id: number]: ServerPlayer}
    playerTurn: number;
}