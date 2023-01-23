import { useContext } from 'react';
import { PeerContext } from '../contexts/PeerContext';

export const usePeer = () => useContext(PeerContext);
