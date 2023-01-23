import React, { useMemo } from 'react';
import { io } from 'socket.io-client';

import { SocketContext } from '../contexts/SocketContext';
import { SOCKET_HOST, SOCKET_PORT } from '../utils/constants';

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const socket = useMemo(() => io(`${SOCKET_HOST}:${SOCKET_PORT}`), []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
