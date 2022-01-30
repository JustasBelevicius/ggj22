import { Message, PlayCardRequestPayload } from 'common/src/Message';
import { MessageType } from 'common/src/MessageType';
import Player from 'common/src/Player';
import React, { useContext, useState } from 'react';
import Button from '../components/Button';
import { GameContext } from '../game/GameContext';
import './MatchPage.css';
import { WebSocketContext } from '../WebSocketContext';

export function MatchPage() {
    const { state } = useContext(GameContext);
    const ws = useContext(WebSocketContext);
    const [card, setCard] = useState<number | undefined>(undefined);
    const [target, setTarget] = useState<number | undefined>(undefined);

    if(state.playerId === undefined) {
        return null;
    }

    const score = state.players?.find(p => p.id === state.playerId)?.score;
    const tokens = [];
    for (let i = 1; i <= 10; i++) {
        tokens[i - 1] = <img  className="token" key={i} src={`${process.env.PUBLIC_URL}/images/${i <= (score || 0) ? 'token-positive' : 'token-negative'}.png`}/>
    }

    const doAction = () => {
        if (card === undefined || target === undefined || state.playerId === undefined || state.hand === undefined || state.roomId === undefined) {
            return;
        }
        const message: Message<PlayCardRequestPayload> = {
            type: MessageType.PLAY_CARD,
            payload: {
                room: state.roomId,
                caster: state.playerId,
                target,
                card: state.hand[card]
            }
        }
        ws?.send(JSON.stringify(message));
    }

    return (
        <div>
            <h2>ROOM CODE: {state.roomCode}</h2>
            <h1>It's {state.players?.find(p => p.id === state.currentPlayer)?.name}'s turn</h1>
            <div className='players'>
                {state.players?.filter(player => player.id !== state.playerId).map(player => <PlayerItem selected={player.id === target} key={player.id} onClick={setTarget} player={player} />)}
            </div>
            <div className='cards'>
                {state.hand?.map((c, id) => <CardItem selected={id === card} key={id} card={c} onClick={() => setCard(id)} />)}
            </div>
            <div className='tokens'>
                {tokens}
            </div>
            <Button extraClass='full-width' disabled={card === undefined || target === undefined} onClick={doAction} title='Confirm' />
        </div>
    );
}

function PlayerItem({ player, onClick, selected }: { player: Player, onClick: (id: number) => void, selected: boolean }) {
    const score = player.score;
    const tokens = [];
    for (let i = 1; i <= 10; i++) {
        tokens[i - 1] = <span key={i} className={'player-token' + (i <= score ? ' positive' : ' negative')} />
    }
    
    return <div className={'player' + (selected ? ' selected' : '')}>
        <img className='player-img' src={`${process.env.PUBLIC_URL}/images/profile-${player.id % 4}.png`}/>
        <div className='player-tokens'>
            {tokens}
        </div>
        <h4 className='player-name'>{player.name}</h4>
        <Button onClick={() => onClick(player.id)} title="Target" />
    </div>
}

function CardItem({ selected, card, onClick }: { card: number, onClick: (id: number) => void, selected: boolean }) {
    const _onClick = () => {
        const sound = new Audio(`${process.env.PUBLIC_URL}/sounds/cardPlace${Math.round(Math.random() * 3 + 1)}.mp3`);
        sound.play();
        onClick(card);
    }
    
    return <img className={'card' + (selected ? ' selected' : '')} src={`${process.env.PUBLIC_URL}/images/card-${card}.png`} onClick={_onClick} alt={`Card #${card}`} />
}