"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cards = [
    {
        id: 0,
        title: "Lemme treat you",
        description: "You get +1, target draws a card",
        effect: (caster, target, state) => {
            const casterPlayer = state.players[caster];
            const targetPlayer = state.players[target];
            const newState = Object.assign(Object.assign({}, state), { players: Object.assign(Object.assign({}, state.players), { [caster]: Object.assign(Object.assign({}, casterPlayer), { hand: removeItem(casterPlayer.hand, 0), score: casterPlayer.score + 1 }), [target]: Object.assign(Object.assign({}, targetPlayer), { hand: [...targetPlayer.hand, Math.round(Math.random() * (cards.length - 1))] }) }) });
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
            const newState = Object.assign(Object.assign({}, state), { players: Object.assign(Object.assign({}, state.players), { [caster]: Object.assign(Object.assign({}, casterPlayer), { hand: removeItem([...casterPlayer.hand, card], 1), score: casterPlayer.score - 1 }), [target]: Object.assign(Object.assign({}, targetPlayer), { hand: removeItem(casterPlayer.hand, card) }) }) });
            return newState;
        }
    }
];
function removeItem(arr, value) {
    const index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}
exports.default = cards;
//# sourceMappingURL=cards.js.map