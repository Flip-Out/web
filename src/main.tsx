import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AppStore } from './store/index.tsx';
import { ArcPayProvider } from '@arcpay/react-sdk';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ArcPayProvider>
        <AppStore>
          <App />
        </AppStore>
      </ArcPayProvider>
  </StrictMode>
);
