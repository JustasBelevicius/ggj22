import GameState from "../models/GameState";
import Card from "../models/Card";

const cards: Card[] = [
    {
        id: 0,
        title: "Lemme treat you",
        description: "You get +1, target draws a card",
        effect: (caster, target, state) => {
            const casterPlayer = state.players[caster];
            const targetPlayer = state.players[target];
            const newState: GameState = {
                ...state,
                players: {
                    ...state.players,
                    [caster]: {
                        ...casterPlayer,
                        hand: removeItem(casterPlayer.hand, 0),
                        score: casterPlayer.score + 1
                    },
                    [target]: {
                        ...targetPlayer,
                        hand: [...targetPlayer.hand, Math.round(Math.random() * (cards.length - 1))],
                    }
                }
            }
            return newState;
        }
    },
    {
        id: 1,
        title: "What! you stealin'?",
        description: "You get -1, target gives you a card at random",
        effect: (caster, target, state) => {
            const casterPlayer = state.players[caster];
            const targetPlayer = state.players[target];
            const card = targetPlayer.hand[Math.round(Math.random() * (targetPlayer.hand.length - 1))];
            const newState: GameState = {
                ...state,
                players: {
                    ...state.players,
                    [caster]: {
                        ...casterPlayer,
                        hand: removeItem([...casterPlayer.hand, card], 1),
                        score: casterPlayer.score - 1
                    },
                    [target]: {
                        ...targetPlayer,
                        hand: removeItem(casterPlayer.hand, card),
                    }
                }
            }
            return newState;
        }
    }
]

function removeItem<T>(arr: T[], value: T) {
    const index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
  }

export default cards;