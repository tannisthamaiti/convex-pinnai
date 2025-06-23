import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConvexProviderWithAuth0 } from "convex/react-auth0";
import { ConvexReactClient } from "convex/react";
import App from './App';
import './index.css';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConvexProviderWithAuth0
      client={convex}
      authInfo={{
        domain: import.meta.env.VITE_AUTH0_DOMAIN,
        clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
        redirectUri: window.location.origin,
      }}
    >
      <App />
    </ConvexProviderWithAuth0>
  </React.StrictMode>
);
