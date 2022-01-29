import React, { useState } from 'react';
import StateHandler from './StateHandler';
import states, { State } from './States';
import { WebSocketContext } from './WebSocketContext';

console.log(process.env.REACT_APP_WS_HOST);
const ws = new WebSocket(process.env.REACT_APP_WS_HOST || "");


function App() {
  const [state, setState] = useState(State.LOGIN); 
  const StateComponent = states[state];
  return <WebSocketContext.Provider value={ws}>
    <StateHandler changeState={setState}/>
    <StateComponent />
  </WebSocketContext.Provider>;
}

export default App;
