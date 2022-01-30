import { WebSocket } from 'ws';

export default interface Connections {[playerId: number]: WebSocket};