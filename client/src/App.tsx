import React, { useEffect, useReducer, useState } from 'react';
import { GameContext, gameReducer } from './game/GameContext';
import StateHandler from './StateHandler';
import states, { State } from './States';
import { WebSocketContext } from './WebSocketContext';
import './App.css';

const ws = new WebSocket(process.env.REACT_APP_WS_HOST || "");

function App() {
  const [state, setState] = useState(State.LOGIN);
  const [game, dispatch] = useReducer(gameReducer, {});

  const StateComponent = states[state];
  return <WebSocketContext.Provider value={ws}>
    <GameContext.Provider value={{ state: game, dispatch }}>
      <StateHandler changeState={setState} />
      <div className='content' style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/board.png)`,
      }}>
        <div className={'playArea ' + state}>
          <StateComponent />
        </div>
      </div>
    </GameContext.Provider>
  </WebSocketContext.Provider>;
}

export default App;
