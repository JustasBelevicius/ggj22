import GameState from "./GameState";

export default interface Card {
    id: number;
    title: string;
    description: string;
    effect: (caster: number, target: number, state: GameState) => GameState;
}