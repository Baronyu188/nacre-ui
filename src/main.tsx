import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {App} from './demo/App';
import './ui/theme.css';
import './demo/demo.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
