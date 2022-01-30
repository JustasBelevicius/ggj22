import Player from "../../../common/src/Player";

export default interface ServerPlayer extends Player {
    hand: number[];
}