import React from 'react';

export const PeerContext = React.createContext<RTCPeerConnection | null>(null);
