// import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { PeerProvider } from './providers/PeerProvider';
import { SocketProvider } from './providers/SocketProvider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <BrowserRouter>
    <SocketProvider>
      <PeerProvider>
        <App />
      </PeerProvider>
    </SocketProvider>
  </BrowserRouter>
  // </React.StrictMode>
);
