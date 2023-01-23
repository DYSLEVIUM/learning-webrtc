import React from 'react';
import { io } from 'socket.io-client';

export const SocketContext = React.createContext<ReturnType<typeof io> | null>(
  null
);
