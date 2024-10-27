import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AppStore } from './store/index.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppStore>
      <App />
    </AppStore>
  </StrictMode>
);
