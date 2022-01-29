import React, { useState } from 'react';
import StateHandler from './StateHandler';
import states, { State } from './States';
import { WebSocketContext } from './WebSocketContext';

const ws = new WebSocket(process.env.WS_HOST || "ws://localhost:3001");


function App() {
  const [state, setState] = useState(State.LOGIN); 
  const StateComponent = states[state];

  
  return <WebSocketContext.Provider value={ws}>
    <StateHandler changeState={setState}/>
    <StateComponent />
  </WebSocketContext.Provider>;
}

export default App;
