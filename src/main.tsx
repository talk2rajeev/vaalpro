import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProviders } from './core/providers';
import { AppRouter } from './core/router';
import './core/styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <AppRouter />
    </AppProviders>
  </React.StrictMode>,
);
