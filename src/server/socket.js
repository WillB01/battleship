import io from 'socket.io-client';

import { port } from './port';

const socket = io.connect(port);

export { socket };
