import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';

// Opts the page into the scroll-reveal start state. Without this class every revealed block is
// simply visible, which is what a visitor gets if this script never runs.
document.documentElement.classList.add('js');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
