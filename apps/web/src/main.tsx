import { StrictMode } from 'react';

import * as ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';

import { App } from './app';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [],
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
