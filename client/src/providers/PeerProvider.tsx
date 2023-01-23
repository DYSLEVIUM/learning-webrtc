import React, { useMemo } from 'react';

import { PeerContext } from '../contexts/PeerContext';
import { ICE_CANDIDATE_POOL_SIZE, ICE_SERVERS } from '../utils/constants';

interface PeerProviderProps {
  children: React.ReactNode;
}

export const PeerProvider: React.FC<PeerProviderProps> = ({ children }) => {
  const peer = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers: ICE_SERVERS,
        iceCandidatePoolSize: ICE_CANDIDATE_POOL_SIZE,
      }),
    []
  );
  return <PeerContext.Provider value={peer}>{children}</PeerContext.Provider>;
};
