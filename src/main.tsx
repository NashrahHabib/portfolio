import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import App from './App';
import './index.css';

// The single-file preview build keeps routes in memory (it works inside any embed); the real site uses clean URLs.
const Router = __HASH_ROUTER__ ? MemoryRouter : BrowserRouter;
const routerProps = __HASH_ROUTER__ ? {} : { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' };

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <Router {...routerProps}>
        <App />
      </Router>
    </MotionConfig>
  </React.StrictMode>,
);
